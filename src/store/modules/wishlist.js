export default {
    namespaced: true,
    state: {
      wishlistItems: [],
    },
    mutations: {
      addToWishlist(state, product) {
        const exists = state.wishlistItems.find((item) => item.id === product.id);
        if (!exists) {
          state.wishlistItems.push(product);
        }
      },
      removeFromWishlist(state, productId) {
        state.wishlistItems = state.wishlistItems.filter((item) => item.id !== productId);
      },
    },
    actions: {
      addToWishlist({ commit }, product) {
        commit('addToWishlist', product);
      },
      removeFromWishlist({ commit }, productId) {
        commit('removeFromWishlist', productId);
      },
    },
    getters: {
      wishlistItems: (state) => state.wishlistItems,
    },
  };