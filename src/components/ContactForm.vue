<template>
  <form
    class="contact-form"
    :class="{ 'form-underline': variant === 'underline' }"
    action="#"
    method="POST"
    @submit.prevent
  >
    <div class="form-group">
      <label>Name</label>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>First Name <span class="required">(required)</span></label>
        <input type="text" name="first_name" required>
      </div>
      <div class="form-group">
        <label>Last Name <span class="required">(required)</span></label>
        <input type="text" name="last_name" required>
      </div>
    </div>
    <div class="form-group">
      <label>Email <span class="required">(required)</span></label>
      <input type="email" name="email" required>
    </div>
    <div v-if="showNewsletter" class="form-checkbox">
      <input type="checkbox" id="newsletter" name="newsletter">
      <label for="newsletter">Sign up for news and updates</label>
    </div>
    <div class="form-group">
      <label>Message <span class="required">(required)</span></label>
      <textarea name="message" required></textarea>
    </div>
    <button type="submit" class="btn-submit">{{ submitText }}</button>
  </form>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'standard',
    validator: (val) => ['standard', 'underline'].includes(val),
  },
  showNewsletter: {
    type: Boolean,
    default: false,
  },
  submitText: {
    type: String,
    default: 'Submit',
  },
})
</script>

<style scoped>
.contact-form {
  margin-top: 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.8rem;
  color: var(--text-body);
  margin-bottom: 0.4rem;
  font-weight: 400;
}

.form-group label .required {
  font-size: 0.75rem;
  color: var(--brown-light);
  font-style: italic;
  margin-left: 0.3rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group textarea {
  width: 100%;
  padding: 0.7rem 0.5rem;
  border: 1.5px solid var(--brown-dark);
  border-radius: 3px;
  background: transparent;
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--text-dark);
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--brown-medium);
}

.form-group textarea {
  min-height: 120px;
  resize: vertical;
}

/* Underline variant */
.form-underline .form-group input[type="text"],
.form-underline .form-group input[type="email"],
.form-underline .form-group textarea {
  border: none;
  border-bottom: 1.5px solid var(--brown-dark);
  border-radius: 0;
  padding: 0.7rem 0;
  background: transparent;
}

.form-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.form-checkbox input[type="checkbox"] {
  accent-color: var(--brown-dark);
}

.form-checkbox label {
  font-size: 0.8rem;
  color: var(--text-body);
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
