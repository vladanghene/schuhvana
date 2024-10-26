<template>
  <div class="product-category">
    <!-- Section Title -->
    <h2 class="category-title">{{ title }}</h2>

    <!-- Product Grid -->
    <div class="product-grid">
      <div v-for="(product, index) in products" :key="index" class="product-card">
        <div class="image-container">
          <img :src="product.image" :alt="product.name" />

          <!-- Product Name Button Overlay -->
          <button class="product-name">{{ product.name }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    products: {
      type: Array,
      required: true,
    },
  }
};
</script>

<style scoped>
/* Title styling */
.category-title {
  font-size: 1.75rem;
  text-align: left;
  margin-bottom: 1.5rem;
}

/* Product grid styling */
.product-grid {
  display: flex;
  gap: 1.5rem;
  justify-content: space-between;
}

/* Individual product card */
.product-card {
  position: relative;
  width: 100%;
}

/* Image container */
.image-container {
  position: relative;
  overflow: hidden;
}

/* Product image styling */
.image-container img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 10px; /* Optional to make the images look smoother */
}

/* Product name button (styled like the image you provided) */
.product-name {
  position: absolute;
  bottom: 15px;
  left: 15px;
  background-color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.product-name:hover {
  background-color: #f1f1f1;
}
</style>