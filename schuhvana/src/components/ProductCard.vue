<template>
    <div class="product-card">
      <img :src="product.image" :alt="product.name" />
      <h3>{{ product.name }}</h3>
      <p class="price">${{ product.price }}</p>
      <button @click="addToCart">Add to Cart</button>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex';
  
  export default {
    props: {
      product: Object,
    },
    methods: {
      ...mapActions('cart', ['addToCart']),
    },
  };
  </script>
  
  <style scoped>
  .product-card {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 1rem;
    text-align: center;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .product-card img {
    max-width: 100%;
    height: auto;
    margin-bottom: 1rem;
  }
  
  .product-card h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
  
  .price {
    color: #007bff;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>