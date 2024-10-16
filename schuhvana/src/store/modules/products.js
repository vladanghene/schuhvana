export default {
    namespaced: true,
    state: {
      productList: [],
    },
    mutations: {
      setProducts(state, products) {
        state.productList = products;
      },
    },
    actions: {
      fetchProducts({ commit }) {
        // Mock API call to get products
        const products = [
          { id: 1, name: 'Nike Air Max', price: 120, brand: 'Nike' },
          { id: 2, name: 'Adidas Ultraboost', price: 140, brand: 'Adidas' },
          { id: 3, name: 'Puma RS-X', price: 110, brand: 'Puma' },
        ];
        commit('setProducts', products);
      },
    },
    getters: {
      allProducts: (state) => state.productList,
      getProductById: (state) => (id) => state.productList.find((product) => product.id === id),
    },
  };