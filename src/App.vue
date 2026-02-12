<template>
  <div class="app-wrapper">
    <SiteHeader />
    <main class="main-content">
      <router-view :key="$route.fullPath" />
    </main>
    <SiteFooter />
  </div>
</template>

<script setup>
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<style>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  background: var(--beige);
}
</style>
