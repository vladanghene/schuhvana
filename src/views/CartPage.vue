
<template>
  <div class="cart-page">
    <div class="cart-container">
      <Breadcrumbs />
      <div class="cart-header">
        <h1>Shopping Cart</h1>
        <span class="item-count">{{ cartItems.length }} item{{ cartItems.length !== 1 ? 's' : '' }}</span>
      </div>

      <div v-if="cartItems.length > 0 || removedItems.length > 0" class="cart-content">
        <div class="cart-main">
          <div v-if="cartItems.length > 0" class="cart-items">
            <div v-for="item in cartItems" :key="item.id" class="cart-item">
              <div class="item-image">
                <img :src="getImageUrl(item.image)" :alt="item.name" />
              </div>
              <div class="item-details">
                <div class="item-info">
                  <h3>{{ item.name }}</h3>
                  <p class="size">Size: {{ item.selectedSize }}</p>
                  <p class="price">${{ item.price }}</p>
                </div>
                <div class="item-actions">
                  <div class="quantity-controls">
                    <button class="quantity-btn" @click="updateQuantity(item.id, item.quantity - 1)" :disabled="item.quantity <= 1">−</button>
                    <span class="quantity">{{ item.quantity }}</span>
                    <button class="quantity-btn" @click="updateQuantity(item.id, item.quantity + 1)">+</button>
                  </div>
                  <button @click="softDeleteFromCart(item.id)" class="remove-btn">
                    <span class="remove-icon">×</span>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="removedItems.length > 0" class="removed-items">
            <h2>Recently Removed</h2>
            <div v-for="item in removedItems" :key="item.id" class="removed-item">
              <div class="item-image">
                <img :src="getImageUrl(item.image)" :alt="item.name" />
              </div>
              <div class="item-details">
                <div class="item-info">
                  <h3>{{ item.name }}</h3>
                  <p class="size">Size: {{ item.selectedSize }}</p>
                  <p class="price">${{ item.price }}</p>
                </div>
                <button @click="restoreToCart(item.id)" class="restore-btn">
                  Add Back to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <h2>Order Summary</h2>
          <div class="summary-details">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>${{ cartTotal.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span>${{ cartTotal.toFixed(2) }}</span>
            </div>
          </div>
          <router-link to="/checkout" class="checkout-button" :class="{ 'disabled': cartItems.length === 0 }" :disabled="cartItems.length === 0">
            Proceed to Checkout
          </router-link>
          <router-link to="/" class="continue-shopping">
            Continue Shopping
          </router-link>
        </div>
      </div>

      <div v-else class="empty-cart">
        <div class="empty-cart-content">
          <svg class="cart-icon" viewBox="0 0 24 24" width="64" height="64">
            <path fill="currentColor" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 3h1l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H6.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H4.21l-.94-2H1v2zm16 15c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <router-link to="/" class="start-shopping-btn">Start Shopping</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { getImageUrl, DEFAULT_SHOE_IMAGE } from '@/utils/imageUtils';
import Breadcrumbs from '@/components/Breadcrumbs.vue';

export default {
  name: 'CartPage',
  components: {
    Breadcrumbs
  },
  computed: {
    ...mapGetters('cart', ['cartItems', 'cartTotal', 'removedItems']),
  },
  data() {
    return {
      fallbackImage: DEFAULT_SHOE_IMAGE
    };
  },
  methods: {
    ...mapActions('cart', ['softDeleteFromCart', 'restoreToCart', 'updateCartItemQuantity']),
    getImageUrl(filename) {
      if (!filename) return DEFAULT_SHOE_IMAGE;
      return getImageUrl(filename);
    },
    updateQuantity(itemId, newQuantity) {
      if (newQuantity > 0) {
        this.updateCartItemQuantity({ id: itemId, quantity: newQuantity });
      }
    }
  },
};
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 2rem 1rem;
}

.cart-container {
  max-width: 1200px;
  margin: 0 auto;
}

.cart-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.cart-header h1 {
  margin: 0;
  font-size: 2rem;
  color: #2c3e50;
}

.item-count {
  color: #6c757d;
  font-size: 1.1rem;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
}

.cart-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.cart-items {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.cart-item {
  display: flex;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.item-details {
  flex-grow: 1;
  margin-left: 1.5rem;
  display: flex;
  justify-content: space-between;
}

.item-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

.size {
  color: #6c757d;
  margin: 0.25rem 0;
}

.price {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
  margin: 0.5rem 0;
}

.item-actions {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8f9fa;
  padding: 0.25rem;
  border-radius: 6px;
}

.quantity-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2c3e50;
  transition: all 0.2s;
}

.quantity-btn:hover:not(:disabled) {
  background: #e9ecef;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  min-width: 30px;
  text-align: center;
  font-weight: 500;
}

.remove-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.remove-btn:hover {
  color: #c82333;
}

.remove-icon {
  font-size: 1.2rem;
}

.removed-items {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.removed-items h2 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #6c757d;
}

.removed-item {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  opacity: 0.7;
  background: rgba(0, 0, 0, 0.02);
  transition: opacity 0.2s;
}

.removed-item:hover {
  opacity: 0.85;
}

.removed-item:last-child {
  border-bottom: none;
}

.restore-btn {
  height: fit-content;
  align-self: center;
  padding: 0.5rem 1rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.restore-btn:hover {
  background: #218838;
}

.cart-summary {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 2rem;
}

.cart-summary h2 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.summary-details {
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  color: #6c757d;
}

.summary-row.total {
  border-top: 1px solid #eee;
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
}

.checkout-button {
  display: block;
  width: 100%;
  padding: 1rem;
  background: #007bff;
  color: white;
  text-align: center;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
  margin-bottom: 1rem;
}

.checkout-button:hover {
  background: #0056b3;
}

.checkout-button.disabled {
  background: #6c757d;
  cursor: not-allowed;
  pointer-events: none;
}

.continue-shopping {
  display: block;
  text-align: center;
  color: #6c757d;
  text-decoration: none;
  font-size: 0.9rem;
}

.continue-shopping:hover {
  color: #2c3e50;
}

.empty-cart {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 4rem 2rem;
}

.empty-cart-content {
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
}

.cart-icon {
  color: #6c757d;
  margin-bottom: 1.5rem;
}

.empty-cart h2 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.empty-cart p {
  color: #6c757d;
  margin-bottom: 2rem;
}

.start-shopping-btn {
  display: inline-block;
  padding: 1rem 2rem;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.start-shopping-btn:hover {
  background: #0056b3;
}

@media (max-width: 768px) {
  .cart-page {
    padding: 1rem;
  }

  .cart-item {
    flex-direction: column;
  }

  .item-image {
    width: 100%;
    height: 200px;
    margin-bottom: 1rem;
  }

  .item-details {
    margin-left: 0;
    flex-direction: column;
    gap: 1rem;
  }

  .item-actions {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>