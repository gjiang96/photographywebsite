<template>
  <PhotoGallery :images="images" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PhotoGallery from '../components/PhotoGallery.vue'
import { getGalleryImages, galleries } from '../data/galleries.js'

const route = useRoute()

const images = computed(() => {
  const category = route.params.category
  if (!galleries[category]) return []
  return getGalleryImages(category)
})
</script>
