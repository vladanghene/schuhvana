<template>
  <div class="category-page" v-if="category">
    <Breadcrumbs />
    
    <div class="category-header">
      <img :src="categoryImage" :alt="category.name">
      <div class="category-info">
        <h1>{{ category.name }}</h1>
        <p>{{ category.description }}</p>
      </div>
    </div>

    <div class="products-section">
      <div class="product-grid">
        <SingleProductCard 
          v-for="product in products" 
          :key="product.id" 
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import SingleProductCard from '../components/SingleProductCard.vue';
import Breadcrumbs from '../components/Breadcrumbs.vue';
import { mapGetters } from 'vuex';
import { getCategoryImageUrl } from '@/utils/imageUtils';

export default {
  name: 'CategoryPage',
  components: {
    SingleProductCard,
    Breadcrumbs
  },
  props: {
    categoryname: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters('products', ['allProducts']),
    ...mapGetters('categories', ['getCategoryById']),
    
    category() {
      if (!this.categoryname) return null;
      return this.getCategoryById(this.categoryname);
    },
    categoryImage() {
      if (!this.category?.image) return '';
      return getCategoryImageUrl(this.category.image);
    },
    products() {
      if (!this.category) return [];
      return this.allProducts?.filter(p => 
        p?.categories?.includes(this.category.id)
      ) || [];
    }
  }
};
</script>

<style scoped>
.category-page {
  padding: 2rem;
}

.category-header {
  position: relative;
  margin-bottom: 2rem;
  border-radius: 8px;
  overflow: hidden;
}

.category-header img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.category-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  color: white;
}

.category-info h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.category-info p {
  font-size: 1.2rem;
  max-width: 600px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .category-page {
    padding: 1rem;
  }

  .category-header img {
    height: 200px;
  }

  .category-info h1 {
    font-size: 2rem;
  }

  .category-info p {
    font-size: 1rem;
  }
}
</style>