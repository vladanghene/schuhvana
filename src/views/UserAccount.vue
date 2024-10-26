<template>
    <div class="user-account-page">
      <h2>My Account</h2>
      <div class="account-info">
        <p><strong>Name:</strong> {{ userInfo.name }}</p>
        <p><strong>Email:</strong> {{ userInfo.email }}</p>
        <button @click="logout" class="logout-button">Logout</button>
      </div>
      <div class="order-history">
        <h3>Order History</h3>
        <div v-if="orders.length">
          <ul>
            <li v-for="order in orders" :key="order.id">
              <p>Order #{{ order.id }} - Total: ${{ order.total }}</p>
              <router-link :to="'/order/' + order.id">View Order</router-link>
            </li>
          </ul>
        </div>
        <p v-else>No orders yet.</p>
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    computed: {
      ...mapGetters('user', ['getUserInfo']),
      userInfo() {
        return this.getUserInfo || {};
      },
      orders() {
        // Mock orders; replace this with actual fetched orders
        return [
          { id: 1, total: 150 },
          { id: 2, total: 75 },
        ];
      },
    },
    methods: {
      ...mapActions('user', ['logout']),
    },
  };
  </script>
  
  <style scoped>
  .user-account-page {
    padding: 2rem;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .account-info {
    margin-bottom: 2rem;
  }
  
  .logout-button {
    padding: 0.75rem 1.5rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .order-history ul {
    list-style-type: none;
    padding: 0;
  }
  
  .order-history li {
    margin-bottom: 1rem;
  }
  </style>