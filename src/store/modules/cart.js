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
          item.quantity += 1;
        } else {
          // If not found, add as new item
          state.items.push({ ...product, quantity: 1 });
        }
        
        state.totalPrice = Number((state.totalPrice + product.price).toFixed(2));
      },
      softDeleteFromCart(state, { id, selectedSize }) {
        const itemIndex = state.items.findIndex(
          (item) => item.id === id && item.selectedSize === selectedSize
        );
        
        if (itemIndex !== -1) {
          const removedItem = { 
            ...state.items[itemIndex],
            removedAt: Date.now() // Add timestamp when item is removed
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
          } else {
            // If it's new, add it to removedItems
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
      // Add new mutation to remove expired items
      removeExpiredItems(state) {
        const now = Date.now();
        const EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
        state.removedItems = state.removedItems.filter(item => {
          return now - item.removedAt < EXPIRY_TIME;
        });
      },
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
      checkExpiredItems({ commit }) {
        commit('removeExpiredItems');
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
      }
    }
  };
