# Gary Jiang Photography

Photography portfolio + blog for gjphotos.com. Vue 3 SPA (Composition API, `<script setup>`), Vite,
Vue Router, plain CSS. Hosted on S3 + CloudFront; contact form posts to an AWS Lambda.

## Commands

```bash
npm run dev          # http://localhost:5173
npm run build        # -> dist/
npm run lint         # eslint --fix
npm run format       # prettier --write src/
```

Node 22 (matches CI). A Husky pre-commit hook runs lint-staged.

## Conventions

- Gallery photos are numbered `1.jpg … N.jpg` and live in both `web/` and `original/`. Counts are
  read from disk at build time; there is no count to update by hand.
- Blogs are registered in `src/data/blogs.js` (newest first) with markdown in `src/content/blogs/`.
- Keep the warm, minimal look: use the CSS variables in `src/assets/styles/main.css`, not new
  colors.
- `old-static-site/` and `dist/` are gitignored artifacts; don't edit them.

## Knowledge (read the one you need)

| Topic                                | File                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------ |
| Project layout, routes, components   | [docs/architecture.md](docs/architecture.md)                             |
| Colors, fonts, gallery grid layout   | [docs/design-system.md](docs/design-system.md)                           |
| Gallery images: folders, sizes, nav  | [docs/galleries.md](docs/galleries.md)                                   |
| Blog data model, markdown, Chinese   | [docs/blogs.md](docs/blogs.md)                                           |
| S3/CloudFront hosting and deploys    | [docs/deployment.md](docs/deployment.md)                                 |
| Contact form Lambda + SES            | [docs/contact-lambda.md](docs/contact-lambda.md)                         |
| ESLint / Prettier / Husky            | [docs/code-quality.md](docs/code-quality.md)                             |
| Original Vue migration plan (frozen) | [docs/history/vue-migration-plan.md](docs/history/vue-migration-plan.md) |

## Skills (`.claude/skills/`)

- `/new-blog`: turn a `.docx` + photos in `src/content/blogs/` into a published blog post.
- `/add-gallery-photos`: add new photos to a gallery (resize, number, place in `web/` +
  `original/`).
- `/deploy`: build and deploy the site or the Lambda.
