export default {
    namespaced: true,
    state: {
      query: '',
      searchResults: [],
    },
    mutations: {
      setSearchQuery(state, query) {
        state.query = query;
      },
      setSearchResults(state, results) {
        state.searchResults = results;
      },
    },
    actions: {
      performSearch({ commit }, query) {
        commit('setSearchQuery', query);
        
        // Mock API call to search products
        const results = [
          { id: 1, name: 'Nike Air Max', price: 120 },
          { id: 2, name: 'Adidas Ultraboost', price: 140 },
        ];
        
        commit('setSearchResults', results);
      },
    },
    getters: {
      searchResults: (state) => state.searchResults,
    },
  };