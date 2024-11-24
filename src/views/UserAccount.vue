<template>
  <v-container fluid class="fill-height bg-grey-lighten-4 py-8">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <div class="d-flex flex-column gap-6">
          <!-- Header -->
          <v-card class="pa-6" elevation="0" rounded="lg">
            <div class="d-flex align-center justify-space-between flex-wrap gap-4">
              <div>
                <h1 class="text-h4 font-weight-light mb-2" style="letter-spacing: 1.5px;">My Account</h1>
                <p class="text-body-1 text-medium-emphasis font-weight-light" style="letter-spacing: 0.5px;">
                  Welcome back, {{ userData?.firstName || 'Max' }}
                </p>
              </div>
              <div class="d-flex gap-4">
                <v-btn
                  prepend-icon="mdi-cog"
                  variant="outlined"
                  color="black"
                  style="letter-spacing: 0.5px;"
                  @click="showSettings = true"
                >
                  Settings
                </v-btn>
                <v-btn
                  prepend-icon="mdi-logout"
                  color="black"
                  style="letter-spacing: 0.5px;"
                  @click="handleLogout"
                >
                  Sign Out
                </v-btn>
              </div>
            </div>
          </v-card>

          <!-- Main Content -->
          <v-card class="pa-0" elevation="0" rounded="lg">
            <v-tabs
              v-model="activeTab"
              color="black"
              align-tabs="center"
              class="border-b"
            >
              <v-tab
                v-for="tab in tabs"
                :key="tab.value"
                :value="tab.value"
                class="text-body-2"
                style="letter-spacing: 1px; text-transform: uppercase;"
              >
                {{ tab.label }}
              </v-tab>
            </v-tabs>

            <v-window v-model="activeTab">
              <!-- Overview Tab -->
              <v-window-item value="overview">
                <v-container class="pa-6">
                  <v-row>
                    <v-col cols="12" md="6">
                      <div class="mb-6">
                        <h3 class="text-h6 font-weight-regular mb-4" style="letter-spacing: 0.5px;">Recent Orders</h3>
                        <v-list v-if="orders.length" class="bg-grey-lighten-5">
                          <v-list-item
                            v-for="order in orders"
                            :key="order.id"
                            :title="order.name"
                            :subtitle="`Order #${order.id} - ${order.date}`"
                            class="mb-2 rounded"
                          >
                            <template v-slot:prepend>
                              <v-avatar color="grey-lighten-3" size="48">
                                <v-img :src="order.image" cover></v-img>
                              </v-avatar>
                            </template>
                            <template v-slot:append>
                              <v-chip
                                :color="getStatusColor(order.status)"
                                variant="tonal"
                                size="small"
                                class="text-caption"
                              >
                                {{ order.status }}
                              </v-chip>
                            </template>
                          </v-list-item>
                        </v-list>
                        <v-alert
                          v-else
                          type="info"
                          variant="tonal"
                          class="mb-4"
                        >
                          No orders yet
                        </v-alert>
                      </div>

                      <div>
                        <h3 class="text-h6 font-weight-regular mb-4" style="letter-spacing: 0.5px;">Saved Addresses</h3>
                        <v-list v-if="addresses.length" class="bg-grey-lighten-5">
                          <v-list-item
                            v-for="address in addresses"
                            :key="address.id"
                            :title="address.name"
                            :subtitle="address.street"
                            class="mb-2 rounded"
                          >
                            <template v-slot:prepend>
                              <v-icon icon="mdi-map-marker" size="24"></v-icon>
                            </template>
                          </v-list-item>
                        </v-list>
                        <v-alert
                          v-else
                          type="info"
                          variant="tonal"
                          class="mb-4"
                        >
                          No saved addresses
                        </v-alert>
                      </div>
                    </v-col>

                    <v-col cols="12" md="6">
                      <div class="mb-6">
                        <div class="d-flex align-center mb-4">
                          <v-icon icon="mdi-shoe-sneaker" size="24" class="me-2"></v-icon>
                          <h3 class="text-h6 font-weight-regular" style="letter-spacing: 0.5px;">Size Preferences</h3>
                        </div>                        
                        <v-card variant="outlined" class="pa-4">
                          <div class="d-flex justify-space-between align-center mb-4">
                            <div>
                              <span class="text-body-2 font-weight-medium">Selected Size Scale</span>
                              <div class="text-caption text-medium-emphasis">Your preferred measurement system</div>
                            </div>
                            <v-select
                              v-model="currentScale"
                              :items="getAvailableScales"
                              variant="outlined"
                              density="compact"
                              hide-details
                              class="size-select"
                            ></v-select>
                          </div>
                          <div class="d-flex justify-space-between align-center">
                            <div>
                              <span class="text-body-2 font-weight-medium">Your Size</span>
                              <div class="text-caption text-medium-emphasis">Based on your selected scale</div>
                            </div>
                            <v-select
                              v-model="currentSize"
                              :items="availableSizes"
                              variant="outlined"
                              density="compact"
                              hide-details
                              class="size-select"
                            ></v-select>
                          </div>
                        </v-card>
                      </div>
                      <div>
                        <h3 class="text-h6 font-weight-regular mb-4" style="letter-spacing: 0.5px;">Payment Methods</h3>
                        <v-list v-if="paymentMethods.length" class="bg-grey-lighten-5">
                          <v-list-item
                            v-for="method in paymentMethods"
                            :key="method.id"
                            :title="`${method.brand} ending in ${method.last4}`"
                            :subtitle="`Expires ${method.expMonth}/${method.expYear}`"
                            class="mb-2 rounded"
                          >
                            <template v-slot:prepend>
                              <v-icon :icon="getCardIcon(method.brand)" size="24"></v-icon>
                            </template>
                          </v-list-item>
                        </v-list>
                        <v-alert
                          v-else
                          type="info"
                          variant="tonal"
                          class="mb-4"
                        >
                          No saved payment methods
                        </v-alert>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-window-item>

              <!-- Orders Tab -->
              <v-window-item value="orders">
                <v-container class="pa-6">
                  <div class="d-flex flex-column gap-6">
                    <!-- Orders Filter -->
                    <v-card variant="outlined" class="pa-4">
                      <div class="d-flex flex-wrap gap-4 align-center justify-space-between mb-4">
                        <div>
                          <h3 class="text-h6 font-weight-regular" style="letter-spacing: 0.5px;">Order History</h3>
                          <p class="text-body-2 text-medium-emphasis">View and track your orders</p>
                        </div>
                        <div class="d-flex gap-4">
                          <v-select
                            v-model="orderFilter"
                            :items="['All Orders', 'Processing', 'Shipped', 'Delivered', 'Cancelled']"
                            variant="outlined"
                            density="comfortable"
                            hide-details
                            class="max-width-200"
                          ></v-select>
                          <v-text-field
                            v-model="orderSearch"
                            placeholder="Search orders..."
                            prepend-inner-icon="mdi-magnify"
                            variant="outlined"
                            density="comfortable"
                            hide-details
                            class="max-width-200"
                          ></v-text-field>
                        </div>
                      </div>
                    </v-card>

                    <!-- Orders List -->
                    <v-card variant="outlined" class="pa-0">
                      <v-data-table
                        :headers="orderHeaders"
                        :items="filteredOrders"
                        :loading="loading"
                        hover
                      >
                        <template v-slot:item.status="{ item }">
                          <v-chip
                            :color="getStatusColor(item.columns.status)"
                            variant="tonal"
                            size="small"
                            class="text-caption"
                          >
                            {{ item.columns.status }}
                          </v-chip>
                        </template>
                        <template v-slot:item.actions="{ item }">
                          <v-btn
                            variant="text"
                            density="comfortable"
                            icon="mdi-eye"
                            @click="viewOrderDetails(item.columns)"
                          ></v-btn>
                        </template>
                      </v-data-table>
                    </v-card>

                    <!-- Order Details Dialog -->
                    <v-dialog v-model="showOrderDetails" width="600">
                      <v-card v-if="selectedOrder">
                        <v-card-title class="d-flex justify-space-between align-center pa-4">
                          <span class="text-h6">Order Details #{{ selectedOrder.id }}</span>
                          <v-btn icon="mdi-close" variant="text" @click="showOrderDetails = false"></v-btn>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text class="pa-4">
                          <div class="d-flex flex-column gap-4">
                            <div>
                              <div class="text-subtitle-2 mb-1">Order Status</div>
                              <v-chip
                                :color="getStatusColor(selectedOrder.status)"
                                variant="tonal"
                                size="small"
                              >
                                {{ selectedOrder.status }}
                              </v-chip>
                            </div>
                            <div>
                              <div class="text-subtitle-2 mb-2">Items</div>
                              <v-list>
                                <v-list-item
                                  v-for="item in selectedOrder.items"
                                  :key="item.id"
                                  :title="item.name"
                                  :subtitle="`Size: ${item.size} | Quantity: ${item.quantity}`"
                                >
                                  <template v-slot:prepend>
                                    <v-avatar size="48">
                                      <v-img :src="item.image" cover></v-img>
                                    </v-avatar>
                                  </template>
                                  <template v-slot:append>
                                    {{ formatPrice(item.price) }}
                                  </template>
                                </v-list-item>
                              </v-list>
                            </div>
                            <v-divider></v-divider>
                            <div class="d-flex justify-space-between">
                              <span class="text-subtitle-1">Total</span>
                              <span class="text-subtitle-1">{{ formatPrice(selectedOrder.total) }}</span>
                            </div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  </div>
                </v-container>
              </v-window-item>

              <!-- Settings Tab -->
              <v-window-item value="settings">
                <v-container class="pa-6">
                  <AccountSettings @saved="handleSettingsSaved" />
                </v-container>
              </v-window-item>
            </v-window>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import AccountSettings from '@/components/AccountSettings.vue';

