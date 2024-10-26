<template>
  <div class="home">
    <!-- Hero Section -->
    <HeroSection />
    <section class="categories-section">
      <div class="categories-container">
        <div class="category">
          <ProductCategory title="Discover Classics" :products="classics" />
        </div>
        <div class="category">
          <ProductCategory title="Shop by Sport" :products="sports" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import HeroSection from '../components/HeroSection.vue';
import ProductCategory from '../components/ProductCategory.vue';

export default {
  components: {
    HeroSection,
    ProductCategory,
  },
  data() {
    return {
      classics: [
        { id: 1, name: 'Air Max', image: 'https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb/h_600,c_limit/800b58e3-b669-4dc3-a2d4-e68f5688d151/nike-just-do-it.jpg' },
        { id: 2, name: 'Air Force 1', image: 'https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb/h_600,c_limit/c61c8b70-ef28-4615-9b81-76c17467681c/nike-just-do-it.jpg' },
        { id: 3, name: 'Dunk', image: 'https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb/h_600,c_limit/64b7ce43-fe36-4a02-ae10-b8251a33d847/nike-just-do-it.jpg' }
      ],
      sports: [
        { id: 1, name: 'Running', image: 'https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb/h_600,c_limit/a3c971bc-bc0a-4c0c-8bdf-e807a3027e53/nike-just-do-it.jpg' },
        { id: 2, name: 'Football', image: 'https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb/h_600,c_limit/e4695209-3f23-4a05-a9f9-d0edde31b653/nike-just-do-it.jpg' },
        { id: 3, name: 'Basketball', image: 'https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb/h_600,c_limit/38ed4b8e-9cfc-4e66-9ddd-02a52314eed9/nike-just-do-it.jpg' }
      ],
      products: [
        { id: 1, name: 'Air Max', image: 'https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb/h_600,c_limit/800b58e3-b669-4dc3-a2d4-e68f5688d151/nike-just-do-it.jpg' },
        { id: 2, name: 'Air Force 1', image: 'https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb/h_600,c_limit/c61c8b70-ef28-4615-9b81-76c17467681c/nike-just-do-it.jpg' },
        { id: 3, name: 'Dunk', image: 'https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb/h_600,c_limit/64b7ce43-fe36-4a02-ae10-b8251a33d847/nike-just-do-it.jpg' }
      ],
    };
  },
};
</script>

<style scoped>
.home {
  padding: 2rem;
}
.categories-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 0;
}

.categories-container {
  display: flex;
  flex-direction: column; /* Stack categories vertically */
  gap: 2rem; /* Add space between categories */
}

.category {
  text-align: center;
}

.category h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}
</style>