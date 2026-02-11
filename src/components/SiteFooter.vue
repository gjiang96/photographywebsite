<template>
  <footer class="site-footer">
    <div class="footer-logo">Gary Jiang Photography</div>
    <div class="footer-social">
      <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <circle cx="12" cy="12" r="5"/>
          <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
        </svg>
      </a>
    </div>
    <div class="footer-email">
      <a href="mailto:bowengary@hotmail.com">bowengary@hotmail.com</a>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: 2rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--beige);
  border-top: 1px solid rgba(92, 64, 51, 0.1);
}

.footer-logo {
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: 400;
  font-style: italic;
  color: var(--brown-dark);
}

.footer-social a {
  color: var(--brown-dark);
  font-size: 1.1rem;
  transition: opacity 0.2s;
}

.footer-social a:hover {
  opacity: 0.6;
}

.footer-email a {
  font-size: 0.85rem;
  color: var(--brown-dark);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.footer-email a:hover {
  opacity: 0.6;
}

@media (max-width: 900px) {
  .site-footer {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    padding: 1.5rem;
  }
}
</style>
