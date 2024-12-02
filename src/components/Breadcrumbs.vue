<template>
  <nav v-if="!isHomePage" class="breadcrumbs" aria-label="breadcrumb">
    <ol>
      <li v-for="(crumb, index) in breadcrumbs" :key="index">
        <router-link 
          v-if="index < breadcrumbs.length - 1" 
          :to="crumb.path"
          :aria-current="index === breadcrumbs.length - 1 ? 'page' : undefined"
        >
          {{ crumb.name }}
        </router-link>
        <span v-else>{{ crumb.name }}</span>
        <span v-if="index < breadcrumbs.length - 1" class="separator">/</span>
      </li>
    </ol>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Breadcrumbs',
  computed: {
    ...mapGetters('products', ['getProductById']),
    ...mapGetters('categories', ['getCategoryById']),
    isHomePage() {
      return this.$route.name === 'Home' || this.$route.path === '/';
    },
    breadcrumbs() {
      const breadcrumbs = [{ name: 'Home', path: '/' }];
      const { name, params, path } = this.$route;

      // Return empty for home page
      if (this.isHomePage) {
        return [];
      }

      // Handle category pages
      if (name === 'Category' && params.categoryname) {
        const category = this.getCategoryById(params.categoryname);
        breadcrumbs.push({
          name: category ? category.name : this.capitalizeFirst(params.categoryname),
          path: `/category/${params.categoryname}`
        });
      }

      // Handle product pages
      if (name === 'ProductPage' && params.id) {
        const product = this.getProductById(Number(params.id));
        if (product) {
          // Add category breadcrumb if product has categories
          if (product.categories && product.categories.length > 0) {
            const category = this.getCategoryById(product.categories[0]);
            if (category) {
              breadcrumbs.push({
                name: category.name,
                path: `/category/${category.id}`
              });
            }
          }
          // Add product name
          breadcrumbs.push({
            name: product.name,
            path: `/product/${params.id}`
          });
        }
      }

      // Handle cart page
      if (name === 'CartPage') {
        breadcrumbs.push({
          name: 'Shopping Cart',
          path: '/cart'
        });
      }

      // Handle checkout page
      if (name === 'CheckoutPage') {
        breadcrumbs.push({
          name: 'Shopping Cart',
          path: '/cart'
        });
        breadcrumbs.push({
          name: 'Checkout',
          path: '/checkout'
        });
      }

      // Handle account-related pages
      if (name === 'Login') {
        breadcrumbs.push({
          name: 'Login',
          path: '/login'
        });
      }

      if (name === 'Register') {
        breadcrumbs.push({
          name: 'Register',
          path: '/register'
        });
      }

      if (name === 'UserAccount') {
        breadcrumbs.push({
          name: 'My Account',
          path: '/account'
        });
      }

      // Handle order confirmation
      if (name === 'OrderConfirmationPage') {
        breadcrumbs.push({
          name: 'Shopping Cart',
          path: '/cart'
        });
        breadcrumbs.push({
          name: 'Checkout',
          path: '/checkout'
        });
        breadcrumbs.push({
          name: 'Order Confirmation',
          path: '/order-confirmation'
        });
      }

      return breadcrumbs;
    }
  },
  methods: {
    capitalizeFirst(string) {
      if (!string) return '';
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
  }
};
</script>

<style scoped>
.breadcrumbs {
  padding: 1rem 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.breadcrumbs ol {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.breadcrumbs li {
  display: flex;
  align-items: center;
}

.breadcrumbs a {
  color: #007bff;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumbs a:hover {
  color: #0056b3;
  text-decoration: underline;
}

.breadcrumbs .separator {
  margin: 0 0.5rem;
  color: #6c757d;
}

.breadcrumbs span:last-child {
  color: #495057;
  font-weight: 500;
}
</style>
