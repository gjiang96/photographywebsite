<template>
  <div v-if="post" class="blog-post-page">
    <div class="blog-post-header">
      <router-link to="/blogs" class="back-link">← All Blogs</router-link>
      <time class="blog-post-date">{{ formatDate(post.date) }}</time>
    </div>

    <article class="blog-post-content">
      <!-- Table of Contents -->
      <nav v-if="toc.length" class="toc" aria-label="Table of contents">
        <p class="toc-title">Contents</p>
        <ol>
          <li v-for="item in toc" :key="item.id" :class="{ 'toc-h3': item.level === 3 }">
            <a :href="`#${item.id}`">{{ item.text }}</a>
          </li>
        </ol>
      </nav>

      <!-- Rendered markdown -->
      <div class="markdown-body" v-html="renderedContent" />
    </article>
  </div>

  <div v-else class="not-found">
    <p>Post not found.</p>
    <router-link to="/blogs">Back to Blogs</router-link>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import { blogs } from '../data/blogs.js'

// Dynamically import markdown content
const markdownModules = import.meta.glob('../content/blogs/*.md', {
  query: '?raw',
  import: 'default',
})

const route = useRoute()
const rawContent = ref('')

async function loadContent(slug) {
  const key = `../content/blogs/${slug}.md`
  if (markdownModules[key]) {
    rawContent.value = await markdownModules[key]()
  } else {
    rawContent.value = ''
  }
}

loadContent(route.params.slug)
watch(() => route.params.slug, loadContent)

const post = computed(() => blogs.find(b => b.slug === route.params.slug))

// Slugify heading text to match marked's generated IDs
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Extract ToC from markdown (## and ### headings, skip the title #)
const toc = computed(() => {
  if (!rawContent.value) return []
  const items = []
  for (const line of rawContent.value.split('\n')) {
    const h2 = line.match(/^## (.+)/)
    const h3 = line.match(/^### (.+)/)
    if (h2) items.push({ level: 2, text: h2[1].trim(), id: slugify(h2[1].trim()) })
    else if (h3) items.push({ level: 3, text: h3[1].trim(), id: slugify(h3[1].trim()) })
  }
  return items
})

// Configure marked with custom heading renderer to add IDs
const renderer = new marked.Renderer()
renderer.heading = function ({ text, depth }) {
  if (depth === 1) {
    return `<h${depth}>${text}</h${depth}>\n`
  }
  const id = slugify(text)
  return `<h${depth} id="${id}">${text}</h${depth}>\n`
}

marked.use({ renderer })

const renderedContent = computed(() => {
  if (!rawContent.value) return ''
  return marked(rawContent.value)
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped>
.blog-post-page {
  max-width: 780px;
  margin: 0 auto;
  padding: 3rem 2rem 6rem;
}

.blog-post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.back-link {
  font-size: 0.82rem;
  color: var(--brown-light);
  letter-spacing: 0.04em;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--brown-dark);
}

.blog-post-date {
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  color: var(--brown-light);
  text-transform: uppercase;
}

/* Table of Contents */
.toc {
  background: var(--beige-light);
  border-left: 3px solid var(--brown-light);
  padding: 1.5rem 2rem;
  margin-bottom: 3rem;
}

.toc-title {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 1rem;
  color: var(--brown-dark);
  margin-bottom: 0.75rem;
  font-weight: 400;
}

.toc ol {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.toc li a {
  font-size: 0.88rem;
  color: var(--text-body);
  transition: color 0.2s;
}

.toc li a:hover {
  color: var(--brown-dark);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.toc-h3 {
  padding-left: 1.25rem;
}

.toc-h3 a {
  font-size: 0.83rem;
  color: var(--brown-light);
}

/* Not found */
.not-found {
  text-align: center;
  padding: 6rem 2rem;
}
</style>

<style>
/* Unscoped — styles for v-html rendered markdown */
.markdown-body h1 {
  font-family: var(--font-heading);
  font-weight: 400;
  font-style: italic;
  font-size: 2.6rem;
  color: var(--brown-dark);
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.markdown-body h2 {
  font-family: var(--font-heading);
  font-weight: 400;
  font-style: italic;
  font-size: 1.7rem;
  color: var(--brown-dark);
  margin-top: 3rem;
  margin-bottom: 1rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--beige);
}

.markdown-body h3 {
  font-family: var(--font-heading);
  font-weight: 400;
  font-style: italic;
  font-size: 1.2rem;
  color: var(--brown-medium);
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.markdown-body p {
  font-size: 0.95rem;
  line-height: 1.85;
  color: var(--text-body);
  margin-bottom: 1.2rem;
}

.markdown-body a {
  color: var(--brown-dark);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.markdown-body a:hover {
  opacity: 0.7;
}

/* Lyrics blockquotes */
.markdown-body blockquote {
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  background: var(--beige-light);
  border-left: 3px solid var(--lavender);
  font-style: italic;
}

.markdown-body blockquote p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 2;
  color: var(--text-dark);
  white-space: pre-line;
}

/* Images */
.markdown-body img {
  width: 100%;
  height: auto;
  margin: 1.5rem 0;
  display: block;
}

/* Lists */
.markdown-body ul,
.markdown-body ol {
  padding-left: 1.5rem;
  margin-bottom: 1.2rem;
}

.markdown-body li {
  font-size: 0.95rem;
  line-height: 1.85;
  color: var(--text-body);
  margin-bottom: 0.4rem;
}

/* Horizontal rule */
.markdown-body hr {
  border: none;
  border-top: 1px solid var(--beige);
  margin: 2.5rem 0;
}

/* Inline emphasis */
.markdown-body em {
  color: var(--brown-medium);
}

.markdown-body strong {
  font-weight: 600;
  color: var(--text-dark);
}
</style>
