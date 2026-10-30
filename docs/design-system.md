# Design System

Clean, minimal, warm. A structural change should never change the look.

- **Colors**: dark brown `#5c4033`, beige `#e8e0d4`, lavender `#d5d0da`, white. Defined as CSS
  variables in `src/assets/styles/main.css`; use the variables.
- **Headings**: Playfair Display italic (Google Fonts).
- **Body**: Helvetica Neue / system sans-serif.
- **Breakpoints**: 900px and 600px.
- **Styles**: global rules in `main.css`; everything component-specific in `<style scoped>`.

## Gallery grid

- CSS Grid, 2 columns, `grid-auto-flow: dense`.
- Row height from viewport: `calc((100vw - 3rem) / 3)` (about 3:2).
- `PhotoGallery.vue` reads `naturalWidth` / `naturalHeight` on load. Portrait images get `.portrait`
  (`grid-row: span 2`), landscape stays one row.
- `object-fit: cover` so cells fill evenly. Swapping a photo needs no layout change.
- Empty gallery shows a "Coming soon" state.
