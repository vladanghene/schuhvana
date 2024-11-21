<template>
  <div class="privacy-page">
    <div class="container">
      <h1>Privacy Policy</h1>
      
      <section>
        <h2>Introduction</h2>
        <p>Welcome to Schuhvana's Privacy Policy. Your privacy is important to us, and we are committed to protecting your personal information.</p>
      </section>

      <section>
        <h2>Information We Collect</h2>
        <ul>
          <li>Personal information (name, email, shipping address)</li>
          <li>Payment information (processed securely through our payment providers)</li>
          <li>Shopping preferences and history</li>
          <li>Device and browser information</li>
        </ul>
      </section>

      <section>
        <h2>How We Use Your Information</h2>
        <ul>
          <li>Process your orders and provide customer service</li>
          <li>Send order updates and shipping notifications</li>
          <li>Improve our products and services</li>
          <li>Personalize your shopping experience</li>
        </ul>
      </section>

      <section>
        <h2>Data Security</h2>
        <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>
      </section>

      <section>
        <h2>Contact Us</h2>
        <p>If you have any questions about our Privacy Policy, please contact us at privacy@schuhvana.com</p>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Privacy'
}
</script>

<style scoped>
.privacy-page {
  padding: 2rem 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #1a1a1a;
}

h2 {
  font-size: 1.5rem;
  margin: 1.5rem 0 1rem;
  color: #333;
}

section {
  margin-bottom: 2rem;
}

p {
  line-height: 1.6;
  color: #4a4a4a;
}

ul {
  list-style-type: disc;
  margin-left: 1.5rem;
}

li {
  margin-bottom: 0.5rem;
  color: #4a4a4a;
}
</style>
