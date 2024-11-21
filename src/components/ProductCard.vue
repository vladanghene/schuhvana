<template>
  <div class="product-category">
    <h2>{{ title }}</h2>
    <div class="product-row">
      <div v-for="product in products" :key="product.id" class="product-card">
        <div class="product-card">
          <!-- Clickable image and product name -->
          <router-link :to="{ name: 'ProductPage', params: { id: product.id } }" class="product-link">
            <img :src="product.image" :alt="product.name" />
            <p>{{ product.name }}</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    products: {
      type: Array,
      required: true
    },
  },
};
</script>

<style scoped>
.product-category {
  margin: 2rem 0;
}

.product-row {
  display: flex;
  overflow-x: auto;
  gap: 1rem;
}

.product-card {
  min-width: 200px;
  text-align: center;
  cursor: pointer;
}

.product-card img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.product-card p {
  margin-top: 1rem;
  font-size: 1rem;
  cursor: pointer; /* Show pointer to indicate it's clickable */
  color: #007bff; /* Make the text stand out as a clickable link */
  text-decoration: underline; /* Add underline to make it clear it's a link */
}
</style>