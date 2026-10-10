-- =========================================================================
-- PortfolioHub AI - Production PostgreSQL Database Schema & RLS Policies
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  is_banned BOOLEAN DEFAULT false,
  total_downloads INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  website TEXT,
  github TEXT,
  linkedin TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automatic Profile Creation Trigger on auth.users Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  suffix INTEGER := 1;
BEGIN
  -- Extract base username from metadata or email prefix
  base_username := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'username'), ''),
    NULLIF(TRIM(split_part(NEW.email, '@', 1)), ''),
    'user'
  );
  final_username := base_username;

  -- Ensure unique username across profiles
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    final_username := base_username || '_' || floor(random() * 9000 + 1000)::text;
    suffix := suffix + 1;
    IF suffix > 10 THEN
      final_username := base_username || '_' || replace(gen_random_uuid()::text, '-', '');
      EXIT;
    END IF;
  END LOOP;

  INSERT INTO public.profiles (
    id,
    username,
    email,
    full_name,
    avatar_url,
    role
  ) VALUES (
    NEW.id,
    final_username,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', final_username),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'),
    'user'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. TEMPLATES TABLE (Supports both UUIDs and curated IDs like tmpl-bento-13)
CREATE TABLE IF NOT EXISTS public.templates (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  creator_name TEXT DEFAULT 'PortfolioHub Community',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Minimal', 'Developer', 'Bento', 'Terminal', 'Neumorphic',
    'Retro Arcade', 'Editorial', 'Aurora', 'Blueprint', 'Kinetic',
    'Card Deck', 'Holographic', 'Deep Space', 'Origami', 'Student',
    'Corporate', 'Designer', 'Luxury', 'Cyberpunk', 'Glassmorphism',
    'Creative', 'Photographer', 'Dark', '3D'
  )),
  difficulty TEXT DEFAULT 'Intermediate' CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  thumbnail_url TEXT,
  preview_images TEXT[] DEFAULT ARRAY[]::TEXT[],
  html_code TEXT NOT NULL,
  css_code TEXT NOT NULL,
  js_code TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT true,
  likes_count INTEGER DEFAULT 0,
  downloads_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  remixes_count INTEGER DEFAULT 0,
  remixed_from_id TEXT REFERENCES public.templates(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. LIKES TABLE (One like per user per template)
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  template_id TEXT REFERENCES public.templates(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, template_id)
);

