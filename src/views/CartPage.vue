
<template>
  <div class="cart-page">
    <div class="container">
      <Breadcrumbs />
      
      <!-- Cart Container -->
      <div class="cart-container">
        <div class="cart-header">
          <h1>Shopping Cart</h1>
          <span class="item-count">{{ cartItems.length }} item{{ cartItems.length !== 1 ? 's' : '' }}</span>
        </div>

        <!-- Main Cart Section -->
        <div v-if="cartItems.length > 0" class="cart-content">
          <!-- Cart Items -->
          <div class="cart-main">
            <div class="cart-items">
              <TransitionGroup name="cart-item" tag="div">
                <div v-for="item in cartItems" :key="`${item.id}-${item.selectedSize}`" class="cart-item">
                  <div class="item-image">
                    <img :src="getImageUrl(item.image)" :alt="item.name" />
                  </div>
                  <div class="item-details">
                    <div class="item-info">
                      <h3>{{ item.name }}</h3>
                      <p class="size">
                        Size: {{ item.selectedSize }} US
                        <span v-if="item.sizeConversions" class="size-conversions">
                          (UK {{ item.sizeConversions.UK }} / EU {{ item.sizeConversions.EU }})
                        </span>
                      </p>
                      <p class="price">${{ item.price }}</p>
                    </div>
                    <div class="item-actions">
                      <div class="size-selector">
                        <select 
                          v-model="selectedSizes[item.id]" 
                          @change="handleAddSize(item)"
                          :disabled="getAvailableSizes(item.id).every(size => isSizeInCart(item.id, size))"
                        >
                          <option value="" disabled>Select another size</option>
                          <option 
                            v-for="size in getAvailableSizes(item.id)" 
                            :key="size"
                            :value="size"
                            :disabled="isSizeInCart(item.id, size)"
                          >
                            Size US {{ size }}
                          </option>
                        </select>
                        <button 
                          v-if="selectedSizes[item.id]" 
                          @click="handleAddSize(item)"
                          :disabled="isSizeInCart(item.id, selectedSizes[item.id])"
                          class="add-size-btn"
                        >
                          Add to Cart
                        </button>
                      </div>
                      <div class="quantity-controls">
                        <button 
                          class="quantity-btn" 
                          @click="updateQuantity(item.id, item.selectedSize, item.quantity - 1)" 
                          :disabled="item.quantity <= 1"
                        >−</button>
                        <span class="quantity">{{ item.quantity }}</span>
                        <button 
                          class="quantity-btn" 
                          @click="updateQuantity(item.id, item.selectedSize, item.quantity + 1)"
                        >+</button>
                      </div>
                      <button 
                        @click="softDeleteFromCart({ id: item.id, selectedSize: item.selectedSize })" 
                        class="remove-btn"
                      >
                        <span class="remove-icon">×</span>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </div>

          <!-- Cart Summary -->
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
            <router-link 
              to="/checkout" 
              class="checkout-button" 
              :class="{ 'disabled': cartItems.length === 0 }" 
              :disabled="cartItems.length === 0"
            >
              Proceed to Checkout
            </router-link>
            <router-link to="/" class="continue-shopping">
              Continue Shopping
            </router-link>
          </div>
        </div>

        <!-- Empty Cart Message -->
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

      <!-- Recently Removed Items -->
      <div v-if="removedItems.length > 0" class="removed-items-section">
        <h2>Recently Removed</h2>
        <TransitionGroup name="removed-item" tag="div" class="removed-items">
          <div 
            v-for="item in removedItems" 
            :key="`removed-${item.id}-${item.selectedSize}`" 
            class="removed-item" 
            :class="{ 'fade-out': item.isRestoring }"
          >
            <div class="item-image">
              <img :src="getImageUrl(item.image)" :alt="item.name" />
            </div>
            <div class="item-details">
              <div class="item-info">
                <h3>{{ item.name }}</h3>
                <p class="size">
                  Size: {{ item.selectedSize }} US
                  <span v-if="item.sizeConversions" class="size-conversions">
                    (UK {{ item.sizeConversions.UK }} / EU {{ item.sizeConversions.EU }})
                  </span>
                </p>
                <p class="price">${{ item.price }}</p>
              </div>
              <div class="restore-container">
                <button @click="handleRestore($event, item)" class="restore-btn">
                  Add Back to Cart
                </button>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- Confetti Animation -->
      <Confetti 
        v-if="showingConfetti"
        :is-active="true"
        :mouse-x="mousePosition.x"
        :mouse-y="mousePosition.y"
        type="restore"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { ref, onMounted, onUnmounted } from 'vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import Confetti from '@/components/Confetti.vue';
import { getImageUrl, DEFAULT_SHOE_IMAGE } from '@/utils/imageUtils';

