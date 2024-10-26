export default {
    namespaced: true,
    state: {
      productList: [],
      product: null,
    },
  mutations: {
    setProducts(state, products) {
      state.productList = products; // Set all products
    },
    // setProduct(state, product) {
    //   state.product = product; // Set the current product
    // },
    setProduct(state, product) {
      console.log('Setting product in state:', product); // Log the product being set
      state.product = product;
    }
  },
    actions: {
      async fetchProductById({ commit, state }, id) {
        try {

          console.log('Fetching product by ID:', id); // Log the product ID

        // Check if the product exists in the state
        const existingProduct = state.productList.find(product => product.id === parseInt(id));

        if (existingProduct) {
          console.log('Product found in productList:', existingProduct); // Log the existing product
          commit('setProduct', existingProduct);
        } else {
          console.log('Product not found, simulating API call...');
          // Simulate an API call to fetch the product by ID if not found in productList
          setTimeout(() => {
            const product = {
              id,
              name: 'Nike Air Max GENERIC PRODUCT',
              price: 120,
              images: ['image1.jpg', 'image2.jpg'],
              sizes: [7, 8, 9],
              description: 'A stylish and comfortable shoe.'
            };
            console.log('Fetched product:', product); // Log the fetched product
            commit('setProduct', product); // Commit the fetched product to the state
          }, 1000);
        }

        } catch (error) {
          console.error('Error fetching products:', error);
        }
        
      },
      // fetchProductById({ commit, state }, id) {
      //   const existingProduct = state.productList.find(product => product.id === parseInt(id));

      //   if (existingProduct) {
      //     commit('setProduct', existingProduct);
      //   } else {
      //     // Simulate an API call to fetch the product by ID if not found in productList
      //     setTimeout(() => {
      //       const product = {
      //         id,
      //         name: 'Nike Air Max',
      //         price: 120,
      //         images: ['image1.jpg', 'image2.jpg'],
      //         sizes: [7, 8, 9],
      //         description: 'A stylish and comfortable shoe.'
      //       };
      //       commit('setProduct', product); // Commit the fetched product to the state
      //     }, 1000);
      //   }
      // },
      async fetchProducts({ commit }) {
        // Mock API call to get products
        try {
          // Simulate fetching products from an API
          const products = [
            {
              id: 1,
              name: 'Nike Air Max',
              price: 120,
              brand: 'Nike',
              images: [
                'puma-rs-x/img1.png',
                'puma-rs-x/img1.png',
                'puma-rs-x/img1.png'
              ],
              sizes: [7, 8, 9, 10, 11],
              description: 'A modern take on the classic Air Max, offering great comfort and style.',
              material: 'Mesh and synthetic leather',
              style: 'Casual'
            },
            {
              id: 2,
              name: 'Adidas Ultraboost',
              price: 140,
              brand: 'Adidas',
              images: [
                'puma-rs-x/img1.png',
                'puma-rs-x/img1.png',
                'puma-rs-x/img1.png'
              ],
              sizes: [6, 7, 8, 9, 10],
              description: 'The Ultraboost provides superior cushioning and energy return, making it perfect for runners.',
              material: 'Primeknit textile',
              style: 'Running'
            },
            {
              id: 3,
              name: 'Puma RS-X',
              price: 110,
              brand: 'Puma',
              images: [
                'puma-rs-x/img1.png',
                'puma-rs-x/img2.png',
                'puma-rs-x/img3.png',
                'puma-rs-x/img4.png',
                'puma-rs-x/img5.png',
                'puma-rs-x/img6.png',
                'puma-rs-x/img7.png',
                'puma-rs-x/img8.png',
              ],
              sizes: [7, 8, 9, 10],
              description: 'RS-X is known for its bold look and maximum comfort, perfect for everyday wear.',
              material: 'Textile and leather',
              style: 'Sporty'
            }
        ];
        console.log('Fetched products:', products);  // Debug log
        commit('setProducts', products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }},
    },
    getters: {
      product: (state) => state.product,
      productList: (state) => state.productList,
      // getProductById: (state) => (id) => state.productList.find((product) => product.id === id),
      getProductById: (state) => (id) => state.productList.find(product => product.id === parseInt(id)), // Get product by ID
    },
  };