-- 4. DOWNLOADS TABLE
CREATE TABLE IF NOT EXISTS public.downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  template_id TEXT REFERENCES public.templates(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. VIEWS TABLE
CREATE TABLE IF NOT EXISTS public.views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id TEXT REFERENCES public.templates(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  template_id TEXT REFERENCES public.templates(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, template_id)
);

-- 7. REMIXES TABLE
CREATE TABLE IF NOT EXISTS public.remixes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
  original_template_id TEXT REFERENCES public.templates(id) ON DELETE CASCADE NOT NULL,
  remixed_template_id TEXT REFERENCES public.templates(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  template_id TEXT REFERENCES public.templates(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. FOLLOWERS TABLE
CREATE TABLE IF NOT EXISTS public.followers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- 10. INDEXES FOR HIGH-PERFORMANCE SEARCH & SORT
CREATE INDEX IF NOT EXISTS idx_templates_category ON public.templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_likes ON public.templates(likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_templates_downloads ON public.templates(downloads_count DESC);
CREATE INDEX IF NOT EXISTS idx_templates_views ON public.templates(views_count DESC);
CREATE INDEX IF NOT EXISTS idx_templates_created ON public.templates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_likes_template ON public.likes(template_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_template ON public.comments(template_id);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remixes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;

-- Helper to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- Templates Policies
CREATE POLICY "Public templates are viewable by everyone" 
  ON public.templates FOR SELECT USING (is_public = true OR auth.uid() = user_id OR public.is_admin());

-- (insert policy is defined in the SECURITY HARDENING section at the end of this file)

CREATE POLICY "Users can update own templates or admins can update any" 
  ON public.templates FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can delete own templates or admins can delete any" 
  ON public.templates FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

-- Likes Policies
CREATE POLICY "Likes viewable by everyone" 
  ON public.likes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like" 
  ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own likes" 
  ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- Downloads Policies
CREATE POLICY "Downloads viewable by everyone" 
  ON public.downloads FOR SELECT USING (true);

-- (download-log policy is defined in the SECURITY HARDENING section at the end of this file)

-- Comments Policies
CREATE POLICY "Comments viewable by everyone" 
  ON public.comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can post comments" 
  ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments or admins can delete any" 
  ON public.comments FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

-- Favorites Policies
CREATE POLICY "Users can view own favorites" 
  ON public.favorites FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites" 
  ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own favorites" 
  ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- =========================================================================
-- STORAGE BUCKETS SETUP (Run via Supabase Storage API or SQL)
-- =========================================================================
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('avatars', 'avatars', true),
  ('thumbnails', 'thumbnails', true),
  ('previews', 'previews', true),
  ('templates', 'templates', true),
  ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public storage view for avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Public storage view for thumbnails" ON storage.objects FOR SELECT USING (bucket_id = 'thumbnails');
CREATE POLICY "Public storage view for previews" ON storage.objects FOR SELECT USING (bucket_id = 'previews');
CREATE POLICY "Public storage view for templates" ON storage.objects FOR SELECT USING (bucket_id = 'templates');

-- (upload policies are defined in the SECURITY HARDENING section at the end of this file)

-- =========================================================================
-- 11. SEED DATA - ALL 24 PORTFOLIO STYLES
-- =========================================================================
INSERT INTO public.templates (
  id, title, description, category, difficulty, tags, thumbnail_url, preview_images,
  html_code, css_code, js_code, is_featured, is_approved, is_public,
  likes_count, downloads_count, views_count, remixes_count, creator_name
) VALUES
(
  'tmpl-minimal-01',
  'Minimal Clean Slate',
  'Swiss-inspired high contrast grid typography with razor-thin hairline dividers and ample white space.',
  'Minimal', 'Beginner', ARRAY['Clean', 'Typography', 'Monochrome', 'Swiss'],
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'],
  '<!-- Minimal Clean Slate -->', '/* Minimal Clean Slate CSS */', '// Minimal JS',
  true, true, true, 0, 0, 0, 0, 'PortfolioHub'
),
(
  'tmpl-dev-02',
  'Terminal Matrix Hacker',
  'Raw green CRT cathode scanlines, live typing command prompt, and monospaced system telemetry.',
  'Developer', 'Advanced', ARRAY['Terminal', 'CLI', 'CRT', 'Matrix'],
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'],
  '<!-- Terminal Matrix Hacker -->', '/* Terminal CSS */', '// Terminal JS',
  true, true, true, 0, 0, 0, 0, 'PortfolioHub'
),
(
  'tmpl-stud-03',
  'Academic Resume Grid',
  'Compact multi-column curriculum vitae layout engineered for internship applications and academic research.',
  'Student', 'Beginner', ARRAY['Resume', 'Academic', 'Clean', 'Fast'],
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'],
  '<!-- Academic Resume Grid -->', '/* Resume CSS */', '// Resume JS',
  false, true, true, 0, 0, 0, 0, 'PortfolioHub'
),
(
  'tmpl-corp-04',
  'Executive Enterprise',
  'Conservative navy-slate palette with corporate case study callouts and credibility metric badges.',
  'Corporate', 'Intermediate', ARRAY['Enterprise', 'Fintech', 'B2B', 'Corporate'],
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'],
  '<!-- Executive Enterprise -->', '/* Executive CSS */', '// Executive JS',
  false, true, true, 0, 0, 0, 0, 'PortfolioHub'
),
(
  'tmpl-des-05',
  'Design Foundry Portfolio',
  'Editorial design showcase featuring oversized typography, cursor follow circle, and dynamic project previews.',
  'Designer', 'Intermediate', ARRAY['Studio', 'Creative', 'Agency', 'Interactive'],
  'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80'],
  '<!-- Design Foundry -->', '/* Foundry CSS */', '// Foundry JS',
  true, true, true, 0, 0, 0, 0, 'PortfolioHub'
),
(
  'tmpl-lux-06',
  'Haute Couture Monolith',
  'Warm champagne gold accents, rich serif headers, and luxury architectural framing.',
  'Luxury', 'Intermediate', ARRAY['Luxury', 'Gold', 'Fashion', 'Serif'],
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'],
  '<!-- Haute Couture Monolith -->', '/* Luxury CSS */', '// Luxury JS',
  false, true, true, 0, 0, 0, 0, 'PortfolioHub'
),
(
  'tmpl-cyber-07',
  'Neo-Tokyo HUD 2099',
  'Cyberpunk combat HUD with angular tech badges, scanlines, and high-energy diagnostics.',
  'Cyberpunk', 'Advanced', ARRAY['Cyberpunk', 'Sci-Fi', 'HUD', 'Neon'],
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80'],
  '<!-- Neo-Tokyo HUD -->', '/* Cyberpunk CSS */', '// Cyberpunk JS',
  true, true, true, 0, 0, 0, 0, 'PortfolioHub'
),
(
  'tmpl-glass-08',
  'Frost UI Prism',
  'Multi-layer backdrop-blur panels with chromatic border refraction and light ambient gradients.',
  'Glassmorphism', 'Intermediate', ARRAY['Glassmorphism', 'Frosted', 'Modern', 'Clean'],
  'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80'],
  '<!-- Frost UI Prism -->', '/* Glassmorphism CSS */', '// Glassmorphism JS',
  false, true, true, 0, 0, 0, 0, 'PortfolioHub'
),
(
  'tmpl-crea-09',
  'Vibrant Maximalist Pop',
  'Bold Memphis-inspired geometric stickers, neo-brutalist solid black shadows, and vivid colors.',
  'Creative', 'Intermediate', ARRAY['Brutalist', 'Memphis', 'Pop', 'Vibrant'],
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'],
  '<!-- Vibrant Maximalist Pop -->', '/* Creative CSS */', '// Creative JS',
  true, true, true, 0, 0, 0, 0, 'PortfolioHub'
),
(
  'tmpl-photo-10',
  'Fullbleed Lightbox Gallery',
  'Edge-to-edge photography showcase with darkroom atmosphere, metadata overlays, and zero distraction.',
  'Photographer', 'Beginner', ARRAY['Photography', 'Darkroom', 'Fullscreen', 'Visual'],
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80'],
  '<!-- Fullbleed Gallery -->', '/* Photographer CSS */', '// Photographer JS',
  false, true, true, 0, 0, 0, 0, 'PortfolioHub'
),
(
  'tmpl-dark-11',
  'OLED Void Stealth',
  'True #000000 pitch black canvas engineered for low power consumption and high-contrast focus.',
  'Dark', 'Beginner', ARRAY['OLED', 'Stealth', 'Pitch Black', 'Minimal'],
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'],
  '<!-- OLED Void Stealth -->', '/* Dark CSS */', '// Dark JS',
  false, true, true, 0, 0, 0, 0, 'PortfolioHub'
),
(
  'tmpl-3d-12',
  'Dimensions Isometric',
  'Isometric layered perspective with dynamic 3D cursor tilt responsiveness and deep shadows.',
  '3D', 'Advanced', ARRAY['3D', 'Tilt', 'Isometric', 'Perspective'],
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80'],
  '<!-- Dimensions Isometric -->', '/* 3D CSS */', '// 3D JS',
  true, true, true, 0, 0, 0, 0, 'PortfolioHub'
),
(
  'tmpl-bento-13',
  'Bento Grid Pro',
  'Modular Apple-style asymmetric bento box layout with 3D hover tilt, status lights, and live metrics.',
  'Bento', 'Intermediate', ARRAY['Bento', 'Grid', '3D Tilt', 'Apple-style'],
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'],
  '<!-- Bento Grid Pro -->', '/* Bento CSS */', '// Bento JS',
  true, true, true, 0, 0, 0, 0, 'PortfolioHub'
),
(
  'tmpl-terminal-14',
  'UNIX Hacker Shell',
  'Authentic Linux bash terminal CLI with live typed command prompt, status bar, and green phosphor hover effects.',
  'Terminal', 'Advanced', ARRAY['Terminal', 'CLI', 'UNIX', 'Matrix'],
  'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80'],
  '<!-- UNIX Hacker Shell -->', '/* UNIX Shell CSS */', '// UNIX Shell JS',
  true, true, true, 0, 0, 0, 0, 'PortfolioHub'
),
(
  'tmpl-neumorphic-15',
  'Soft Clay Neumorphism',
  'Tactile dual-shadow extruded clay design with physical pressed states and smooth light-catch highlights.',
  'Neumorphic', 'Intermediate', ARRAY['Neumorphism', 'Soft UI', 'Clay', 'Minimal'],
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'],
  '<!-- Soft Clay Neumorphism -->', '/* Neumorphic CSS */', '// Neumorphic JS',
  false, true, true, 0, 0, 0, 0, 'PortfolioHub'
),
(
  'tmpl-retro-16',
  '8-Bit Cyber Arcade',
  'Chiptune nostalgia with CRT cathode scanlines, 3D press buttons, pixel borders, and arcade cabinet typography.',
  'Retro Arcade', 'Intermediate', ARRAY['Retro', '8-Bit', 'Arcade', 'CRT Scanlines'],
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'],
  '<!-- 8-Bit Cyber Arcade -->', '/* Retro Arcade CSS */', '// Retro Arcade JS',
  true, true, true, 0, 0, 0, 0, 'PortfolioHub'
),
(
  'tmpl-editorial-17',
  'Vogue Swiss Editorial',
  'High-fashion editorial layout featuring Cormorant Garamond serif, drop caps, and asymmetric magazine column rhythms.',
  'Editorial', 'Beginner', ARRAY['Editorial', 'Magazine', 'Typography', 'Serif'],
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'],
  '<!-- Vogue Swiss Editorial -->', '/* Editorial CSS */', '// Editorial JS',
  false, true, true, 0, 0, 0, 0, 'PortfolioHub'
),
(
  'tmpl-aurora-18',
  'Polar Aurora Borealis',
  'Dynamic flowing gradient mesh with glowing chromatic borders, glass backdrops, and northern light animation.',
  'Aurora', 'Advanced', ARRAY['Aurora', 'Gradient Mesh', 'Glow', 'Modern'],
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'],
  '<!-- Polar Aurora Borealis -->', '/* Aurora CSS */', '// Aurora JS',
  true, true, true, 0, 0, 0, 0, 'PortfolioHub'
),
(
  'tmpl-blueprint-19',
  'Architectural Blueprint CAD',
  'Engineering technical schematic with drafting grid, certification stamps, dimensional lines, and cursor coordinate tracker.',
  'Blueprint', 'Advanced', ARRAY['Blueprint', 'CAD', 'Engineering', 'Technical'],
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80'],
  '<!-- Architectural Blueprint -->', '/* Blueprint CSS */', '// Blueprint JS',
  false, true, true, 0, 0, 0, 0, 'PortfolioHub'
),
(
  'tmpl-kinetic-20',
  'Kinetic Dynamic Type',
  'High-energy typography with infinite marquee banner, word hover morphing, pill tickers, and bold spring interactions.',
  'Kinetic', 'Intermediate', ARRAY['Kinetic', 'Typography', 'Marquee', 'Dynamic'],
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'],
  '<!-- Kinetic Dynamic Type -->', '/* Kinetic CSS */', '// Kinetic JS',
  true, true, true, 0, 0, 0, 0, 'PortfolioHub'
),
(
  'tmpl-deck-21',
  '3D Fanned Card Deck',
  'Poker-style perspective card deck that smoothly fans out on cursor proximity with custom suits and depth layering.',
  'Card Deck', 'Advanced', ARRAY['3D Deck', 'Fanned Cards', 'Perspective', 'Interactive'],
  'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=800&q=80'],
  '<!-- 3D Fanned Card Deck -->', '/* Card Deck CSS */', '// Card Deck JS',
  false, true, true, 0, 0, 0, 0, 'PortfolioHub'
),
(
  'tmpl-holo-22',
  'Prismatic Holographic',
  'Iridescent foil card overlays reacting to mouse movement with 3D gyro tilt and rainbow shimmer highlights.',
  'Holographic', 'Advanced', ARRAY['Holographic', 'Prismatic', 'Gyro Tilt', 'Iridescent'],
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80'],
  '<!-- Prismatic Holographic -->', '/* Holographic CSS */', '// Holographic JS',
  true, true, true, 0, 0, 0, 0, 'PortfolioHub'
),
(
  'tmpl-space-23',
  'Deep Space Constellation',
  'Interactive HTML5 starfield particle canvas with pulsing orbital node, cosmic glows, and constellation skills grid.',
  'Deep Space', 'Advanced', ARRAY['Cosmic', 'Starfield', 'Canvas', 'Constellation'],
  'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80'],
  '<!-- Deep Space Constellation -->', '/* Deep Space CSS */', '// Deep Space JS',
  true, true, true, 0, 0, 0, 0, 'PortfolioHub'
),
(
  'tmpl-origami-24',
  'Japanese Origami Papercraft',
  'Tactile Japanese paper aesthetic featuring folded dog-eared corners, natural ink stamping, and textured card lifts.',
  'Origami', 'Beginner', ARRAY['Origami', 'Papercraft', 'Wabi-Sabi', 'Tactile'],
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'],
  '<!-- Japanese Origami Papercraft -->', '/* Origami CSS */', '// Origami JS',
  false, true, true, 0, 0, 0, 0, 'PortfolioHub'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  tags = EXCLUDED.tags,
  thumbnail_url = EXCLUDED.thumbnail_url,
  preview_images = EXCLUDED.preview_images,
  is_featured = EXCLUDED.is_featured,
  updated_at = NOW();


-- #####################################################################
-- SECURITY HARDENING (merged from the former sql/security_fixes.sql)
-- Safe to re-run. Keep this section at the END of the file.
-- #####################################################################
-- ---------------------------------------------------------------------
-- 0) is_admin(): same logic as before, with a pinned search_path
-- ---------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------
-- 1) PROFILES: lock the `role` column
-- ---------------------------------------------------------------------
drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id and role = 'user');

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using      (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- auth.uid() is null for the SQL editor / service_role: those are allowed.
  if auth.uid() is not null then
    if tg_op = 'INSERT' and new.role is distinct from 'user' then
      raise exception 'Not allowed: new accounts always start as a normal user.' using errcode = '42501';
    end if;
    if tg_op = 'UPDATE' and new.role is distinct from old.role then
      raise exception 'Not allowed: roles can only be changed from the SQL editor.' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_role on public.profiles;
create trigger profiles_guard_role
  before insert or update on public.profiles
  for each row execute function public.guard_profile_role();

-- ---------------------------------------------------------------------
-- 2) ONLY ONE ADMIN, enforced by the database
--    (a partial unique index: a second row with role='admin' is rejected)
--    If you already have more than one admin, run sql/make_single_admin.sql first.
-- ---------------------------------------------------------------------
do $$
begin
  if (select count(*) from public.profiles where role = 'admin') > 1 then
    raise warning 'More than one admin exists, so the one-admin index was NOT created. Run sql/make_single_admin.sql, then run this block again.';
  else
    create unique index if not exists only_one_admin on public.profiles (role) where role = 'admin';
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 3) TEMPLATES: only signed-in users, only as themselves (admins may also sync built-ins)
-- ---------------------------------------------------------------------
drop policy if exists "Anyone can insert templates" on public.templates;
drop policy if exists "Signed in users can insert own templates" on public.templates;
create policy "Signed in users can insert own templates"
  on public.templates for insert
  to authenticated
  with check (auth.uid() = user_id or public.is_admin());

