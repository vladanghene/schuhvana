<template>
    <header class="header">
      <div class="logo">
        <router-link to="/">Schuhvana</router-link>
      </div>
      <nav class="navigation">
        <router-link to="/">Home</router-link>
        <router-link to="/category/men">Men</router-link>
        <router-link to="/category/women">Women</router-link>
        <router-link to="/category/kids">Kids</router-link>
        <router-link to="/cart">Cart ({{ cartItemCount }})</router-link>
        <router-link v-if="!isAuthenticated" to="/login">Login</router-link>
        <router-link v-if="isAuthenticated" to="/account">My Account</router-link>
      </nav>
      <div class="search-bar">
        <input type="text" v-model="searchQuery" placeholder="Search products..." @keyup.enter="search" />
        <button @click="search">Search</button>
      </div>
    </header>
  </template>
  
  <script>
  import { mapGetters } from 'vuex';
  
  export default {
    data() {
      return {
        searchQuery: '',
      };
    },
    computed: {
      ...mapGetters('cart', ['cartItems']),
      ...mapGetters('user', ['isAuthenticated']),
      cartItemCount() {
        return this.cartItems.reduce((total, item) => total + item.quantity, 0);
      },
    },
    methods: {
      search() {
        this.$store.dispatch('search/performSearch', this.searchQuery);
        this.$router.push({ name: 'SearchPage', query: { q: this.searchQuery } });
      },
    },
  };
  </script>
  
  <style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #fff;
    border-bottom: 1px solid #ccc;
  }
  
  .logo a {
    font-size: 1.5rem;
    font-weight: bold;
    text-decoration: none;
    color: #000;
  }
  
  .navigation a {
    margin: 0 1rem;
    text-decoration: none;
    color: #000;
  }
  
  .search-bar {
    display: flex;
  }
  
  .search-bar input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .search-bar button {
    margin-left: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>