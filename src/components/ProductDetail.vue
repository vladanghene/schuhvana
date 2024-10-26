<template>
  <div class="product-page">
    <!-- Left-side vertical image gallery -->
    <div v-if="product && product.images && product.images.length" class="image-gallery">
      <img
        v-for="image in product.images"
        :key="image"
        :src="`/assets/images/${image}`"
        @click="setMainImage(image)"
        :class="{ selected: image === mainImage }"
        alt="Product image"
      />
    </div>

    <!-- Main product image -->
    <div v-if="mainImage" class="main-product-image">
      <img :src="mainImage" :alt="product.name" />
    </div>

    <!-- Fallback for when no product images are available -->
    <div v-else>
      <p>Loading product images...</p>
    </div>

    <!-- Product information section -->
    <div v-if="product" class="product-info">
      <h1>{{ product.name }}</h1>
      <p class="price">{{ product.price }}€</p>

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

    <!-- Fallback for when no product is available -->
    <div v-else>
      <p>Loading product details...</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      mainImage: null,
      selectedSize: null,
      showDetails: false,
    };
  },
  mounted() {
    // Check if product and images exist, then set the first image as main image
    if (this.product && this.product.images && this.product.images.length > 0) {
      this.mainImage = `/assets/images/${this.product.images[0]}`;
    }
  },
  methods: {
    setMainImage(image) {
      this.mainImage = `/assets/images/${image}`;
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
  },
};
</script>

<style scoped>
.product-page {
  display: flex;
  gap: 2rem;
  padding: 2rem;
}

.image-gallery {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

.main-product-image img {
  width: 100%;
  max-width: 1000px;
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