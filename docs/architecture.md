# Architecture

Single-page Vue 3 app built with Vite. `src/App.vue` is the layout shell: `SiteHeader` +
`<router-view>` + `SiteFooter`.

## Layout

```
├── index.html                 # Vite entry
├── vite.config.js             # includes the `virtual:gallery-counts` plugin (see galleries.md)
├── public/images/             # all photos, served as-is (see galleries.md)
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── router/index.js        # routes + document.title handling
│   ├── data/
│   │   ├── galleries.js       # gallery categories + getGalleryImages()
│   │   └── blogs.js           # blog registry (newest first)
│   ├── content/blogs/         # blog markdown (<slug>.md, optional <slug>.zh.md)
│   ├── components/
│   │   ├── SiteHeader.vue     # nav, Photography dropdown, mobile menu
│   │   ├── SiteFooter.vue     # logo, Instagram, email
│   │   ├── PhotoGallery.vue   # grid with portrait/landscape auto-detection
│   │   ├── ImageLightbox.vue  # full-size viewer, loads the `original/` image
│   │   └── ContactForm.vue    # posts to the contact Lambda; `standard` / `underline` variants
│   ├── views/                 # Home, Gallery, About, Contact, Blogs, BlogPost
│   └── assets/styles/main.css # CSS variables, reset, base typography
├── lambda/                    # contact form handler (see contact-lambda.md)
├── deploy.sh                  # build + S3 sync + CloudFront invalidation
└── optimize-images.sh         # legacy, see galleries.md before running
```

## Routes

| Path                 | View         | Notes                                              |
| -------------------- | ------------ | -------------------------------------------------- |
| `/`                  | HomeView     | Favourite works + "Let's Connect"                  |
| `/gallery/:category` | GalleryView  | Unknown category redirects home                    |
| `/about`             | AboutView    | Bio + contact panel                                |
| `/contact`           | ContactView  |                                                    |
| `/blogs`             | BlogsView    | Lists `blogs.js`                                   |
| `/blogs/:slug`       | BlogPostView | Unknown slug redirects to `/blogs`; EN/中文 toggle |
| anything else        | redirect `/` |                                                    |

Page titles come from `meta.title`, or are derived from the gallery/blog title in
`router.beforeEach`.

## Navigation

Header: **Photography** dropdown (Landscape, Portrait, Film, Animal, Abstract), **About**,
**Contact**, **Blogs**. Adding a gallery category means touching `SiteHeader.vue` too.
