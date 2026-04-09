<template>
  <section class="gallery-section">
    <div class="gallery-grid">
      <template v-if="images.length > 0">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="gallery-item"
          :class="{ portrait: portraitFlags[index], loaded: loadedFlags[index] }"
          @click="openLightbox(image)"
        >
          <div v-if="!loadedFlags[index]" class="image-placeholder" />
          <img
            :src="image.src"
            :alt="image.alt"
            loading="lazy"
            decoding="async"
            @load="onImageLoad($event, index)"
          />
        </div>
      </template>
      <p v-else class="coming-soon">Coming soon</p>
    </div>
  </section>

  <ImageLightbox
    :is-open="lightboxOpen"
    :src="lightboxSrc"
    :alt="lightboxAlt"
    @close="lightboxOpen = false"
  />
</template>

<script setup>
import { ref, reactive } from 'vue'
import ImageLightbox from './ImageLightbox.vue'

defineProps({
  images: {
    type: Array,
    required: true,
  },
})

const lightboxOpen = ref(false)
const lightboxSrc = ref('')
const lightboxAlt = ref('')

function openLightbox(image) {
  lightboxSrc.value = image.src.replace('/web/', '/original/')
  lightboxAlt.value = image.alt
  lightboxOpen.value = true
}

const portraitFlags = reactive({})
const loadedFlags = reactive({})

function onImageLoad(event, index) {
  const img = event.target
  if (img.naturalHeight > img.naturalWidth) {
    portraitFlags[index] = true
  }
  loadedFlags[index] = true
}
</script>

<style scoped>
.gallery-section {
  padding: 2rem 5rem 3rem;
  background: var(--white);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: min(calc((100vw - 11rem) / 3), calc((100vh - 9rem) / 2));
  grid-auto-flow: dense;
  gap: 1rem;
}

.gallery-item {
  overflow: hidden;
  border-radius: 2px;
  position: relative;
  background: var(--beige);
  cursor: pointer;
}

.gallery-item.portrait {
  grid-row: span 2;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(110deg, var(--beige) 8%, #f0e8dc 18%, var(--beige) 33%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  opacity: 0;
  transition:
    opacity 0.3s ease,
    transform 0.4s ease;
}

.gallery-item.loaded img {
  opacity: 1;
}

.gallery-item.loaded:hover img {
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
  .gallery-section {
    padding: 2rem 1rem 3rem;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
    grid-auto-rows: calc((100vw - 2rem) * 2 / 3);
  }
}
</style>
