<template>
  <div v-if="product" class="product-page">
    <ProductDetail :product="product" />
  </div>
  <div v-else class="loading">
    Loading...
  </div>
</template>

<script>
import ProductDetail from '../components/ProductDetail.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'ProductPage',
  components: {
    ProductDetail
  },
  computed: {
    ...mapGetters('products', {
      product: 'product',
      allProducts: 'allProducts'
    })
  },
  methods: {
    ...mapActions('products', ['fetchProductById', 'initializeProducts'])
  },
  async mounted() {
    try {
      const productId = parseInt(this.$route.params.id);
      
      // Initialize products if needed
      if (!this.allProducts.length) {
        await this.initializeProducts();
      }
      
      // Fetch the specific product
      await this.fetchProductById(productId);
    } catch (error) {
      console.error('Error loading product:', error);
    }
  }
};
</script>

<style scoped>
.product-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
  color: #666;
}
</style>