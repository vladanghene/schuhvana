<template>
  <div class="home">
    <Hero />
    <h1>Welcome to Schuhvana</h1>
    
    <div v-if="loading" class="loading">
      Loading...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else class="content">
      <!-- Discover Classics Section -->
      <section v-if="classicProducts.length" class="section">
        <h2>Discover Classics</h2>
        <div class="product-grid">
          <template v-for="product in classicProducts" :key="product.id">
            <SingleProductCard 
              v-if="product && product.id"
              :product="product"
            />
          </template>
        </div>
      </section>

      <!-- Shop by Sport Section -->
      <section v-if="sportCategories.length" class="section">
        <h2 class="section-header">Shop by Sport</h2>
        <div class="category-grid">
          <template v-for="category in sportCategories" :key="category.id">
            <router-link 
              v-if="category && category.id"
              :to="{ 
                name: 'Category', 
                params: { categoryname: category.id }
              }"
              class="category-card"
            >
              <img 
                :src="getImageUrl(category.image)" 
                :alt="category.name"
                @error="handleImageError($event, category.image)"
                loading="lazy"
              >
              <h3>{{ category.name }}</h3>
              <p>{{ category.description }}</p>
            </router-link>
          </template>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SingleProductCard from '@/components/SingleProductCard.vue';
import Hero from '@/components/Hero.vue';
import { getImageUrl, DEFAULT_SHOE_IMAGE } from '@/utils/imageUtils';

export default {
  name: 'Home',
  components: {
    SingleProductCard,
    Hero
  },
  data() {
    return {
      loading: true,
      error: null,
      imageLoadErrors: new Set()
    }
  },
  computed: {
    ...mapGetters('categories', ['allCategories', 'allSections', 'getSportCategories']),
    ...mapGetters('products', ['allProducts']),
    
    classicProducts() {
      return this.allProducts?.filter(p => p?.categories?.includes('discover-classics')) || [];
    },
    sportProducts() {
      return this.allProducts?.filter(p => !p?.categories?.includes('discover-classics')) || [];
    },
    sportCategories() {
      return this.getSportCategories || [];
    }
  },
  methods: {
    ...mapActions('products', ['initializeProducts']),
    getImageUrl(path) {
      if (!path || this.imageLoadErrors.has(path)) return DEFAULT_SHOE_IMAGE;
      return getImageUrl(path);
    },
    handleImageError(e, imagePath) {
      console.warn(`Failed to load image: ${imagePath}`);
      this.imageLoadErrors.add(imagePath);
      if (e.target) {
        e.target.src = DEFAULT_SHOE_IMAGE;
      }
    }
  },
  async mounted() {
    try {
      await this.initializeProducts();
      this.loading = false;
    } catch (error) {
      console.error('Failed to initialize products:', error);
      this.error = 'Failed to load products. Please try again later.';
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  margin: 20px 0;
}

.error {
  color: red;
}

.content {
  width: 100%;
}

.section {
  margin-bottom: 40px;
  width: 100%;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  width: 100%;
  padding: 20px 0;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  width: 100%;
  padding: 20px 0;
}

.category-card {
  text-decoration: none;
  color: inherit;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  background: white;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.category-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.category-card:hover img {
  transform: scale(1.15);
}

.category-card h3 {
  margin: 24px 24px 12px;
  font-size: 1.2em;
  color: #333;
}

.category-card p {
  margin: 0 24px 24px;
  color: #666;
  flex-grow: 1;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 32px;
  font-size: 2.4em;
}

h2 {
  margin-bottom: 24px;
  font-size: 1.8em;
  color: #333;
  padding: 0 8px;
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .category-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
  }

  h1 {
    font-size: 2em;
    margin-bottom: 24px;
  }

  h2 {
    font-size: 1.6em;
    margin-bottom: 20px;
  }
}
</style>