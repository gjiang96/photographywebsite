<template>
  <div v-if="post" class="blog-post-page">
    <div class="blog-post-header">
      <router-link to="/blogs" class="back-link">← All Blogs</router-link>
      <div class="header-right">
        <button v-if="hasZh" class="lang-toggle" @click="toggleLang">
          {{ lang === 'en' ? '中文' : 'EN' }}
        </button>
        <time class="blog-post-date">{{ formatDate(post.date) }}</time>
      </div>
    </div>

    <article class="blog-post-content">
      <!-- Table of Contents -->
      <nav v-if="toc.length" ref="tocEl" class="toc" aria-label="Table of contents">
        <p class="toc-title">Contents</p>
        <ol>
          <li v-for="item in toc" :key="item.id" :class="{ 'toc-h3': item.level === 3 }">
            <a
              :href="`#${item.id}`"
              :class="{ active: activeId === item.id }"
              @click.prevent="scrollToSection(item.id)"
              >{{ item.text }}</a
            >
          </li>
        </ol>
      </nav>

      <!-- Rendered markdown (content is from trusted local .md files, not user input) -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div ref="markdownEl" class="markdown-body" v-html="renderedContent" />
    </article>

    <!-- Mobile: floating TOC button (appears after scrolling past static TOC) -->
    <button
      v-if="toc.length && !tocInView"
      class="toc-fab"
      aria-label="Open table of contents"
      @click="drawerOpen = true"
    >
      <span aria-hidden="true">☰</span>
      Contents
    </button>

    <!-- Mobile: backdrop -->
    <Transition name="fade">
      <div v-if="drawerOpen" class="toc-backdrop" @click="drawerOpen = false" />
    </Transition>

    <!-- Mobile: slide-up drawer -->
    <Transition name="drawer">
      <nav
        v-if="drawerOpen"
        class="toc-drawer"
        role="dialog"
        aria-label="Table of contents"
        aria-modal="true"
      >
        <div class="toc-drawer-header">
          <span class="toc-drawer-title">Contents</span>
          <button
            class="toc-drawer-close"
            aria-label="Close table of contents"
            @click="drawerOpen = false"
          >
            ✕
          </button>
        </div>
        <ol class="toc-drawer-list">
          <li v-for="item in toc" :key="item.id" :class="{ 'toc-h3': item.level === 3 }">
            <a
              :href="`#${item.id}`"
              :class="{ active: activeId === item.id }"
              @click.prevent="scrollToSection(item.id, true)"
              >{{ item.text }}</a
            >
          </li>
        </ol>
      </nav>
    </Transition>
  </div>

  <div v-else class="not-found">
    <p>Post not found.</p>
    <router-link to="/blogs">Back to Blogs</router-link>
  </div>

  <ImageLightbox
    :is-open="lightboxOpen"
    :src="lightboxSrc"
    :alt="lightboxAlt"
    @close="lightboxOpen = false"
  />
</template>

<script setup>
import { ref, computed, watch, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import { blogs } from '../data/blogs.js'
import ImageLightbox from '../components/ImageLightbox.vue'

// Dynamically import markdown content
const markdownModules = import.meta.glob('../content/blogs/*.md', {
  query: '?raw',
  import: 'default',
})

const route = useRoute()
const rawContent = ref('')
const lang = ref('en')
const hasZh = ref(false)

async function loadContent(slug) {
  const enKey = `../content/blogs/${slug}.md`
  const zhKey = `../content/blogs/${slug}.zh.md`
  hasZh.value = !!markdownModules[zhKey]
  const key = lang.value === 'zh' && markdownModules[zhKey] ? zhKey : enKey
  if (markdownModules[key]) {
    rawContent.value = await markdownModules[key]()
  } else {
    rawContent.value = ''
  }
}

function toggleLang() {
  lang.value = lang.value === 'en' ? 'zh' : 'en'
  loadContent(route.params.slug)
}

loadContent(route.params.slug)
watch(
  () => route.params.slug,
  slug => {
    lang.value = 'en'
    loadContent(slug)
  }
)

const post = computed(() => blogs.find(b => b.slug === route.params.slug))

// Slugify heading text to match marked's generated IDs
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u4e00-\u9fff-]/g, '')
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
    if (h2) {
      const text = h2[1].trim()
      items.push({ level: 2, text, id: slugify(text) })
    } else if (h3) {
      const text = h3[1].trim()
      items.push({ level: 3, text, id: slugify(text) })
    }
  }
  return items
})