-- ---------------------------------------------------------------------
-- 4 + 5) TEMPLATES: protect owner, featured/approved flags and counters
-- ---------------------------------------------------------------------
create or replace function public.guard_template_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  stats_ok boolean := coalesce(current_setting('app.stats_update', true), '') = 'on';
begin
  -- SQL editor / service_role / admin: no restrictions
  if auth.uid() is null or public.is_admin() then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.is_featured     := false;
    new.likes_count     := 0;
    new.downloads_count := 0;
    new.views_count     := 0;
    new.remixes_count   := 0;
    return new;
  end if;

  -- UPDATE by a normal user (the owner): these columns stay as they were
  new.user_id     := old.user_id;
  new.is_featured := old.is_featured;
  new.is_approved := old.is_approved;
  if not stats_ok then
    new.likes_count     := old.likes_count;
    new.downloads_count := old.downloads_count;
    new.views_count     := old.views_count;
    new.remixes_count   := old.remixes_count;
  end if;
  return new;
end;
$$;

drop trigger if exists templates_guard_columns on public.templates;
create trigger templates_guard_columns
  before insert or update on public.templates
  for each row execute function public.guard_template_columns();

-- The two official counter functions switch the guard off for their own update only.
create or replace function public.increment_template_stat(p_template_id text, p_field text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_field not in ('views_count', 'downloads_count', 'remixes_count') then
    raise exception 'invalid counter: %', p_field;
  end if;
  perform set_config('app.stats_update', 'on', true);
  execute format('update public.templates set %I = coalesce(%I, 0) + 1 where id::text = $1', p_field, p_field)
    using p_template_id;
  perform set_config('app.stats_update', 'off', true);
end; $$;
grant execute on function public.increment_template_stat(text, text) to anon, authenticated;

create or replace function public.sync_likes_count() returns trigger
language plpgsql security definer set search_path = public as $$
declare tid text := coalesce(new.template_id, old.template_id)::text;
begin
  begin
    perform set_config('app.stats_update', 'on', true);
    update public.templates
       set likes_count = (select count(*) from public.likes where template_id::text = tid)
     where id::text = tid;
    perform set_config('app.stats_update', 'off', true);
  exception when others then
    perform set_config('app.stats_update', 'off', true);
    raise warning 'sync_likes_count skipped: %', sqlerrm;
  end;
  return null;
end; $$;

-- make sure the like-counter trigger exists (setup.sql normally creates it)
do $$
begin
  if to_regclass('public.likes') is not null then
    drop trigger if exists likes_count_sync on public.likes;
    create trigger likes_count_sync after insert or delete on public.likes
      for each row execute function public.sync_likes_count();
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 6) DOWNLOADS: only signed-in users, only for themselves
-- ---------------------------------------------------------------------
drop policy if exists "Anyone can log downloads" on public.downloads;
drop policy if exists "Signed in users log own downloads" on public.downloads;
create policy "Signed in users log own downloads"
  on public.downloads for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Note: public.views, public.remixes and public.followers have RLS ON and no policies,
