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
        <div class="order-items">
          <div v-for="item in cartItems" :key="`${item.id}-${item.selectedSize}`" class="order-item">
            <div class="item-details">
              <img :src="item.image" :alt="item.name" class="item-image">
              <div class="item-info">
                <h4>{{ item.name }}</h4>
                <p>Size: {{ item.selectedSize }} {{ getSizeScale(item) }}</p>
                <p>Quantity: {{ item.quantity }}</p>
                <p>Price: ${{ (item.price * item.quantity).toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="order-total">
          <p>Total: ${{ cartTotal }}</p>
        </div>
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
    ...mapGetters('cart', ['cartTotal', 'cartItems']),
  },
  methods: {
    ...mapActions('cart', ['clearCart']),
    submitOrder() {
      // Mock order submission
      alert('Order placed successfully!');
      this.clearCart();
      this.$router.push('/order-confirmation');
    },
    getSizeScale(item) {
      if (!item.sizeConversions) return '';
      const scales = {
        'US': 'US',
        'UK': 'UK',
        'EU': 'EU',
        'CM': 'cm',
        'IN': 'inches'
      };
      const conversions = Object.entries(item.sizeConversions)
        .map(([scale, value]) => `${scales[scale]}: ${value}`)
        .join(' / ');
      return `(${conversions})`;
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

.order-items {
  margin: 1rem 0;
}

.order-item {
  border-bottom: 1px solid #eee;
  padding: 1rem 0;
}

.item-details {
  display: flex;
  gap: 1rem;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.item-info {
  flex: 1;
}

.item-info h4 {
  margin: 0 0 0.5rem 0;
}

.item-info p {
  margin: 0.25rem 0;
  color: #666;
}

.order-total {
  margin-top: 1rem;
  font-weight: bold;
  font-size: 1.2rem;
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