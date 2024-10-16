export default {
    namespaced: true,
    state: {
      reviews: [],
    },
    mutations: {
      addReview(state, review) {
        state.reviews.push(review);
      },
      setReviews(state, reviews) {
        state.reviews = reviews;
      },
    },
    actions: {
      fetchReviews({ commit }, productId) {
        // Mock API call to get reviews for a product
        const reviews = [
          { id: 1, productId, rating: 5, text: 'Great shoes!' },
          { id: 2, productId, rating: 4, text: 'Very comfortable.' },
        ];
        commit('setReviews', reviews);
      },
      addReview({ commit }, review) {
        commit('addReview', review);
      },
    },
    getters: {
      getReviewsByProductId: (state) => (productId) =>
        state.reviews.filter((review) => review.productId === productId),
    },
  };