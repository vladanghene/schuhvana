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
          <p>Price: ${{ product.price }}</p>
          <button @click="addToCart(product)">Add to Cart</button>
        </div>
      </div>
    </div>
    <div class="cart">
      <h3>Cart</h3>
      <ul>
        <li v-for="item in cart" :key="item.id">
						<img src={{item.images.[0]}}></img>
						{{ item.name }} - ${{ item.price }} x {{ item.quantity }}
        </li>
      </ul>
      <p>Total: ${{ cartTotal }}</p>
      <button @click="clearCart">Clear Cart</button>
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
  data() {
    return {
      cart: []
    };
  },
  computed: {
			cartTotal(){
				return this.cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
			}
	},
  methods: {
    addToCart(product) {
      const sizeType = product.sizeType || 'men-regular'; // Default to men-regular if not specified
      const availableSizes = this.$store.getters['products/getProductSizes'](product);
      const defaultSize = availableSizes[0]; // Use first available size as default
      
      if (!defaultSize) {
        console.warn('No sizes available for product:', product.name);
        return;
      }

      const sizeConversions = this.$store.getters['products/getProductSizeConversions'](product);
      const usSize = `US-${defaultSize}`;
      const conversions = sizeConversions[usSize];

      this.$store.dispatch('cart/addToCart', {
        ...product,
        selectedSize: defaultSize,
        sizeConversions: conversions
      });
    },
    clearCart() {
      this.cart = [];
    }
  }
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
}

.cart {
  margin-top: 2rem;
}

.cart ul {
  list-style-type: none;
  padding: 0;
}

.cart li {
  margin-bottom: 0.5rem;
}
</style>
