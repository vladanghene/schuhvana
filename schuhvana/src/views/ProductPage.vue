<template>
    <div class="product-page">
      <ProductDetail v-if="product" :product="product" />
    </div>
  </template>

  <script>
  import ProductDetail from '../components/ProductDetail.vue';
  import { mapGetters, mapActions } from 'vuex';

  export default {
    components: {
      ProductDetail,
    },
    async mounted() {
      try {
        const productId = this.$route.params.id;

        // Check if productList is empty; if so, fetch products first
        if (!this.productList.length) {
          console.log('Product list is empty. Fetching all products...');
          await this.fetchProducts();  // Fetch all products first
        }

        // Fetch the product by ID
        await this.fetchProductById(productId);
      } catch (error) {
        console.error('Error during mounted hook:', error);
      }
    },
    mounted() {
      const productId = this.$route.params.id;
      console.log('Product ID from route:', productId); // Log the route param
      this.fetchProductById(productId); // Fetch the product by ID
    },
    computed: {
      ...mapGetters('products', {
      product: 'product', // Map the `product` getter from Vuex
      productList: 'productList'  // Use your getter for the full product list
      }),
      async mounted() {
        const productId = this.$route.params.id;

        // Check if productList is empty; if so, fetch products first
        if (!this.productList.length) {
          console.log('Product list is empty. Fetching all products...');
          await this.fetchProducts();  // Fetch all products first
        }

        // Now fetch the product by ID, ensuring we await the async operation
        await this.fetchProductById(productId);
      }
    },
    methods: {
    ...mapActions('products', ['fetchProductById', 'fetchProducts']) // Dispatch the action to fetch product by ID
    },
  };
  </script>

  <style scoped>
  .product-page {
    padding: 2rem;
  }
  </style>