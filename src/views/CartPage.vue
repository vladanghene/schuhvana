
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
            <div v-if="cartItems.length > 0" key="items">
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
                      <div class="size-change">
                        <select 
                          v-model="selectedSizesChange[`${item.id}-${item.selectedSize}`]"
                          class="change-size-select"
                          @change="handleSizeChange(item)"
                        >
                          <option value="">Size: {{ item.selectedSize }}</option>
                          <option 
                            v-for="size in getAvailableSizes(getProductById(item.id))" 
                            :key="size.value"
                            :value="size.value"
                            :disabled="isSizeInCart(item.id, size.value) && size.value !== item.selectedSize"
                          >
                            {{ size.label }}
                          </option>
                        </select>
                      </div>
                      <p class="price">${{ item.price }}</p>
                    </div>
                    <div class="item-controls">
                      <div class="size-selector">
                        <select 
                          v-model="selectedSizes[`${item.id}-${item.selectedSize}`]"
                          class="add-size-select"
                          @change="handleAddSize(item)"
                        >
                          <option value="">Add Size</option>
                          <option 
                            v-for="size in getAvailableSizes(getProductById(item.id))" 
                            :key="size.value"
                            :value="size.value"
                            :disabled="isSizeInCart(item.id, size.value)"
                          >
                            {{ size.label }}
                          </option>
                        </select>
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
            <div v-else class="empty-cart" key="empty">
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
          <TransitionGroup name="removed-item" tag="div" class="removed-items">
            <div v-for="item in removedItems" :key="`${item.id}-${item.selectedSize}-removed`" class="removed-item">
              <div class="removed-item-content">
                <img :src="getImageUrl(item.image)" :alt="item.name" class="removed-thumb">
                <div class="removed-details">
                  <h4>{{ item.name }}</h4>
                  <p>Size: {{ getDisplaySize(item) }}</p>
                </div>
                <div class="time-remaining">{{ getTimeRemaining(item) }}</div>
              </div>
              <button @click="handleRestore($event, item)" class="restore-btn">
                Restore to Cart
              </button>
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
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';
import Breadcrumbs from '../components/Breadcrumbs.vue';
import Confetti from '../components/Confetti.vue';
import { mapState, mapGetters, mapActions } from 'vuex';
import { getImageUrl, DEFAULT_SHOE_IMAGE } from '@/utils/imageUtils';