export default {
  name: 'CartPage',
  components: {
    Breadcrumbs,
    Confetti
  },
  computed: {
    ...mapGetters('cart', ['cartItems', 'cartTotal', 'removedItems']),
    ...mapGetters('products', ['getProductById']),
    
    getAvailableSizes() {
      return (productId) => {
        const product = this.getProductById(productId);
        if (!product) return [];
        const sizes = this.$store.getters['products/getProductSizes'](product);
        return sizes.US || [];  // Always use US sizes for consistency
      };
    }
  },
  data() {
    return {
      fallbackImage: DEFAULT_SHOE_IMAGE,
      selectedSizes: {},
      showingConfetti: false,
      mousePosition: { x: 0, y: 0 },
      checkExpiredInterval: null
    };
  },
  created() {
    // Initialize selectedSizes for each cart item
    this.cartItems.forEach(item => {
      this.selectedSizes[item.id] = '';
    });
  },
  mounted() {
    // Start periodic check for expired items
    this.checkExpiredInterval = setInterval(() => {
      this.checkExpiredItems();
    }, 30000); // Check every 30 seconds
  },
  unmounted() {
    // Clean up interval when component is destroyed
    if (this.checkExpiredInterval) {
      clearInterval(this.checkExpiredInterval);
    }
  },
  methods: {
    ...mapActions('cart', [
      'softDeleteFromCart', 
      'restoreToCart', 
      'removeFromRemoved', 
      'clearCart',
      'updateCartItemQuantity',
      'addToCart',
      'checkExpiredItems'
    ]),
    ...mapGetters('products', ['getProductById']),
    getImageUrl,
    updateQuantity(id, selectedSize, newQuantity) {
      if (newQuantity > 0) {
        this.updateCartItemQuantity({ id, selectedSize, quantity: newQuantity });
      }
    },
    handleRestore(event, item) {
      // Get fresh size conversions from store
      const product = this.getProductById(item.id);
      if (!product) return;
      
      const sizeConversions = this.$store.getters['products/getProductSizeConversions'](product);
      const usSize = `US-${item.selectedSize}`;
      const conversions = sizeConversions[usSize];
      
      // Update item with fresh size conversions
      const updatedItem = {
        ...item,
        sizeConversions: conversions
      };

      this.mousePosition = {
        x: event.clientX,
        y: event.clientY
      };
      this.showingConfetti = true;
      
      // Restore item with updated conversions
      this.restoreToCart({ 
        id: updatedItem.id, 
        selectedSize: updatedItem.selectedSize,
        sizeConversions: updatedItem.sizeConversions
      });

      // Remove item from removedItems list
      this.removeFromRemoved({
        id: updatedItem.id,
        selectedSize: updatedItem.selectedSize
      });
      
      // Reset confetti after animation
      setTimeout(() => {
        this.showingConfetti = false;
      }, 2000);
    },
    handleAddSize(item) {
      const size = this.selectedSizes[item.id];
      if (!size) return;

      // Get fresh size conversions from store
      const product = this.getProductById(item.id);
      if (!product) return;
      
      const sizeConversions = this.$store.getters['products/getProductSizeConversions'](product);
      const usSize = `US-${size}`;
      const conversions = sizeConversions[usSize];

      // Add new size with fresh conversions
      this.addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        selectedSize: size,
        sizeConversions: conversions,
        image: item.image
      });

      // Reset selection
      this.selectedSizes[item.id] = '';
    },
    isSizeInCart(id, size) {
      return this.cartItems.some(item => item.id === id && item.selectedSize === size);
    }
  }
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
  align-items: center;
}

.item-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

.size {
  color: #666;
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.size-conversions {
  color: #888;
  font-size: 0.85rem;
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

.size-selector {
  margin: 1rem 0;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.size-selector select {
  padding: 0.5rem 1rem;
  padding-right: 2.5rem;  /* Increased right padding to prevent text overlap with arrow */
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #333;
  background-color: #fff;
  cursor: pointer;
  min-width: 150px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
  background-size: 1em;
}

.size-selector select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

.size-selector select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  color: #999;
}

.size-selector .add-size-btn {
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.size-selector .add-size-btn:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-1px);
}

.size-selector .add-size-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.size-selector option {
  padding: 0.5rem;
  font-size: 0.9rem;
}

.size-selector option:disabled {
  color: #999;
  background: #f5f5f5;
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

.removed-items-section {
  margin-top: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 2rem;
}

.removed-items-section h2 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.removed-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.removed-item {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}

.removed-item.fade-out {
  opacity: 0;
  transform: translateX(-20px);
  pointer-events: none;
}

.restore-container {
  display: flex;
  align-items: center;
}

.restore-btn {
  padding: 0.75rem 1.5rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.restore-btn:hover {
  background: #218838;
}

.removed-item.fade-out * {
  pointer-events: none;
}

.removed-item:not(.fade-out) .restore-btn {
  pointer-events: auto;
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

/* Cart Items Animation */
.cart-item-enter-active,
.cart-item-leave-active {
  transition: all 0.5s ease;
}

.cart-item-enter-from,
.cart-item-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Recently Removed Items Animation */
.removed-item-enter-active,
.removed-item-leave-active {
  transition: all 0.5s ease;
}

.removed-item-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.removed-item-leave-to {
  opacity: 0;
  transform: translateX(30px);
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

  .removed-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .restore-container {
    width: 100%;
    justify-content: center;
    margin-top: 1rem;
  }
}
</style>