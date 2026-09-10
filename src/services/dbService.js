import { supabase, isSupabaseConfigured } from '../supabase/client.js';
import { generatePortfolioCode, DEFAULT_USER_DATA } from './templateEngines.js';

// Pre-seeded 12 initial templates metadata with distinct aesthetics
const SEED_TEMPLATES = [
  {
    id: 'tmpl-minimal-01',
    title: 'Aura Minimalist',
    description: 'Clean Swiss-inspired typography, generous whitespace, and pure content focus. Ideal for engineers and product leaders.',
    category: 'Minimal',
    difficulty: 'Beginner',
    tags: ['Minimal', 'Fast', 'Clean', 'Modern'],
    thumbnail_url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80'
    ],
    creator_name: 'Elena Rostova',
    creator_id: 'user-01',
    creator_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    likes_count: 1420,
    downloads_count: 3890,
    views_count: 12400,
    remixes_count: 312,
    is_featured: true,
    is_approved: true,
    created_at: '2025-01-15T10:00:00Z'
  },
  {
    id: 'tmpl-dev-02',
    title: 'Kernel Terminal IDE',
    description: 'Bespoke terminal console aesthetic with bash prompt, git commit logs, and syntax highlighting style. For hackers & backend wizards.',
    category: 'Developer',
    difficulty: 'Intermediate',
    tags: ['Terminal', 'CLI', 'Git', 'Linux'],
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
    ],
    creator_name: 'Marcus Brody',
    creator_id: 'user-02',
    creator_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    likes_count: 2150,
    downloads_count: 5640,
    views_count: 18900,
    remixes_count: 480,
    is_featured: true,
    is_approved: true,
    created_at: '2025-01-20T14:30:00Z'
  },
  {
    id: 'tmpl-student-03',
    title: 'Scholar Roadmap',
    description: 'Vibrant academic cards displaying coursework, GPA badges, hackathon honors, and semester projects.',
    category: 'Student',
    difficulty: 'Beginner',
    tags: ['College', 'Internship', 'Junior Dev', 'Clean'],
    thumbnail_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
    ],
    creator_name: 'Priya Sharma',
    creator_id: 'user-03',
    creator_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    likes_count: 980,
    downloads_count: 2410,
    views_count: 8500,
    remixes_count: 195,
    is_featured: false,
    is_approved: true,
    created_at: '2025-02-01T09:15:00Z'
  },
  {
    id: 'tmpl-corp-04',
    title: 'Vanguard Executive',
    description: 'Crisp, authoritative design built for engineering directors, CTOs, and enterprise consultants with metric case studies.',
    category: 'Corporate',
    difficulty: 'Intermediate',
    tags: ['Executive', 'Enterprise', 'Leadership', 'Metrics'],
    thumbnail_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
    ],
    creator_name: 'David Sterling',
    creator_id: 'user-04',
    creator_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    likes_count: 730,
    downloads_count: 1980,
    views_count: 6200,
    remixes_count: 88,
    is_featured: false,
    is_approved: true,
    created_at: '2025-02-05T16:45:00Z'
  },
  {
    id: 'tmpl-designer-05',
    title: 'Prism Visualist',
    description: 'Visual-first dynamic showcase with bold display typography, magnetic cards, and rich interactive thumbnails.',
    category: 'Designer',
    difficulty: 'Intermediate',
    tags: ['UI/UX', 'Art Direction', 'Typography', 'Figma'],
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
    ],
    creator_name: 'Chloe Monet',
    creator_id: 'user-05',
    creator_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    likes_count: 1840,
    downloads_count: 4200,
    views_count: 14500,
    remixes_count: 360,
    is_featured: true,
    is_approved: true,
    created_at: '2025-02-08T11:20:00Z'
  },
  {
    id: 'tmpl-lux-06',
    title: 'Aureus Obsidian',
    description: 'Ultra-exclusive dark editorial canvas paired with champagne gold accents and Cormorant Garamond serif headings.',
    category: 'Luxury',
    difficulty: 'Advanced',
    tags: ['Editorial', 'Luxury', 'Gold', 'Serif'],
    thumbnail_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    creator_name: 'Julian Beauchamp',
    creator_id: 'user-06',
    creator_avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    likes_count: 1290,
    downloads_count: 3100,
    views_count: 11000,
    remixes_count: 210,
    is_featured: true,
    is_approved: true,
    created_at: '2025-02-12T13:10:00Z'
  },
  {
    id: 'tmpl-cyber-07',
    title: 'Neuromancer HUD',
    description: 'Cyberpunk HUD cockpit with glitch header animations, scanline overlays, neon cyan & magenta telemetry cards.',
    category: 'Cyberpunk',
    difficulty: 'Advanced',
    tags: ['Neon', 'Matrix', 'HUD', 'Glitch'],
    thumbnail_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80'
    ],
    creator_name: 'Kaelen Voss',
    creator_id: 'user-07',
    creator_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    likes_count: 2490,
    downloads_count: 6720,
    views_count: 22400,
    remixes_count: 590,
    is_featured: true,
    is_approved: true,
    created_at: '2025-02-14T20:00:00Z'
  },
  {
    id: 'tmpl-glass-08',
    title: 'Frost Acrylic',
    description: 'Multi-layer frosted glass panels floating atop glowing gradient mesh orbs. Ultra modern iOS-like translucency.',
    category: 'Glassmorphism',
    difficulty: 'Intermediate',
    tags: ['Glass', 'Mesh', 'Backdrop', 'Modern'],
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
    ],
    creator_name: 'Sora Tanaka',
    creator_id: 'user-08',
    creator_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    likes_count: 1780,
    downloads_count: 4500,
    views_count: 16100,
    remixes_count: 340,
    is_featured: false,
    is_approved: true,
    created_at: '2025-02-18T08:30:00Z'
  },
  {
    id: 'tmpl-creative-09',
    title: 'Neo Pop Brutal',
    description: 'Bold chunky borders, hard drop shadows, playful stickers, and contrasting pop colors. Unapologetically creative.',
    category: 'Creative',
    difficulty: 'Beginner',
    tags: ['Neo-Brutalism', 'Pop', 'Vibrant', 'Fun'],
    thumbnail_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
    ],
    creator_name: 'Zoe Hendrix',
    creator_id: 'user-09',
    creator_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    likes_count: 1120,
    downloads_count: 2890,
    views_count: 9800,
    remixes_count: 180,
    is_featured: false,
    is_approved: true,
    created_at: '2025-02-20T17:15:00Z'
  },
  {
    id: 'tmpl-photo-10',
    title: 'Lumina Shutter',
    description: 'Pure image-centric masonry gallery engineered for fine art photographers, cinematographers, and visual storytellers.',
    category: 'Photographer',
    difficulty: 'Beginner',
    tags: ['Photography', 'Gallery', 'Black', 'Monochrome'],
    thumbnail_url: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80'
    ],
    creator_name: 'Lucas Richter',
    creator_id: 'user-10',
    creator_avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    likes_count: 890,
    downloads_count: 2150,
    views_count: 7900,
    remixes_count: 140,
    is_featured: false,
    is_approved: true,
    created_at: '2025-02-22T12:00:00Z'
  },
  {
    id: 'tmpl-dark-11',
    title: 'Stealth Obsidian',
    description: 'Ultra deep dark palette with luminous emerald accents, subtle borders, and smooth glowing hover cards.',
    category: 'Dark',
    difficulty: 'Intermediate',
    tags: ['Stealth', 'Deep Dark', 'Emerald', 'Developer'],
    thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
    ],
    creator_name: 'Damon Hunt',
    creator_id: 'user-11',
    creator_avatar: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=200&q=80',
    likes_count: 1650,
    downloads_count: 3940,
    views_count: 13900,
    remixes_count: 275,
    is_featured: false,
    is_approved: true,
    created_at: '2025-02-25T14:40:00Z'
  },
  {
    id: 'tmpl-3d-12',
    title: 'Dimensions Isometric',
    description: 'Isometric layered perspective with dynamic 3D cursor tilt responsiveness and deep shadows.',
    category: '3D',
    difficulty: 'Advanced',
    tags: ['3D', 'Tilt', 'Isometric', 'Perspective'],
    thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80'
    ],
    creator_name: 'Aris Thorne',
    creator_id: 'user-12',
    creator_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    likes_count: 2310,
    downloads_count: 5880,
    views_count: 20100,
    remixes_count: 420,
    is_featured: true,
    is_approved: true,
    created_at: '2025-02-28T19:20:00Z'
  },
  {
    id: 'tmpl-bento-13',
    title: 'Bento Grid Pro',
    description: 'Modular Apple-style asymmetric bento box layout with 3D hover tilt, status lights, and live metrics.',
    category: 'Bento',
    difficulty: 'Intermediate',
    tags: ['Bento', 'Grid', '3D Tilt', 'Apple-style'],
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
    ],
    creator_name: 'Kai Takahashi',
    creator_id: 'user-13',
    creator_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    likes_count: 3120,
    downloads_count: 7420,
    views_count: 25400,
    remixes_count: 610,
    is_featured: true,
    is_approved: true,
    created_at: '2025-03-01T10:00:00Z'
  },
  {
    id: 'tmpl-terminal-14',
    title: 'UNIX Hacker Shell',
    description: 'Authentic Linux bash terminal CLI with live typed command prompt, status bar, and green phosphor hover effects.',
    category: 'Terminal',
    difficulty: 'Advanced',
    tags: ['Terminal', 'CLI', 'UNIX', 'Matrix'],
    thumbnail_url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80'
    ],
    creator_name: 'Nix Foster',
    creator_id: 'user-14',
    creator_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    likes_count: 2890,
    downloads_count: 6510,
    views_count: 21900,
    remixes_count: 530,
    is_featured: true,
    is_approved: true,
    created_at: '2025-03-01T14:30:00Z'
  },
  {
    id: 'tmpl-neumorphic-15',
    title: 'Soft Clay Neumorphism',
    description: 'Tactile dual-shadow extruded clay design with physical pressed states and smooth light-catch highlights.',
    category: 'Neumorphic',
    difficulty: 'Intermediate',
    tags: ['Neumorphism', 'Soft UI', 'Clay', 'Minimal'],
    thumbnail_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'
    ],
    creator_name: 'Clara Lindqvist',
    creator_id: 'user-15',
    creator_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    likes_count: 1980,
    downloads_count: 4720,
    views_count: 16800,
    remixes_count: 340,
    is_featured: false,
    is_approved: true,
    created_at: '2025-03-02T09:00:00Z'
  },
  {
    id: 'tmpl-retro-16',
    title: '8-Bit Cyber Arcade',
    description: 'Chiptune nostalgia with CRT cathode scanlines, 3D press buttons, pixel borders, and arcade cabinet typography.',
    category: 'Retro Arcade',
    difficulty: 'Intermediate',
    tags: ['Retro', '8-Bit', 'Arcade', 'CRT Scanlines'],
    thumbnail_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
    ],
    creator_name: 'Jax Voxel',
    creator_id: 'user-16',
    creator_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    likes_count: 2450,
    downloads_count: 5890,
    views_count: 19200,
    remixes_count: 410,
    is_featured: true,
    is_approved: true,
    created_at: '2025-03-02T16:00:00Z'
  },
  {
    id: 'tmpl-editorial-17',
    title: 'Vogue Swiss Editorial',
    description: 'High-fashion editorial layout featuring Cormorant Garamond serif, drop caps, and asymmetric magazine column rhythms.',
    category: 'Editorial',
    difficulty: 'Beginner',
    tags: ['Editorial', 'Magazine', 'Typography', 'Serif'],
    thumbnail_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'
    ],
    creator_name: 'Camille Moreau',
    creator_id: 'user-17',
    creator_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    likes_count: 1840,
    downloads_count: 4210,
    views_count: 15300,
    remixes_count: 290,
    is_featured: false,
    is_approved: true,
    created_at: '2025-03-03T11:20:00Z'
  },
  {
    id: 'tmpl-aurora-18',
    title: 'Polar Aurora Borealis',
    description: 'Dynamic flowing gradient mesh with glowing chromatic borders, glass backdrops, and northern light animation.',
    category: 'Aurora',
    difficulty: 'Advanced',
    tags: ['Aurora', 'Gradient Mesh', 'Glow', 'Modern'],
    thumbnail_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'
    ],
    creator_name: 'Soren Frost',
    creator_id: 'user-18',
    creator_avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    likes_count: 3410,
    downloads_count: 8120,
    views_count: 28400,
    remixes_count: 720,
    is_featured: true,
    is_approved: true,
    created_at: '2025-03-03T18:00:00Z'
  },
  {
    id: 'tmpl-blueprint-19',
    title: 'Architectural Blueprint CAD',
    description: 'Engineering technical schematic with drafting grid, certification stamps, dimensional lines, and cursor coordinate tracker.',
    category: 'Blueprint',
    difficulty: 'Advanced',
    tags: ['Blueprint', 'CAD', 'Engineering', 'Technical'],
    thumbnail_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80'
    ],
    creator_name: 'Klaus Brand',
    creator_id: 'user-19',
    creator_avatar: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=200&q=80',
    likes_count: 2670,
    downloads_count: 6140,
    views_count: 20500,
    remixes_count: 460,
    is_featured: false,
    is_approved: true,
    created_at: '2025-03-04T08:45:00Z'
  },
  {
    id: 'tmpl-kinetic-20',
    title: 'Kinetic Dynamic Type',
    description: 'High-energy typography with infinite marquee banner, word hover morphing, pill tickers, and bold spring interactions.',
    category: 'Kinetic',
    difficulty: 'Intermediate',
    tags: ['Kinetic', 'Typography', 'Marquee', 'Dynamic'],
    thumbnail_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
    ],
    creator_name: 'Devon Miles',
    creator_id: 'user-20',
    creator_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    likes_count: 2210,
    downloads_count: 5310,
    views_count: 17800,
    remixes_count: 380,
    is_featured: true,
    is_approved: true,
    created_at: '2025-03-04T13:10:00Z'
  },
  {
    id: 'tmpl-deck-21',
    title: '3D Fanned Card Deck',
    description: 'Poker-style perspective card deck that smoothly fans out on cursor proximity with custom suits and depth layering.',
    category: 'Card Deck',
    difficulty: 'Advanced',
    tags: ['3D Deck', 'Fanned Cards', 'Perspective', 'Interactive'],
    thumbnail_url: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=800&q=80'
    ],
    creator_name: 'Talia Sterling',
    creator_id: 'user-21',
    creator_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    likes_count: 2590,
    downloads_count: 6020,
    views_count: 21100,
    remixes_count: 490,
    is_featured: false,
    is_approved: true,
    created_at: '2025-03-05T09:30:00Z'
  },
  {
    id: 'tmpl-holo-22',
    title: 'Prismatic Holographic',
    description: 'Iridescent foil card overlays reacting to mouse movement with 3D gyro tilt and rainbow shimmer highlights.',
    category: 'Holographic',
    difficulty: 'Advanced',
    tags: ['Holographic', 'Prismatic', 'Gyro Tilt', 'Iridescent'],
    thumbnail_url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80'
    ],
    creator_name: 'Zephyr Lux',
    creator_id: 'user-22',
    creator_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    likes_count: 3820,
    downloads_count: 9240,
    views_count: 31200,
    remixes_count: 850,
    is_featured: true,
    is_approved: true,
    created_at: '2025-03-05T15:00:00Z'
  },
  {
    id: 'tmpl-space-23',
    title: 'Deep Space Constellation',
    description: 'Interactive HTML5 starfield particle canvas with pulsing orbital node, cosmic glows, and constellation skills grid.',
    category: 'Deep Space',
    difficulty: 'Advanced',
    tags: ['Cosmic', 'Starfield', 'Canvas', 'Constellation'],
    thumbnail_url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80'
    ],
    creator_name: 'Dr. Orion Vance',
    creator_id: 'user-23',
    creator_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    likes_count: 3650,
    downloads_count: 8890,
    views_count: 29800,
    remixes_count: 790,
    is_featured: true,
    is_approved: true,
    created_at: '2025-03-05T20:45:00Z'
  },
  {
    id: 'tmpl-origami-24',
    title: 'Japanese Origami Papercraft',
    description: 'Tactile Japanese paper aesthetic featuring folded dog-eared corners, natural ink stamping, and textured card lifts.',
    category: 'Origami',
    difficulty: 'Beginner',
    tags: ['Origami', 'Papercraft', 'Wabi-Sabi', 'Tactile'],
    thumbnail_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    preview_images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
    ],
    creator_name: 'Kenji Sato',
    creator_id: 'user-24',
    creator_avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    likes_count: 2190,
    downloads_count: 5120,
    views_count: 17400,
    remixes_count: 360,
    is_featured: false,
    is_approved: true,
    created_at: '2025-03-06T09:15:00Z'
  }
];

