export default {
  namespaced: true,
  state: {
    products: [],
    product: null,
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
    setProduct(state, product) {
      state.product = product;
    }
  },
  actions: {
    initializeProducts({ commit }) {
      try {
        const products = [
          { 
            id: 1, 
            name: 'Nike Air Max 90', 
            categories: ['discover-classics', 'running'],
            image: 'products/nike/air-max-90/airmax-1.jpg',
            images: [
              'products/nike/air-max-90/airmax-1.jpg',
              'products/nike/air-max-90/airmax-2.jpg',
              'products/nike/air-max-90/airmax-3.jpg',
              'products/nike/air-max-90/airmax-4.jpg',
              'products/nike/air-max-90/airmax-5.jpg',
              'products/nike/air-max-90/airmax-7.jpg',
              'products/nike/air-max-90/airmax-8.jpg',
              'products/nike/air-max-90/airmax-10.jpg'
            ],
            price: 129.99,
            description: 'The Nike Air Max 90 stays true to its OG running roots with the iconic Waffle outsole, stitched overlays and classic TPU accents. Fresh colors give a modern look while Max Air cushioning adds comfort to your journey.',
            sizes: [7, 8, 9, 10, 11],
            material: 'Leather and synthetic upper',
            style: 'Classic'
          },
          { 
            id: 2, 
            name: 'Air Force 1', 
            categories: ['discover-classics'],
            image: 'products/nike/air-force-1/af1-1.jpg',
            images: [
              'products/nike/air-force-1/af1-1.jpg',
              'products/nike/air-force-1/af1-2.jpg',
              'products/nike/air-force-1/af1-3.jpg',
              'products/nike/air-force-1/af1-4.jpg',
              'products/nike/air-force-1/af1-5.jpg',
              'products/nike/air-force-1/af1-6.jpg',
              'products/nike/air-force-1/af1-7.jpg',
              'products/nike/air-force-1/af1-8.jpg',
              'products/nike/air-force-1/af1-9.jpg',
              'products/nike/air-force-1/af1-10.jpg'
            ],
            price: 99.99,
            description: 'The iconic Air Force 1, a timeless classic that never goes out of style.',
            sizes: [6, 7, 8, 9, 10, 11]
          },
          { 
            id: 3, 
            name: 'Dunk', 
            categories: ['discover-classics'],
            image: 'products/nike/dunk/dunk-1.jpg',
            images: [
              'products/nike/dunk/dunk-1.jpg',
              'products/nike/dunk/dunk-2.jpg',
              'products/nike/dunk/dunk-3.jpg',
              'products/nike/dunk/dunk-4.jpg',
              'products/nike/dunk/dunk-5.jpg',
              'products/nike/dunk/dunk-6.jpg',
              'products/nike/dunk/dunk-7.jpg',
              'products/nike/dunk/dunk-8.jpg',
              'products/nike/dunk/dunk-9.jpg',
              'products/nike/dunk/dunk-10.jpg'
            ],
            price: 109.99,
            description: 'Originally made for the hardwood, the Nike Dunk has become a streetwear icon.',
            sizes: [7, 8, 9, 10]
          },
          { 
            id: 4, 
            name: 'Nike ZoomX Vaporfly', 
            categories: ['running'],
            image: 'products/nike/vaporfly/vaporfly-1.jpg',
            images: [
              'products/nike/vaporfly/vaporfly-1.jpg',
              'products/nike/vaporfly/vaporfly-2.jpg',
              'products/nike/vaporfly/vaporfly-3.jpg',
              'products/nike/vaporfly/vaporfly-4.jpg',
              'products/nike/vaporfly/vaporfly-5.jpg',
              'products/nike/vaporfly/vaporfly-6.jpg',
              'products/nike/vaporfly/vaporfly-7.jpg',
              'products/nike/vaporfly/vaporfly-8.jpg',
              'products/nike/vaporfly/vaporfly-9.jpg',
              'products/nike/vaporfly/vaporfly-10.jpg'
            ],
            price: 149.99,
            description: 'High-performance running shoes designed for comfort and speed. Features ZoomX foam and a full-length carbon fiber plate for exceptional energy return.',
            sizes: [7, 8, 9, 10, 11]
          },
          { 
            id: 5, 
            name: 'Nike Phantom GX Elite', 
            categories: ['football'],
            image: 'products/nike/phantom/phantom-1.jpg',
            images: [
              'products/nike/phantom/phantom-1.jpg',
              'products/nike/phantom/phantom-2.jpg',
              'products/nike/phantom/phantom-3.jpg',
              'products/nike/phantom/phantom-4.jpg',
              'products/nike/phantom/phantom-5.jpg',
              'products/nike/phantom/phantom-6.jpg',
              'products/nike/phantom/phantom-7.jpg',
              'products/nike/phantom/phantom-8.jpg',
              'products/nike/phantom/phantom-9.jpg',
              'products/nike/phantom/phantom-10.jpg'
            ],
            price: 159.99,
            description: 'Professional-grade football boots with innovative studs and enhanced touch control for optimal performance on the field.',
            sizes: [6, 7, 8, 9, 10]
          },
          { 
            id: 6, 
            name: 'Nike LeBron XX', 
            categories: ['basketball'],
            image: 'products/nike/lebron/lebron-1.jpg',
            images: [
              'products/nike/lebron/lebron-1.jpg',
              'products/nike/lebron/lebron-2.jpg',
              'products/nike/lebron/lebron-3.jpg',
              'products/nike/lebron/lebron-4.jpg',
              'products/nike/lebron/lebron-5.jpg',
              'products/nike/lebron/lebron-6.jpg',
              'products/nike/lebron/lebron-7.jpg',
              'products/nike/lebron/lebron-8.jpg',
              'products/nike/lebron/lebron-9.jpg',
              'products/nike/lebron/lebron-10.jpg'
            ],
            price: 169.99,
            description: 'Basketball shoes engineered for explosive performance on the court, featuring Zoom Air units and durable traction pattern.',
            sizes: [8, 9, 10, 11, 12]
          }
        ];
        commit('setProducts', products);
      } catch (error) {
        console.error('Error initializing products:', error);
        throw error;
      }
    },
    async fetchProductById({ commit, state }, id) {
      try {
        const existingProduct = state.products.find(product => product.id === parseInt(id));
        if (existingProduct) {
          commit('setProduct', existingProduct);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
      }
    }
  },
  getters: {
    allProducts: state => state.products,
    product: state => state.product,
    getProductById: state => id => state.products.find(product => product.id === id)
  }
};