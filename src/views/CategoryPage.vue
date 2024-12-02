<template>
  <div class="category-page" v-if="category">
    <Breadcrumbs />
    
    <div v-if="categoryname !== 'all'" class="category-header">
      <img :src="categoryImage" :alt="category.name">
      <div class="category-info">
        <h1>{{ category.name }}</h1>
        <p>{{ category.description }}</p>
      </div>
    </div>

    <div class="products-section">
      <template v-if="categoryname === 'all'">
        <div v-for="category in groupedProducts" :key="category.id" class="category-section">
          <h2 class="category-title">{{ category.name }}</h2>
          <div class="product-grid">
            <SingleProductCard 
              v-for="product in category.products" 
              :key="product.id" 
              :product="product"
            />
          </div>
        </div>
      </template>
      <div v-else class="product-grid">
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
import { getImageUrl } from '@/utils/imageUtils';

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
  created() {
    // Ensure products are initialized
    this.$store.dispatch('products/initializeProducts');
  },
  computed: {
    ...mapGetters('products', ['allProducts']),
    category() {
      if (!this.categoryname) return null;
      return {
        id: this.categoryname,
        name: this.categoryname.charAt(0).toUpperCase() + this.categoryname.slice(1),
        description: `Browse our ${this.categoryname}'s collection`,
        image: `categories/${this.categoryname}.jpg`
      };
    },
    categoryImage() {
      if (!this.category?.image) return '';
      return getImageUrl(this.category.image);
    },
    products() {
      console.log('Category name:', this.categoryname);
      console.log('All products:', this.allProducts);
      
      if (!this.category) return [];
      if (this.categoryname === 'all') {
        return this.allProducts || [];
      }
      
      const filtered = this.allProducts?.filter(p => {
        console.log(`Checking product ${p.name}:`, {
          categories: p.categories,
          hasCategory: Array.isArray(p.categories) && p.categories.includes(this.categoryname)
        });
        return Array.isArray(p.categories) && p.categories.includes(this.categoryname);
      }) || [];
      
      console.log('Filtered products:', filtered.map(p => ({ name: p.name, categories: p.categories })));
      return filtered;
    }
  }
};
</script>

<style scoped>
.category-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
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
  grid-template-columns: repeat(auto-fit, 280px);
  gap: 2rem;
  margin-top: 2rem;
  justify-content: center;
  width: 100%;
}

.category-section {
  margin-bottom: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.category-title {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  color: #666;
  letter-spacing: 1px;
  text-transform: uppercase;
  position: relative;
  text-align: center;
}

.category-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background-color: #ddd;
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

  .category-title {
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fit, 160px);
    gap: 1rem;
  }
}
</style>