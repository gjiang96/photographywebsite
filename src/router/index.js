import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GalleryView from '../views/GalleryView.vue'
import AboutView from '../views/AboutView.vue'
import ContactView from '../views/ContactView.vue'
import { galleries } from '../data/galleries.js'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Gary Jiang Photography' },
  },
  {
    path: '/gallery/:category',
    name: 'gallery',
    component: GalleryView,
    beforeEnter: to => {
      if (!galleries[to.params.category]) {
        return { name: 'home' }
      }
    },
    meta: { titleSuffix: 'Gary Jiang Photography' },
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: { title: 'About — Gary Jiang Photography' },
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactView,
    meta: { title: 'Contact — Gary Jiang Photography' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(to => {
  if (to.meta.title) {
    document.title = to.meta.title
  } else if (to.name === 'gallery' && galleries[to.params.category]) {
    document.title = `${galleries[to.params.category].title} — Gary Jiang Photography`
  }
})

export default router
