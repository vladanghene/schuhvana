export default {
    namespaced: true,
    state: {
      items: [],
      totalPrice: 0,
    },
    mutations: {
      addToCart(state, product) {
        const item = state.items.find((item) => item.id === product.id);
        if (item) {
          item.quantity += 1;
        } else {
          state.items.push({ ...product, quantity: 1 });
        }
        state.totalPrice += product.price;
      },
      removeFromCart(state, productId) {
        const itemIndex = state.items.findIndex((item) => item.id === productId);
        if (itemIndex !== -1) {
          state.totalPrice -= state.items[itemIndex].price * state.items[itemIndex].quantity;
          state.items.splice(itemIndex, 1);
        }
      },
      clearCart(state) {
        state.items = [];
        state.totalPrice = 0;
      },
    },
    actions: {
      addToCart({ commit }, product) {
        commit('addToCart', product);
      },
      removeFromCart({ commit }, productId) {
        commit('removeFromCart', productId);
      },
      clearCart({ commit }) {
        commit('clearCart');
      },
    },
    getters: {
      cartItems: (state) => state.items,
      cartTotal: (state) => state.totalPrice,
    },
  };