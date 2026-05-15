---
name: new-blog
description:
  Create a new blog post from a docx + photos in src/content/blogs/. Translates the document to
  markdown, improves grammar and flow, embeds a YouTube video, registers the blog in blogs.js, and
  cleans up source artifacts.
---

The user wants to publish a new blog post. There will be a `.docx` file and a set of photos sitting
in `src/content/blogs/`. Your job is to walk through every step below in order — do not skip or
batch steps.

## Step 1 — Discover the source files

List everything in `src/content/blogs/`. Identify:

- The `.docx` file (there may also be a temp lock file like `~$*.docx` — ignore it)
- All image files (JPG/PNG) that don't already belong to a finished blog

Derive the blog **slug** from the docx filename (e.g. `those-eyes.docx` → slug `those-eyes`).

## Step 2 — Extract the docx content

Use Python to extract the text from the docx (it is a zip file containing `word/document.xml`):

```python
import zipfile
from xml.etree import ElementTree as ET

with zipfile.ZipFile('src/content/blogs/<name>.docx', 'r') as z:
    xml = z.read('word/document.xml')

tree = ET.fromstring(xml)
for para in tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
    texts = []
    for run in para.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}r'):
        t = run.find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t')
        if t is not None and t.text:
            texts.append(t.text)
    print(''.join(texts))
```

Read the full extracted text carefully before proceeding.

## Step 3 — View all the photos

Use the Read tool on each image file so you can see what is in each photo. Take note of the subject
matter and mood — you will use this to name them and write their descriptions.

## Step 4 — Name the photos

Give each photo a short, descriptive kebab-case name that reflects its content and connects to the
themes of the blog (e.g. `those-eyes.jpg`, `stop-and-notice.jpg`, `cherry-blossoms.jpg`). One photo
should be designated the **cover** image. The most visually striking or thematically central photo
is usually the best cover.

Create the destination directories and copy the photos with their new names:

```
public/images/blog/<slug>/original/<name>.jpg
public/images/blog/<slug>/web/<name>.jpg
```

Copy each photo to **both** `original/` and `web/`. Also copy the cover photo as `cover.jpg` in both
directories.

## Step 5 — Ask for the YouTube link

**Stop and ask the user:** "What is the YouTube link for the video you want to embed in this blog?"
Wait for their reply before continuing. Extract the video ID from the URL (the `v=` parameter) for
use in the embed iframe.

## Step 6 — Write the markdown file

Create `src/content/blogs/<slug>.md` following this structure (mirror `first-love.md` for formatting
reference):

```
# <Song Title> – <Artist>

## Introduction
(2–4 sentences: what the blog is about, why this song matters to the author)

<YouTube iframe embed using the video ID from Step 5>

## Background
(History and context of the song/artist)

## The Song
(Per-section breakdown: Verse 1, Chorus, Verse 2, Bridge, etc.)
Each section should have:
  - A blockquote with the lyrics
  - 2–4 sentences of analysis

## Photographs
(One subsection per photo with a title, the image tag, and 2–5 sentences connecting the photo to the song's themes)

---

## Final Thoughts
(3–6 sentences wrapping up the emotional takeaway)
```

**YouTube embed format:**

```html
<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:1.5rem 0;">
  <iframe
    src="https://www.youtube.com/embed/<VIDEO_ID>"
    title="<Song> – <Artist>"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    style="position:absolute;top:0;left:0;width:100%;height:100%;"
  ></iframe>
</div>
```

**Image reference format:**

```markdown
![Alt text](/images/blog/<slug>/web/<name>.jpg)
```

### Writing quality rules

Apply all of these while writing the markdown:

- **Grammar**: fix typos, punctuation, subject–verb agreement, tense consistency
- **Conciseness**: cut redundant words and phrases; if a sentence can be shorter without losing
  meaning, shorten it
- **Flow**: each paragraph should lead naturally into the next; avoid abrupt topic changes
- **Tone**: preserve the author's personal voice — don't make it sound academic or generic
- **No filler**: remove phrases like "It's important to note that…", "As we can see…", "In
  conclusion…"
- **Lyrics blockquotes**: use `<br>` tags between lyric lines (not newlines), since markdown
  blockquotes collapse whitespace

## Step 7 — Register the blog in blogs.js

Open `src/data/blogs.js` and add a new entry at the **top** of the array (most recent first):

```js
{
  slug: '<slug>',
  title: '<Song Title> – <Artist>',
  date: '<today's date as YYYY-MM-DD>',
  excerpt: '<1–2 sentence summary of what the blog covers>',
  coverImage: '/images/blog/<slug>/web/cover.jpg',
  coverAlt: '<brief alt text>',
},
```

## Step 8 — Clean up source artifacts

Delete from `src/content/blogs/`:

- The `.docx` file
- The temp lock file (`~$*.docx`) if present
- All the original DSC/source image files

Leave all `.md` files in place.

Verify the cleanup with a final `ls src/content/blogs/` — only `.md` files should remain.

## Step 9 — Confirm completion

Tell the user:

- The slug and URL path where the blog will be accessible (`/blogs/<slug>`)
- The photo names and what each one depicts
- Any edits you made to the text (grammar fixes, cuts, restructured sections)
