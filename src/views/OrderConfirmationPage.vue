<template>
    <div class="order-confirmation-page">
      <h2>Thank You for Your Order!</h2>
      <p>Your order has been successfully placed and is being processed.</p>
      <p>We will send you a confirmation email with the order details shortly.</p>
      <router-link to="/" class="back-to-home">Continue Shopping</router-link>
    </div>
  </template>

  <style scoped>
  .order-confirmation-page {
    padding: 2rem;
    text-align: center;
  }

  .back-to-home {
    display: inline-block;
    margin-top: 2rem;
    padding: 1rem 2rem;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 4px;
  }
  </style>
