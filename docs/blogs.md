# Blogs

Each post is a song write-up with lyrics analysis and photos inspired by it.

## Pieces of a post

| Piece          | Location                                                            |
| -------------- | ------------------------------------------------------------------- |
| Registry entry | `src/data/blogs.js`, newest first                                   |
| English body   | `src/content/blogs/<slug>.md`                                       |
| Chinese body   | `src/content/blogs/<slug>.zh.md` (optional)                         |
| Photos         | `public/images/blog/<slug>/{web,original}/<name>.jpg` + `cover.jpg` |

Registry entry shape:

```js
{
  slug: 'those-eyes',
  title: 'Those Eyes – New West',
  date: '2026-05-14',              // YYYY-MM-DD
  excerpt: '1–2 sentence summary',
  coverImage: '/images/blog/those-eyes/web/cover.jpg',
  coverAlt: '…',
}
```

## Rendering

- `BlogPostView.vue` loads markdown via `import.meta.glob` and renders it with `marked`.
- If `<slug>.zh.md` exists, an EN/中文 toggle appears; otherwise English only.
- A slug missing from `blogs.js` redirects to `/blogs`, even if the markdown exists.

## Post structure

Title `# <Song> – <Artist>`, then Introduction (with YouTube embed), Background, The Song
(per-section lyric blockquotes using `<br>` between lines), Photographs, `---`, Final Thoughts.
`first-love.md` is the reference example.

To create one from a `.docx` draft, use the `/new-blog` skill.
