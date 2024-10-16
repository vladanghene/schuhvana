<template>
    <div class="checkout-page">
      <h2>Checkout</h2>
      <form @submit.prevent="submitOrder">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" v-model="order.name" required />
        </div>
        <div class="form-group">
          <label for="address">Shipping Address</label>
          <input type="text" id="address" v-model="order.address" required />
        </div>
        <div class="form-group">
          <label for="payment">Payment Method</label>
          <select id="payment" v-model="order.paymentMethod" required>
            <option value="credit-card">Credit Card</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>
        <div class="order-summary">
          <h3>Order Summary</h3>
          <p>Total: ${{ cartTotal }}</p>
        </div>
        <button type="submit" class="submit-button">Place Order</button>
      </form>
    </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    data() {
      return {
        order: {
          name: '',
          address: '',
          paymentMethod: 'credit-card',
        },
      };
    },
    computed: {
      ...mapGetters('cart', ['cartTotal']),
    },
    methods: {
      ...mapActions('cart', ['clearCart']),
      submitOrder() {
        // Mock order submission
        alert('Order placed successfully!');
        this.clearCart();
        this.$router.push('/order-confirmation');
      },
    },
  };
  </script>
  
  <style scoped>
  .checkout-page {
    padding: 2rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .order-summary {
    margin-top: 2rem;
  }
  
  .submit-button {
    padding: 1rem 2rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>