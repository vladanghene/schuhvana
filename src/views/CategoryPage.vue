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
      <div class="filters">
        <select v-model="selectedSizeType" class="size-filter">
          <option value="">All Size Types</option>
          <option value="men-regular">Men's Regular</option>
          <option value="men-small">Men's Small</option>
          <option value="women-regular">Women's Regular</option>
          <option value="women-small">Women's Small</option>
        </select>
      </div>

      <template v-if="categoryname === 'all'">
        <div v-for="category in filteredGroupedProducts" :key="category.id" class="category-section">
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
          v-for="product in filteredProducts" 
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
  setup(props) {
    const selectedSizeType = ref('');

    const filterBySize = (products) => {
      if (!selectedSizeType.value) return products;
      return products.filter(product => 
        (product.sizeType || 'men-regular') === selectedSizeType.value
      );
    };

    const category = computed(() => {
      if (!props.categoryname) return null;
      return props.getCategoryById(props.categoryname);
    });

    const categoryImage = computed(() => {
      if (!category.value?.image) return '';
      return getImageUrl(category.value.image);
    });

    const products = computed(() => {
      if (!category.value) return [];
      if (props.categoryname === 'all') {
        return props.allProducts || [];
      }
      return props.allProducts?.filter(p => 
        p?.categories?.includes(category.value.id)
      ) || [];
    });

    const groupedProducts = computed(() => {
      if (props.categoryname !== 'all') return [];
      
      // Get all categories except 'all'
      const categories = props.allCategories.filter(cat => cat.id !== 'all');
      
      // Group products by category
      return categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        products: props.allProducts.filter(product => 
          product.categories?.includes(cat.id)
        )
      })).filter(cat => cat.products.length > 0);
    });

    const filteredProducts = computed(() => {
      return filterBySize(products.value);
    });

    const filteredGroupedProducts = computed(() => {
      return groupedProducts.value.map(category => ({
        ...category,
        products: filterBySize(category.products)
      })).filter(category => category.products.length > 0);
    });

    return {
      category,
      categoryImage,
      products,
      groupedProducts,
      selectedSizeType,
      filteredProducts,
      filteredGroupedProducts
    };
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

.filters {
  margin: 1rem;
  display: flex;
  justify-content: flex-end;
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