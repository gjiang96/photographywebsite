# Galleries & Images

## Folder layout

```
public/images/
├── <category>/              # landscape, portrait, film, animal, abstract
│   ├── web/1.jpg … N.jpg       # grid image, long edge 2000px
│   └── original/1.jpg … N.jpg  # full-resolution, opened in the lightbox
├── blog/<slug>/{web,original}/ # blog photos + cover.jpg (see blogs.md)
├── home/favourite-{1,2,3}.jpg
├── about/profile.jpg
└── contact/contact-photo.jpg
```

## How a gallery is built

- `vite.config.js` defines a `virtual:gallery-counts` module that counts files matching `^\d+\.jpg$`
  in each `public/images/<category>/web/` at build/dev-server start.
- `src/data/galleries.js` holds only titles; `getGalleryImages(category)` emits images **highest
  number first**, so the newest photo (largest number) shows at the top.
- Numbering must be contiguous from 1, lowercase `.jpg`, and the same number must exist in both
  `web/` and `original/`.
- Restart `npm run dev` after adding files: the count is computed when the plugin loads.

## Adding a new category

1. Add it to the `categories` array in `vite.config.js`.
2. Add `{ title }` to `galleries` in `src/data/galleries.js`.
3. Add a link in the Photography dropdown in `src/components/SiteHeader.vue`.
4. Create `public/images/<category>/{web,original}/`.

## Resizing

`optimize-images.sh` (macOS, uses `sips`) builds every `web/` image from its `original/` sibling.
Originals are never modified.

| Images    | Web long edge | Quality |
| --------- | ------------- | ------- |
| Galleries | 2000px        | 85      |
| Blogs     | 1200px        | 85      |

Smaller images are copied as-is, never upscaled.

```bash
./optimize-images.sh public/images/landscape          # only missing/stale web copies
./optimize-images.sh --force public/images/blog/<slug> # rebuild all of them
```

Without `--force` a web copy is skipped when it's newer than its original. After a fresh clone the
file times are arbitrary, so pass a folder instead of running it on everything at once.

The `/add-gallery-photos` skill walks through all of this.
