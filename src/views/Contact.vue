<template>
  <div class="contact-page">
    <div class="container">
      <h1>Contact Us</h1>
      <div class="contact-content">
        <div class="contact-info">
          <h2>Get in Touch</h2>
          <p>We're here to help! Send us a message and we'll respond as soon as possible.</p>
          
          <div class="contact-methods">
            <div class="method">
              <h3>Email</h3>
              <p>support@schuhvana.com</p>
            </div>
            
            <div class="method">
              <h3>Phone</h3>
              <p>+1 (555) 123-4567</p>
            </div>
            
            <div class="method">
              <h3>Hours</h3>
              <p>Monday - Friday: 9am - 6pm PST</p>
              <p>Saturday: 10am - 4pm PST</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
        
        <form class="contact-form" @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" v-model="form.name" required>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="form.email" required>
          </div>
          
          <div class="form-group">
            <label for="subject">Subject</label>
            <input type="text" id="subject" v-model="form.subject" required>
          </div>
          
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" v-model="form.message" required></textarea>
          </div>
          
          <button type="submit" class="submit-btn">Send Message</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Contact',
  data() {
    return {
      form: {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    };
  },
  methods: {
    submitForm() {
      // TODO: Implement form submission
      console.log('Form submitted:', this.form);
      // Reset form
      this.form = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
    }
  }
};
</script>

<style scoped>
.contact-page {
  padding: 2rem 0;
  background-color: #f9fafb;
  min-height: calc(100vh - 64px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

h1 {
  text-align: center;
  color: #1f2937;
  margin-bottom: 2rem;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.contact-info h2 {
  color: #1f2937;
  margin-bottom: 1rem;
}

.contact-info p {
  color: #4b5563;
  margin-bottom: 2rem;
}

.contact-methods {
  display: grid;
  gap: 1.5rem;
}

.method h3 {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.method p {
  color: #4b5563;
  margin: 0;
}

.contact-form {
  display: grid;
  gap: 1.5rem;
}

.form-group {
  display: grid;
  gap: 0.5rem;
}

label {
  color: #374151;
  font-weight: 500;
}

input,
textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}

textarea {
  min-height: 150px;
  resize: vertical;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background-color: #16a34a;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #15803d;
}

@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
