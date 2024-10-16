<template>
    <div class="product-page">
      <ProductDetail :product="product" />
    </div>
  </template>
  
  <script>
  import ProductDetail from '../components/ProductDetail.vue';
  import { mapGetters } from 'vuex';
  
  export default {
    components: {
      ProductDetail,
    },
    computed: {
      ...mapGetters('products', ['getProductById']),
      product() {
        return this.getProductById(this.$route.params.id);
      },
    },
  };
  </script>
  
  <style scoped>
  .product-page {
    padding: 2rem;
  }
  </style>