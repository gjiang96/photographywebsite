<template>
  <section class="section-about">
    <div class="about-layout">
      <div class="about-text">
        <h1>About Me</h1>
        <p>My journey into photography began with a realization: most of my life lived only in my head, with no physical or digital medium to bring those moments back. This sparked a mission to document the world around me—preserving the present so my future self can revisit the past.</p>
        <p>When I'm not behind the lens, you'll find me climbing (indoors and out), on the badminton court, gaming, or hunting for the motivation to finish a good book.</p>
        <p>If my work resonates with you, let's connect. I'd love to help you capture the experiences and emotions you want to hold onto.</p>
      </div>
      <div class="about-image">
        <img src="/images/about/profile.jpg" alt="Gary Jiang">
      </div>
    </div>
  </section>

  <section class="section-contact-panel">
    <div class="contact-panel-layout">
      <div class="contact-panel-text">
        <h2>Contact us</h2>
        <p>Interested in working together? Fill out some info and we will be in touch shortly. We can't wait to hear from you!</p>
      </div>
      <div class="contact-panel-form">
        <ContactForm
          variant="standard"
          :show-newsletter="true"
          submit-text="Submit"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import ContactForm from '../components/ContactForm.vue'
</script>

<style scoped>
.section-about {
  padding: 4rem 4vw;
  background: var(--white);
}

.about-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1200px;
  margin: 0 auto;
  align-items: start;
}

.about-text h1 {
  font-family: var(--font-heading);
  font-weight: 400;
  font-style: italic;
  font-size: 2.4rem;
  color: var(--text-dark);
  margin-bottom: 2rem;
}

.about-text p {
  font-size: 0.9rem;
  line-height: 1.8;
  color: var(--text-body);
  margin-bottom: 1.2rem;
}

.about-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.section-contact-panel {
  background: var(--lavender);
  padding: 5rem 4vw;
}

.contact-panel-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1200px;
  margin: 0 auto;
  align-items: start;
}

.contact-panel-text h2 {
  font-family: var(--font-heading);
  font-weight: 400;
  font-style: italic;
  font-size: 2.2rem;
  color: var(--text-dark);
  margin-bottom: 1.5rem;
}

.contact-panel-text p {
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--text-body);
}

@media (max-width: 900px) {
  .about-layout,
  .contact-panel-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .about-image {
    order: -1;
  }
}

@media (max-width: 600px) {
  .about-text h1,
  .contact-panel-text h2 {
    font-size: 1.8rem;
  }
}
</style>
