<template>
  <section class="section-favourites">
    <h2>My Favourite Works</h2>
    <div class="favourites-grid">
      <router-link to="/gallery/portrait">
        <img src="/images/home/favourite-1.jpg" alt="Portrait photography" />
      </router-link>
      <router-link to="/gallery/landscape">
        <img src="/images/home/favourite-2.jpg" alt="Landscape photography" />
      </router-link>
      <router-link to="/gallery/animal">
        <img src="/images/home/favourite-3.jpg" alt="Animal photography" />
      </router-link>
    </div>
  </section>

  <section class="section-connect">
    <h2>Lets Connect</h2>
    <p>
      Let me know what it is <strong><u>you</u></strong> want to create, and we can work together to
      make it a <strong><u>reality</u></strong
      >.
    </p>
    <router-link to="/contact" class="btn-primary"> Get in touch </router-link>
  </section>
</template>

<style scoped>
.section-favourites {
  padding: 3rem 0 3rem;
  text-align: center;
  background: var(--lavender);
}

.section-favourites h2 {
  font-family: var(--font-heading);
  font-weight: 400;
  font-size: 2.2rem;
  color: var(--brown-dark);
  margin-bottom: 2rem;
}

.favourites-grid {
  display: flex;
  gap: 1rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.favourites-grid a {
  flex: 1;
  display: block;
  overflow: hidden;
}

.favourites-grid img {
  width: 100%;
  height: 350px;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.favourites-grid a:hover img {
  transform: scale(1.03);
}

.section-connect {
  background: var(--beige);
  padding: 5rem 3rem;
  text-align: center;
}

.section-connect h2 {
  font-family: var(--font-heading);
  font-weight: 400;
  font-size: 2.2rem;
  color: var(--brown-dark);
  margin-bottom: 1.5rem;
}

.section-connect p {
  font-size: 0.95rem;
  color: var(--text-body);
  max-width: 600px;
  margin: 0 auto 2.5rem;
  line-height: 1.7;
}

@media (max-width: 900px) {
  .favourites-grid {
    flex-direction: column;
    gap: 1rem;
  }

  .favourites-grid img {
    height: 250px;
  }

  .section-connect {
    padding: 3rem 1.5rem;
  }
}

@media (max-width: 600px) {
  .section-favourites h2,
  .section-connect h2 {
    font-size: 1.6rem;
  }
}
</style>
