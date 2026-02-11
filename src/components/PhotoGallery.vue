<template>
  <section class="gallery-section">
    <div class="gallery-grid">
      <template v-if="images.length > 0">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="gallery-item"
          :class="{ portrait: portraitFlags[index] }"
        >
          <img
            :src="image.src"
            :alt="image.alt"
            @load="onImageLoad($event, index)"
          >
        </div>
      </template>
      <p v-else class="coming-soon">Coming soon</p>
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue'

defineProps({
  images: {
    type: Array,
    required: true,
  },
})

const portraitFlags = reactive({})

function onImageLoad(event, index) {
  const img = event.target
  if (img.naturalHeight > img.naturalWidth) {
    portraitFlags[index] = true
  }
}
</script>

<style scoped>
.gallery-section {
  padding: 2rem 1rem 3rem;
  background: var(--white);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: calc((100vw - 3rem) / 3);
  grid-auto-flow: dense;
  gap: 1rem;
}

.gallery-item {
  overflow: hidden;
  border-radius: 2px;
}

.gallery-item.portrait {
  grid-row: span 2;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.gallery-item:hover img {
  transform: scale(1.02);
}

.coming-soon {
  grid-column: 1 / -1;
  text-align: center;
  color: var(--brown-light);
  font-style: italic;
  padding: 4rem 0;
}

@media (max-width: 900px) {
  .gallery-grid {
    grid-template-columns: 1fr;
    grid-auto-rows: calc((100vw - 2rem) * 2 / 3);
  }
}
</style>
