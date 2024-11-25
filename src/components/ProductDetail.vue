<template>
  <div class="product-page">
    <div class="container">
      <Breadcrumbs />
    </div>

    <div class="product-content">
      <!-- Left-side vertical image gallery -->
      <div v-if="localProduct && localProduct.images && localProduct.images.length" class="image-gallery">
        <img
          v-for="image in localProduct.images"
          :key="image"
          :src="getImageUrl(image)"
          @click="changeImage(image)"
          :class="{ selected: currentImage === image }"
          alt="Product image"
          @error="handleImageError($event, image)"
        />
      </div>

      <!-- Main product image -->
      <div v-if="currentImage" class="main-product-image">
        <img
          :src="getImageUrl(currentImage)"
          :alt="localProduct.name"
          @error="handleImageError($event, currentImage)"
          @click="openModal"
        />

        <!-- Size selection -->
        <div class="size-selection">
          <h4>Choose Size</h4>
          <SizeSelector
            :product="localProduct"
            v-model:selectedSize="selectedSize"
            :defaultScale="defaultScale"
          />
        </div>
      </div>

      <!-- Image Modal -->
      <ImageModal
        :is-open="isModalOpen"
        :images="localProduct.images"
        :current-index="currentImageIndex"
        :image-alt="localProduct.name"
        @close="closeModal"
        @update:currentIndex="updateCurrentIndex"
      />

      <!-- Product information section -->
      <div v-if="localProduct" class="product-info">
        <h1>{{ localProduct.name }}</h1>
        <p class="price">${{ localProduct.price }}</p>

        <!-- Add to cart and wishlist buttons -->
        <div class="action-buttons">
          <div class="add-to-cart-wrapper">
            <button class="add-to-cart" @click="handleAddToCart($event)" :disabled="!selectedSize">
              {{ selectedSize ? 'Add to Cart' : 'Select a Size' }}
            </button>
            <Confetti
              :is-active="showConfetti"
              :mouse-x="mousePosition.x"
              :mouse-y="mousePosition.y"
              type="add"
            />
          </div>
          <button class="add-to-wishlist">Add to Wishlist</button>
        </div>

        <!-- Product details and reviews -->
        <div class="product-details">
          <h3>Product Details</h3>
          <p>{{ localProduct.description }}</p>
          <button @click="toggleDetails">Show More</button>
          <div v-if="showDetails">
            <p>Material: {{ localProduct.material }}</p>
            <p>Style: {{ localProduct.style }}</p>
            <p class="size-type">Size Type: <span class="size-type-value">{{ localProduct.sizeType }}</span></p>
            <p class="size-type">
              Current Scale: 
              <select 
                v-model="selectedScale" 
                class="scale-select"
                @change="updateScale"
              >
                <option 
                  v-for="scale in getAvailableScales" 
                  :key="scale" 
                  :value="scale"
                >
                  {{ scale }}
                </option>
              </select>
            </p>
          </div>
        </div>
      </div>

      <!-- Loading states -->
      <div v-else class="loading-state">
        <p>Loading product details...</p>
      </div>
    </div>
    <v-snackbar
      v-model="showError"
      color="error"
      timeout="3000"
    >
      {{ errorMessage }}
    </v-snackbar>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import Breadcrumbs from './Breadcrumbs.vue';
import Confetti from './Confetti.vue';
import ImageModal from './ImageModal.vue';
import SizeSelector from './SizeSelector.vue';
import { getImageUrl, DEFAULT_SHOE_IMAGE } from '@/utils/imageUtils';

