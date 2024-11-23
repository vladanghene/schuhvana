<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-content">
        <router-link to="/" class="brand">Schuhvana</router-link>
        <div class="nav-links">
          <router-link to="/men">Men</router-link>
          <router-link to="/women">Women</router-link>
          <router-link to="/kids">Kids</router-link>
        </div>
        <div class="nav-actions">
          <router-link to="/cart" class="cart-link">
            Cart ({{ cartItemCount }})
          </router-link>
          <template v-if="isAuthenticated">
            <router-link to="/account">Account</router-link>
            <button @click="handleLogout" class="logout-btn">Logout</button>
          </template>
          <router-link v-else to="/login">Login</router-link>
        </div>
      </div>
    </nav>
    <router-view />
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-links">
          <router-link to="/">Home</router-link>
          <router-link to="/contact">Contact Us</router-link>
          <router-link to="/terms">Terms & Conditions</router-link>
          <router-link to="/privacy">Privacy Policy</router-link>
        </div>
        <div class="social-links">
          <a href="#" target="_blank" rel="noopener">Facebook</a>
          <a href="#" target="_blank" rel="noopener">Instagram</a>
          <a href="#" target="_blank" rel="noopener">Twitter</a>
        </div>
        <div class="payment-methods">
          <span>Payment Methods</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapState('user', ['isAuthenticated']),
    ...mapGetters('cart', {
      cartItemCount: 'itemCount'
    })
  },
  methods: {
    ...mapActions('user', ['initialize', 'logout']),
    handleLogout() {
      this.logout();
      this.$router.push('/');
    }
  },
  created() {
    // Initialize user settings
    this.initialize();
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: #2c3e50;
  text-decoration: none;
  font-weight: 500;
}

.nav-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-actions a {
  color: #2c3e50;
  text-decoration: none;
}

.cart-link {
  padding: 0.5rem 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid #dc3545;
  color: #dc3545;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #dc3545;
  color: white;
}

.footer {
  margin-top: auto;
  background-color: #f8f9fa;
  padding: 2rem 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;
}

.footer-links a {
  color: #6c757d;
  text-decoration: none;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;
}

.social-links a {
  color: #6c757d;
  text-decoration: none;
}

.payment-methods {
  text-align: center;
  color: #6c757d;
}

/* Router link active state */
.router-link-active {
  color: #007bff !important;
}
</style>