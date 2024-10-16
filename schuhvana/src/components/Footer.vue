<template>
    <footer class="footer">
      <div class="footer-links">
        <router-link to="/">Home</router-link>
        <router-link to="/contact">Contact Us</router-link>
        <router-link to="/terms">Terms & Conditions</router-link>
        <router-link to="/privacy">Privacy Policy</router-link>
      </div>
      <div class="social-links">
        <a href="https://facebook.com" target="_blank">Facebook</a>
        <a href="https://instagram.com" target="_blank">Instagram</a>
        <a href="https://twitter.com" target="_blank">Twitter</a>
      </div>
      <div class="payment-methods">
        <img src="/assets/images/payments.png" alt="Payment Methods" />
      </div>
    </footer>
  </template>
  
  <style scoped>
  .footer {
    background-color: #f8f9fa;
    padding: 2rem;
    text-align: center;
    border-top: 1px solid #ccc;
  }
  
  .footer-links a {
    margin: 0 1rem;
    text-decoration: none;
    color: #000;
  }
  
  .social-links a {
    margin: 0 1rem;
    text-decoration: none;
    color: #007bff;
  }
  
  .payment-methods img {
    margin-top: 1rem;
    max-width: 200px;
  }
  </style>