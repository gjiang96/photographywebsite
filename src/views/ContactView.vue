<template>
  <section class="section-contact">
    <div class="contact-layout">
      <div class="contact-info">
        <h1>Contact Us</h1>
        <p>You can reach me through my email or socials</p>
        <p><a href="mailto:bowengary@hotmail.com">bowengary@hotmail.com</a></p>

        <div class="contact-form-wrapper">
          <ContactForm variant="underline" submit-text="Send" />
        </div>
      </div>
      <div class="contact-image">
        <img src="/images/contact/contact-photo.jpg" alt="Desk setup" />
      </div>
    </div>
  </section>
</template>

<script setup>
import ContactForm from '../components/ContactForm.vue'
</script>

<style scoped>
.section-contact {
  background: var(--beige);
  padding: 4rem 4vw;
  min-height: 70vh;
}

.contact-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1200px;
  margin: 0 auto;
  align-items: start;
}

.contact-info h1 {
  font-family: var(--font-heading);
  font-weight: 400;
  font-size: 2.4rem;
  color: var(--text-dark);
  margin-bottom: 1.5rem;
}

.contact-info p {
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--text-body);
  margin-bottom: 0.3rem;
}

.contact-info a {
  color: var(--text-body);
}

.contact-form-wrapper {
  margin-top: 3rem;
}

.contact-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

@media (max-width: 900px) {
  .contact-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 600px) {
  .contact-info h1 {
    font-size: 1.8rem;
  }
}
</style>
