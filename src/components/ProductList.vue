<template>
  <div class="product-list">
    <div class="filters">
      <select v-model="selectedSizeType" class="size-filter">
        <option value="">All Size Types</option>
        <option value="men-regular">Men's Regular</option>
        <option value="men-small">Men's Small</option>
        <option value="women-regular">Women's Regular</option>
        <option value="women-small">Women's Small</option>
      </select>
    </div>
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
      selectedSizeType: ''
    };
  },
  computed: {
    ...mapGetters('products', ['productList']),
    sizeFilteredProducts() {
      if (!this.selectedSizeType) {
        return this.productList;
      }
      return this.productList.filter(product => 
        (product.sizeType || 'men-regular') === this.selectedSizeType
      );
    },
    filteredProducts() {
      return this.sizeFilteredProducts.slice(
        (this.currentPage - 1) * 10,
        this.currentPage * 10
      );
    },
    totalPages() {
      return Math.ceil(this.sizeFilteredProducts.length / 10);
    },
  },
  methods: {
    changePage(page) {
      this.currentPage = page;
    },
  },
  watch: {
    selectedSizeType() {
      // Reset to first page when filter changes
      this.currentPage = 1;
    }
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

.filters {
  margin-bottom: 1rem;
  display: flex;
  justify-content: flex-end;
  padding: 0 1rem;
}

.size-filter {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 0.9rem;
  cursor: pointer;
}

.size-filter:focus {
  outline: none;
  border-color: #4CAF50;
}
</style>