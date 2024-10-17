<template>
  <div class="product-page" v-if="product">
    <!-- Left-side vertical image gallery -->
    <div class="image-gallery" v-if="product.images && product.images.length">
      <img
        v-for="image in product.images"
        :key="image"
        :src="getImagePath(image)"
        @click="setMainImage(image)"
        :class="{ selected: image === mainImage }"
        alt="Product image"
      />
    </div>

    <!-- Main product image -->
    <div class="main-product-image" v-if="mainImage">
      <img :src="mainImage" :alt="product.name" />
    </div>

    <!-- Product information section -->
    <div class="product-info">
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
        <button class="add-to-cart" @click="addToCart">Add to Cart</button>
        <button class="add-to-wishlist">Add to Wishlist</button>
      </div>

      <!-- Product details and reviews -->
      <div class="product-details">
        <h3>Product Details</h3>
        <p>{{ product.description }}</p>
        <button @click="toggleDetails">Show More</button>
        <div v-if="showDetails">
          <!-- Collapsible details about the product -->
          <p>Material: {{ product.material }}</p>
          <p>Style: {{ product.style }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading state or no product found -->
  <div v-else>
    Loading product details...
    {{ product }}
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      mainImage: null,
      selectedSize: null,
      showDetails: false
    };
  },
  mounted() {
    // Check if product and images exist, then set the first image as main image
    if (this.product && this.product.images && this.product.images.length > 0) {
      this.mainImage = this.product.images[0];
    }
  },
  methods: {
    setMainImage(image) {
      this.mainImage = require(`@/assets/images/${image}`);
    },
    selectSize(size) {
      this.selectedSize = size;
    },
    addToCart() {
      // Logic for adding the product to cart
    },
    toggleDetails() {
      this.showDetails = !this.showDetails;
    },
    getImagePath(image) {
      try {
        return require(`@/assets/images/${image}`);
      } catch (error) {
        console.error('Image not found:', image);
        return ''; // Fallback in case the image is not found
      }
    }

  }
};
</script>
  
  <style scoped>
.product-page {
  display: flex;
  justify-content: center; /* Center the content horizontally */
  align-items: center; /* Center the content vertically */
  padding: 2rem;
  gap: 2rem; /* Add space between the image gallery and the main image */
}

.image-gallery {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Add space between images in the gallery */
}

.image-gallery img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  cursor: pointer;
}

.image-gallery img.selected {
  border: 2px solid #000;
}

.main-product-image {
  flex-grow: 1;
}

.main-product-image img {
  width: 80%; /* Make the main product image 5 times bigger */
  max-width: none;
}

.product-info {
  flex-grow: 1;
}

.price {
  font-size: 1.5rem;
  color: #007bff;
}

.size-selection {
  margin: 1rem 0;
}

.sizes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.sizes button {
  padding: 0.75rem 1rem;
  background-color: #f1f1f1;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.sizes button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.add-to-cart, .add-to-wishlist {
  padding: 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-to-cart {
  background-color: #007bff;
  color: white;
}

.add-to-wishlist {
  background-color: transparent;
  color: #007bff;
  border: 1px solid #007bff;
}

.product-details {
  margin-top: 2rem;
}

.product-details button {
  margin-top: 1rem;
  cursor: pointer;
}

.product-details div {
  margin-top: 1rem;
}
  </style>