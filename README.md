# Gary Jiang Photography

A modern photography portfolio built with Vue 3 + Vite.

## ✨ Features

- **Single Page Application (SPA)** with Vue Router for smooth navigation
- **Reusable Components**: Header, Footer, Gallery, Contact Form
- **Auto-orientation Detection**: Galleries automatically detect portrait vs landscape images
- **Mobile Responsive**: Fully responsive design with hamburger menu
- **Fast Development**: Hot Module Replacement (HMR) with Vite
- **Easy Gallery Management**: Add photos by dropping them in `public/images/` and updating config

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ (use [nvm](https://github.com/nvm-sh/nvm) to manage versions)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` folder, ready to deploy to AWS S3, Netlify, Vercel, or any static hosting service.

## 📁 Project Structure

```
src/
├── components/       # Reusable components
│   ├── SiteHeader.vue
│   ├── SiteFooter.vue
│   ├── PhotoGallery.vue
│   └── ContactForm.vue
├── views/           # Page components
│   ├── HomeView.vue
│   ├── GalleryView.vue
│   ├── AboutView.vue
│   └── ContactView.vue
├── router/          # Vue Router config
├── data/            # Gallery configuration
└── assets/          # Global styles

public/
└── images/          # All photos (served as static assets)
```

## 🖼️ Adding/Editing Galleries

1. **Add photos** to `public/images/{category}/`
2. **Update gallery config** in `src/data/galleries.js`:

```js
export const galleries = {
  landscape: { title: 'Landscape', count: 10 },
  // Add your new category:
  urban: { title: 'Urban', count: 5 },
}
```

3. **Add route link** (optional): Update the Photography dropdown in `src/components/SiteHeader.vue` if you want a new top-level category

That's it! The gallery will auto-generate image paths and detect orientations.

## 🎨 Design System

- **Colors**: Dark brown (#5c4033), Beige (#e8e0d4), Lavender (#d5d0da)
- **Typography**: Playfair Display (headings), Helvetica Neue (body)
- **Layout**: CSS Grid for galleries, responsive breakpoints at 900px and 600px

## 📝 Notes

- Original static HTML/CSS/JS files are preserved in `old-static-site/`
- No cache-busting query strings needed — Vite handles this automatically
- Contact form has no backend yet (add AWS Lambda, Netlify Functions, etc. as needed)

## 🛠️ Tech Stack

- [Vue 3](https://vuejs.org/) - Progressive JavaScript framework
- [Vite](https://vitejs.dev/) - Fast build tool and dev server
- [Vue Router](https://router.vuejs.org/) - Official Vue.js routing
- Plain CSS with CSS Variables - No preprocessor or framework needed