export default {
  name: 'ProductDetail',
  components: {
    Breadcrumbs,
    Confetti,
    ImageModal,
    SizeSelector
  },
  data() {
    return {
      showDetails: false,
      selectedSize: null,
      currentImage: null,
      isModalOpen: false,
      showConfetti: false,
      mousePosition: { x: 0, y: 0 },
      imageLoadErrors: new Set(),
      localProduct: null,
      selectedScale: null,
      errorMessage: '',
      showError: false,
    };
  },
  computed: {
    ...mapState('user', ['userPreferredScale', 'availableScales']),
    ...mapGetters('user', ['getCurrentScale', 'getDefaultScale']),
    ...mapGetters('products', ['getProductById', 'getAvailableScales']),
    currentImageIndex() {
      return this.localProduct?.images?.indexOf(this.currentImage) || 0;
    },
    defaultScale() {
      return this.getCurrentScale;
    },
    currentScale() {
      return this.getCurrentScale;
    }
  },
  methods: {
    ...mapActions({
      addToCartAction: 'cart/addToCart'
    }),
    ...mapActions('user', ['updatePreferredScale']),
    loadProduct(id) {
      if (id) {
        this.localProduct = this.getProductById(id);
        console.log('Loaded product:', this.localProduct);
        if (this.localProduct && !this.currentImage) {
          this.currentImage = this.localProduct.images?.[0] || null;
        }
      }
    },
    getImageUrl(filename) {
      try {
        if (!filename || this.imageLoadErrors.has(filename)) {
          return DEFAULT_SHOE_IMAGE;
        }
        return getImageUrl(filename);
      } catch (error) {
        console.error('Error getting image URL:', error);
        return DEFAULT_SHOE_IMAGE;
      }
    },
    handleImageError(e, imagePath) {
      console.warn(`Failed to load image: ${imagePath || e.target.src}`);
      if (imagePath) {
        this.imageLoadErrors.add(imagePath);
      }
      e.target.src = DEFAULT_SHOE_IMAGE;
    },
    changeImage(image) {
      this.currentImage = image;
    },
    selectSize(size) {
      this.selectedSize = size;
    },
    async handleAddToCart(event) {
      if (!this.selectedSize) {
        this.errorMessage = 'Please select a size';
        this.showError = true;
        return;
      }

      const result = await this.addToCartAction({
        id: this.localProduct.id,
        name: this.localProduct.name,
        price: this.localProduct.price,
        selectedSize: this.selectedSize,
        quantity: 1,
        image: this.localProduct.images[0]
      });

      if (!result.success) {
        this.errorMessage = result.error;
        this.showError = true;
        return;
      }

      this.mousePosition.x = event.clientX;
      this.mousePosition.y = event.clientY;
      
      this.showConfetti = true;
      setTimeout(() => {
        this.showConfetti = false;
        this.$router.push('/cart');
      }, 500);
    },
    toggleDetails() {
      this.showDetails = !this.showDetails;
    },
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    updateCurrentIndex(index) {
      this.currentImage = this.localProduct?.images?.[index];
    },
    updateScale() {
      this.updatePreferredScale(this.selectedScale);
    }
  },
  created() {
    const id = this.$route.params.id;
    if (id) {
      this.loadProduct(id);
    }
    this.selectedScale = this.getCurrentScale;
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler(newId) {
        this.loadProduct(newId);
      }
    }
  }
};
</script>

<style scoped>
.product-page {
  min-height: 100vh;
  background-color: #fff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.product-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: grid;
  grid-template-columns: auto 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.image-gallery {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-right: 1rem;
}

.image-gallery img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.image-gallery img:hover {
  border-color: #007bff;
}

.image-gallery img.selected {
  border-color: #007bff;
}

.main-product-image {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

.main-product-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
  cursor: pointer;
}

.size-selection {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.size-selection h4 {
  color: #374151;
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: center;
}

.product-info {
  padding-left: 2rem;
}

.product-info h1 {
  margin: 0 0 1rem 0;
  font-size: 2rem;
  color: #2c3e50;
}

.price {
  font-size: 1.5rem;
  color: #007bff;
  font-weight: 600;
  margin-bottom: 2rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.add-to-cart-wrapper {
  position: relative;
  flex: 2;
}

.add-to-cart {
  width: 100%;
  padding: 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.add-to-cart:hover:not(:disabled) {
  background: #0056b3;
}

.add-to-cart:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.add-to-wishlist {
  flex: 1;
  padding: 1rem;
  background: white;
  color: #007bff;
  border: 2px solid #007bff;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.add-to-wishlist:hover {
  background: #f8f9fa;
}

.product-details {
  border-top: 1px solid #e9ecef;
  padding-top: 2rem;
}

.product-details h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.product-details p {
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.product-details button {
  background: none;
  border: none;
  color: #007bff;
  padding: 0;
  cursor: pointer;
  font-weight: 500;
}

.product-details button:hover {
  text-decoration: underline;
}

.size-type {
  margin-top: 0.5rem;
}

.size-type-value {
  color: #4b5563;
  text-transform: capitalize;
}

.loading-state {
  text-align: center;
  color: #6c757d;
  padding: 2rem;
}

.scale-select {
  display: inline-block;
  padding: 0.25rem 1.5rem 0.25rem 0.5rem;
  font-size: 0.9rem;
  line-height: 1.2;
  color: #4b5563;
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%236b7280'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.25rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  appearance: none;
  margin-left: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.scale-select:hover {
  border-color: #3b82f6;
}

.scale-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

@media (max-width: 1024px) {
  .product-content {
    grid-template-columns: auto 1fr;
  }

  .product-info {
    grid-column: 1 / -1;
    padding-left: 0;
  }
}

@media (max-width: 768px) {
  .product-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .image-gallery {
    flex-direction: row;
    overflow-x: auto;
    padding-right: 0;
    padding-bottom: 1rem;
  }

  .image-gallery img {
    width: 60px;
    height: 60px;
  }

  .main-product-image {
    max-width: 100%;
  }
}
</style>
