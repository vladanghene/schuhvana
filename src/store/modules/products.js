export default {
  namespaced: true,
  state: {
    products: [],
    product: null,
    standardSizes: {
      "men-regular": {
        sizes: {
          US: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
          UK: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
          EU: [40, 40.5, 41, 42, 42.5, 43, 44, 44.5, 45, 45.5, 46],
          CM: [25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30],
          IN: [9.8, 10, 10.2, 10.4, 10.6, 10.8, 11, 11.2, 11.4, 11.6, 11.8]
        },
        sizeConversions: {
          "EU-40": { US: "7", UK: "6", CM: "25", IN: "9.8" },
          "EU-40.5": { US: "7.5", UK: "6.5", CM: "25.5", IN: "10" },
          "EU-41": { US: "8", UK: "7", CM: "26", IN: "10.2" },
          "EU-42": { US: "8.5", UK: "7.5", CM: "26.5", IN: "10.4" },
          "EU-42.5": { US: "9", UK: "8", CM: "27", IN: "10.6" },
          "EU-43": { US: "9.5", UK: "8.5", CM: "27.5", IN: "10.8" },
          "EU-44": { US: "10", UK: "9", CM: "28", IN: "11" },
          "EU-44.5": { US: "10.5", UK: "9.5", CM: "28.5", IN: "11.2" },
          "EU-45": { US: "11", UK: "10", CM: "29", IN: "11.4" },
          "EU-45.5": { US: "11.5", UK: "10.5", CM: "29.5", IN: "11.6" },
          "EU-46": { US: "12", UK: "11", CM: "30", IN: "11.8" }
        }
      },
      "men-small": {
        sizes: {
          US: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
          UK: [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10],
          EU: [38, 38.5, 39, 40, 40.5, 41, 42, 42.5, 43, 44, 44.5],
          CM: [24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29],
          IN: [9.4, 9.6, 9.8, 10, 10.2, 10.4, 10.6, 10.8, 11, 11.2, 11.4]
        },
        sizeConversions: {
          "EU-38": { US: "6", UK: "5", CM: "24", IN: "9.4" },
          "EU-38.5": { US: "6.5", UK: "5.5", CM: "24.5", IN: "9.6" },
          "EU-39": { US: "7", UK: "6", CM: "25", IN: "9.8" },
          "EU-40": { US: "7.5", UK: "6.5", CM: "25.5", IN: "10" },
          "EU-40.5": { US: "8", UK: "7", CM: "26", IN: "10.2" },
          "EU-41": { US: "8.5", UK: "7.5", CM: "26.5", IN: "10.4" },
          "EU-42": { US: "9", UK: "8", CM: "27", IN: "10.6" },
          "EU-42.5": { US: "9.5", UK: "8.5", CM: "27.5", IN: "10.8" },
          "EU-43": { US: "10", UK: "9", CM: "28", IN: "11" },
          "EU-44": { US: "10.5", UK: "9.5", CM: "28.5", IN: "11.2" },
          "EU-44.5": { US: "11", UK: "10", CM: "29", IN: "11.4" }
        }
      },
      "women-regular": {
        sizes: {
          US: [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
          UK: [2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5],
          EU: [35, 35.5, 36, 37, 37.5, 38, 38.5, 39, 40, 40.5, 41, 42, 42.5],
          CM: [22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28],
          IN: [8.7, 8.9, 9.1, 9.3, 9.4, 9.6, 9.8, 10, 10.2, 10.4, 10.6, 10.8, 11]
        },
        sizeConversions: {
          "EU-35": { US: "5", UK: "2.5", CM: "22", IN: "8.7" },
          "EU-35.5": { US: "5.5", UK: "3", CM: "22.5", IN: "8.9" },
          "EU-36": { US: "6", UK: "3.5", CM: "23", IN: "9.1" },
          "EU-37": { US: "6.5", UK: "4", CM: "23.5", IN: "9.3" },
          "EU-37.5": { US: "7", UK: "4.5", CM: "24", IN: "9.4" },
          "EU-38": { US: "7.5", UK: "5", CM: "24.5", IN: "9.6" },
          "EU-38.5": { US: "8", UK: "5.5", CM: "25", IN: "9.8" },
          "EU-39": { US: "8.5", UK: "6", CM: "25.5", IN: "10" },
          "EU-40": { US: "9", UK: "6.5", CM: "26", IN: "10.2" },
          "EU-40.5": { US: "9.5", UK: "7", CM: "26.5", IN: "10.4" },
          "EU-41": { US: "10", UK: "7.5", CM: "27", IN: "10.6" },
          "EU-42": { US: "10.5", UK: "8", CM: "27.5", IN: "10.8" },
          "EU-42.5": { US: "11", UK: "8.5", CM: "28", IN: "11" }
        }
      },
      "women-small": {
        sizes: {
          US: [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9],
          UK: [1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5],
          EU: [33.5, 34, 35, 35.5, 36, 37, 37.5, 38, 38.5, 39, 40],
          CM: [21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26],
          IN: [8.3, 8.5, 8.7, 8.9, 9.1, 9.3, 9.4, 9.6, 9.8, 10, 10.2]
        },
        sizeConversions: {
          "EU-33.5": { US: "4", UK: "1.5", CM: "21", IN: "8.3" },
          "EU-34": { US: "4.5", UK: "2", CM: "21.5", IN: "8.5" },
          "EU-35": { US: "5", UK: "2.5", CM: "22", IN: "8.7" },
          "EU-35.5": { US: "5.5", UK: "3", CM: "22.5", IN: "8.9" },
          "EU-36": { US: "6", UK: "3.5", CM: "23", IN: "9.1" },
          "EU-37": { US: "6.5", UK: "4", CM: "23.5", IN: "9.3" },
          "EU-37.5": { US: "7", UK: "4.5", CM: "24", IN: "9.4" },
          "EU-38": { US: "7.5", UK: "5", CM: "24.5", IN: "9.6" },
          "EU-38.5": { US: "8", UK: "5.5", CM: "25", IN: "9.8" },
          "EU-39": { US: "8.5", UK: "6", CM: "25.5", IN: "10" },
          "EU-40": { US: "9", UK: "6.5", CM: "26", IN: "10.2" }
        }
      }
    }
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
            brand: 'Nike',
            model: 'Air Max 90',
            sizeType: 'men-regular',
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
            brand: 'Nike',
            model: 'Air Force 1',
            sizeType: 'men-small',
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
            brand: 'Nike',
            model: 'Dunk',
            sizeType: 'men-regular',
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
            brand: 'Nike',
            model: 'ZoomX Vaporfly',
            sizeType: 'men-regular',
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
            brand: 'Nike',
            model: 'Phantom GX Elite',
            sizeType: 'men-small',
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
            brand: 'Nike',
            model: 'LeBron XX',
            sizeType: 'men-regular',
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
    getProductById: (state) => (id) => {
      const product = state.products.find(p => p.id === parseInt(id));
      return product || {
        id: 0,
        name: 'Product Not Found',
        price: 0,
        description: 'This product could not be found.',
        material: 'N/A',
        style: 'N/A',
        category: 'men',
        small: false,
        images: ['/default-shoe.jpg'],
        sizeType: 'men-regular',  // Add default sizeType
        sizes: [],
        sizeConversions: {}
      };
    },
    getProductSizes: (state) => (product) => {
      if (!product) return {};
      return state.standardSizes[product.sizeType]?.sizes || {};
    },
    getProductSizeConversions: (state) => (product) => {
      if (!product) return {};
      return state.standardSizes[product.sizeType]?.sizeConversions || {};
    },
    getSizeInScale: (state) => (product, size, fromScale, toScale) => {
      if (!product || !size || !fromScale || !toScale) return null;
      
      const conversions = state.standardSizes[product.sizeType]?.sizeConversions;
      if (!conversions) return null;

      const key = `${fromScale}-${size}`;
      return conversions[key]?.[toScale] || null;
    },
    getAvailableScales: state => {
      return ['EU', 'US', 'UK', 'CM', 'IN'];
    },
    getSizeConversions: state => (size, product = state.product) => {
      try {
        if (!product?.sizeType) {
          return null;
        }
        
        const sizeData = state.standardSizes[product.sizeType];
        if (!sizeData?.sizeConversions) return null;

        // Step 1: Determine the source scale and normalize the size value
        let sourceScale = null;
        let normalizedSize = size;
        const sizeNum = Number(size);

        for (const [scale, sizes] of Object.entries(sizeData.sizes)) {
          switch (scale) {
            // Numeric scales: EU, CM, IN
            case 'EU':
            case 'CM':
            case 'IN':
              if (sizes.includes(sizeNum)) {
                sourceScale = scale;
                normalizedSize = sizeNum;
              }
              break;
            // String scales: US, UK
            case 'US':
            case 'UK':
              if (sizes.includes(sizeNum) || sizes.includes(Number(size))) {
                sourceScale = scale;
                normalizedSize = String(sizeNum || size);
              }
              break;
          }
          if (sourceScale) break;
        }

        if (!sourceScale) return null;

        // Step 2: Find the corresponding EU size (our reference scale)
        let euKey;
        if (sourceScale === 'EU') {
          // If already EU, use directly
          euKey = `EU-${normalizedSize}`;
        } else {
          // Otherwise, find the EU size that maps to our source size
          for (const [key, conversions] of Object.entries(sizeData.sizeConversions)) {
            if (conversions[sourceScale] === String(normalizedSize)) {
              euKey = key;
              break;
            }
          }
        }

        if (!euKey || !(euKey in sizeData.sizeConversions)) return null;

        // Step 3: Build the conversion map using EU as reference
        const euSize = Number(euKey.split('-')[1]);
        const numericScales = ['EU', 'CM', 'IN'];
        
        // Start with source and EU values
        const conversions = {
          [sourceScale]: numericScales.includes(sourceScale) ? Number(normalizedSize) : String(normalizedSize),
          'EU': euSize
        };
        
        // Add all other scale conversions
        const euConversions = sizeData.sizeConversions[euKey];
        for (const [scale, val] of Object.entries(euConversions)) {
          if (scale !== sourceScale) {
            conversions[scale] = numericScales.includes(scale) ? Number(val) : val;
          }
        }
        
        return conversions;
      } catch (error) {
        console.error('Error in getSizeConversions:', error);
        return null;
      }
    }
  }
};