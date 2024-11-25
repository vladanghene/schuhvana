export default {
  namespaced: true,
  state: {
    items: [],
    totalPrice: 0,
    removedItems: [], 
  },
  mutations: {
    addToCart(state, { product, isAuthenticated }) {
      const currentTotal = state.items.reduce((total, item) => total + (item.quantity || 1), 0);
      const newQuantity = product.quantity || 1;
      
      // Check if adding would exceed limit for unauthenticated users
      if (!isAuthenticated && (currentTotal + newQuantity) > 10) {
        throw new Error('Unauthenticated users cannot add more than 10 items');
      }
      
      // Find item with same ID AND size
      const item = state.items.find(
        (item) => item.id === product.id && item.selectedSize === product.selectedSize
      );
      
      if (item) {
        // If exact same product and size exists, check limit before incrementing
        if (!isAuthenticated && (currentTotal + newQuantity) > 10) {
          throw new Error('Unauthenticated users cannot add more than 10 items');
        }
        item.quantity += newQuantity;
      } else {
        // If not found, add as new item with specified quantity or default to 1
        state.items.push({ 
          ...product, 
          quantity: newQuantity 
        });
      }
      
      state.totalPrice = Number((state.totalPrice + (product.price * newQuantity)).toFixed(2));
    },
    softDeleteFromCart(state, { id, selectedSize, expiryTime }) {
      const itemIndex = state.items.findIndex(
        (item) => item.id === id && item.selectedSize === selectedSize
      );
      
      if (itemIndex !== -1) {
        const removedItem = { 
          ...state.items[itemIndex],
          removedAt: Date.now(),
          expiryTime: expiryTime
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
    restoreToCart(state, { id, selectedSize, quantity }) {
      const removedItemIndex = state.removedItems.findIndex(
        item => item.id === id && item.selectedSize === selectedSize
      );
      
      if (removedItemIndex !== -1) {
        const itemToRestore = { ...state.removedItems[removedItemIndex] };
        const restoredQuantity = quantity || itemToRestore.quantity || 1;
        
        // Add back to cart
        state.items.push({
          ...itemToRestore,
          quantity: restoredQuantity
        });
        
        // Update total price
        state.totalPrice = Number((state.totalPrice + itemToRestore.price * restoredQuantity).toFixed(2));
        
        // Remove from removed items
        state.removedItems.splice(removedItemIndex, 1);
      }
    },
    removeFromRemoved(state, { id, selectedSize }) {
      const removedItemIndex = state.removedItems.findIndex(
        item => item.id === id && item.selectedSize === selectedSize
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
    updateCartItemQuantity(state, { id, selectedSize, quantity, isAuthenticated }) {
      const item = state.items.find(
        (item) => item.id === id && item.selectedSize === selectedSize
      );
      
      if (item) {
        const currentTotal = state.items.reduce((total, currentItem) => {
          if (currentItem === item) return total; // Exclude current item from total
          return total + (currentItem.quantity || 1);
        }, 0);
        
        // Check if new quantity would exceed limit for unauthenticated users
        if (!isAuthenticated && (currentTotal + quantity) > 10) {
          throw new Error('Unauthenticated users cannot have more than 10 items');
        }
        
        const oldQuantity = item.quantity;
        item.quantity = quantity;
        
        // Update total price
        state.totalPrice = Number((state.totalPrice + (item.price * (quantity - oldQuantity))).toFixed(2));
      }
    },
    changeCartItemSize(state, { id, oldSize, newSize, quantity, isAuthenticated }) {
      const itemIndex = state.items.findIndex(
        (item) => item.id === id && item.selectedSize === oldSize
      );
      
      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        const currentQuantity = item.quantity || 1;
        
        // Check if this would exceed the limit for unauthenticated users
        if (!isAuthenticated) {
          const currentTotal = state.items.reduce((total, currentItem) => {
            if (currentItem === item) return total; // Exclude current item
            return total + (currentItem.quantity || 1);
          }, 0);
          
          if ((currentTotal + currentQuantity) > 10) {
            throw new Error('Unauthenticated users cannot have more than 10 items');
          }
        }
        
        // Create new item with new size
        const updatedItem = {
          ...item,
          selectedSize: newSize,
          quantity: quantity || currentQuantity
        };
        
        // Remove old item and add new one
        state.items.splice(itemIndex, 1);
        state.items.push(updatedItem);
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
    addToCart({ commit, rootGetters }, product) {
      try {
        const isAuthenticated = rootGetters['user/isAuthenticated'];
        commit('addToCart', { product, isAuthenticated });
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          error: error.message 
        };
      }
    },
    addItemToCart({ commit, rootState, rootGetters }, { id, selectedSize, quantity }) {
      const product = rootGetters['products/getProductById'](id);
      if (product) {
        try {
          const isAuthenticated = rootGetters['user/isAuthenticated'];
          commit('addToCart', { 
            product: {
              ...product,
              selectedSize,
              quantity
            }, 
            isAuthenticated 
          });
          return { success: true };
        } catch (error) {
          return { 
            success: false, 
            error: error.message 
          };
        }
      }
      return { success: false, error: 'Product not found' };
    },
    softDeleteFromCart({ commit, rootState }, { id, selectedSize }) {
      // Use a shorter expiry time for non-authenticated users
      const EXPIRY_TIME = rootState.user.isAuthenticated 
        ? 5 * 60 * 1000  // 5 minutes for authenticated users
        : 2 * 60 * 1000; // 2 minutes for non-authenticated users

      commit('softDeleteFromCart', { 
        id, 
        selectedSize,
        expiryTime: Date.now() + EXPIRY_TIME 
      });
    },
    restoreToCart({ commit, state, rootGetters }, { id, selectedSize }) {
      try {
        const isAuthenticated = rootGetters['user/isAuthenticated'];
        
        // Find the item to restore first
        const removedItem = state.removedItems.find(
          item => item.id === id && item.selectedSize === selectedSize
        );
        
        if (!removedItem) {
          return { 
            success: false, 
            error: 'Item not found in removed items' 
          };
        }
        
        const itemQuantity = removedItem.quantity || 1;
        
        if (!isAuthenticated) {
          const currentTotal = state.items.reduce((total, item) => total + (item.quantity || 1), 0);
          
          // Check if restoring would exceed limit
          if ((currentTotal + itemQuantity) > 10) {
            const availableSpace = Math.max(0, 10 - currentTotal);
            
            if (availableSpace === 0) {
              return {
                success: false,
                error: `Cannot restore items. Cart is at maximum capacity (10 items) for unregistered users.`
              };
            }
            
            // Restore what we can
            commit('restoreToCart', { 
              id, 
              selectedSize, 
              quantity: availableSpace 
            });
            
            return {
              success: true,
              message: `Only ${availableSpace} items restored due to cart limit. Register to add all ${itemQuantity} items.`
            };
          }
        }
        
        // Full restoration possible - always pass the original quantity
        commit('restoreToCart', { id, selectedSize, quantity: itemQuantity });
        return { success: true };
      } catch (error) {
        console.error('Error in restoreToCart:', error);
        return {
          success: false,
          error: 'Failed to restore item to cart'
        };
      }
    },
    removeFromRemoved({ commit }, { id, selectedSize }) {
      commit('removeFromRemoved', { id, selectedSize });
    },
    clearCart({ commit }) {
      commit('clearCart');
    },
    updateCartItemQuantity({ commit, rootGetters }, { id, selectedSize, quantity }) {
      const isAuthenticated = rootGetters['user/isAuthenticated'];
      commit('updateCartItemQuantity', { id, selectedSize, quantity, isAuthenticated });
    },
    async changeCartItemSize({ commit, state, rootGetters }, { id, oldSize, newSize, quantity }) {
      try {
        const isAuthenticated = rootGetters['user/isAuthenticated'];
        commit('changeCartItemSize', { 
          id, 
          oldSize, 
          newSize, 
          quantity,
          isAuthenticated 
        });
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    },
    checkExpiredItems({ commit }) {
      commit('removeExpiredItems');
    },
    addToCartSimple({ commit, rootState }, item) {
      if (!rootState.user.isAuthenticated) {
        console.warn('User must be logged in to perform cart operations');
        return;
      }
      commit('addItem', item);
    },
    removeFromCartSimple({ commit, rootState }, itemId) {
      if (!rootState.user.isAuthenticated) {
        console.warn('User must be logged in to perform cart operations');
        return;
      }
      commit('removeItem', itemId);
    },
    clearCartSimple({ commit, rootState }) {
      if (!rootState.user.isAuthenticated) {
        console.warn('User must be logged in to perform cart operations');
        return;
      }
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
    isSizeInCart: (state) => (productId, size) => {
      return state.items.some(item => item.id === productId && item.selectedSize === size);
    },
    itemCount: state => state.items.reduce((total, item) => total + (item.quantity || 1), 0),
    cartTotalSimple: state => state.items.reduce((total, item) => total + item.price, 0),
    cartItemsSimple: state => state.items
  }
};
