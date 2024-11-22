export default {
    namespaced: true,
    state: {
      items: [],
      totalPrice: 0,
      removedItems: [], 
    },
    mutations: {
      addToCart(state, product) {
        const item = state.items.find((item) => item.id === product.id);
        if (item) {
          item.quantity += 1;
        } else {
          state.items.push({ ...product, quantity: 1 });
        }
        state.totalPrice = Number((state.totalPrice + product.price).toFixed(2));
      },
      softDeleteFromCart(state, productId) {
        const itemIndex = state.items.findIndex((item) => item.id === productId);
        if (itemIndex !== -1) {
          const removedItem = state.items[itemIndex];
          state.totalPrice = Number((state.totalPrice - removedItem.price * removedItem.quantity).toFixed(2));
          // Ensure totalPrice never goes below 0
          state.totalPrice = Math.max(0, state.totalPrice);
          state.items.splice(itemIndex, 1);
          state.removedItems.push(removedItem);
        }
      },
      restoreToCart(state, productId) {
        const removedItemIndex = state.removedItems.findIndex((item) => item.id === productId);
        if (removedItemIndex !== -1) {
          const restoredItem = state.removedItems[removedItemIndex];
          state.items.push(restoredItem);
          state.totalPrice = Number((state.totalPrice + restoredItem.price * restoredItem.quantity).toFixed(2));
        }
      },
      removeFromRemoved(state, productId) {
        const removedItemIndex = state.removedItems.findIndex((item) => item.id === productId);
        if (removedItemIndex !== -1) {
          state.removedItems.splice(removedItemIndex, 1);
        }
      },
      clearCart(state) {
        state.items = [];
        state.removedItems = [];
        state.totalPrice = 0;
      },
      updateCartItemQuantity(state, { id, quantity }) {
        const item = state.items.find((item) => item.id === id);
        if (item) {
          state.totalPrice = Number((state.totalPrice + (quantity - item.quantity) * item.price).toFixed(2));
          item.quantity = quantity;
        }
      },
    },
    actions: {
      addToCart({ commit }, product) {
        commit('addToCart', product);
      },
      softDeleteFromCart({ commit }, productId) {
        commit('softDeleteFromCart', productId);
      },
      restoreToCart({ commit }, productId) {
        commit('restoreToCart', productId);
      },
      removeFromRemoved({ commit }, productId) {
        commit('removeFromRemoved', productId);
      },
      clearCart({ commit }) {
        commit('clearCart');
      },
      updateCartItemQuantity({ commit }, payload) {
        commit('updateCartItemQuantity', payload);
      },
    },
    getters: {
      cartItems: (state) => state.items,
      cartTotal: (state) => Math.max(0, state.totalPrice),
      removedItems: (state) => state.removedItems,
    },
  };