export default {
  name: 'CartPage',
  components: {
    Breadcrumbs,
    Confetti
  },
  setup() {
    const store = useStore();
    const selectedSizes = reactive({});
    const selectedSizesChange = reactive({});
    const showingConfetti = ref(false);
    const mousePosition = reactive({ x: 0, y: 0 });
    const timeCache = reactive(new Map());
    const now = ref(Date.now());
    const timer = ref(null);
    const updateInterval = 1000; // 1 second

    const updateTimeCache = () => {
      now.value = Date.now();
    };

    // Initialize empty selections for new items
    const initializeNewSelection = (id, size) => {
      const key = `${id}-${size}`;
      selectedSizes[key] = '';
      const product = store.getters['products/getProductById'](id);
      const currentScale = store.getters['user/userPreferredScale'];
      const conversions = store.getters['products/getSizeConversions'](size, product);
      selectedSizesChange[key] = conversions ? conversions[currentScale] || size : size;
    };

    // Watch for cart changes and scale changes to initialize new items
    watch(
      [
        () => store.getters['cart/cartItems'],
        () => store.getters['user/userPreferredScale']
      ],
      ([items, scale]) => {
        items.forEach(item => {
          initializeNewSelection(item.id, item.selectedSize);
        });
      },
      { immediate: true, deep: true }
    );

    onMounted(() => {
      // Clear any existing timer first
      if (timer.value) {
        clearInterval(timer.value);
      }
      
      updateTimeCache();
      timer.value = setInterval(updateTimeCache, updateInterval);
    });

    onUnmounted(() => {
      if (timer.value) {
        clearInterval(timer.value);
        timer.value = null;
      }
      timeCache.clear();
    });

    return {
      selectedSizes,
      selectedSizesChange,
      showingConfetti,
      mousePosition,
      timeCache,
      now,
      updateTimeCache,
      initializeNewSelection
    };
  },
  computed: {
    ...mapGetters('cart', ['cartItems', 'cartTotal', 'removedItems']),
    ...mapGetters('products', ['getProductById', 'getProductSizes', 'getSizeConversions']),
    ...mapGetters('user', ['userPreferredScale']),
    
    getCurrentScale() {
      return this.userPreferredScale;
    },

    getDisplaySize() {
      const cache = new Map();
      
      return (item) => {
        const cacheKey = `${item.id}-${item.selectedSize}`;
        if (cache.has(cacheKey)) return cache.get(cacheKey);

        const product = this.getProductById(item.id);
        if (!product) return item.selectedSize;

        const conversions = this.getSizeConversions(item.selectedSize, product);
        if (!conversions) return item.selectedSize;

        const currentScale = this.getCurrentScale;
        const result = conversions[currentScale] || item.selectedSize;
        cache.set(cacheKey, result);
        return result;
      };
    },

    getAvailableSizes() {
      const cache = new Map();
      
      return (product) => {
        if (!product) return [];
        
        const cacheKey = `${product.id}-${this.getCurrentScale}`;
        if (cache.has(cacheKey)) return cache.get(cacheKey);

        const sizes = this.getProductSizes(product);
        const currentScale = this.getCurrentScale;
        
        let scaleToUse = currentScale;
        let availableSizes = sizes[currentScale] || [];
        
        if (availableSizes.length === 0) {
          scaleToUse = 'EU';
          availableSizes = sizes.EU || [];
        }

        const result = availableSizes.map(size => {
          const conversions = this.getSizeConversions(size, product);
          if (!conversions) return { value: size, label: size };
          
          return {
            value: size,
            label: conversions[currentScale] || size
          };
        });

        cache.set(cacheKey, result);
        return result;
      };
    },

    getTimeRemaining() {
      // Use arrow function to preserve 'this' context
      return (item) => {
        if (!item || !item.expiryTime) return '0m 0s';
        
        const cacheKey = `${item.id}-${item.selectedSize}`;
        
        // Return cached value if it exists and was calculated less than a second ago
        const cached = this.timeCache.get(cacheKey);
        const currentTime = this.now;
        if (cached && currentTime - cached.timestamp < 1000) {
          return cached.value;
        }
        
        const timeLeft = item.expiryTime - currentTime;
        if (timeLeft <= 0) {
          this.removeFromRemoved({ 
            id: item.id, 
            selectedSize: item.selectedSize 
          });
          return '0m 0s';
        }
        
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        const result = `${minutes}m ${seconds}s`;
        
        // Cache the result
        this.timeCache.set(cacheKey, {
          value: result,
          timestamp: currentTime
        });
        
        return result;
      };
    }
  },
  methods: {
    ...mapActions('cart', [
      'softDeleteFromCart', 
      'restoreToCart', 
      'removeFromRemoved', 
      'updateCartItemQuantity',
      'changeCartItemSize',
      'addToCart'
    ]),
    getImageUrl(image) {
      return getImageUrl(image || DEFAULT_SHOE_IMAGE);
    },
    updateQuantity(id, selectedSize, newQuantity) {
      if (newQuantity > 0) {
        this.updateCartItemQuantity({ id, selectedSize, quantity: newQuantity });
      }
    },
    handleRestore(event, item) {
      this.mousePosition.x = event.clientX;
      this.mousePosition.y = event.clientY;
      this.showingConfetti = true;
      
      // Initialize select boxes for the restored item
      const key = `${item.id}-${item.selectedSize}`;
      this.selectedSizes[key] = '';
      const product = this.getProductById(item.id);
      const currentScale = this.userPreferredScale;
      const conversions = this.getSizeConversions(item.selectedSize, product);
      this.selectedSizesChange[key] = conversions ? conversions[currentScale] || item.selectedSize : item.selectedSize;
      
      // Restore item
      this.restoreToCart({ 
        id: item.id, 
        selectedSize: item.selectedSize
      });

      // Remove item from removedItems list
      this.removeFromRemoved({
        id: item.id,
        selectedSize: item.selectedSize
      });
      
      // Reset confetti after animation
      setTimeout(() => {
        this.showingConfetti = false;
      }, 2000);
    },
    async handleSizeChange(item) {
      const key = `${item.id}-${item.selectedSize}`;
      const newSize = this.selectedSizesChange[key];
      if (!newSize || newSize === item.selectedSize) return; // Skip if no size selected or same size
      
      if (!this.isSizeInCart(item.id, newSize)) {
        // Change the size in cart while preserving quantity
        await this.changeCartItemSize({ 
          id: item.id, 
          oldSize: item.selectedSize,
          newSize,
          quantity: item.quantity
        });
      }
    },
    isSizeInCart(id, size) {
      return this.cartItems.some(item => item.id === id && item.selectedSize === size);
    },
    async handleAddSize(item) {
      const key = `${item.id}-${item.selectedSize}`;
      const newSize = this.selectedSizes[key];
      if (!newSize) return; // Skip if no size selected
      
      if (!this.isSizeInCart(item.id, newSize)) {
        const product = this.getProductById(item.id);
        
        // Add new size as a separate item
        await this.addToCart({ 
          id: item.id, 
          selectedSize: newSize,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        });
        
        // Initialize dropdowns for the new item
        this.initializeNewSelection(item.id, newSize);
        
        // Reset the selection
        this.$nextTick(() => {
          this.selectedSizes[key] = '';
        });
      }
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
  gap: 1rem;
  flex: 1;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-info h3 {
  color: #111827;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.2;
}

.item-info .size-change {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item-info .price {
  color: #111827;
  font-weight: 600;
  font-size: 1.25rem;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.item-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f9fafb;
  padding: 0.25rem;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.remove-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  color: #dc2626;
  background: transparent;
  border: 1px solid #dc2626;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;

  &:hover {
    background: #dc2626;
    color: white;
  }

  &:active {
    transform: scale(0.98);
  }
}

.change-size-select,
.add-size-select {
  appearance: none;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  color: #4a5568;
  cursor: pointer;
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  width: auto;
  min-width: fit-content;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  margin: 0;
  display: inline-flex;
  align-items: center;

  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  }

  &:disabled {
    background-color: #f7fafc;
    cursor: not-allowed;
    opacity: 0.5;
  }
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
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.03);
  padding: 0.25rem 0.5rem;
  border-radius: 0 8px 0 8px;
  font-size: 0.75rem;
  color: #4b5563;
  font-weight: 500;
  box-shadow: inset 0px -2px 2px rgba(255, 255, 255, 0.8),
              inset 0px 2px 2px rgba(0, 0, 0, 0.03),
              0px 2px 4px rgba(0, 0, 0, 0.05);
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
              inset 0px 2px 2px rgba(0, 0, 0, 0.03),
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
</style>