export default {
  namespaced: true,
  state: {
    items: [],
    totalPrice: 0,
    removedItems: [], 
  },
  mutations: {
    addToCart(state, product) {
      // Find item with same ID AND size
      const item = state.items.find(
        (item) => item.id === product.id && item.selectedSize === product.selectedSize
      );
      
      if (item) {
        // If exact same product and size exists, increment quantity
        item.quantity += product.quantity || 1;
      } else {
        // If not found, add as new item with specified quantity or default to 1
        state.items.push({ 
          ...product, 
          quantity: product.quantity || 1 
        });
      }
      
      state.totalPrice = Number((state.totalPrice + (product.price * (product.quantity || 1))).toFixed(2));
    },
    softDeleteFromCart(state, { id, selectedSize }) {
      const itemIndex = state.items.findIndex(
        (item) => item.id === id && item.selectedSize === selectedSize
      );
      
      if (itemIndex !== -1) {
        const EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
        const now = Date.now();
        const removedItem = { 
          ...state.items[itemIndex],
          removedAt: now,
          expiryTime: now + EXPIRY_TIME
        };
        state.totalPrice = Number((state.totalPrice - removedItem.price * removedItem.quantity).toFixed(2));
        // Ensure totalPrice never goes below 0
        state.totalPrice = Math.max(0, state.totalPrice);
        state.items.splice(itemIndex, 1);
        
        // Check if this item was previously removed
        const existingRemovedIndex = state.removedItems.findIndex(
          item => item.id === id && item.selectedSize === selectedSize
        );
        
        if (existingRemovedIndex !== -1) {
          // If it exists, update its timestamp
          state.removedItems[existingRemovedIndex].removedAt = removedItem.removedAt;
          state.removedItems[existingRemovedIndex].expiryTime = removedItem.expiryTime;
        } else {
          // If not, add it to removedItems
          state.removedItems.push(removedItem);
        }
      }
    },
    restoreToCart(state, { id, selectedSize }) {
      const removedItemIndex = state.removedItems.findIndex(
        (item) => item.id === id && item.selectedSize === selectedSize
      );
      
      if (removedItemIndex !== -1) {
        const restoredItem = { ...state.removedItems[removedItemIndex] };
        delete restoredItem.removedAt; // Remove the timestamp
        delete restoredItem.isRestoring; // Remove the restoring flag
        state.items.push(restoredItem);
        state.totalPrice = Number((state.totalPrice + restoredItem.price * restoredItem.quantity).toFixed(2));
      }
    },
    removeFromRemoved(state, { id, selectedSize }) {
      const removedItemIndex = state.removedItems.findIndex(
        (item) => item.id === id && item.selectedSize === selectedSize
      );
      
      if (removedItemIndex !== -1) {
        state.removedItems.splice(removedItemIndex, 1);
      }
    },
    clearCart(state) {
      state.items = [];
      state.removedItems = [];
      state.totalPrice = 0;
    },
    updateCartItemQuantity(state, { id, selectedSize, quantity }) {
      const item = state.items.find(
        (item) => item.id === id && item.selectedSize === selectedSize
      );
      
      if (item) {
        state.totalPrice = Number((state.totalPrice + (quantity - item.quantity) * item.price).toFixed(2));
        item.quantity = quantity;
      }
    },
    changeCartItemSize(state, { id, oldSize, newSize }) {
      const itemIndex = state.items.findIndex(
        (item) => item.id === id && item.selectedSize === oldSize
      );
      
      if (itemIndex !== -1) {
        state.items[itemIndex].selectedSize = newSize;
      }
    },
    // Add new mutation to remove expired items
    removeExpiredItems(state) {
      const now = Date.now();
      const EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
      state.removedItems = state.removedItems.filter(item => {
        return now - item.removedAt < EXPIRY_TIME;
      });
    },
    addItem(state, item) {
      state.items.push(item);
    },
    removeItem(state, itemId) {
      state.items = state.items.filter(item => item.id !== itemId);
    },
    clearCartSimple(state) {
      state.items = [];
    }
  },
  actions: {
    addToCart({ commit }, product) {
      commit('addToCart', product);
    },
    addItemToCart({ commit, rootGetters }, { id, selectedSize, quantity }) {
      // Get product from products store
      const product = rootGetters['products/getProductById'](id);
      if (product) {
        commit('addToCart', {
          ...product,
          selectedSize,
          quantity
        });
      }
    },
    softDeleteFromCart({ commit }, { id, selectedSize }) {
      commit('softDeleteFromCart', { id, selectedSize });
    },
    restoreToCart({ commit }, { id, selectedSize }) {
      commit('restoreToCart', { id, selectedSize });
    },
    removeFromRemoved({ commit }, { id, selectedSize }) {
      commit('removeFromRemoved', { id, selectedSize });
    },
    clearCart({ commit }) {
      commit('clearCart');
    },
    updateCartItemQuantity({ commit }, { id, selectedSize, quantity }) {
      commit('updateCartItemQuantity', { id, selectedSize, quantity });
    },
    async changeCartItemSize({ commit, state }, { id, oldSize, newSize, quantity }) {
      // Find the item to be changed
      const itemIndex = state.items.findIndex(
        (item) => item.id === id && item.selectedSize === oldSize
      );
      
      if (itemIndex !== -1) {
        const item = { ...state.items[itemIndex] };
        
        // Remove the old size
        commit('softDeleteFromCart', { id, selectedSize: oldSize });
        
        // Add the new size immediately with preserved quantity
        commit('addToCart', { 
          ...item, 
          selectedSize: newSize,
          quantity: quantity || item.quantity // Use passed quantity or preserve existing
        });
      }
    },
    checkExpiredItems({ commit }) {
      commit('removeExpiredItems');
    },
    addToCartSimple({ commit }, item) {
      commit('addItem', item);
    },
    removeFromCartSimple({ commit }, itemId) {
      commit('removeItem', itemId);
    },
    clearCartSimple({ commit }) {
      commit('clearCartSimple');
    }
  },
  getters: {
    cartItems(state) {
      return state.items;
    },
    cartTotal(state) {
      return state.totalPrice;
    },
    removedItems(state) {
      const now = Date.now();
      const EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
      return state.removedItems.filter(item => {
        return now - item.removedAt < EXPIRY_TIME;
      });
    },
    // Add new getter to check if a specific size is in cart
    isSizeInCart: (state) => (productId, size) => {
      return state.items.some(item => item.id === productId && item.selectedSize === size);
    },
    itemCount: state => state.items.length,
    cartTotalSimple: state => state.items.reduce((total, item) => total + item.price, 0),
    cartItemsSimple: state => state.items
  }
};
