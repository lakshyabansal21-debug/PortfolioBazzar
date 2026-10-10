/**
 * seedTemplates.js: 24 built-in (curated) templates ka metadata.
 *
 * Inme `html_code/css_code/js_code` nahi hota. Jab koi template kholta hai to
 * dbService.getTemplateById() category ke hisaab se code generator se bana deta hai.
 *
 * Pehle yahan nakli numbers (likes: 2150, downloads: 5640 ...) aur nakli creators the.
 * Ab saare counters 0 se shuru hote hain aur sirf asli activity se badhte hain.
 */
import { SITE } from '../config/siteConfig.js';

export const SEED_TEMPLATES = [
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
    creator_name: SITE.name,
    creator_id: null,
    creator_avatar: null,
    likes_count: 0,
    downloads_count: 0,
    views_count: 0,
    remixes_count: 0,
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
    creator_name: SITE.name,
    creator_id: null,
    creator_avatar: null,
    likes_count: 0,
    downloads_count: 0,
    views_count: 0,
    remixes_count: 0,
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
    creator_name: SITE.name,
    creator_id: null,
    creator_avatar: null,
    likes_count: 0,
    downloads_count: 0,
    views_count: 0,
    remixes_count: 0,
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
    creator_name: SITE.name,
    creator_id: null,
    creator_avatar: null,
    likes_count: 0,
    downloads_count: 0,
    views_count: 0,
    remixes_count: 0,
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
    creator_name: SITE.name,
    creator_id: null,
    creator_avatar: null,
    likes_count: 0,
    downloads_count: 0,
    views_count: 0,
    remixes_count: 0,
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
    creator_name: SITE.name,
    creator_id: null,
    creator_avatar: null,
    likes_count: 0,
    downloads_count: 0,
    views_count: 0,
    remixes_count: 0,
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
    creator_name: SITE.name,
    creator_id: null,
    creator_avatar: null,
    likes_count: 0,
    downloads_count: 0,
    views_count: 0,
    remixes_count: 0,
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
    creator_name: SITE.name,
    creator_id: null,
    creator_avatar: null,
    likes_count: 0,
    downloads_count: 0,
    views_count: 0,
    remixes_count: 0,
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
    creator_name: SITE.name,
    creator_id: null,
    creator_avatar: null,
    likes_count: 0,
    downloads_count: 0,
    views_count: 0,
    remixes_count: 0,
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
    creator_name: SITE.name,
    creator_id: null,
    creator_avatar: null,
    likes_count: 0,
    downloads_count: 0,
    views_count: 0,
    remixes_count: 0,
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
    creator_name: SITE.name,
    creator_id: null,
    creator_avatar: null,
    likes_count: 0,
    downloads_count: 0,
    views_count: 0,
    remixes_count: 0,
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
    creator_name: SITE.name,
    creator_id: null,
    creator_avatar: null,
    likes_count: 0,
    downloads_count: 0,
    views_count: 0,
    remixes_count: 0,
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
    creator_name: SITE.name,
    creator_id: null,
    creator_avatar: null,
    likes_count: 0,
    downloads_count: 0,
    views_count: 0,
    remixes_count: 0,
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
    creator_name: SITE.name,
    creator_id: null,
    creator_avatar: null,
    likes_count: 0,
    downloads_count: 0,
    views_count: 0,
    remixes_count: 0,
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
    creator_name: SITE.name,
    creator_id: null,
    creator_avatar: null,
    likes_count: 0,
    downloads_count: 0,
    views_count: 0,
    remixes_count: 0,
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
    creator_name: SITE.name,
    creator_id: null,
    creator_avatar: null,
    likes_count: 0,
    downloads_count: 0,
    views_count: 0,
    remixes_count: 0,
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
    creator_name: SITE.name,
    creator_id: null,
    creator_avatar: null,
    likes_count: 0,
    downloads_count: 0,
    views_count: 0,
    remixes_count: 0,
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
    creator_name: SITE.name,
    creator_id: null,
    creator_avatar: null,
    likes_count: 0,
    downloads_count: 0,
    views_count: 0,
    remixes_count: 0,
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
    creator_name: SITE.name,
    creator_id: null,
    creator_avatar: null,
    likes_count: 0,
    downloads_count: 0,
    views_count: 0,
    remixes_count: 0,
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
    creator_name: SITE.name,
    creator_id: null,
    creator_avatar: null,
    likes_count: 0,
    downloads_count: 0,
    views_count: 0,
    remixes_count: 0,
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
    creator_name: SITE.name,
    creator_id: null,
    creator_avatar: null,
    likes_count: 0,
    downloads_count: 0,
    views_count: 0,
    remixes_count: 0,
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
    creator_name: SITE.name,
    creator_id: null,
    creator_avatar: null,
    likes_count: 0,
    downloads_count: 0,
    views_count: 0,
    remixes_count: 0,
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
    creator_name: SITE.name,
    creator_id: null,
    creator_avatar: null,
    likes_count: 0,
    downloads_count: 0,
    views_count: 0,
    remixes_count: 0,
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
    creator_name: SITE.name,
    creator_id: null,
    creator_avatar: null,
    likes_count: 0,
    downloads_count: 0,
    views_count: 0,
    remixes_count: 0,
    is_featured: false,
    is_approved: true,
    created_at: '2025-03-06T09:15:00Z'
  }
];

/** Built-in template ki id pehchanne ke liye. */
export const SEED_IDS = new Set(SEED_TEMPLATES.map((t) => t.id));