// Configure marked with custom heading renderer to add IDs
// text may contain HTML (e.g. <em> from marked inline parsing) — strip tags for the id
const renderer = new marked.Renderer()
renderer.heading = function ({ text, depth }) {
  if (depth === 1) {
    return `<h${depth}>${text}</h${depth}>\n`
  }
  const plainText = text.replace(/<[^>]+>/g, '')
  const id = slugify(plainText)
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

// Extra breathing room so the heading isn't flush against the sticky header
const SCROLL_GAP_PX = 16

function scrollToSection(id, closeDrawer = false) {
  const el = document.getElementById(id)
  if (el) {
    const headerHeight = document.querySelector('.site-header')?.offsetHeight ?? 0
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - SCROLL_GAP_PX
    window.scrollTo({ top, behavior: 'smooth' })
  }
  if (closeDrawer) drawerOpen.value = false
}

// --- TOC state ---

const markdownEl = ref(null)
const tocEl = ref(null)
const tocInView = ref(true)
const drawerOpen = ref(false)
const activeId = ref('')

// Detection band for the active heading: a ~5% window near the top of the viewport.
// Format: top right bottom left (like CSS margin).
// -15% pushes the top edge down, -80% shrinks from the bottom — leaving a narrow band.
const ACTIVE_HEADING_ROOT_MARGIN = '-15% 0px -80% 0px'

let tocObserver = null
let headingObserver = null

function setupTocObserver() {
  if (!tocEl.value) return
  tocObserver = new IntersectionObserver(([entry]) => {
    tocInView.value = entry.isIntersecting
  })
  tocObserver.observe(tocEl.value)
}

function setupHeadingObserver() {
  headingObserver?.disconnect()
  const headings = document.querySelectorAll('.markdown-body h2, .markdown-body h3')
  if (!headings.length) return
  headingObserver = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      }
    },
    { rootMargin: ACTIVE_HEADING_ROOT_MARGIN }
  )
  headings.forEach(h => headingObserver.observe(h))
}

// --- Lightbox ---

const lightboxOpen = ref(false)
const lightboxSrc = ref('')
const lightboxAlt = ref('')
let imgListeners = []

function attachImageListeners() {
  imgListeners.forEach(({ el, handler }) => el.removeEventListener('click', handler))
  imgListeners = []
  if (!markdownEl.value) return
  markdownEl.value.querySelectorAll('img').forEach(img => {
    const handler = () => {
      lightboxSrc.value = img.src.replace('/web/', '/original/')
      lightboxAlt.value = img.alt
      lightboxOpen.value = true
    }
    img.style.cursor = 'pointer'
    img.addEventListener('click', handler)
    imgListeners.push({ el: img, handler })
  })
}

// Re-run all DOM-dependent setup whenever the rendered markdown changes
watch(renderedContent, async () => {
  await nextTick()
  tocObserver?.disconnect()
  setupTocObserver()
  setupHeadingObserver()
  attachImageListeners()
})

onUnmounted(() => {
  tocObserver?.disconnect()
  headingObserver?.disconnect()
  imgListeners.forEach(({ el, handler }) => el.removeEventListener('click', handler))
})
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

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.lang-toggle {
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  color: var(--brown-light);
  background: none;
  border: 1px solid var(--brown-light);
  border-radius: 3px;
  padding: 0.2rem 0.55rem;
  cursor: pointer;
  transition:
    color 0.2s,
    border-color 0.2s;
  font-family: inherit;
}

.lang-toggle:hover {
  color: var(--brown-dark);
  border-color: var(--brown-dark);
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

.toc li a:hover,
.toc li a.active {
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

/* ---- Mobile floating TOC ---- */

/* FAB pill button */
.toc-fab {
  display: none;
  position: fixed;
  bottom: 1.75rem;
  right: 1.25rem;
  z-index: 90;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1rem;
  background: var(--brown-dark);
  color: var(--beige-light);
  border: none;
  border-radius: 999px;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
  transition: background 0.2s;
}

.toc-fab:hover {
  background: var(--brown-medium);
}

/* Backdrop */
.toc-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 95;
  background: rgba(0, 0, 0, 0.35);
}

/* Drawer */
.toc-drawer {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--beige-light);
  border-top: 3px solid var(--brown-light);
  border-radius: 1rem 1rem 0 0;
  padding: 1.25rem 1.5rem 2rem;
  max-height: 60vh;
  overflow-y: auto;
}

.toc-drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.toc-drawer-title {
  font-family: var(--font-heading);
  font-size: 1rem;
  color: var(--brown-dark);
  font-weight: 400;
}

.toc-drawer-close {
  background: none;
  border: none;
  font-size: 1rem;
  color: var(--brown-light);
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
  transition: color 0.2s;
}

.toc-drawer-close:hover {
  color: var(--brown-dark);
}

.toc-drawer-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toc-drawer-list li a {
  font-size: 0.9rem;
  color: var(--text-body);
  transition: color 0.2s;
}

.toc-drawer-list li a:hover,
.toc-drawer-list li a.active {
  color: var(--brown-dark);
  font-weight: 500;
}

.toc-drawer-list li a.active::before {
  content: '› ';
  color: var(--brown-light);
}

.toc-drawer-list .toc-h3 {
  padding-left: 1rem;
}

.toc-drawer-list .toc-h3 a {
  font-size: 0.84rem;
  color: var(--brown-light);
}

/* Show mobile elements only on small screens */
@media (max-width: 767px) {
  .toc-fab {
    display: flex;
  }

  .toc-backdrop {
    display: block;
  }

  .toc-drawer {
    display: block;
  }
}

/* Drawer slide-up transition */
.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.28s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateY(100%);
}

/* Backdrop fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style>
/* Unscoped — styles for v-html rendered markdown */
.markdown-body h1 {
  font-family: var(--font-heading);
  font-weight: 400;
  font-size: 2.6rem;
  color: var(--brown-dark);
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.markdown-body h2 {
  font-family: var(--font-heading);
  font-weight: 400;
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
