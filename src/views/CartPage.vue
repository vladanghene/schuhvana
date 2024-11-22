
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
        <div class="cart-content">
          <Transition name="empty-cart" mode="out-in">
            <div v-if="cartItems.length > 0">
              <div class="cart-items">
                <TransitionGroup name="cart-items" tag="div" class="cart-items">
                  <div v-for="item in cartItems" 
                    :key="`${item.id}-${item.selectedSize}`" 
                    class="cart-item">
                    <div class="item-image">
                      <img :src="getImageUrl(item.image)" :alt="item.name" />
                    </div>
                    <div class="item-details">
                      <div class="item-info">
                        <h3>{{ item.name }}</h3>
                        <div class="size">
                          Size: {{ item.selectedSize }} US
                          <div v-if="item.sizeConversions" class="size-conversions">
                            (UK {{ item.sizeConversions.UK }} / EU {{ item.sizeConversions.EU }})
                          </div>
                          <div class="item-size">
                            <select 
                              v-model="selectedSizesChange[item.id]"
                              @change="handleSizeChange(item)"
                              class="change-size-select"
                            >
                              <option value="">Select a different size</option>
                              <option 
                                v-for="size in getAvailableSizes(item.id)"
                                :key="size"
                                :value="size"
                                :disabled="isSizeInCart(item.id, size)"
                              >
                                US {{ size }}
                              </option>
                            </select>
                          </div>
                        </div>
                        <p class="price">${{ item.price }}</p>
                      </div>
                      <div class="item-actions">
                        <div class="size-selector">
                          <select 
                            v-model="selectedSizes[item.id]" 
                            @change="handleAddSize(item)"
                            :disabled="getAvailableSizes(item.id).every(size => isSizeInCart(item.id, size))"
                          >
                            <option value="" disabled>Add a new size to cart</option>
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
          </Transition>
        </div>

        <!-- Recently Removed Items -->
        <div v-if="removedItems.length > 0" class="removed-section">
          <h3>Recently Removed</h3>
          <div class="removed-items">
            <div v-for="item in removedItems" :key="`${item.id}-${item.selectedSize}-removed`" class="removed-item">
              <div class="removed-item-content">
                <img :src="getImageUrl(item.image)" :alt="item.name" class="removed-thumb">
                <div class="removed-details">
                  <h4>{{ item.name }}</h4>
                  <p>Size: US {{ item.selectedSize }}</p>
                  <p>${{ item.price }}</p>
                </div>
                <div class="time-remaining">{{ getTimeRemaining(item) }}</div>
              </div>
              <button @click="handleRestore($event, item)" class="restore-btn">
                Restore to Cart
              </button>
            </div>
          </div>
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
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { onMounted, onUnmounted, watch } from 'vue';
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
    
    getTimeRemaining() {
      return (item) => {
        if (!item || !item.removedAt) return '0m 0s';
        
        const now = Date.now();
        const EXPIRY_TIME = 30 * 1000; // 30 seconds in milliseconds
        const timeLeft = Math.max(0, (item.removedAt + EXPIRY_TIME) - now);

        // If time has expired, remove from state
        if (timeLeft === 0) {
          this.removeFromRemoved({ id: item.id, selectedSize: item.selectedSize });
          return '0m 0s';
        }
        
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
      };
    },

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
      selectedSizes: {},
      selectedSizesChange: {},
      showingConfetti: false,
      mousePosition: { x: 0, y: 0 },
      checkExpiredInterval: null
    };
  },
  created() {
    // Initialize selectedSizes and selectedSizesChange for each cart item
    this.cartItems.forEach(item => {
      this.selectedSizes[item.id] = '';
      this.selectedSizesChange[item.id] = '';
    });
  },
  mounted() {
    // Start periodic check for expired items
    this.removedItems.forEach(item => {
      const now = Date.now();
      const EXPIRY_TIME = 30 * 1000; // 30 seconds in milliseconds
      const timeLeft = Math.max(0, (item.removedAt + EXPIRY_TIME) - now);
      
      if (timeLeft === 0) {
        this.removeFromRemoved({ id: item.id, selectedSize: item.selectedSize });
      }
    });
    this.checkExpiredInterval = setInterval(() => {
      this.removedItems.forEach(item => {
        const now = Date.now();
        const EXPIRY_TIME = 30 * 1000; // 30 seconds in milliseconds
        const timeLeft = Math.max(0, (item.removedAt + EXPIRY_TIME) - now);
        
        if (timeLeft === 0) {
          this.removeFromRemoved({ id: item.id, selectedSize: item.selectedSize });
        }
      });
    }, 1000); // Check every second
  },
  unmounted() {
    // Clean up interval when component is destroyed
    if (this.checkExpiredInterval) {
      clearInterval(this.checkExpiredInterval);
    }
  },
  watch: {
    cartItems: {
      handler(newItems) {
        // Clear any existing timer
        if (this.emptyMessageTimer) {
          clearTimeout(this.emptyMessageTimer);
        }
        
        if (newItems.length === 0) {
          // Set timer to show empty message after 2 seconds
          this.showEmptyMessage = false;
          setTimeout(() => {
            this.showEmptyMessage = true;
          }, 2000);
        } else {
          this.showEmptyMessage = false;
        }
      },
      immediate: true
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
      'checkExpiredItems',
      'changeCartItemSize'
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
      
      // Initialize select boxes for the restored item
      this.selectedSizes[updatedItem.id] = '';
      this.selectedSizesChange[updatedItem.id] = '';
      
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
    async handleSizeChange(item) {
      const newSize = this.selectedSizesChange[item.id];
      if (!newSize) return; // Skip if no size selected
      
      if (!this.isSizeInCart(item.id, newSize)) {
        // Get fresh size conversions from store
        const product = this.getProductById(item.id);
        if (!product) return;
        
        const sizeConversions = this.$store.getters['products/getProductSizeConversions'](product);
        const usSize = `US-${newSize}`;
        const conversions = sizeConversions[usSize];

        await this.changeCartItemSize({ 
          id: item.id, 
          oldSize: item.selectedSize, 
          newSize,
          sizeConversions: conversions
        });
        
        this.selectedSizesChange[item.id] = ''; // Reset selection
      }
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

.cart-content {
  position: relative;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
}

.cart-content > div {
  display: flex;
  gap: 2rem;
  flex: 1;
}

@media (max-width: 1024px) {
  .cart-content > div {
    flex-direction: column;
  }

  .cart-summary {
    width: 100%;
    position: relative;
    top: 0;
  }

  .summary-details {
    max-width: 500px;
    margin: 0 auto 1.5rem;
  }

  .checkout-button,
  .continue-shopping {
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
}

@media (max-width: 768px) {
  .cart-content {
    gap: 1rem;
  }

  .cart-content > div {
    gap: 1rem;
  }
}

.cart-items {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cart-summary {
  width: 380px;
  flex-shrink: 0;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 2rem;
  align-self: flex-start;
  height: fit-content;
}

.cart-summary h2 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  font-size: 1.5rem;
  text-align: center;
}

.summary-details {
  margin-bottom: 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  color: #6c757d;
  background: #f8f9fa;
  border-radius: 8px;
  grid-column: span 2;
}

.summary-row.total {
  border-top: none;
  margin-top: 0.5rem;
  padding: 1rem;
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
  background: #e9ecef;
}

.summary-row span:first-child {
  font-weight: 500;
}

.summary-row span:last-child {
  text-align: right;
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

.cart-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.cart-item {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 3rem;
  padding: 2.5rem 3.5rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
  transition: all 0.2s ease;
}

.cart-item:hover {
  border-color: #e5e7eb;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.cart-item .item-image {
  width: 200px;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.cart-item .item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  padding: 1rem 0;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
}

.item-info h3 {
  color: #111827;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.2;
}

.item-info .size {
  color: #4b5563;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  white-space: nowrap;
  flex-wrap: nowrap;
}

.size-conversions {
  color: #9ca3af;
  font-size: 0.875rem;
  white-space: nowrap;
}

.item-info .price {
  color: #111827;
  font-weight: 600;
  font-size: 1.25rem;
}

.item-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;
  margin-top: auto;
}

.size-selector {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 200px;
  margin-top: 0.7rem;
}

.size-selector select {
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #374151;
  font-size: 0.875rem;
  background-color: white;
  cursor: pointer;
  width: 160px;
}

.add-size-btn {
  padding: 0.5rem 1rem;
  background: #16a34a;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f9fafb;
  padding: 0.25rem;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  margin-left: auto;
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  color: #dc2626;
  background: transparent;
  border: 1px solid #dc2626;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.remove-btn:hover {
  background: #dc2626;
  color: white;
}

.remove-btn:active {
  transform: scale(0.98);
}

.remove-icon {
  font-size: 1.25rem;
  line-height: 1;
}

.change-size-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: white;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 180px;
  height: 38px;
  appearance: none;
  display: flex;
  align-items: center;
}

.change-size-select option {
  color: #374151;
  padding: 0.5rem;
  font-weight: 500;
}

.change-size-select:hover:not(:disabled) {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.change-size-select:focus {
  outline: none;
  border-color: #d1d5db;
  box-shadow: 0 0 0 2px rgba(209, 213, 219, 0.2);
}

.change-size-select:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.5;
}

.item-size {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 200px;
  margin-top: 0.7rem;
}

.removed-section {
  margin-top: 2rem;
  padding: 1.5rem;
  border: 2px dashed rgba(156, 163, 175, 0.5);
  border-radius: 8px;
}

.removed-section h3 {
  color: #374151;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.removed-items {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.removed-item {
  position: relative;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  overflow: hidden;
  transition: all 0.2s ease;
  border: 1px solid #f3f4f6;
  padding: 1.5rem;
  display: flex;
  align-items: center;
}

.removed-item:hover {
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border-color: #e5e7eb;
}

.removed-item-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
}

.removed-thumb {
  width: 100px;
  height: 100px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.removed-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.removed-item .restore-btn {
  padding: 0.5rem 1rem;
  background: #16a34a;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  font-weight: 500;
}

.removed-item .restore-btn:hover {
  background: #22c55e;
  transform: translateY(-1px);
}

.removed-item .restore-btn:disabled {
  background: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.time-remaining {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.05);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #4b5563;
  font-weight: 500;
}

.checkout-button {
  display: block;
  width: 100%;
  padding: 1rem;
  background: #007bff;
  color: white;
  text-align: center;
  font-weight: 500;
  border-radius: 6px;
  text-decoration: none;
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
  text-decoration: none;
  color: #6c757d;
  font-size: 0.9rem;
}

.continue-shopping:hover {
  color: #2c3e50;
}

.empty-cart {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  background: #f8f9fa;
}

.empty-cart-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 400px;
  margin: auto;
}

.empty-cart-content .cart-icon {
  color: #e2e8f0;
  filter: drop-shadow(0px 2px 2px rgba(255, 255, 255, 0.8)) 
          drop-shadow(0px -2px 2px rgba(0, 0, 0, 0.1));
}

.empty-cart-content h2 {
  color: #94a3b8;
  margin: 0;
  font-size: 1.8rem;
  text-shadow: 0px 2px 2px rgba(255, 255, 255, 0.8),
               0px -2px 2px rgba(0, 0, 0, 0.1);
}

.empty-cart-content p {
  color: #94a3b8;
  margin: 0;
  font-size: 1.1rem;
  text-shadow: 0px 2px 2px rgba(255, 255, 255, 0.8),
               0px -2px 2px rgba(0, 0, 0, 0.1);
}

.start-shopping-btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  color: #94a3b8;
  background: #f1f5f9;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: inset 0px -2px 2px rgba(255, 255, 255, 0.8),
              inset 0px 2px 2px rgba(0, 0, 0, 0.1),
              0px 2px 4px rgba(0, 0, 0, 0.05);
}

.start-shopping-btn:hover {
  background: #e2e8f0;
  transform: translateY(1px);
}

.start-shopping-btn:active {
  background: #cbd5e1;
  box-shadow: inset 0px 2px 2px rgba(0, 0, 0, 0.1),
              inset 0px -2px 2px rgba(255, 255, 255, 0.8);
}

/* Cart Items Animation */
.cart-items-move,
.cart-items-enter-active,
.cart-items-leave-active {
  transition: all 0.5s ease;
}

.cart-items-enter-from,
.cart-items-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.cart-items-leave-active {
  position: absolute;
}

/* Recently Removed Items Animation */
.removed-item-enter-active,
.removed-item-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.removed-item-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.removed-item-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

/* Empty Cart Transition */
.empty-cart-enter-active {
  transition: all 3s ease;
}

.empty-cart-leave-active {
  transition: all 0.5s ease;
}

.empty-cart-enter-from,
.empty-cart-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.empty-cart-enter-to,
.empty-cart-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .cart-page {
    padding: 1rem;
  }

  .cart-item {
    grid-template-columns: auto 1fr;
    gap: 1.5rem;
    padding: 1rem;
  }

  .item-image {
    width: 100px;
    height: 100px;
  }

  .item-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .size-selector {
    width: 100%;
  }

  .size-selector select {
    width: 100%;
  }

  .quantity-controls {
    width: 100%;
    justify-content: center;
  }

  .remove-btn {
    width: 100%;
    justify-content: center;
  }
  
  .time-remaining {
    top: 1.25rem;
    right: 1.25rem;
  }
}
</style>