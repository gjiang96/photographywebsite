# Gary Jiang Photography Website

## Overview
A photography portfolio website built with Vue 3 + Vite. Single Page Application (SPA) with reusable components and Vue Router for navigation. Designed to run locally and eventually be hosted on AWS.

## Site Structure
```
├── index.html                 # Vite entry point
├── vite.config.js
├── package.json
├── public/
│   └── images/                # Photos served as static assets
│       ├── home/              favourite-1.jpg, favourite-2.jpg, favourite-3.jpg
│       ├── landscape/         1.jpg - 10.jpg
│       ├── portrait/          1.jpg - 14.jpg (some are .JPG uppercase)
│       ├── film/              1.jpg - 8.jpg
│       ├── animal/            1.jpg - 10.jpg
│       ├── abstract/          (empty - waiting for photos)
│       ├── about/             profile.jpg
│       └── contact/           contact-photo.jpg
├── src/
│   ├── main.js                # Vue app bootstrap
│   ├── App.vue                # Layout: SiteHeader + router-view + SiteFooter
│   ├── router/
│   │   └── index.js           # All route definitions
│   ├── data/
│   │   └── galleries.js       # Gallery config (category, count, file extensions)
│   ├── components/
│   │   ├── SiteHeader.vue     # Header, nav, mobile menu (shared)
│   │   ├── SiteFooter.vue     # Footer (shared)
│   │   ├── PhotoGallery.vue   # Reusable gallery grid with auto orientation
│   │   └── ContactForm.vue    # Reusable form (standard vs underline variant)
│   ├── views/
│   │   ├── HomeView.vue       # Homepage: My Favourite Works + Lets Connect
│   │   ├── GalleryView.vue    # Generic gallery page (route param: category)
│   │   ├── AboutView.vue      # About bio + contact panel
│   │   └── ContactView.vue    # Contact page
│   └── assets/
│       └── styles/
│           └── main.css       # Global styles (CSS variables, reset, base)
└── old-static-site/           # Original HTML/CSS/JS files (archived)
```

## Navigation
- **Photography** (dropdown): Landscape, Portrait, Film, Animal, Abstract
- **About**: Bio + contact form panel
- **Contact**: Standalone contact page

## Design System
- **Color palette**: Dark brown (#5c4033), beige (#e8e0d4), lavender (#d5d0da), white
- **Headings**: Playfair Display italic (Google Fonts)
- **Body text**: Helvetica Neue / system sans-serif
- **Aesthetic**: Clean, minimal, warm photography portfolio

## Gallery Layout (Important)
- CSS Grid with 2 columns, `grid-auto-flow: dense`
- Row height calculated from viewport: `calc((100vw - 3rem) / 3)` for ~3:2 aspect ratio
- **JS detects image orientation** on load via `naturalWidth`/`naturalHeight`
- Portrait images get `.portrait` class → `grid-row: span 2`
- Landscape images stay 1 row
- `object-fit: cover` for uniform cell filling
- Fully dynamic: swap any photo and orientation is auto-detected

## Routes
- `/` → HomeView
- `/gallery/:category` → GalleryView (landscape, portrait, film, animal, abstract)
- `/about` → AboutView
- `/contact` → ContactView

## Shared Components
- **SiteHeader**: Auto-detects active route, mobile responsive dropdown menu
- **SiteFooter**: Logo, Instagram link, email
- **PhotoGallery**: Auto-detects portrait/landscape orientation via `naturalWidth`/`naturalHeight`, handles "Coming soon" state
- **ContactForm**: Two variants (standard bordered inputs, underline inputs), optional newsletter checkbox

## Gallery Configuration
Edit `src/data/galleries.js` to add/modify galleries:
- Set `count` to number of photos
- Specify uppercase file extensions in `extensions` object (e.g., `{ 2: 'JPG' }`)
- Images are auto-generated: `images/${category}/${num}.${ext}`

## Running Locally
**Development:**
```bash
npm run dev
# Open http://localhost:5173
```

**Production build:**
```bash
npm run build       # Creates dist/ folder
npm run preview     # Preview production build
```

**Note:** Node.js 20+ required (use nvm to manage Node versions)

## Future Plans
- Add abstract photography section
- Host on AWS (S3 + CloudFront, or similar)
- Contact form backend (currently no submission handler)
