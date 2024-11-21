
<template>
  <div class="cart-page">
    <h2>Your Cart</h2>
    <div v-if="cartItems.length > 0" class="cart-items">
      <div v-for="item in cartItems" :key="item.product.id" class="cart-item">
				<img :src="`/assets/images/${item.product.images[0]}`" :alt="item.product.name" />
        <div class="item-info">
          <h3>{{ item.product.name }}</h3>
          <p>Quantity: {{ item.quantity }}</p>
          <p>Price: ${{ item.product.price }}</p>
          <button @click="removeFromCart(item.product.id)">Remove</button>
        </div>
      </div>
      <div class="cart-total">
        <h3>Total: ${{ cartTotal }}</h3>
        <router-link to="/checkout" class="checkout-button">Proceed to Checkout</router-link>
      </div>
    </div>
    <div v-else>
      <p>Your cart is empty. <router-link to="/">Start shopping now!</router-link></p>
    </div>
  </div>
</template>



  <script>
			import { mapGetters, mapActions } from 'vuex';

			export default {
					computed: {
							...mapGetters('cart', ['cartItems', 'cartTotal']),
					},
					methods: {
							...mapActions('cart', ['removeFromCart']),
					},
			async mounted(){
				console.log(this.$store.state.cart.items[0].product);
			},
			};
  </script>

	<style scoped>
		.cart-page {
		padding: 2rem;
}

  .cart-items {
				display: flex;
				flex-direction: column;
				gap: 1rem;
  }

  .cart-item {
				display: flex;
				gap: 1rem;
				border-bottom: 1px solid #ccc;
				padding-bottom: 1rem;
  }

  .item-info {
				flex-grow: 1;
  }

  .checkout-button {
				padding: 1rem 2rem;
				background-color: #007bff;
				color: white;
				text-decoration: none;
				border-radius: 4px;
				display: inline-block;
  }

  .cart-total {
    margin-top: 2rem;
    text-align: right;
  }
  </style>