export default {
  name: 'UserAccount',
  components: {
    AccountSettings
  },
  data() {
    return {
      activeTab: 'overview',
      tabs: [
        { label: 'Overview', value: 'overview' },
        { label: 'Orders', value: 'orders' },
        { label: 'Settings', value: 'settings' }
      ],
      showPreferences: false,
      showSizeGuide: false,
      showSettings: false,
      showOrderDetails: false,
      selectedOrder: null,
      loading: false,
      orderFilter: 'All Orders',
      orderSearch: '',
      orders: [
        {
          id: 'ORD-001',
          date: '2023-07-01',
          name: 'Classic Leather Sneakers',
          total: '$129.99',
          status: 'Delivered',
          image: 'https://example.com/shoe1.jpg',
          items: [
            {
              id: 1,
              name: 'Classic Leather Sneakers',
              size: '42',
              quantity: 1,
              price: 129.99,
              image: 'https://example.com/shoe1.jpg'
            }
          ]
        },
        {
          id: 'ORD-002',
          date: '2023-07-15',
          name: 'Running Performance Shoes',
          total: '$159.99',
          status: 'Processing',
          image: 'https://example.com/shoe2.jpg',
          items: [
            {
              id: 2,
              name: 'Running Performance Shoes',
              size: '43',
              quantity: 1,
              price: 159.99,
              image: 'https://example.com/shoe2.jpg'
            }
          ]
        }
      ],
      addresses: [
        {
          id: 1,
          name: 'Home',
          street: '123 Main St, Apt 4B, New York, NY 10001'
        },
        {
          id: 2,
          name: 'Work',
          street: '456 Business Ave, Suite 300, New York, NY 10002'
        }
      ],
      paymentMethods: [
        {
          id: 1,
          brand: 'Visa',
          last4: '4242',
          expMonth: '12',
          expYear: '2024'
        },
        {
          id: 2,
          brand: 'Mastercard',
          last4: '8888',
          expMonth: '03',
          expYear: '2025'
        }
      ]
    };
  },
  computed: {
    ...mapState('user', ['userPreferredScale', 'availableScales', 'user', 'userInfo']),
    ...mapGetters('products', ['getAvailableScales', 'getSizeConversions', 'getProductSizes']),
    currentScale: {
      get() {
        return this.userPreferredScale || 'EU';
      },
      set(value) {
        this.handleScaleChange(value);
      }
    },
    currentSize: {
      get() {
        return this.userInfo?.preferences?.shoeSize || null;
      },
      set(value) {
        this.handleSizeChange(value);
      }
    },
    availableSizes() {
      const sizeType = 'men-regular';
      const sizes = this.getProductSizes({ sizeType });
      return sizes[this.currentScale] || [];
    },
    userData() {
      return this.userInfo;
    },
    filteredOrders() {
      let orders = [...this.orders];
      
      if (this.orderFilter !== 'All Orders') {
        orders = orders.filter(order => order.status === this.orderFilter);
      }
      
      if (this.orderSearch) {
        const searchTerm = this.orderSearch.toLowerCase();
        orders = orders.filter(order => 
          order.id.toString().includes(searchTerm) ||
          order.name.toLowerCase().includes(searchTerm)
        );
      }

      return orders.map(order => ({
        ...order,
        itemCount: order.items ? order.items.length : 0,
        total: order.items ? order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0
      }));
    }
  },
  methods: {
    ...mapActions('user', ['updateUserProfile', 'updatePreferredScale', 'logout']),
    
    async handleLogout() {
      try {
        await this.logout();
        this.$router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },
    
    async handleScaleChange(newScale) {
      if (newScale === this.currentScale) return;
      
      const oldScale = this.currentScale;

      // First update the scale in store
      await this.updatePreferredScale(newScale);

      // Convert the size using product store's conversion mechanism
      if (this.currentSize) {
        const mockProduct = { sizeType: 'men-regular' }; // This should come from user preferences
        const conversions = this.getSizeConversions(this.currentSize, mockProduct);
        
        if (conversions && conversions[newScale]) {
          const newSize = conversions[newScale];
          
          // Update the size in user preferences
          await this.updateUserProfile({
            preferences: {
              ...this.userInfo?.preferences,
              sizeScale: newScale,
              shoeSize: newSize
            }
          });
        }
      }
    },

    async handleSizeChange(newSize) {
      if (newSize === this.currentSize) return;
      
      // Update the size in user preferences
      await this.updateUserProfile({
        preferences: {
          ...this.userInfo?.preferences,
          shoeSize: newSize
        }
      });
    },
    
    getStatusColor(status) {
      const colors = {
        'Delivered': 'success',
        'Processing': 'info',
        'Shipped': 'primary',
        'Cancelled': 'error'
      };
      return colors[status] || 'grey';
    },
    
    getCardIcon(brand) {
      const icons = {
        'Visa': 'mdi-credit-card',
        'Mastercard': 'mdi-credit-card',
        'American Express': 'mdi-credit-card',
        'Discover': 'mdi-credit-card'
      };
      return icons[brand] || 'mdi-credit-card';
    },
    
    formatPrice(price) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(price);
    },
    
    viewOrderDetails(order) {
      this.selectedOrder = order;
      this.showOrderDetails = true;
    },
    
    handleSettingsSaved() {
      this.$store.dispatch('user/initialize');
    }
  }
};
</script>

<style scoped>
.size-select {
  max-width: 120px;
}

.v-list-item {
  transition: background-color 0.2s ease;
}

.v-list-item:hover {
  background-color: rgb(0 0 0 / 0.02);
}

.border-b {
  border-bottom: 1px solid rgb(0 0 0 / 0.1);
}

.gap-6 {
  gap: 24px;
}

.gap-4 {
  gap: 16px;
}
</style>