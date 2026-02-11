<template>
  <header class="site-header">
    <div class="site-logo">
      <router-link to="/">Gary Jiang Photography</router-link>
    </div>
    <button
      class="mobile-menu-toggle"
      :class="{ active: menuOpen }"
      aria-label="Toggle menu"
      @click="toggleMenu"
    >
      <span></span><span></span><span></span>
    </button>
    <div
      class="mobile-overlay"
      :class="{ active: menuOpen }"
      @click="closeMenu"
    ></div>
    <nav class="site-nav" :class="{ open: menuOpen }">
      <div class="nav-dropdown" :class="{ open: dropdownOpen }">
        <button
          class="nav-dropdown-trigger"
          :class="{ active: isPhotographyRoute }"
          @click="toggleDropdown"
        >
          Photography <span class="chevron">&#9662;</span>
        </button>
        <div class="nav-dropdown-menu">
          <router-link to="/gallery/landscape" @click="closeMenu">Landscape</router-link>
          <router-link to="/gallery/portrait" @click="closeMenu">Portrait</router-link>
          <router-link to="/gallery/film" @click="closeMenu">Film</router-link>
          <router-link to="/gallery/animal" @click="closeMenu">Animal</router-link>
          <router-link to="/gallery/abstract" @click="closeMenu">Abstract</router-link>
        </div>
      </div>
      <router-link to="/about" active-class="active" @click="closeMenu">About</router-link>
      <router-link to="/contact" active-class="active" @click="closeMenu">Contact</router-link>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const menuOpen = ref(false)
const dropdownOpen = ref(false)

const isPhotographyRoute = computed(() => {
  return route.path.startsWith('/gallery')
})

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
  dropdownOpen.value = false
}

function toggleDropdown(e) {
  if (window.innerWidth <= 900) {
    e.preventDefault()
    dropdownOpen.value = !dropdownOpen.value
  }
}
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--lavender);
  padding: 1.5rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.site-logo {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 400;
  font-style: italic;
  color: var(--brown-dark);
  letter-spacing: 0.02em;
}

.site-logo a {
  color: var(--brown-dark);
}

.site-nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.site-nav > a,
.nav-dropdown > .nav-dropdown-trigger {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--brown-dark);
  letter-spacing: 0.04em;
  transition: opacity 0.2s;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.site-nav > a:hover,
.nav-dropdown:hover > .nav-dropdown-trigger {
  opacity: 0.6;
}

.site-nav > a.active {
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* Dropdown */
.nav-dropdown {
  position: relative;
}

.nav-dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.nav-dropdown-trigger.active {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.nav-dropdown-trigger .chevron {
  font-size: 0.6rem;
  transition: transform 0.2s;
}

.nav-dropdown:hover .chevron {
  transform: rotate(180deg);
}

.nav-dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%);
  background: var(--lavender);
  min-width: 160px;
  padding: 0.75rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  text-align: center;
}

.nav-dropdown:hover .nav-dropdown-menu {
  opacity: 1;
  visibility: visible;
}

.nav-dropdown-menu a {
  display: block;
  padding: 0.5rem 1.5rem;
  font-size: 0.8rem;
  color: var(--brown-dark);
  letter-spacing: 0.04em;
  transition: background-color 0.15s;
}

.nav-dropdown-menu a:hover {
  background-color: var(--beige-light);
}

/* Mobile hamburger */
.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-menu-toggle span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--brown-dark);
  margin: 5px 0;
  transition: all 0.3s;
}

.mobile-overlay {
  display: none;
}

@media (max-width: 900px) {
  .site-header {
    padding: 1.2rem 1.5rem;
  }

  .site-nav {
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    height: 100vh;
    background: var(--lavender);
    flex-direction: column;
    padding: 5rem 2rem 2rem;
    gap: 0;
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
    transition: right 0.3s ease;
    z-index: 200;
  }

  .site-nav.open {
    right: 0;
  }

  .site-nav > a,
  .nav-dropdown > .nav-dropdown-trigger {
    font-size: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid var(--beige);
    width: 100%;
    text-align: left;
  }

  .nav-dropdown {
    width: 100%;
  }

  .nav-dropdown-menu {
    position: static;
    transform: none;
    box-shadow: none;
    padding: 0;
    opacity: 1;
    visibility: visible;
    display: none;
    text-align: left;
  }

  .nav-dropdown.open .nav-dropdown-menu {
    display: block;
  }

  .nav-dropdown-menu a {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }

  .mobile-menu-toggle {
    display: block;
    z-index: 300;
  }

  .mobile-menu-toggle.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .mobile-menu-toggle.active span:nth-child(2) {
    opacity: 0;
  }

  .mobile-menu-toggle.active span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
  }

  .mobile-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 150;
  }

  .mobile-overlay.active {
    display: block;
  }
}
</style>
