# PortfolioHub AI 🚀

A high-performance, community-driven portfolio website generator and template marketplace. Create, customize, upload, remix, like, and download 100% responsive, offline-ready portfolio websites in pure HTML, CSS, and JavaScript.

---

## 🌟 Key Features

- **12 Bespoke Templates**: Minimal, Developer, Student, Corporate, Designer, Luxury, Cyberpunk, Glassmorphism, Creative, Photographer, Dark, and 3D.
- **Instant Offline ZIP Export**: Downloads complete packages containing `index.html`, `style.css`, and `script.js` ready to double-click or host on GitHub Pages / Vercel / Netlify.
- **Split-Screen Live Editor**: Reorder sections with drag/reorder controls, toggle visibility, customize typography, tweak color palettes, and preview live across Desktop, Tablet, and Mobile viewports.
- **Multi-Step Generator**: Effortlessly collect personal details, education, experience, unlimited projects, skills, achievements, contact, and social links.
- **Community & Social**: Like, favorite, comment, view counters, download tracking, and **Remix** (fork templates while crediting the original creator).
- **Template Upload & Marketplace**: Users can submit custom designs with live code and preview screenshots.
- **Admin Dashboard**: Analytics, content moderation, featuring standout templates, and user status controls.
- **Supabase & PostgreSQL**: Seamless integration for Authentication (Google OAuth & Email/Password), Storage buckets, and Row Level Security (RLS).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, JavaScript (.jsx), Tailwind CSS, React Router DOM, Framer Motion, Lucide React
- **Backend & Database**: Supabase, PostgreSQL, Supabase Auth, Supabase Storage, Row Level Security (RLS)
- **Utilities**: JSZip, FileSaver, Canvas Confetti

---

## 🚀 Quick Start Guide

### 1. Installation

Clone the repository and install all required dependencies:

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

*(Note: PortfolioHub AI includes local persistent fallback mode so all 12 templates, generator, live editor, and ZIP exports work immediately out-of-the-box even before connecting Supabase).*

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase & PostgreSQL Setup

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In the left navigation, open the **SQL Editor**.
3. Copy the entire contents of `sql/schema.sql` located in this repository.
4. Paste and click **Run**. This will create:
   - `profiles`, `templates`, `likes`, `downloads`, `views`, `favorites`, `remixes`, `comments`, and `followers` tables.
   - Optimized indexes for search, filtering, and sorting.
   - Row Level Security (RLS) policies.
   - Storage buckets: `avatars`, `thumbnails`, `previews`, `templates`, and `resumes`.

5. Run `supabase/setup.sql` (comments table, like counter, view/download counters).
6. Run `sql/security_fixes.sql` (locks down roles, templates, counters and storage; see the file header).
7. Make yourself the single admin: sign up on the site, then run `sql/make_single_admin.sql`
   (put your email in it). After you sign in again, an **Admin** button appears in the top bar.

> Roles can only be changed from the Supabase SQL editor, never from the website, and the
> database allows at most one admin. Never put the `service_role` key in `.env` or the frontend.

### Google OAuth Configuration

1. In Supabase Dashboard, go to **Authentication** -> **Providers**.
2. Enable **Google**.
3. Supply your Google Cloud OAuth Client ID and Secret.
4. Add the Supabase callback URL to your authorized redirect URIs in Google Cloud Console:
   `https://<your-project-ref>.supabase.co/auth/v1/callback`

---

## 📦 Build & Deploy on Vercel

```bash
# Build production bundle
npm run build

# Preview build locally
npm run preview
```

### Deploy to Vercel:

1. Push code to GitHub.
2. Import project into Vercel.
3. Configure Build Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**.

---

## 📄 License
MIT License. Built for the developer community with ❤️.
