<template>
  <div class="product-page">
    <div class="container">
      <Breadcrumbs />
    </div>
    
    <div class="product-content">
      <!-- Left-side vertical image gallery -->
      <div v-if="product && product.images && product.images.length" class="image-gallery">
        <img
          v-for="image in product.images"
          :key="image"
          :src="getImageUrl(image)"
          @click="setMainImage(image)"
          :class="{ selected: currentImage === image }"
          alt="Product image"
          @error="handleImageError($event, image)"
        />
      </div>

      <!-- Main product image -->
      <div v-if="currentImage" class="main-product-image">
        <img :src="getImageUrl(currentImage)" :alt="product.name" @error="handleImageError($event, currentImage)" />
      </div>

      <!-- Product information section -->
      <div v-if="product" class="product-info">
        <h1>{{ product.name }}</h1>
        <p class="price">${{ product.price }}</p>

        <!-- Size selection -->
        <div class="size-selection">
          <h4>Choose Size</h4>
          <div class="sizes">
            <button
              v-for="size in product.sizes"
              :key="size"
              :class="{ active: selectedSize === size }"
              @click="selectSize(size)"
            >
              {{ size }}
            </button>
          </div>
        </div>

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
            />
          </div>
          <button class="add-to-wishlist">Add to Wishlist</button>
        </div>

        <!-- Product details and reviews -->
        <div class="product-details">
          <h3>Product Details</h3>
          <p>{{ product.description }}</p>
          <button @click="toggleDetails">Show More</button>
          <div v-if="showDetails">
            <p>Material: {{ product.material }}</p>
            <p>Style: {{ product.style }}</p>
          </div>
        </div>
      </div>

      <!-- Loading states -->
      <div v-else class="loading-state">
        <p>Loading product details...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Breadcrumbs from './Breadcrumbs.vue';
import Confetti from './Confetti.vue';
import { getImageUrl, DEFAULT_SHOE_IMAGE } from '@/utils/imageUtils';

export default {
  name: 'ProductDetail',
  components: {
    Breadcrumbs,
    Confetti
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentImage: null,
      selectedSize: null,
      showDetails: false,
      imageLoadErrors: new Set(),
      showConfetti: false,
      mousePosition: { x: 0, y: 0 }
    };
  },
  methods: {
    ...mapActions('cart', {
      addItemToCart: 'addToCart'
    }),
    getImageUrl(filename) {
      if (!filename || this.imageLoadErrors.has(filename)) return DEFAULT_SHOE_IMAGE;
      return getImageUrl(filename);
    },
    handleImageError(e, imagePath) {
      console.warn(`Failed to load image: ${imagePath || e.target.src}`);
      if (imagePath) {
        this.imageLoadErrors.add(imagePath);
      }
      e.target.src = DEFAULT_SHOE_IMAGE;
    },
    setMainImage(image) {
      this.currentImage = image;
    },
    selectSize(size) {
      this.selectedSize = size;
    },
    handleAddToCart(event) {
      this.mousePosition = {
        x: event.clientX,
        y: event.clientY
      };
      this.showConfetti = true;
      setTimeout(() => {
        this.showConfetti = false;
      }, 3000); // Increased timeout to match new animation duration
      if (!this.selectedSize) return;
      
      this.addItemToCart({
        id: this.product.id,
        name: this.product.name,
        price: this.product.price,
        size: this.selectedSize,
        image: this.currentImage || this.product.image
      });
    },
    toggleDetails() {
      this.showDetails = !this.showDetails;
    }
  },
  mounted() {
    if (this.product) {
      this.currentImage = this.product.images?.[0] || this.product.image;
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
  width: 100%;
  max-width: 500px;
}

.main-product-image img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  object-fit: cover;
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

.size-selection {
  margin-bottom: 2rem;
}

.size-selection h4 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.sizes {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.sizes button {
  width: 50px;
  height: 50px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.sizes button:hover {
  border-color: #007bff;
}

.sizes button.active {
  border-color: #007bff;
  background: #007bff;
  color: white;
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

.loading-state {
  text-align: center;
  color: #6c757d;
  padding: 2rem;
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