-- which means "nobody can read or write them from the website". The app does not use
-- them today, so that is the safe default. Add policies only when you build those features.

-- ---------------------------------------------------------------------
-- 7) STORAGE: users may only upload into a folder named after their own user id
--    Example path:  avatars/<user-id>/photo.png
-- ---------------------------------------------------------------------
drop policy if exists "Authenticated users upload avatars"    on storage.objects;
drop policy if exists "Authenticated users upload thumbnails" on storage.objects;
drop policy if exists "Authenticated users upload previews"   on storage.objects;
drop policy if exists "Authenticated users upload templates"  on storage.objects;
drop policy if exists "Users upload to own folder"            on storage.objects;

create policy "Users upload to own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('avatars', 'thumbnails', 'previews', 'templates')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------------------------------------------------------------------
-- DONE. Verify with the queries at the bottom of sql/make_single_admin.sql
-- ---------------------------------------------------------------------

-- ---------------------------------------------------------------------
-- 8) TEMPLATES: size limits (stops oversized uploads; 1 MB per code column)
--    NOT VALID = existing rows are not re-checked, new/updated rows are.
-- ---------------------------------------------------------------------
alter table public.templates drop constraint if exists templates_code_size_chk;
alter table public.templates add constraint templates_code_size_chk
  check (
    length(coalesce(html_code, '')) <= 1048576 and
    length(coalesce(css_code,  '')) <= 1048576 and
    length(coalesce(js_code,   '')) <= 1048576 and
    length(coalesce(title, '')) <= 200 and
    length(coalesce(description, '')) <= 2000
  ) not valid;

-- ---------------------------------------------------------------------
-- 9) Per-user publish rate limit: max 20 new templates per hour (admins exempt)
-- ---------------------------------------------------------------------
create or replace function public.limit_template_publish_rate()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if (select count(*) from public.templates
         where user_id = auth.uid() and created_at > now() - interval '1 hour') >= 20 then
      raise exception 'Too many templates published. Please try again later.';
    end if;
  end if;
  return new;
end; $$;
drop trigger if exists templates_publish_rate on public.templates;
create trigger templates_publish_rate before insert on public.templates
  for each row execute function public.limit_template_publish_rate();

-- ---------------------------------------------------------------------
-- DONE. Verify with the queries at the bottom of sql/make_single_admin.sql
-- ---------------------------------------------------------------------
