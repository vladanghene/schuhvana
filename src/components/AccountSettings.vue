<template>
  <div class="settings-container">
    <v-form ref="form" v-model="valid">
      <!-- Personal Information -->
      <div class="mb-8">
        <h3 class="text-h6 font-weight-regular mb-6" style="letter-spacing: 0.5px;">Personal Information</h3>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="firstName"
              label="First Name"
              variant="outlined"
              density="comfortable"
              bg-color="white"
              :rules="[v => !!v || 'First name is required']"
              class="mb-4"
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="lastName"
              label="Last Name"
              variant="outlined"
              density="comfortable"
              bg-color="white"
              :rules="[v => !!v || 'Last name is required']"
              class="mb-4"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="email"
              label="Email Address"
              type="email"
              variant="outlined"
              density="comfortable"
              class="mb-4 readonly-field"
              :readonly="true"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="phone"
              label="Phone Number"
              variant="outlined"
              density="comfortable"
              bg-color="white"
              :rules="[v => !v || /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4}$/.test(v) || 'Please enter a valid phone number']"
              class="mb-4"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>

      <!-- Password Settings -->
      <div class="mb-8">
        <h3 class="text-h6 font-weight-regular mb-6" style="letter-spacing: 0.5px;">Password Settings</h3>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="currentPassword"
              label="Current Password"
              :type="showCurrentPassword ? 'text' : 'password'"
              variant="outlined"
              density="comfortable"
              bg-color="white"
              hide-details="auto"
              class="mb-4"
              :append-inner-icon="showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showCurrentPassword = !showCurrentPassword"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="newPassword"
              label="New Password"
              :type="showNewPassword ? 'text' : 'password'"
              variant="outlined"
              density="comfortable"
              bg-color="white"
              hide-details="auto"
              class="mb-4"
              :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showNewPassword = !showNewPassword"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>

      <!-- Notifications -->
      <div class="mb-8">
        <h3 class="text-h6 font-weight-regular mb-6" style="letter-spacing: 0.5px;">Notification Preferences</h3>
        <v-card variant="outlined" class="pa-4 mb-4">
          <v-row>
            <v-col cols="12">
              <div class="d-flex justify-space-between align-center mb-4">
                <div>
                  <span class="text-body-1 font-weight-medium">Email Notifications</span>
                  <div class="text-caption text-medium-emphasis">Receive updates about your orders and account</div>
                </div>
                <v-switch
                  v-model="preferences.emailNotifications"
                  color="black"
                  hide-details
                ></v-switch>
              </div>

              <div class="d-flex justify-space-between align-center mb-4">
                <div>
                  <span class="text-body-1 font-weight-medium">Order Updates</span>
                  <div class="text-caption text-medium-emphasis">Get updates about your orders</div>
                </div>
                <v-switch
                  v-model="preferences.orderUpdates"
                  color="black"
                  hide-details
                ></v-switch>
              </div>

              <div class="d-flex justify-space-between align-center mb-4">
                <div>
                  <span class="text-body-1 font-weight-medium">Promotional Emails</span>
                  <div class="text-caption text-medium-emphasis">Get promotional emails about our products</div>
                </div>
                <v-switch
                  v-model="preferences.promotionalEmails"
                  color="black"
                  hide-details
                ></v-switch>
              </div>

              <div class="d-flex justify-space-between align-center">
                <div>
                  <span class="text-body-1 font-weight-medium">Profile Visibility</span>
                  <div class="text-caption text-medium-emphasis">Allow other users to see your profile</div>
                </div>
                <v-select
                  v-model="preferences.profileVisibility"
                  :items="['private', 'public']"
                  color="black"
                  hide-details
                ></v-select>
              </div>

              <div class="d-flex justify-space-between align-center">
                <div>
                  <span class="text-body-1 font-weight-medium">Data Sharing</span>
                  <div class="text-caption text-medium-emphasis">Allow us to share your data with third parties</div>
                </div>
                <v-switch
                  v-model="preferences.dataSharing"
                  color="black"
                  hide-details
                ></v-switch>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </v-form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AccountSettings',
  data() {
    return {
      valid: true,
      initialized: false,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      currentPassword: '',
      newPassword: '',
      showCurrentPassword: false,
      showNewPassword: false,
      preferences: {
        emailNotifications: true,
        orderUpdates: true,
        promotionalEmails: false,
        profileVisibility: 'private',
        dataSharing: false
      },
      updateQueue: new Set()
    };
  },
  computed: {
    ...mapState('user', ['userInfo']),
    userData() {
      return this.userInfo;
    }
  },
  watch: {
    userData: {
      immediate: true,
      handler(newUser) {
        if (newUser) {
          this.loadUserData();
        }
      }
    },
    firstName(newVal) {
      if (this.initialized && newVal !== this.userData?.firstName) {
        this.queueUpdate('firstName', newVal);
      }
    },
    lastName(newVal) {
      if (this.initialized && newVal !== this.userData?.lastName) {
        this.queueUpdate('lastName', newVal);
      }
    },
    phone(newVal) {
      if (this.initialized && newVal !== this.userData?.phone) {
        this.queueUpdate('phone', newVal);
      }
    },
    'preferences': {
      deep: true,
      handler(newVal) {
        if (this.initialized && JSON.stringify(newVal) !== JSON.stringify(this.userData?.preferences)) {
          this.queueUpdate('preferences', { ...newVal });
        }
      }
    }
  },
  methods: {
    ...mapActions('user', ['updateUserProfile']),
    queueUpdate(field, value) {
      this.updateQueue.add({ field, value });
      this.processUpdates();
    },
    debounce(fn, delay) {
      let timeoutId;
      return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          fn.apply(this, args);
        }, delay);
      };
    },
    updateProfile(data) {
      return this.updateUserProfile(data)
        .catch(error => {
          console.error('Failed to update profile:', error);
          throw error;
        });
    },
    loadUserData() {
      if (this.userData) {
        this.initialized = false;
        this.firstName = this.userData.firstName || '';
        this.lastName = this.userData.lastName || '';
        this.email = this.userData.email || '';
        this.phone = this.userData.phone || '';
        
        if (this.userData.preferences) {
          this.preferences = {
            ...this.preferences,
            ...this.userData.preferences
          };
        }
        
        this.$nextTick(() => {
          this.initialized = true;
        });
      }
    }
  },
  created() {
    this.processUpdates = this.debounce(() => {
      if (this.updateQueue.size === 0) return;

      const updates = {};
      this.updateQueue.forEach(update => {
        if (update.field === 'preferences') {
          updates.preferences = update.value;
        } else {
          updates[update.field] = update.value;
        }
      });

      this.updateProfile(updates)
        .then(() => {
          this.updateQueue.clear();
        })
        .catch(error => {
          console.error('Failed to process updates:', error);
        });
    }, 300);
  }
};
</script>

<style scoped>
.settings-container {
  max-width: 800px;
  margin: 0 auto;
}

:deep(.v-field__input) {
  min-height: 44px !important;
  padding-top: 12px !important;
  padding-bottom: 0 !important;
}

:deep(.v-field__outline) {
  --v-field-border-width: 1px !important;
}

:deep(.v-text-field .v-input__details) {
  padding-inline-start: 0;
  min-height: 0;
}

:deep(.v-field__field) {
  gap: 0 !important;
}

:deep(.v-label) {
  margin-bottom: 0;
  font-size: 0.95rem;
  opacity: 0.7;
}

:deep(.readonly-field) {
  opacity: 0.6;
}

:deep(.readonly-field .v-field__input) {
  color: rgba(0, 0, 0, 0.7) !important;
}

:deep(.readonly-field .v-field) {
  background-color: rgb(250, 250, 250) !important;
}

.gap-4 {
  gap: 16px;
}
</style>
