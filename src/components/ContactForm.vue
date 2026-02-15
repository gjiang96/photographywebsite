<template>
  <form
    class="contact-form"
    :class="{ 'form-underline': variant === 'underline' }"
    @submit.prevent="handleSubmit"
  >
    <div v-if="successMessage" class="alert alert-success">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="alert alert-error">
      {{ errorMessage }}
    </div>

    <div class="form-group">
      <label>Name</label>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>First Name <span class="required">(required)</span></label>
        <input v-model="formData.first_name" type="text" required :disabled="isSubmitting" />
      </div>
      <div class="form-group">
        <label>Last Name <span class="required">(required)</span></label>
        <input v-model="formData.last_name" type="text" required :disabled="isSubmitting" />
      </div>
    </div>
    <div class="form-group">
      <label>Email <span class="required">(required)</span></label>
      <input v-model="formData.email" type="email" required :disabled="isSubmitting" />
    </div>
    <div v-if="showNewsletter" class="form-checkbox">
      <input
        id="newsletter"
        v-model="formData.newsletter"
        type="checkbox"
        :disabled="isSubmitting"
      />
      <label for="newsletter">Sign up for news and updates</label>
    </div>
    <div class="form-group">
      <label>Message <span class="required">(required)</span></label>
      <textarea v-model="formData.message" required :disabled="isSubmitting" />
    </div>
    <button type="submit" class="btn-submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Sending...' : submitText }}
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  variant: {
    type: String,
    default: 'standard',
    validator: val => ['standard', 'underline'].includes(val),
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

const formData = ref({
  first_name: '',
  last_name: '',
  email: '',
  message: '',
  newsletter: false,
})

const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const API_ENDPOINT = 'https://ehrkhhli6d.execute-api.us-east-1.amazonaws.com/prod/contact'

async function handleSubmit() {
  isSubmitting.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData.value),
    })

    const data = await response.json()

    if (response.ok) {
      successMessage.value = 'Thank you! Your message has been sent successfully.'
      // Reset form
      formData.value = {
        first_name: '',
        last_name: '',
        email: '',
        message: '',
        newsletter: false,
      }
    } else {
      errorMessage.value = data.error || 'Failed to send message. Please try again.'
    }
  } catch {
    errorMessage.value = 'An error occurred. Please try again later.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.contact-form {
  margin-top: 0;
}

.alert {
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert-error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
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

.form-group input[type='text'],
.form-group input[type='email'],
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
.form-underline .form-group input[type='text'],
.form-underline .form-group input[type='email'],
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

.form-checkbox input[type='checkbox'] {
  accent-color: var(--brown-dark);
}

.form-checkbox label {
  font-size: 0.8rem;
  color: var(--text-body);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-group input:disabled,
.form-group textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
