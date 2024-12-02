
<template>
  <div class="cart-page">
    <v-snackbar
      v-model="showError"
      :color="snackbarColor"
      timeout="3000"
    >
      {{ errorMessage }}
    </v-snackbar>
    
    <div class="container">
      <Breadcrumbs />
      
      <!-- Cart Container -->
      <div class="cart-container">
        <div class="cart-header">
          <h1>Shopping Cart</h1>
          <span v-if="itemCount > 0" class="cart-count">({{ itemCount }} items)</span>
          <router-link 
            v-if="itemCount === 10 && !isAuthenticated" 
            to="/register" 
            class="register-prompt"
          >
            Register to continue shopping
          </router-link>
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
                      <div class="quantity-controls">
                        <v-btn
                          icon="mdi-minus"
                          size="small"
                          variant="text"
                          :disabled="item.quantity <= 1"
                          @click="updateQuantity(item, item.quantity - 1)"
                        />
                        <span class="quantity-display">{{ item.quantity }}</span>
                        <v-btn
                          icon="mdi-plus"
                          size="small"
                          variant="text"
                          @click="updateQuantity(item, item.quantity + 1)"
                        />
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
                      <button 
                        class="remove-button"
                        @click="softDeleteFromCart({ id: item.id, selectedSize: item.selectedSize })" 
                      >
                        <span class="remove-text">Remove</span>
                        <span class="remove-underline"></span>
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
        <div v-if="groupedRemovedItems.length > 0" class="removed-section">
          <h3>Recently Removed</h3>
          <TransitionGroup name="removed-item" tag="div" class="removed-items">
            <div v-for="group in groupedRemovedItems" :key="group.id" class="removed-item">
              <div class="removed-sizes">
                <div 
                  v-for="(size, index) in group.sizes" 
                  :key="size.size" 
                  class="removed-size-item elevation-1"
                  :class="{
                    'splitting': getCardState(group.id, size.size).isSplitting,
                    'isRestacking': getCardState(group.id, size.size).isRestacking,
                    'switched': getCardState(group.id, size.size).isSwitched
                  }"
                  @mouseenter="startSplit(group.id, size.size)"
                  @mouseleave="endSplit(group.id, size.size)"
                  :ref="`removed-${group.id}-${size.size}`"
                >
                  <div class="removed-item-stack">
                    <div class="product-card">
                      <img :src="getImageUrl(group.image)" :alt="group.name" class="removed-thumb">
                      <div class="product-overlay">
                        <h4>{{ group.name }}</h4>
                      </div>
                    </div>
                    <div class="size-card">
                      <div class="size-info">
                        <span class="text-caption text-medium-emphasis">Size</span>
                        <span class="text-h5 text-medium-emphasis">{{ getDisplaySize({ id: group.id, selectedSize: size.size }) }}</span>
                      </div>
                      <button 
                        class="restore-button"
                        @click="handleRestore($event, { id: group.id, selectedSize: size.size })"
                      >
                        <span class="restore-text">Restore</span>
                        <span class="restore-underline"></span>
                      </button>
                      <div class="time-remaining text-caption">
                        {{ getTimeRemaining({ id: group.id, selectedSize: size.size, expiryTime: size.expiryTime }) }}
                      </div>
                    </div>
                  </div>
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
    const cardStates = reactive(new Map());
    const timer = ref(null);
    const updateInterval = 60000;
    const errorMessage = ref('');
    const showError = ref(false);
    const snackbarColor = ref('error');

    const getCardState = (id, size) => {
      const key = `${id}-${size}`;
      if (!cardStates.has(key)) {
        cardStates.set(key, reactive({
          isSplitting: false,
          isRestacking: false,
          isSwitched: false
        }));
      }
      return cardStates.get(key);
    };

    const startSplit = (id, size) => {
      const state = getCardState(id, size);
      state.isSplitting = true;
      state.isRestacking = false;
      
      // After split animation, start restack
      setTimeout(() => {
        state.isRestacking = true;
        state.isSwitched = true;
      }, 300);
    };

    const endSplit = (id, size) => {
      const state = getCardState(id, size);
      // Start the reverse animation
      state.isRestacking = false;
      state.isSplitting = true;
      
      // After cards split again, reset to original position
      setTimeout(() => {
        state.isSplitting = false;
        state.isSwitched = false;
      }, 300);
    };

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
      initializeNewSelection,
      getCardState,
      startSplit,
      endSplit,
      timer,
      updateInterval,
      errorMessage,
      showError,
      snackbarColor,
      async restoreItem(id, selectedSize) {
        try {
          const result = await this.$store.dispatch('cart/restoreToCart', { id, selectedSize });
          
          if (result.message) {
            this.errorMessage = result.message;
            this.snackbarColor = 'warning';
            this.showError = true;
          } else if (!result.success) {
            this.errorMessage = result.error;
            this.snackbarColor = 'error';
            this.showError = true;
          }
        } catch (error) {
          this.errorMessage = error.message;
          this.snackbarColor = 'error';
          this.showError = true;
        }
      },
      async changeSize(item, newSize) {
        try {
          const result = await this.$store.dispatch('cart/changeCartItemSize', {
            id: item.id,
            oldSize: item.selectedSize,
            newSize: newSize,
            quantity: item.quantity
          });
          
          if (!result.success) {
            this.errorMessage = result.error;
            this.snackbarColor = 'error';
            this.showError = true;
          }
        } catch (error) {
          this.errorMessage = error.message;
          this.snackbarColor = 'error';
          this.showError = true;
        }
      },
    };
  },
  computed: {
    ...mapGetters('cart', ['cartItems', 'cartTotal', 'removedItems', 'itemCount']),
    ...mapGetters('products', ['getProductById', 'getProductSizes', 'getSizeConversions']),
    ...mapGetters('user', ['userPreferredScale', 'isAuthenticated']),
    
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
    },
    groupedRemovedItems() {
      const grouped = {};
      this.removedItems.forEach(item => {
        if (!grouped[item.id]) {
          grouped[item.id] = {
            id: item.id,
            name: item.name,
            image: item.image,
            sizes: []
          };
        }
        grouped[item.id].sizes.push({
          size: item.selectedSize,
          expiryTime: item.expiryTime,
          quantity: item.quantity,
          isSplitting: false,
          isSwitched: false
        });
      });
      return Object.values(grouped);
    },
  },
  methods: {
    ...mapActions('cart', [
      'removeFromRemoved', 
      'restoreToCart',
      'softDeleteFromCart',
      'updateCartItemQuantity',
      'changeCartItemSize',
      'addToCart'
    ]),
    handleRestore(event, { id, selectedSize }) {
      if (event) {
        const rect = event.target.getBoundingClientRect();
        this.mousePosition.x = rect.left + rect.width / 2;
        this.mousePosition.y = rect.top;
      }

      const cardState = this.getCardState(id, selectedSize);
      cardState.isSplitting = false;
      cardState.isRestacking = false;
      cardState.isSwitched = false;
      
      this.restoreToCart({ id, selectedSize })
        .then(result => {
          if (!result) {
            this.errorMessage = 'Failed to restore item';
            this.snackbarColor = 'error';
            this.showError = true;
            return;
          }
          
          if (result.message) {
            this.errorMessage = result.message;
            this.snackbarColor = 'warning';
            this.showError = true;
          } else if (!result.success) {
            this.errorMessage = result.error || 'Failed to restore item';
            this.snackbarColor = 'error';
            this.showError = true;
            return;
          }

          // Only remove from removed items and show confetti if successful
          if (result.success) {
            this.removeFromRemoved({ id, selectedSize });
            this.showingConfetti = true;
            
            setTimeout(() => {
              this.showingConfetti = false;
            }, 2000);
          }
        })
        .catch(error => {
          console.error('Restore error:', error);
          this.errorMessage = error?.message || 'An error occurred while restoring the item';
          this.snackbarColor = 'error';
          this.showError = true;
        });
    },
    getImageUrl(image) {
      return getImageUrl(image || DEFAULT_SHOE_IMAGE);
    },
    async handleSizeChange(item) {
      const key = `${item.id}-${item.selectedSize}`;
      const newSize = this.selectedSizesChange[key];
      if (!newSize || newSize === item.selectedSize) return; // Skip if no size selected or same size
      
      if (!this.isSizeInCart(item.id, newSize)) {
        // Change the size in cart while preserving quantity
        await this.changeSize(item, newSize);
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
    },
    getOriginalQuantity(item) {
      const cartItem = this.cartItems.find(i => i.id === item.id && i.selectedSize === item.selectedSize);
      return cartItem ? cartItem.quantity : 1;
    },
    async updateQuantity(item, newQuantity) {
      try {
        if (newQuantity < 1) return;
        
        await this.$store.dispatch('cart/updateCartItemQuantity', {
          id: item.id,
          selectedSize: item.selectedSize,
          quantity: newQuantity
        });
      } catch (error) {
        if (error.message.includes('Unauthenticated users')) {
          // Reset the quantity input to previous value
          this.$nextTick(() => {
            item.quantity = this.getOriginalQuantity(item);
          });
          // Show error message
          this.errorMessage = 'Please register to add more than 10 items to cart';
          this.snackbarColor = 'error';
          this.showError = true;
        }
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
  border-radius: 6px;
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
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.cart-header h1 {
  margin: 0;
  font-weight: 500;
  color: #1f2937;
}

.cart-count {
  color: #64748b;
  font-size: 0.875rem;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.cart-item .item-image {
  width: 200px;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
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

.restore-button, .remove-button {
  background-color: transparent;
  color: #64748b;
  padding: 4px 12px;
  border: none;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin: 0.5rem 0;
  border-radius: 9999px;
}

.restore-text, .remove-text {
  position: relative;
  z-index: 1;
  transition: color 0.2s ease;
}

.restore-underline, .remove-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  transition: all 0.2s ease;
  transform-origin: left;
  opacity: 0.2;
  border-radius: 9999px;
}

.restore-underline {
  background-color: #10b981;
}

.remove-underline {
  background-color: #ef4444;
}

.restore-button:hover .restore-text {
  color: #059669;
}

.remove-button:hover .remove-text {
  color: #dc2626;
}

.restore-button:hover .restore-underline {
  height: 100%;
  background-color: #10b981;
  opacity: 0.1;
}

.remove-button:hover .remove-underline {
  height: 100%;
  background-color: #ef4444;
  opacity: 0.1;
}

.restore-button:active .restore-underline {
  background-color: #059669;
  opacity: 0.15;
}

.remove-button:active .remove-underline {
  background-color: #dc2626;
  opacity: 0.15;
}

.change-size-select {
  appearance: none;
  background-color: transparent;
  color: #64748b;
  padding: 4px 12px;
  border: none;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  position: relative;
  margin: 0.5rem 0;
  border-radius: 9999px;
  transition: all 0.2s ease;
  padding-right: 32px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
}

.change-size-select:hover {
  color: #334155;
  background-color: #f8fafc;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23334155' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
}

.change-size-select:focus {
  outline: none;
  background-color: #f1f5f9;
}

.change-size-select option {
  color: #334155;
  background-color: white;
  font-weight: 500;
}

.change-size-select option:disabled {
  color: #94a3b8;
}

.add-size-select {
  appearance: none;
  background-color: transparent;
  color: #64748b;
  padding: 4px 12px;
  border: none;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  position: relative;
  margin: 0.5rem 0;
  border-radius: 9999px;
  transition: all 0.2s ease;
  padding-right: 32px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
}

.add-size-select:hover {
  color: #334155;
  background-color: #f8fafc;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23334155' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
}

.add-size-select:focus {
  outline: none;
  background-color: #f1f5f9;
}

.add-size-select option {
  color: #334155;
  background-color: white;
  font-weight: 500;
}

.add-size-select option:disabled {
  color: #94a3b8;
}

.removed-section {
  margin-top: 2rem;
  padding: 1.5rem;
  border: 2px dashed rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 12px;
  background: rgba(var(--v-theme-surface), 0.4);
}

.removed-section h3 {
  font-size: 1.25rem;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.87);
  margin-bottom: 1rem;
}

.removed-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.removed-item {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  width: 100%;
}

.removed-item-content {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.product-info {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  min-width: 300px;
  position: relative;
}

.removed-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.product-card {
  z-index: 2;
  transform: translateX(0) translateZ(10px);
  position: relative;
  overflow: hidden;
  border-radius: 4px;
}

.product-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0.75rem;
  display: flex;
  align-items: flex-start;
}

.product-overlay h4 {
  color: gray;
  margin: 0;
  font-size: 0.875rem;
  font-weight: 400;
  text-align: left;
  line-height: 0.1em;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  backdrop-filter: blur(4px);
}

.removed-sizes {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
}

.removed-item {
  margin-bottom: 1.5rem;
}

.removed-size-item {
  position: relative;
  width: 140px;
  height: 140px;
  margin-right: 1rem;
  perspective: 1000px;
}

.removed-item-stack {
  position: relative;
  width: 140px;
  height: 140px;
  transform-style: preserve-3d;
}

.product-card,
.size-card {
  position: absolute;
  top: 0;
  left: 0;
  width: 140px;
  height: 140px;
  border-radius: 4px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  backface-visibility: visible;
}

.product-card {
  transform: translateX(0) translateZ(10px);
  z-index: 2;
}

.size-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  transform: translateX(0) translateZ(-10px);
  z-index: 1;
}

.removed-size-item.splitting:not(.isRestacking) .product-card {
  transform: translateX(-80px) rotate(-5deg) translateZ(10px);
  z-index: 2;
}

.removed-size-item.splitting:not(.isRestacking) .size-card {
  transform: translateX(80px) rotate(5deg) translateZ(-10px);
  z-index: 1;
}

.removed-size-item.splitting.isRestacking .product-card {
  transform: translateX(0) translateZ(-10px);
  z-index: 1;
}

.removed-size-item.splitting.isRestacking .size-card {
  transform: translateX(0) translateZ(10px);
  z-index: 2;
}

.removed-size-item.switched:not(.splitting) .product-card {
  transform: translateX(0) translateZ(-10px);
  z-index: 1;
}

.removed-size-item.switched:not(.splitting) .size-card {
  transform: translateX(0) translateZ(10px);
  z-index: 2;
}

.size-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.size-info .text-caption {
  opacity: 0.7;
  margin-bottom: -0.25rem;
  font-size: 0.75rem;
}

.size-info .text-h5 {
  line-height: 1;
  margin: 0;
  font-size: 1.25rem;
}

.restore-button {
  background-color: transparent;
  color: #64748b;
  padding: 4px 12px;
  border: none;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin: 0.5rem 0;
  border-radius: 9999px;
}

.restore-text {
  position: relative;
  z-index: 1;
  transition: color 0.2s ease;
}

.restore-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #10b981;
  transition: all 0.2s ease;
  transform-origin: left;
  opacity: 0.2;
  border-radius: 9999px;
}

.restore-button:hover .restore-text {
  color: #059669;
}

.restore-button:hover .restore-underline {
  height: 100%;
  background-color: #10b981;
  opacity: 0.1;
}

.restore-button:active .restore-underline {
  background-color: #059669;
  opacity: 0.15;
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

.register-prompt {
  font-size: 0.875rem;
  color: #6b7280;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.register-prompt::after {
  content: '→';
  font-size: 1rem;
  transition: transform 0.2s ease;
}

.register-prompt:hover {
  color: #10b981;
  background-color: #f0fdf4;
}

.register-prompt:hover::after {
  transform: translateX(2px);
}

.register-prompt:active {
  background-color: #ecfdf5;
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