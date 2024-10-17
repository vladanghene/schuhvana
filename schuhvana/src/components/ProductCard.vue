<template>
  <div class="product-category">
    <h2>{{ title }}</h2>
    <div class="product-row">
      <div v-for="product in products" :key="product.id" class="product-card">
        <div class="product-card">
          <router-link :to="{ name: 'ProductPage', params: { id: product.id } }">
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
    product: {
      type: Object,
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
}

.product-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-card p {
  margin-top: 1rem;
  font-size: 1rem;
}
</style>