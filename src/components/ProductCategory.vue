<template>
  <div class="category-page">
    <div class="container">
      <Breadcrumbs />
      <!-- Section Header -->
      <div class="category-header">
        <h2 class="category-title">{{ title }}</h2>
        <router-link :to="categoryLink" class="view-all">View All</router-link>
      </div>

      <!-- Product Grid -->
      <div class="product-grid">
        <SingleProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          class="product-card"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SingleProductCard from './SingleProductCard.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';

export default {
  name: 'ProductCategory',
  components: {
    SingleProductCard,
    Breadcrumbs
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    products: {
      type: Array,
      required: true,
    }
  },
  computed: {
    categoryLink() {
      // Convert the category title to a URL-friendly format
      return `/${encodeURIComponent(this.title)}`;
    }
  }
};
</script>

<style scoped>
/* Category header styling */
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

/* Title styling */
.category-title {
  font-size: 1.75rem;
  margin: 0;
}

/* View All link styling */
.view-all {
  color: #000;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border: 1px solid #000;
  border-radius: 20px;
  transition: all 0.2s ease;
}

.view-all:hover {
  background-color: #000;
  color: #fff;
}

/* Product grid styling */
.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>