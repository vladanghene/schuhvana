<template>
  <div class="user-account-page">
    <h2>My Account</h2>
    
    <div class="account-navigation">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="currentTab = tab.id"
        :class="['tab-button', { active: currentTab === tab.id }]"
      >
        {{ tab.name }}
      </button>
    </div>

    <div class="tab-content">
      <!-- Profile Overview Tab -->
      <div v-if="currentTab === 'overview'" class="account-info">
        <p><strong>Name:</strong> {{ userInfo.name }}</p>
        <p><strong>Email:</strong> {{ userInfo.email }}</p>
        <p><strong>Preferred Size Scale:</strong> {{ userPreferredScale }}</p>
        <button @click="logout" class="logout-button">Logout</button>
      </div>

      <!-- Settings Tab -->
      <div v-if="currentTab === 'settings'">
        <AccountSettings />
      </div>

      <!-- Order History Tab -->
      <div v-if="currentTab === 'orders'" class="order-history">
        <h3>Order History</h3>
        <div v-if="orders.length">
          <ul>
            <li v-for="order in orders" :key="order.id">
              <p>Order #{{ order.id }} - Total: ${{ order.total }}</p>
              <router-link :to="'/order/' + order.id">View Order</router-link>
            </li>
          </ul>
        </div>
        <p v-else>No orders yet.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import AccountSettings from '@/components/AccountSettings.vue';

export default {
  components: {
    AccountSettings
  },
  data() {
    return {
      currentTab: 'overview',
      tabs: [
        { id: 'overview', name: 'Overview' },
        { id: 'settings', name: 'Settings' },
        { id: 'orders', name: 'Orders' }
      ]
    };
  },
  computed: {
    ...mapState('user', ['userPreferredScale']),
    ...mapGetters('user', ['getUserInfo']),
    userInfo() {
      return this.getUserInfo || {};
    },
    orders() {
      return [
        { id: 1, total: 150 },
        { id: 2, total: 75 },
      ];
    },
  },
  methods: {
    ...mapActions('user', ['logout']),
  },
};
</script>

<style scoped>
.user-account-page {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.account-navigation {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
  border-bottom: 2px solid transparent;
}

.tab-button.active {
  color: #007bff;
  border-bottom-color: #007bff;
}

.tab-content {
  margin-top: 2rem;
}

.logout-button {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

.order-history ul {
  list-style-type: none;
  padding: 0;
}

.order-history li {
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
}
</style>