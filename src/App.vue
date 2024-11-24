<template>
  <v-app>
    <v-app-bar 
      color="white" 
      elevation="0"
      border
      class="px-4"
    >
      <v-app-bar-title class="font-weight-light">
        <router-link to="/" class="text-decoration-none">
          <span class="text-h5" style="letter-spacing: 1.5px;">SCHUHVANA</span>
        </router-link>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <div class="d-none d-md-flex">
        <v-btn
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          variant="text"
          class="text-body-2 font-weight-regular mx-2"
          style="letter-spacing: 0.5px;"
        >
          {{ item.text }}
        </v-btn>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        to="/cart"
        variant="text"
        class="text-body-2"
        style="letter-spacing: 0.5px;"
      >
        <v-icon icon="mdi-shopping" class="me-1" size="small"></v-icon>
        Cart ({{ cartItemCount }})
      </v-btn>

      <template v-if="isAuthenticated">
        <v-btn
          to="/account"
          variant="text"
          class="text-body-2 ms-2"
          style="letter-spacing: 0.5px;"
        >
          <v-icon icon="mdi-account" class="me-1" size="small"></v-icon>
          Account
        </v-btn>
        <v-btn
          @click="handleLogout"
          variant="text"
          class="text-body-2 ms-2"
          style="letter-spacing: 0.5px;"
        >
          <v-icon icon="mdi-logout" class="me-1" size="small"></v-icon>
          Logout
        </v-btn>
      </template>
      <v-btn
        v-else
        to="/login"
        variant="text"
        class="text-body-2 ms-2"
        style="letter-spacing: 0.5px;"
      >
        <v-icon icon="mdi-login" class="me-1" size="small"></v-icon>
        Login
      </v-btn>

      <v-btn
        class="d-md-none ms-2"
        icon
        variant="text"
        @click="drawer = !drawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      temporary
      location="right"
      class="d-md-none"
    >
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          :title="item.text"
          class="text-body-2"
          style="letter-spacing: 0.5px;"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-4">
      <router-view />
    </v-main>

    <v-footer class="bg-white" border>
      <v-container class="py-4">
        <v-row>
          <v-col cols="12" md="4">
            <div class="text-center text-md-left">
              <v-btn
                v-for="link in footerLinks"
                :key="link.to"
                :to="link.to"
                variant="text"
                class="text-body-2 px-2"
                style="letter-spacing: 0.5px;"
              >
                {{ link.text }}
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" md="4" class="text-center">
            <div class="social-links">
              <v-btn
                v-for="social in socialLinks"
                :key="social.url"
                :href="social.url"
                target="_blank"
                rel="noopener"
                icon
                variant="text"
                size="small"
                class="mx-1"
              >
                <v-icon>{{ social.icon }}</v-icon>
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" md="4" class="text-center text-md-right">
            <span class="text-caption text-medium-emphasis" style="letter-spacing: 0.5px;">Payment Methods</span>
            <div class="mt-2">
              <v-icon class="mx-1 text-medium-emphasis" size="small">mdi-credit-card</v-icon>
              <v-icon class="mx-1 text-medium-emphasis" size="small">mdi-paypal</v-icon>
              <v-icon class="mx-1 text-medium-emphasis" size="small">mdi-apple-pay</v-icon>
              <v-icon class="mx-1 text-medium-emphasis" size="small">mdi-google-pay</v-icon>
            </div>
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <v-row>
          <v-col cols="12" class="text-center">
            <span class="text-caption text-medium-emphasis" style="letter-spacing: 1px;">
              {{ new Date().getFullYear() }} SCHUHVANA. ALL RIGHTS RESERVED.
            </span>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'App',
  data() {
    return {
      drawer: false,
      menuItems: [
        { text: 'MEN', to: '/men' },
        { text: 'WOMEN', to: '/women' },
        { text: 'KIDS', to: '/kids' }
      ],
      footerLinks: [
        { text: 'HOME', to: '/' },
        { text: 'CONTACT', to: '/contact' },
        { text: 'TERMS', to: '/terms' },
        { text: 'PRIVACY', to: '/privacy' }
      ],
      socialLinks: [
        { icon: 'mdi-facebook', url: '#' },
        { icon: 'mdi-instagram', url: '#' },
        { icon: 'mdi-twitter', url: '#' }
      ]
    };
  },
  computed: {
    ...mapState('user', ['isAuthenticated']),
    ...mapGetters('cart', ['cartItemCount'])
  },
  methods: {
    ...mapActions('user', ['logout']),
    async handleLogout() {
      try {
        await this.logout();
        this.$router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  },
  created() {
    this.$store.dispatch('user/checkAuth');
  }
};
</script>

<style>
/* Global styles */
:root {
  --v-theme-primary: #1a1a1a;
  --v-theme-secondary: #757575;
  --v-theme-accent: #c4c4c4;
  --v-theme-error: #b00020;
  --v-theme-info: #2196F3;
  --v-theme-success: #4CAF50;
  --v-theme-warning: #FB8C00;
}

.v-application {
  font-family: 'Inter', 'Roboto', sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.v-btn {
  text-transform: none !important;
  letter-spacing: 0.5px !important;
}

.v-card {
  border-radius: 8px !important;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important;
}

.text-h5 {
  font-weight: 300 !important;
}

/* Smooth transitions */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>