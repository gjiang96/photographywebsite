# Vue.js Refactor Plan (historical)

> Frozen record of the original static-site → Vue migration. Current docs: `docs/architecture.md`.

## Tech Stack

- **Vue 3** (Composition API with `<script setup>`)
- **Vue Router** for SPA navigation (replaces 8 separate HTML files)
- **Vite** as build tool + dev server (replaces `python3 -m http.server`)
- **Plain CSS** (port existing styles into scoped component styles)

## New Project Structure

```
photographywebsite/
├── index.html                 # Vite entry point (single HTML file)
├── vite.config.js
├── package.json
├── public/
│   └── images/                # Move existing images/ here (served as-is)
│       ├── home/
│       ├── landscape/
│       ├── portrait/
│       ├── film/
│       ├── animal/
│       ├── abstract/
│       ├── about/
│       └── contact/
├── src/
│   ├── main.js                # Vue app bootstrap
│   ├── App.vue                # Layout shell: SiteHeader + <router-view> + SiteFooter
│   ├── router/
│   │   └── index.js           # All route definitions
│   ├── data/
│   │   └── galleries.js       # Gallery configuration (category, count, file extensions)
│   ├── components/
│   │   ├── SiteHeader.vue     # Sticky header, nav dropdown, mobile menu, active route
│   │   ├── SiteFooter.vue     # Footer with logo, Instagram, email
│   │   ├── PhotoGallery.vue   # Reusable gallery grid with auto orientation detection
│   │   └── ContactForm.vue    # Reusable form (props for variant: standard vs underline, newsletter toggle)
│   ├── views/
│   │   ├── HomeView.vue       # "My Favourite Works" + "Lets Connect" sections
│   │   ├── GalleryView.vue    # Generic gallery page — receives category from route param
│   │   ├── AboutView.vue      # About bio section + contact panel (uses ContactForm)
│   │   └── ContactView.vue    # Contact page (uses ContactForm with underline variant)
│   └── assets/
│       └── styles/
│           └── main.css       # Global styles (reset, CSS variables, base typography)
```

## Shared Components (4 total)

### 1. `SiteHeader.vue`

- Contains: logo, mobile hamburger, overlay, nav with Photography dropdown
- Active route detection via Vue Router (`useRoute()`) — no more manual `active` class
- Mobile menu open/close logic lives here (replaces main.js toggle code)

### 2. `SiteFooter.vue`

- Static component: "Gary Jiang Photography" | Instagram SVG | email link
- No props needed

### 3. `PhotoGallery.vue`

- **Props**: `category` (string), `images` (array of image objects from gallery config)
- Generates gallery grid from data — no more copy-pasting `<div class="gallery-item">` blocks
- Orientation detection via `onMounted` hook (replaces main.js image classification)
- Handles "Coming soon" state when images array is empty (abstract gallery)

### 4. `ContactForm.vue`

- **Props**: `variant` ("standard" | "underline"), `showNewsletter` (boolean)
- "standard" = bordered inputs (about page), "underline" = bottom-border-only inputs (contact page)
- `showNewsletter` toggles the newsletter checkbox row
- Submit button text configurable via prop (`submitText`: "Submit" vs "Send")

## Routing

```js
const routes = [
  { path: '/', component: HomeView },
  { path: '/gallery/:category', component: GalleryView }, // /gallery/landscape, /gallery/portrait, etc.
  { path: '/about', component: AboutView },
  { path: '/contact', component: ContactView },
]
```

- All 5 gallery pages collapse into ONE route with a dynamic `:category` param
- `GalleryView` reads `route.params.category` and looks up the config from `galleries.js`

## Gallery Data (`galleries.js`)

```js
export const galleries = {
  landscape: { title: 'Landscape', count: 10 },
  portrait: { title: 'Portrait', count: 14, extensions: { 2: 'JPG', 6: 'JPG', 9: 'JPG' } },
  film: { title: 'Film', count: 8 },
  animal: { title: 'Animal', count: 10 },
  abstract: { title: 'Abstract', count: 0 },
}
```

- Images auto-generated: `images/${category}/${i}.${ext}` — no manual listing needed
- Adding a new gallery = one line in this config + dropping photos in the folder

## CSS Strategy

- **Global styles** (`main.css`): CSS reset, `:root` variables, base typography, responsive
  breakpoints
- **Component-scoped styles** (`<style scoped>`): Component-specific styles moved into each `.vue`
  file
- All existing visual styling preserved exactly as-is — this is a structural refactor, not a
  redesign

## Migration Steps

1. Initialize Vite + Vue project (`npm create vite@latest`)
2. Move `images/` to `public/images/`
3. Create global CSS from existing `style.css` (extract variables + reset + base)
4. Build the 4 shared components
5. Build the 4 view components
6. Set up Vue Router
7. Wire up `App.vue` as layout shell
8. Verify all pages render identically to current site
9. Clean up old HTML files

## What Changes for the User

- `npm run dev` instead of `python3 -m http.server` for local dev
- `npm run build` produces a `dist/` folder for deployment
- Adding a new gallery category = add entry to `galleries.js` + drop photos in `public/images/`
- No more cache-busting query strings — Vite handles this automatically

## What Stays the Same

- All visual styling (colors, fonts, layout, spacing)
- Image orientation auto-detection behavior
- Mobile responsive layout
- All existing images in their current folder structure
