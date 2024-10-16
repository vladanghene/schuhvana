<template>
    <div class="home">
      <Sidebar @filter-changed="applyFilters" />
      <div class="product-section">
        <h2>Featured Products</h2>
        <ProductList :filteredProducts="filteredProducts" />
      </div>
    </div>
  </template>
  
  <script>
  import Sidebar from '../components/Sidebar.vue';
  import ProductList from '../components/ProductList.vue';
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    components: {
      Sidebar,
      ProductList,
    },
    data() {
      return {
        filters: {
          categories: [],
          priceRange: 100,
        },
      };
    },
    computed: {
      ...mapGetters('products', ['allProducts']),
      filteredProducts() {
        return this.allProducts.filter((product) => {
          const inCategory = this.filters.categories.length
            ? this.filters.categories.includes(product.category)
            : true;
          const inPriceRange = product.price <= this.filters.priceRange;
          return inCategory && inPriceRange;
        });
      },
    },
    methods: {
      ...mapActions('products', ['fetchProducts']),
      applyFilters(filters) {
        this.filters = filters;
      },
    },
    created() {
      this.fetchProducts();
    },
  };
  </script>
  
  <style scoped>
  .home {
    display: flex;
  }
  
  .product-section {
    flex-grow: 1;
    padding: 1rem;
  }
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  </style>