<template>
    <div class="product-detail">
      <div class="product-images">
        <img :src="product.image" :alt="product.name" />
      </div>
      <div class="product-info">
        <h1>{{ product.name }}</h1>
        <p class="price">${{ product.price }}</p>
        <p>{{ product.description }}</p>
        <div class="size-selection">
          <label for="size">Size:</label>
          <select v-model="selectedSize" id="size">
            <option v-for="size in product.sizes" :key="size" :value="size">
              {{ size }}
            </option>
          </select>
        </div>
        <button @click="addToCart">Add to Cart</button>
      </div>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex';
  
  export default {
    props: {
      product: Object,
    },
    data() {
      return {
        selectedSize: null,
      };
    },
    methods: {
      ...mapActions('cart', ['addToCart']),
    },
  };
  </script>
  
  <style scoped>
  .product-detail {
    display: flex;
    gap: 2rem;
  }
  
  .product-images img {
    max-width: 300px;
    height: auto;
  }
  
  .product-info {
    flex-grow: 1;
  }
  
  .price {
    font-size: 1.5rem;
    color: #007bff;
  }
  
  .size-selection {
    margin: 1rem 0;
  }
  
  button {
    padding: 0.75rem 1.5rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>