// Helper to get local templates
function getStoredTemplates() {
  try {
    const raw = localStorage.getItem('portfoliohub_templates');
    if (!raw) {
      localStorage.setItem('portfoliohub_templates', JSON.stringify(SEED_TEMPLATES));
      return SEED_TEMPLATES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem('portfoliohub_templates', JSON.stringify(SEED_TEMPLATES));
      return SEED_TEMPLATES;
    }
    // Auto-sync missing seed templates
    const existingIds = new Set(parsed.map(t => t.id));
    const missing = SEED_TEMPLATES.filter(t => !existingIds.has(t.id));
    if (missing.length > 0) {
      const merged = [...parsed, ...missing];
      localStorage.setItem('portfoliohub_templates', JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch (e) {
    return SEED_TEMPLATES;
  }
}

function saveStoredTemplates(templates) {
  try {
    localStorage.setItem('portfoliohub_templates', JSON.stringify(templates));
  } catch (e) {
    console.error('Local save error', e);
  }
}

// User state helpers
function getStoredLikes() {
  try {
    return JSON.parse(localStorage.getItem('portfoliohub_user_likes') || '[]');
  } catch {
    return [];
  }
}

function getStoredFavorites() {
  try {
    return JSON.parse(localStorage.getItem('portfoliohub_user_favorites') || '[]');
  } catch {
    return [];
  }
}

function getStoredComments() {
  try {
    return JSON.parse(localStorage.getItem('portfoliohub_comments') || '{}');
  } catch {
    return {};
  }
}

function isUuid(id) {
  return typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id.trim());
}

export const dbService = {
  // Fetch templates with search, filter, and sort (merges Supabase community uploads with curated catalog)
  async getTemplates({ category = 'All', difficulty = 'All', search = '', sort = 'popular', page = 1, limit = 9 } = {}) {
    let combinedItems = [];
    const seenIds = new Set();

    // 1. Fetch live community uploads from Supabase first
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('templates').select('*').eq('is_approved', true);
        const { data, error } = await query;
        if (!error && Array.isArray(data)) {
          data.forEach(item => {
            if (item && item.id && !seenIds.has(item.id)) {
              seenIds.add(item.id);
              combinedItems.push(item);
            }
          });
        }
      } catch (e) {
        console.warn('Supabase templates fetch notice:', e);
      }
    }

    // 2. Include stored local templates and curated seed styles
    const stored = getStoredTemplates();
    stored.forEach(item => {
      if (item && item.id && !seenIds.has(item.id)) {
        seenIds.add(item.id);
        combinedItems.push(item);
      }
    });

    SEED_TEMPLATES.forEach(item => {
      if (item && item.id && !seenIds.has(item.id)) {
        seenIds.add(item.id);
        combinedItems.push(item);
      }
    });

    let items = combinedItems;

    // Apply category filter
    if (category && category !== 'All') {
      items = items.filter(t => t.category && t.category.toLowerCase() === category.toLowerCase());
    }

    // Apply difficulty filter
    if (difficulty && difficulty !== 'All') {
      items = items.filter(t => t.difficulty && t.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    // Apply text search
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(t => 
        (t.title && t.title.toLowerCase().includes(q)) || 
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.creator_name && t.creator_name.toLowerCase().includes(q)) ||
        (Array.isArray(t.tags) && t.tags.some(tag => String(tag).toLowerCase().includes(q))) ||
        (typeof t.tags === 'string' && t.tags.toLowerCase().includes(q))
      );
    }

    // Sort items
    if (sort === 'newest') {
      items.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else if (sort === 'downloads') {
      items.sort((a, b) => (b.downloads_count || 0) - (a.downloads_count || 0));
    } else if (sort === 'likes') {
      items.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
    } else {
      // Popular (combination of likes, downloads, and views)
      items.sort((a, b) => {
        const scoreA = (a.likes_count || 0) * 3 + (a.downloads_count || 0) * 2 + (a.views_count || 0) * 0.1;
        const scoreB = (b.likes_count || 0) * 3 + (b.downloads_count || 0) * 2 + (b.views_count || 0) * 0.1;
        return scoreB - scoreA;
      });
    }

    const total = items.length;
    const startIndex = (page - 1) * limit;
    const paginated = items.slice(startIndex, startIndex + limit);

    return {
      templates: paginated,
      total,
      totalPages: Math.ceil(total / limit) || 1
    };
  },

  // Get single template by ID or slug
  async getTemplateById(id) {
    if (!id) return null;
    let found = null;

    if (isSupabaseConfigured) {
      try {
        if (isUuid(id)) {
          const { data, error } = await supabase.from('templates').select('*').eq('id', id).maybeSingle();
          if (!error && data) {
            found = data;
          }
        } else {
          // If not UUID, query by title (ilike)
          const { data, error } = await supabase.from('templates').select('*').ilike('title', id).maybeSingle();
          if (!error && data) {
            found = data;
          }
        }
      } catch (e) {
        console.warn('Supabase getTemplateById notice:', e);
      }
    }

    if (!found) {
      const templates = getStoredTemplates();
      found = templates.find(t => t.id === id || String(t.id) === String(id) || (t.title && t.title.toLowerCase() === String(id).toLowerCase()));
    }

    if (!found) {
      found = SEED_TEMPLATES.find(t => t.id === id || String(t.id) === String(id) || (t.title && t.title.toLowerCase() === String(id).toLowerCase()));
    }

    if (found) {
      // Ensure HTML/CSS/JS code exists and is not just a tiny placeholder or comment
      const rawHtml = found.html_code ? String(found.html_code).trim() : '';
      const isStub = !rawHtml || 
        rawHtml.length < 35 || 
        (rawHtml.startsWith('<!--') && rawHtml.endsWith('-->') && !rawHtml.includes('<div') && !rawHtml.includes('<section'));

      if (isStub) {
        const generated = generatePortfolioCode(found.category || found.title, DEFAULT_USER_DATA);
        found.html_code = generated.html;
        found.css_code = (found.css_code && String(found.css_code).trim().length > 20) ? found.css_code : generated.css;
        found.js_code = (found.js_code && String(found.js_code).trim().length > 10) ? found.js_code : generated.js;
      }
      return found;
    }
    return null;
  },

  // Like / Unlike toggle
  async toggleLike(templateId, userId = 'guest-user') {
    const userLikes = getStoredLikes();
    const hasLiked = userLikes.includes(templateId);

    let updatedLikes;
    let increment = 1;

    if (hasLiked) {
      updatedLikes = userLikes.filter(id => id !== templateId);
      increment = -1;
    } else {
      updatedLikes = [...userLikes, templateId];
      increment = 1;
    }
    localStorage.setItem('portfoliohub_user_likes', JSON.stringify(updatedLikes));

    const templates = getStoredTemplates();
    const index = templates.findIndex(t => t.id === templateId);
    if (index !== -1) {
      templates[index].likes_count = Math.max(0, (templates[index].likes_count || 0) + increment);
      saveStoredTemplates(templates);
    }

    if (isSupabaseConfigured && userId !== 'guest-user') {
      try {
        if (hasLiked) {
          await supabase.from('likes').delete().eq('template_id', templateId).eq('user_id', userId);
        } else {
          await supabase.from('likes').insert({ template_id: templateId, user_id: userId });
        }
      } catch (e) {
        console.warn('Supabase like error', e);
      }
    }

    return { hasLiked: !hasLiked, count: templates[index]?.likes_count || 0 };
  },

  isLiked(templateId) {
    return getStoredLikes().includes(templateId);
  },

  // Favorite toggle
  async toggleFavorite(templateId) {
    const favs = getStoredFavorites();
    const isFav = favs.includes(templateId);
    const updated = isFav ? favs.filter(id => id !== templateId) : [...favs, templateId];
    localStorage.setItem('portfoliohub_user_favorites', JSON.stringify(updated));
    return !isFav;
  },

  isFavorite(templateId) {
    return getStoredFavorites().includes(templateId);
  },

  // Record Download
  async recordDownload(templateId) {
    if (!templateId) return;
    const templates = getStoredTemplates();
    const idx = templates.findIndex(t => t.id === templateId || String(t.id) === String(templateId));
    if (idx !== -1) {
      templates[idx].downloads_count = (templates[idx].downloads_count || 0) + 1;
      saveStoredTemplates(templates);
    }

    if (isSupabaseConfigured && isUuid(templateId)) {
      try {
        const { data } = await supabase.from('templates').select('downloads_count').eq('id', templateId).maybeSingle();
        if (data) {
          await supabase.from('templates').update({ downloads_count: (data.downloads_count || 0) + 1 }).eq('id', templateId);
        }
      } catch (e) {
        console.warn('Supabase download logging notice:', e);
      }
    }
  },

  async incrementDownloads(templateId) {
    return this.recordDownload(templateId);
  },

  // Record View
  async recordView(templateId) {
    if (!templateId) return;
    const templates = getStoredTemplates();
    const idx = templates.findIndex(t => t.id === templateId || String(t.id) === String(templateId));
    if (idx !== -1) {
      templates[idx].views_count = (templates[idx].views_count || 0) + 1;
      saveStoredTemplates(templates);
    }

    if (isSupabaseConfigured && isUuid(templateId)) {
      try {
        const { data } = await supabase.from('templates').select('views_count').eq('id', templateId).maybeSingle();
        if (data) {
          await supabase.from('templates').update({ views_count: (data.views_count || 0) + 1 }).eq('id', templateId);
        }
      } catch (e) {
        console.warn('Supabase view logging notice:', e);
      }
    }
  },

  async incrementViews(templateId) {
    return this.recordView(templateId);
  },

  // Remix Template: Duplicate HTML/CSS/JS, create new entry, keep creator credited
  async remixTemplate(originalTemplate, user = {}) {
    const newId = `remix-${Date.now()}`;
    const remixedTemplate = {
      ...originalTemplate,
      id: newId,
      title: `${originalTemplate.title} (Remix by ${user.username || 'Creator'})`,
      creator_name: user.username || 'Remixer',
      creator_id: user.id || 'remixer-user',
      creator_avatar: user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      remixed_from_id: originalTemplate.id,
      remixed_from_title: originalTemplate.title,
      original_creator: originalTemplate.creator_name,
      likes_count: 0,
      downloads_count: 0,
      views_count: 1,
      remixes_count: 0,
      created_at: new Date().toISOString()
    };

    const templates = getStoredTemplates();
    // Increment original template remix count
    const origIdx = templates.findIndex(t => t.id === originalTemplate.id);
    if (origIdx !== -1) {
      templates[origIdx].remixes_count = (templates[origIdx].remixes_count || 0) + 1;
    }

    templates.unshift(remixedTemplate);
    saveStoredTemplates(templates);

    if (isSupabaseConfigured && user.id) {
      try {
        await supabase.from('templates').insert({
          title: remixedTemplate.title,
          description: remixedTemplate.description,
          category: remixedTemplate.category,
          html_code: remixedTemplate.html_code || '',
          css_code: remixedTemplate.css_code || '',
          js_code: remixedTemplate.js_code || '',
          remixed_from_id: originalTemplate.id,
          user_id: user.id
        });
      } catch (e) {
        console.warn('Supabase remix save error', e);
      }
    }

    return remixedTemplate;
  },

  // Upload new template
  async uploadTemplate(templateData, user = {}) {
    const creatorName = user.username || templateData.creator_name || 'Community Creator';
    const creatorId = user.id || templateData.creator_id || 'community-user';
    const creatorAvatar = user.avatar_url || templateData.creator_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

    const newId = `user-tmpl-${Date.now()}`;
    const newTemplate = {
      id: newId,
      title: templateData.title,
      description: templateData.description || 'Custom developer portfolio template.',
      category: templateData.category || 'Minimal',
      difficulty: templateData.difficulty || 'Intermediate',
      tags: templateData.tags || ['Custom', 'Community'],
      thumbnail_url: templateData.thumbnail_url || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      preview_images: templateData.preview_images || [templateData.thumbnail_url || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'],
      html_code: templateData.html_code || '',
      css_code: templateData.css_code || '',
      js_code: templateData.js_code || '',
      creator_name: creatorName,
      creator_id: creatorId,
      creator_avatar: creatorAvatar,
      likes_count: 0,
      downloads_count: 0,
      views_count: 1,
      remixes_count: 0,
      is_featured: false,
      is_approved: true,
      is_public: true,
      created_at: new Date().toISOString()
    };

    // Save locally immediately
    const templates = getStoredTemplates();
    templates.unshift(newTemplate);
    saveStoredTemplates(templates);

    // Save to Supabase if connected
    if (isSupabaseConfigured) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const activeUserId = sessionData?.session?.user?.id;

        const payload = {
          title: newTemplate.title,
          description: newTemplate.description,
          category: newTemplate.category,
          difficulty: newTemplate.difficulty,
          tags: newTemplate.tags,
          thumbnail_url: newTemplate.thumbnail_url,
          preview_images: newTemplate.preview_images,
          html_code: newTemplate.html_code,
          css_code: newTemplate.css_code,
          js_code: newTemplate.js_code,
          creator_name: newTemplate.creator_name,
          is_approved: true,
          is_public: true
        };

        // Attach user_id if authenticated
        if (activeUserId) {
          payload.user_id = activeUserId;
        }

        const { data, error } = await supabase
          .from('templates')
          .insert(payload)
          .select()
          .maybeSingle();

        if (!error && data) {
          // If Supabase assigned a UUID or ID, keep local store in sync
          newTemplate.id = data.id;
          templates[0] = { ...newTemplate, ...data };
          saveStoredTemplates(templates);
        } else if (error) {
          console.warn('Supabase template insert notice:', error.message);
        }
      } catch (e) {
        console.warn('Supabase upload error:', e);
      }
    }

    return newTemplate;
  },

  // Alias for uploadTemplate
  async createTemplate(templateData, user = {}) {
    return this.uploadTemplate(templateData, user);
  },

  // Update template
  async updateTemplate(templateId, updates = {}) {
    if (!templateId) return null;

    let updatedItem = null;
    const templates = getStoredTemplates();
    const idx = templates.findIndex(t => t.id === templateId || String(t.id) === String(templateId));

    if (idx !== -1) {
      templates[idx] = {
        ...templates[idx],
        ...updates,
        updated_at: new Date().toISOString()
      };
      updatedItem = templates[idx];
      saveStoredTemplates(templates);
    } else {
      // If not in stored, create a local entry with updates
      const original = await this.getTemplateById(templateId);
      if (original) {
        updatedItem = {
          ...original,
          ...updates,
          updated_at: new Date().toISOString()
        };
        templates.unshift(updatedItem);
        saveStoredTemplates(templates);
      }
    }

    if (isSupabaseConfigured && isUuid(templateId)) {
      try {
        const payload = {};
        if (updates.title !== undefined) payload.title = updates.title;
        if (updates.description !== undefined) payload.description = updates.description;
        if (updates.category !== undefined) payload.category = updates.category;
        if (updates.difficulty !== undefined) payload.difficulty = updates.difficulty;
        if (updates.tags !== undefined) payload.tags = updates.tags;
        if (updates.creator_name !== undefined) payload.creator_name = updates.creator_name;
        if (updates.thumbnail_url !== undefined) payload.thumbnail_url = updates.thumbnail_url;
        if (updates.html_code !== undefined) payload.html_code = updates.html_code;
        if (updates.css_code !== undefined) payload.css_code = updates.css_code;
        if (updates.js_code !== undefined) payload.js_code = updates.js_code;

        if (Object.keys(payload).length > 0) {
          const { data, error } = await supabase
            .from('templates')
            .update(payload)
            .eq('id', templateId)
            .select()
            .maybeSingle();

          if (!error && data) {
            updatedItem = { ...updatedItem, ...data };
          } else if (error) {
            console.warn('Supabase updateTemplate notice:', error.message);
          }
        }
      } catch (e) {
        console.warn('Supabase updateTemplate error:', e);
      }
    }

    return updatedItem;
  },

  // Delete template
  async deleteTemplate(templateId) {
    let templates = getStoredTemplates();
    templates = templates.filter(t => t.id !== templateId);
    saveStoredTemplates(templates);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('templates').delete().eq('id', templateId);
      } catch (e) {
        console.warn('Supabase delete error', e);
      }
    }
    return true;
  },

  // Toggle Featured (Admin)
  async toggleFeature(templateId) {
    const templates = getStoredTemplates();
    const idx = templates.findIndex(t => t.id === templateId);
    if (idx !== -1) {
      templates[idx].is_featured = !templates[idx].is_featured;
      saveStoredTemplates(templates);
      return templates[idx].is_featured;
    }
    return false;
  },

  // Comments
  getComments(templateId) {
    const all = getStoredComments();
    return all[templateId] || [
      {
        id: 'c1',
        author: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80',
        content: 'This template is incredible! Exported as clean HTML/CSS and deployed to GitHub pages in 3 minutes.',
        created_at: '2025-02-10T12:00:00Z'
      },
      {
        id: 'c2',
        author: 'Alex Kumar',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
        content: 'Love the animations and responsive viewport styling. Huge thanks to the author.',
        created_at: '2025-02-14T15:30:00Z'
      }
    ];
  },

  addComment(templateId, author = 'Dev Guest', content = '') {
    const all = getStoredComments();
    const list = all[templateId] || [];
    const newComment = {
      id: `c-${Date.now()}`,
      author,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      content,
      created_at: new Date().toISOString()
    };
    list.unshift(newComment);
    all[templateId] = list;
    localStorage.setItem('portfoliohub_comments', JSON.stringify(all));
    return newComment;
  },

  // Admin stats
  getAdminStats() {
    const templates = getStoredTemplates();
    const totalDownloads = templates.reduce((sum, t) => sum + (t.downloads_count || 0), 0);
    const totalLikes = templates.reduce((sum, t) => sum + (t.likes_count || 0), 0);
    const totalViews = templates.reduce((sum, t) => sum + (t.views_count || 0), 0);
    const totalRemixes = templates.reduce((sum, t) => sum + (t.remixes_count || 0), 0);

    return {
      totalTemplates: templates.length,
      totalDownloads,
      totalLikes,
      totalViews,
      totalRemixes,
      totalUsers: 14820,
      activeSessions: 412
    };
  },

  // Sync / Seed all 24 curated styles directly to Supabase
  async syncAllStylesToSupabase() {
    if (!isSupabaseConfigured) {
      return { 
        success: false, 
        message: 'Supabase is not configured. Please supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in settings or .env.' 
      };
    }

    try {
      const records = SEED_TEMPLATES.map(t => {
        const generated = generatePortfolioCode(t.category, DEFAULT_USER_DATA);
        return {
          id: t.id,
          title: t.title,
          description: t.description,
          category: t.category,
          difficulty: t.difficulty,
          tags: t.tags || [],
          thumbnail_url: t.thumbnail_url,
          preview_images: t.preview_images || [t.thumbnail_url],
          html_code: t.html_code || generated.html || '',
          css_code: t.css_code || generated.css || '',
          js_code: t.js_code || generated.js || '',
          is_featured: Boolean(t.is_featured),
          is_approved: true,
          is_public: true,
          likes_count: t.likes_count || 0,
          downloads_count: t.downloads_count || 0,
          views_count: t.views_count || 0,
          remixes_count: t.remixes_count || 0,
          creator_name: t.creator_name || 'PortfolioHub Curated',
          created_at: t.created_at || new Date().toISOString()
        };
      });

      const { data, error } = await supabase
        .from('templates')
        .upsert(records, { onConflict: 'id' });

      if (error) {
        console.warn('Supabase template upsert error:', error);
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        count: records.length, 
        message: `Successfully synchronized all ${records.length} styles to Supabase.` 
      };
    } catch (err) {
      console.warn('Failed to sync styles to Supabase:', err);
      return { success: false, error: err.message };
    }
  },

  // Generate pure SQL script to seed all styles into Supabase SQL editor
  generateSupabaseSqlSeedScript() {
    const rows = SEED_TEMPLATES.map(t => {
      const safeTitle = (t.title || '').replace(/'/g, "''");
      const safeDesc = (t.description || '').replace(/'/g, "''");
      const tagsSql = `ARRAY[${(t.tags || []).map(tag => `'${tag.replace(/'/g, "''")}'`).join(', ')}]::TEXT[]`;
      const previewsSql = `ARRAY[${(t.preview_images || [t.thumbnail_url]).map(p => `'${p}'`).join(', ')}]::TEXT[]`;
      const safeAuthor = (t.creator_name || 'PortfolioHub').replace(/'/g, "''");

      return `(
  '${t.id}', '${safeTitle}', '${safeDesc}', '${t.category}', '${t.difficulty}',
  ${tagsSql}, '${t.thumbnail_url}', ${previewsSql},
  '<!-- ${safeTitle} -->', '/* ${safeTitle} CSS */', '// ${safeTitle} JS',
  ${Boolean(t.is_featured)}, true, true,
  ${t.likes_count || 0}, ${t.downloads_count || 0}, ${t.views_count || 0}, ${t.remixes_count || 0},
  '${safeAuthor}'
)`;
    }).join(',\n');

    return `-- Run this in your Supabase SQL Editor:
INSERT INTO public.templates (
  id, title, description, category, difficulty, tags, thumbnail_url, preview_images,
  html_code, css_code, js_code, is_featured, is_approved, is_public,
  likes_count, downloads_count, views_count, remixes_count, creator_name
) VALUES
${rows}
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  tags = EXCLUDED.tags,
  thumbnail_url = EXCLUDED.thumbnail_url,
  preview_images = EXCLUDED.preview_images,
  is_featured = EXCLUDED.is_featured,
  updated_at = NOW();`;
  }
};
