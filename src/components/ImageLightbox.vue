<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="isOpen"
        class="lightbox-overlay"
        role="dialog"
        aria-modal="true"
        @click.self="close"
      >
        <button class="lightbox-close" aria-label="Close" @click="close">✕</button>
        <div class="lightbox-body">
          <div v-if="loading" class="lightbox-spinner" />
          <img v-show="!loading" :src="src" :alt="alt" class="lightbox-img" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
})

const emit = defineEmits(['close'])

const loading = ref(false)

watch(
  () => props.isOpen,
  open => {
    if (open) {
      loading.value = true
      const img = new Image()
      img.onload = img.onerror = () => {
        loading.value = false
      }
      img.src = props.src
      document.addEventListener('keydown', onKeydown)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', onKeydown)
      document.body.style.overflow = ''
    }
  }
)

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

function close() {
  emit('close')
}

function onKeydown(e) {
  if (e.key === 'Escape') close()
}
</script>

<style scoped>
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-close {
  position: absolute;
  top: 1.25rem;
  right: 1.5rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: color 0.2s;
}

.lightbox-close:hover {
  color: #fff;
}

.lightbox-body {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 3rem 2rem;
  box-sizing: border-box;
}

.lightbox-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6);
}

.lightbox-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.25);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.22s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
