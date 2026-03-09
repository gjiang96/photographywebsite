<template>
  <div class="blogs-page">
    <div class="blogs-header">
      <h1>Blogs</h1>
      <p>Thoughts on music, photography, and the moments in between.</p>
    </div>

    <div class="blogs-list">
      <router-link
        v-for="blog in blogs"
        :key="blog.slug"
        :to="`/blogs/${blog.slug}`"
        class="blog-card"
      >
        <div class="blog-card-image">
          <img :src="blog.coverImage" :alt="blog.coverAlt" loading="lazy" />
        </div>
        <div class="blog-card-body">
          <time class="blog-card-date">{{ formatDate(blog.date) }}</time>
          <h2 class="blog-card-title">{{ blog.title }}</h2>
          <p class="blog-card-excerpt">{{ blog.excerpt }}</p>
          <span class="blog-card-read">Read more →</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { blogs } from '../data/blogs.js'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped>
.blogs-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 4rem 2rem 6rem;
}

.blogs-header {
  text-align: center;
  margin-bottom: 4rem;
}

.blogs-header h1 {
  font-family: var(--font-heading);
  font-weight: 400;
  font-size: 2.8rem;
  color: var(--brown-dark);
  margin-bottom: 0.75rem;
}

.blogs-header p {
  font-size: 0.95rem;
  color: var(--brown-light);
  letter-spacing: 0.02em;
}

.blogs-list {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.blog-card {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 2.5rem;
  align-items: start;
  color: inherit;
  transition: opacity 0.2s;
}

.blog-card:hover {
  opacity: 0.85;
}

.blog-card-image {
  overflow: hidden;
}

.blog-card-image img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  transition: transform 0.4s ease;
  display: block;
}

.blog-card:hover .blog-card-image img {
  transform: scale(1.03);
}

.blog-card-body {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding-top: 0.25rem;
}

.blog-card-date {
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  color: var(--brown-light);
  text-transform: uppercase;
}

.blog-card-title {
  font-family: var(--font-heading);
  font-weight: 400;
  font-size: 1.7rem;
  color: var(--brown-dark);
  line-height: 1.3;
}

.blog-card-excerpt {
  font-size: 0.9rem;
  color: var(--text-body);
  line-height: 1.75;
  margin-top: 0.25rem;
}

.blog-card-read {
  font-size: 0.82rem;
  color: var(--brown-dark);
  letter-spacing: 0.04em;
  margin-top: 0.5rem;
}

@media (max-width: 700px) {
  .blog-card {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .blog-card-image img {
    height: 200px;
  }

  .blogs-header h1 {
    font-size: 2rem;
  }
}
</style>
