<template>
    <div class="product-list">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
      />
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-changed="changePage"
      />
    </div>
  </template>
  
  <script>
  import ProductCard from './ProductCard.vue';
  import Pagination from './Pagination.vue';
  import { mapGetters } from 'vuex';
  
  export default {
    components: {
      ProductCard,
      Pagination,
    },
    data() {
      return {
        currentPage: 1,
      };
    },
    computed: {
      ...mapGetters('products', ['productList']),
      filteredProducts() {
        // Apply any additional filtering logic here, such as categories and price
        return this.productList.slice(
          (this.currentPage - 1) * 10,
          this.currentPage * 10
        );
      },
      totalPages() {
        return Math.ceil(this.productList.length / 10);
      },
    },
    methods: {
      changePage(page) {
        this.currentPage = page;
      },
    },
  };
  </script>
  
  <style scoped>
  .product-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem;
    justify-content: space-between;
  }
  </style>