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
            sizes: {
              US: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
              UK: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
              EU: [40, 40.5, 41, 42, 42.5, 43, 44, 44.5, 45, 45.5, 46],
              CM: [25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30],
              IN: [9.8, 10, 10.2, 10.4, 10.6, 10.8, 11, 11.2, 11.4, 11.6, 11.8]
            },
            sizeConversions: {
              "US-7": { UK: "6", EU: "40", CM: "25", IN: "9.8" },
              "US-7.5": { UK: "6.5", EU: "40.5", CM: "25.5", IN: "10" },
              "US-8": { UK: "7", EU: "41", CM: "26", IN: "10.2" },
              "US-8.5": { UK: "7.5", EU: "42", CM: "26.5", IN: "10.4" },
              "US-9": { UK: "8", EU: "42.5", CM: "27", IN: "10.6" },
              "US-9.5": { UK: "8.5", EU: "43", CM: "27.5", IN: "10.8" },
              "US-10": { UK: "9", EU: "44", CM: "28", IN: "11" },
              "US-10.5": { UK: "9.5", EU: "44.5", CM: "28.5", IN: "11.2" },
              "US-11": { UK: "10", EU: "45", CM: "29", IN: "11.4" },
              "US-11.5": { UK: "10.5", EU: "45.5", CM: "29.5", IN: "11.6" },
              "US-12": { UK: "11", EU: "46", CM: "30", IN: "11.8" }
            },
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
            sizes: {
              US: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
              UK: [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10],
              EU: [38, 38.5, 39, 40, 40.5, 41, 42, 42.5, 43, 44, 44.5],
              CM: [24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29],
              IN: [9.2, 9.4, 9.6, 9.8, 10, 10.2, 10.4, 10.6, 10.8, 11, 11.2]
            },
            sizeConversions: {
              "US-6": { UK: "5", EU: "38", CM: "24", IN: "9.2" },
              "US-6.5": { UK: "5.5", EU: "38.5", CM: "24.5", IN: "9.4" },
              "US-7": { UK: "6", EU: "39", CM: "25", IN: "9.6" },
              "US-7.5": { UK: "6.5", EU: "40", CM: "25.5", IN: "9.8" },
              "US-8": { UK: "7", EU: "40.5", CM: "26", IN: "10" },
              "US-8.5": { UK: "7.5", EU: "41", CM: "26.5", IN: "10.2" },
              "US-9": { UK: "8", EU: "42", CM: "27", IN: "10.4" },
              "US-9.5": { UK: "8.5", EU: "42.5", CM: "27.5", IN: "10.6" },
              "US-10": { UK: "9", EU: "43", CM: "28", IN: "10.8" },
              "US-10.5": { UK: "9.5", EU: "44", CM: "28.5", IN: "11" },
              "US-11": { UK: "10", EU: "44.5", CM: "29", IN: "11.2" }
            },
            material: 'Leather and synthetic upper',
            style: 'Classic'
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
            sizes: {
              US: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
              UK: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10],
              EU: [40, 40.5, 41, 42, 42.5, 43, 44, 44.5, 45],
              CM: [25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29],
              IN: [9.8, 10, 10.2, 10.4, 10.6, 10.8, 11, 11.2, 11.4]
            },
            sizeConversions: {
              "US-7": { UK: "6", EU: "40", CM: "25", IN: "9.8" },
              "US-7.5": { UK: "6.5", EU: "40.5", CM: "25.5", IN: "10" },
              "US-8": { UK: "7", EU: "41", CM: "26", IN: "10.2" },
              "US-8.5": { UK: "7.5", EU: "42", CM: "26.5", IN: "10.4" },
              "US-9": { UK: "8", EU: "42.5", CM: "27", IN: "10.6" },
              "US-9.5": { UK: "8.5", EU: "43", CM: "27.5", IN: "10.8" },
              "US-10": { UK: "9", EU: "44", CM: "28", IN: "11" },
              "US-10.5": { UK: "9.5", EU: "44.5", CM: "28.5", IN: "11.2" },
              "US-11": { UK: "10", EU: "45", CM: "29", IN: "11.4" }
            },
            material: 'Leather and synthetic upper',
            style: 'Classic'
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
            sizes: {
              US: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
              UK: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10],
              EU: [40, 40.5, 41, 42, 42.5, 43, 44, 44.5, 45],
              CM: [25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29],
              IN: [9.8, 10, 10.2, 10.4, 10.6, 10.8, 11, 11.2, 11.4]
            },
            sizeConversions: {
              "US-7": { UK: "6", EU: "40", CM: "25", IN: "9.8" },
              "US-7.5": { UK: "6.5", EU: "40.5", CM: "25.5", IN: "10" },
              "US-8": { UK: "7", EU: "41", CM: "26", IN: "10.2" },
              "US-8.5": { UK: "7.5", EU: "42", CM: "26.5", IN: "10.4" },
              "US-9": { UK: "8", EU: "42.5", CM: "27", IN: "10.6" },
              "US-9.5": { UK: "8.5", EU: "43", CM: "27.5", IN: "10.8" },
              "US-10": { UK: "9", EU: "44", CM: "28", IN: "11" },
              "US-10.5": { UK: "9.5", EU: "44.5", CM: "28.5", IN: "11.2" },
              "US-11": { UK: "10", EU: "45", CM: "29", IN: "11.4" }
            },
            material: 'Leather and synthetic upper',
            style: 'Classic'
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
            sizes: {
              US: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10],
              UK: [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9],
              EU: [38, 38.5, 39, 40, 40.5, 41, 42, 42.5, 43],
              CM: [24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28],
              IN: [9.2, 9.4, 9.6, 9.8, 10, 10.2, 10.4, 10.6, 10.8]
            },
            sizeConversions: {
              "US-6": { UK: "5", EU: "38", CM: "24", IN: "9.2" },
              "US-6.5": { UK: "5.5", EU: "38.5", CM: "24.5", IN: "9.4" },
              "US-7": { UK: "6", EU: "39", CM: "25", IN: "9.6" },
              "US-7.5": { UK: "6.5", EU: "40", CM: "25.5", IN: "9.8" },
              "US-8": { UK: "7", EU: "40.5", CM: "26", IN: "10" },
              "US-8.5": { UK: "7.5", EU: "41", CM: "26.5", IN: "10.2" },
              "US-9": { UK: "8", EU: "42", CM: "27", IN: "10.4" },
              "US-9.5": { UK: "8.5", EU: "42.5", CM: "27.5", IN: "10.6" },
              "US-10": { UK: "9", EU: "43", CM: "28", IN: "10.8" }
            },
            material: 'Leather and synthetic upper',
            style: 'Classic'
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
            sizes: {
              US: [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
              UK: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
              EU: [41, 41.5, 42, 42.5, 43, 44, 44.5, 45, 46],
              CM: [26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30],
              IN: [10, 10.2, 10.4, 10.6, 10.8, 11, 11.2, 11.4, 11.6]
            },
            sizeConversions: {
              "US-8": { UK: "7", EU: "41", CM: "26", IN: "10" },
              "US-8.5": { UK: "7.5", EU: "41.5", CM: "26.5", IN: "10.2" },
              "US-9": { UK: "8", EU: "42", CM: "27", IN: "10.4" },
              "US-9.5": { UK: "8.5", EU: "42.5", CM: "27.5", IN: "10.6" },
              "US-10": { UK: "9", EU: "43", CM: "28", IN: "10.8" },
              "US-10.5": { UK: "9.5", EU: "44", CM: "28.5", IN: "11" },
              "US-11": { UK: "10", EU: "44.5", CM: "29", IN: "11.2" },
              "US-11.5": { UK: "10.5", EU: "45", CM: "29.5", IN: "11.4" },
              "US-12": { UK: "11", EU: "46", CM: "30", IN: "11.6" }
            },
            material: 'Leather and synthetic upper',
            style: 'Classic'
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