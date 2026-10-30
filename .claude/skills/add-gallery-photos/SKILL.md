---
name: add-gallery-photos
description:
  Add new photos to a portfolio gallery (landscape, portrait, film, animal, abstract). Numbers them
  after the existing photos, places full-size copies in original/ and 2000px copies in web/. Use
  when the user says "add these photos", "new pictures for the landscape gallery", or similar.
---

Background: `docs/galleries.md`.

## Step 1: Find the inputs

Ask which gallery (category) and where the new photos are if the user hasn't said. Confirm the
category exists in `src/data/galleries.js`; if it's new, follow "Adding a new category" in
`docs/galleries.md` first.

## Step 2: Work out the next numbers

```bash
ls public/images/<category>/web | grep -E '^[0-9]+\.jpg$' | sort -n | tail -1
```

New photos take the next numbers in order. The highest number shows first in the gallery, so ask the
user if they care which new photo appears on top.

## Step 3: Copy originals

Copy each photo to `public/images/<category>/original/<n>.jpg`. Lowercase `.jpg`. Convert other
formats with `sips -s format jpeg`.

## Step 4: Make web copies

```bash
sips -Z 2000 -s format jpeg -s formatOptions 85 \
  public/images/<category>/original/<n>.jpg --out public/images/<category>/web/<n>.jpg
```

Never run `optimize-images.sh`; it overwrites originals.

## Step 5: Verify

- `web/` and `original/` contain the same numbers, contiguous from 1.
- Restart `npm run dev` (counts are computed at startup) and check `/gallery/<category>`: the new
  photos appear at the top and portrait/landscape spans look right.

Report the numbers assigned to each source file.
