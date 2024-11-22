<template>
  <div class="order-confirmation-page">
    <div class="confirmation-header">
      <h2>Thank You for Your Order!</h2>
      <p>Your order has been successfully placed and is being processed.</p>
      <p>We will send you a confirmation email with the order details shortly.</p>
    </div>

    <div class="order-details" v-if="lastOrder">
      <h3>Order Summary</h3>
      <div class="order-items">
        <div v-for="item in lastOrder.items" :key="`${item.id}-${item.selectedSize}`" class="order-item">
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
        <p>Total: ${{ lastOrder.total }}</p>
      </div>
    </div>

    <router-link to="/" class="back-to-home">Continue Shopping</router-link>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('orders', ['lastOrder'])
  },
  methods: {
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
    }
  }
};
</script>

<style scoped>
.order-confirmation-page {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.confirmation-header {
  text-align: center;
  margin-bottom: 2rem;
}

.order-details {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
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
  text-align: right;
}

.back-to-home {
  display: inline-block;
  margin-top: 1rem;
  padding: 1rem 2rem;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.back-to-home:hover {
  background-color: #45a049;
}
</style>
