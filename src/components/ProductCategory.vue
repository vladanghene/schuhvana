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
        <div class="category-card" v-for="product in products" :key="product.id">
          <div class="category-image">
            <img :src="product.image" />
          </div>
          <h3 class="category-name">{{ product.name }}</h3>
        </div>
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

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.category-image {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  overflow: hidden;
  border-radius: 12px;
}

.category-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.category-card:hover .category-image img {
  transform: scale(1.15);
}

.category-name {
  font-size: 1.25rem;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>