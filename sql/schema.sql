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

CREATE POLICY "Anyone can insert templates" 
  ON public.templates FOR INSERT WITH CHECK (true);

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

CREATE POLICY "Anyone can log downloads" 
  ON public.downloads FOR INSERT WITH CHECK (true);

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

CREATE POLICY "Authenticated users upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users upload thumbnails" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'thumbnails' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users upload previews" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'previews' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users upload templates" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'templates' AND auth.role() = 'authenticated');

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
  true, true, true, 1840, 4210, 14200, 240, 'Elena Rostova'
),
(
  'tmpl-dev-02',
  'Terminal Matrix Hacker',
  'Raw green CRT cathode scanlines, live typing command prompt, and monospaced system telemetry.',
  'Developer', 'Advanced', ARRAY['Terminal', 'CLI', 'CRT', 'Matrix'],
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'],
  '<!-- Terminal Matrix Hacker -->', '/* Terminal CSS */', '// Terminal JS',
  true, true, true, 3120, 8940, 29400, 780, 'Devon Vance'
),
(
  'tmpl-stud-03',
  'Academic Resume Grid',
  'Compact multi-column curriculum vitae layout engineered for internship applications and academic research.',
  'Student', 'Beginner', ARRAY['Resume', 'Academic', 'Clean', 'Fast'],
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'],
  '<!-- Academic Resume Grid -->', '/* Resume CSS */', '// Resume JS',
  false, true, true, 920, 3110, 8900, 150, 'Marcus Aurel'
),
(
  'tmpl-corp-04',
  'Executive Enterprise',
  'Conservative navy-slate palette with corporate case study callouts and credibility metric badges.',
  'Corporate', 'Intermediate', ARRAY['Enterprise', 'Fintech', 'B2B', 'Corporate'],
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'],
  '<!-- Executive Enterprise -->', '/* Executive CSS */', '// Executive JS',
  false, true, true, 740, 1980, 7100, 95, 'Sarah Jenkins'
),
(
  'tmpl-des-05',
  'Design Foundry Portfolio',
  'Editorial design showcase featuring oversized typography, cursor follow circle, and dynamic project previews.',
  'Designer', 'Intermediate', ARRAY['Studio', 'Creative', 'Agency', 'Interactive'],
  'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80'],
  '<!-- Design Foundry -->', '/* Foundry CSS */', '// Foundry JS',
  true, true, true, 2450, 6420, 21800, 510, 'Matteo Rossi'
),
(
  'tmpl-lux-06',
  'Haute Couture Monolith',
  'Warm champagne gold accents, rich serif headers, and luxury architectural framing.',
  'Luxury', 'Intermediate', ARRAY['Luxury', 'Gold', 'Fashion', 'Serif'],
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'],
  '<!-- Haute Couture Monolith -->', '/* Luxury CSS */', '// Luxury JS',
  false, true, true, 1620, 3890, 13400, 310, 'Aurelia Chen'
),
(
  'tmpl-cyber-07',
  'Neo-Tokyo HUD 2099',
  'Cyberpunk combat HUD with angular tech badges, scanlines, and high-energy diagnostics.',
  'Cyberpunk', 'Advanced', ARRAY['Cyberpunk', 'Sci-Fi', 'HUD', 'Neon'],
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80'],
  '<!-- Neo-Tokyo HUD -->', '/* Cyberpunk CSS */', '// Cyberpunk JS',
  true, true, true, 4120, 11400, 42000, 1120, 'Ren Kusanagi'
),
(
  'tmpl-glass-08',
  'Frost UI Prism',
  'Multi-layer backdrop-blur panels with chromatic border refraction and light ambient gradients.',
  'Glassmorphism', 'Intermediate', ARRAY['Glassmorphism', 'Frosted', 'Modern', 'Clean'],
  'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80'],
  '<!-- Frost UI Prism -->', '/* Glassmorphism CSS */', '// Glassmorphism JS',
  false, true, true, 1950, 4820, 17900, 390, 'Chloe Dubois'
),
(
  'tmpl-crea-09',
  'Vibrant Maximalist Pop',
  'Bold Memphis-inspired geometric stickers, neo-brutalist solid black shadows, and vivid colors.',
  'Creative', 'Intermediate', ARRAY['Brutalist', 'Memphis', 'Pop', 'Vibrant'],
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'],
  '<!-- Vibrant Maximalist Pop -->', '/* Creative CSS */', '// Creative JS',
  true, true, true, 2780, 7120, 24500, 640, 'Jasper Fox'
),
(
  'tmpl-photo-10',
  'Fullbleed Lightbox Gallery',
  'Edge-to-edge photography showcase with darkroom atmosphere, metadata overlays, and zero distraction.',
  'Photographer', 'Beginner', ARRAY['Photography', 'Darkroom', 'Fullscreen', 'Visual'],
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80'],
  '<!-- Fullbleed Gallery -->', '/* Photographer CSS */', '// Photographer JS',
  false, true, true, 1430, 3620, 12800, 210, 'Sora Takahashi'
),
(
  'tmpl-dark-11',
  'OLED Void Stealth',
  'True #000000 pitch black canvas engineered for low power consumption and high-contrast focus.',
  'Dark', 'Beginner', ARRAY['OLED', 'Stealth', 'Pitch Black', 'Minimal'],
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'],
  '<!-- OLED Void Stealth -->', '/* Dark CSS */', '// Dark JS',
  false, true, true, 1890, 4510, 16400, 320, 'Viktor Vane'
),
(
  'tmpl-3d-12',
  'Dimensions Isometric',
  'Isometric layered perspective with dynamic 3D cursor tilt responsiveness and deep shadows.',
  '3D', 'Advanced', ARRAY['3D', 'Tilt', 'Isometric', 'Perspective'],
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80'],
  '<!-- Dimensions Isometric -->', '/* 3D CSS */', '// 3D JS',
  true, true, true, 2310, 5880, 20100, 420, 'Aris Thorne'
),
(
  'tmpl-bento-13',
  'Bento Grid Pro',
  'Modular Apple-style asymmetric bento box layout with 3D hover tilt, status lights, and live metrics.',
  'Bento', 'Intermediate', ARRAY['Bento', 'Grid', '3D Tilt', 'Apple-style'],
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'],
  '<!-- Bento Grid Pro -->', '/* Bento CSS */', '// Bento JS',
  true, true, true, 3120, 7420, 25400, 610, 'Kai Takahashi'
),
(
  'tmpl-terminal-14',
  'UNIX Hacker Shell',
  'Authentic Linux bash terminal CLI with live typed command prompt, status bar, and green phosphor hover effects.',
  'Terminal', 'Advanced', ARRAY['Terminal', 'CLI', 'UNIX', 'Matrix'],
  'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80'],
  '<!-- UNIX Hacker Shell -->', '/* UNIX Shell CSS */', '// UNIX Shell JS',
  true, true, true, 2890, 6510, 21900, 530, 'Nix Foster'
),
(
  'tmpl-neumorphic-15',
  'Soft Clay Neumorphism',
  'Tactile dual-shadow extruded clay design with physical pressed states and smooth light-catch highlights.',
  'Neumorphic', 'Intermediate', ARRAY['Neumorphism', 'Soft UI', 'Clay', 'Minimal'],
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'],
  '<!-- Soft Clay Neumorphism -->', '/* Neumorphic CSS */', '// Neumorphic JS',
  false, true, true, 1980, 4720, 16800, 340, 'Clara Lindqvist'
),
(
  'tmpl-retro-16',
  '8-Bit Cyber Arcade',
  'Chiptune nostalgia with CRT cathode scanlines, 3D press buttons, pixel borders, and arcade cabinet typography.',
  'Retro Arcade', 'Intermediate', ARRAY['Retro', '8-Bit', 'Arcade', 'CRT Scanlines'],
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'],
  '<!-- 8-Bit Cyber Arcade -->', '/* Retro Arcade CSS */', '// Retro Arcade JS',
  true, true, true, 2450, 5890, 19200, 410, 'Jax Voxel'
),
(
  'tmpl-editorial-17',
  'Vogue Swiss Editorial',
  'High-fashion editorial layout featuring Cormorant Garamond serif, drop caps, and asymmetric magazine column rhythms.',
  'Editorial', 'Beginner', ARRAY['Editorial', 'Magazine', 'Typography', 'Serif'],
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'],
  '<!-- Vogue Swiss Editorial -->', '/* Editorial CSS */', '// Editorial JS',
  false, true, true, 1840, 4210, 15300, 290, 'Camille Moreau'
),
(
  'tmpl-aurora-18',
  'Polar Aurora Borealis',
  'Dynamic flowing gradient mesh with glowing chromatic borders, glass backdrops, and northern light animation.',
  'Aurora', 'Advanced', ARRAY['Aurora', 'Gradient Mesh', 'Glow', 'Modern'],
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'],
  '<!-- Polar Aurora Borealis -->', '/* Aurora CSS */', '// Aurora JS',
  true, true, true, 3410, 8120, 28400, 720, 'Soren Frost'
),
(
  'tmpl-blueprint-19',
  'Architectural Blueprint CAD',
  'Engineering technical schematic with drafting grid, certification stamps, dimensional lines, and cursor coordinate tracker.',
  'Blueprint', 'Advanced', ARRAY['Blueprint', 'CAD', 'Engineering', 'Technical'],
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80'],
  '<!-- Architectural Blueprint -->', '/* Blueprint CSS */', '// Blueprint JS',
  false, true, true, 2670, 6140, 20500, 460, 'Klaus Brand'
),
(
  'tmpl-kinetic-20',
  'Kinetic Dynamic Type',
  'High-energy typography with infinite marquee banner, word hover morphing, pill tickers, and bold spring interactions.',
  'Kinetic', 'Intermediate', ARRAY['Kinetic', 'Typography', 'Marquee', 'Dynamic'],
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'],
  '<!-- Kinetic Dynamic Type -->', '/* Kinetic CSS */', '// Kinetic JS',
  true, true, true, 2210, 5310, 17800, 380, 'Devon Miles'
),
(
  'tmpl-deck-21',
  '3D Fanned Card Deck',
  'Poker-style perspective card deck that smoothly fans out on cursor proximity with custom suits and depth layering.',
  'Card Deck', 'Advanced', ARRAY['3D Deck', 'Fanned Cards', 'Perspective', 'Interactive'],
  'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=800&q=80'],
  '<!-- 3D Fanned Card Deck -->', '/* Card Deck CSS */', '// Card Deck JS',
  false, true, true, 2590, 6020, 21100, 490, 'Talia Sterling'
),
(
  'tmpl-holo-22',
  'Prismatic Holographic',
  'Iridescent foil card overlays reacting to mouse movement with 3D gyro tilt and rainbow shimmer highlights.',
  'Holographic', 'Advanced', ARRAY['Holographic', 'Prismatic', 'Gyro Tilt', 'Iridescent'],
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80'],
  '<!-- Prismatic Holographic -->', '/* Holographic CSS */', '// Holographic JS',
  true, true, true, 3820, 9240, 31200, 850, 'Zephyr Lux'
),
(
  'tmpl-space-23',
  'Deep Space Constellation',
  'Interactive HTML5 starfield particle canvas with pulsing orbital node, cosmic glows, and constellation skills grid.',
  'Deep Space', 'Advanced', ARRAY['Cosmic', 'Starfield', 'Canvas', 'Constellation'],
  'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80'],
  '<!-- Deep Space Constellation -->', '/* Deep Space CSS */', '// Deep Space JS',
  true, true, true, 3650, 8890, 29800, 790, 'Dr. Orion Vance'
),
(
  'tmpl-origami-24',
  'Japanese Origami Papercraft',
  'Tactile Japanese paper aesthetic featuring folded dog-eared corners, natural ink stamping, and textured card lifts.',
  'Origami', 'Beginner', ARRAY['Origami', 'Papercraft', 'Wabi-Sabi', 'Tactile'],
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'],
  '<!-- Japanese Origami Papercraft -->', '/* Origami CSS */', '// Origami JS',
  false, true, true, 2190, 5120, 17400, 360, 'Kenji Sato'
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
