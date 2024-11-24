<template>
  <div class="settings-container">
    <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
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
              hide-details="auto"
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
              hide-details="auto"
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
              bg-color="white"
              hide-details="auto"
              class="mb-4"
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
              hide-details="auto"
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
                  v-model="emailNotifications"
                  color="black"
                  hide-details
                ></v-switch>
              </div>

              <div class="d-flex justify-space-between align-center mb-4">
                <div>
                  <span class="text-body-1 font-weight-medium">SMS Notifications</span>
                  <div class="text-caption text-medium-emphasis">Get text messages about order status</div>
                </div>
                <v-switch
                  v-model="smsNotifications"
                  color="black"
                  hide-details
                ></v-switch>
              </div>

              <div class="d-flex justify-space-between align-center">
                <div>
                  <span class="text-body-1 font-weight-medium">Marketing Communications</span>
                  <div class="text-caption text-medium-emphasis">Stay updated with new releases and exclusive offers</div>
                </div>
                <v-switch
                  v-model="marketingNotifications"
                  color="black"
                  hide-details
                ></v-switch>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </div>

      <!-- Privacy Settings -->
      <div class="mb-8">
        <h3 class="text-h6 font-weight-regular mb-6" style="letter-spacing: 0.5px;">Privacy Settings</h3>
        <v-card variant="outlined" class="pa-4">
          <v-row>
            <v-col cols="12">
              <div class="d-flex justify-space-between align-center mb-4">
                <div>
                  <span class="text-body-1 font-weight-medium">Profile Visibility</span>
                  <div class="text-caption text-medium-emphasis">Allow other users to see your profile</div>
                </div>
                <v-switch
                  v-model="profileVisibility"
                  color="black"
                  hide-details
                ></v-switch>
              </div>

              <div class="d-flex justify-space-between align-center">
                <div>
                  <span class="text-body-1 font-weight-medium">Data Collection</span>
                  <div class="text-caption text-medium-emphasis">Allow us to collect usage data to improve your experience</div>
                </div>
                <v-switch
                  v-model="dataCollection"
                  color="black"
                  hide-details
                ></v-switch>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </div>

      <!-- Action Buttons -->
      <div class="d-flex gap-4 justify-end">
        <v-btn
          variant="outlined"
          color="black"
          size="large"
          style="letter-spacing: 0.5px; min-width: 120px;"
          @click="resetForm"
        >
          Cancel
        </v-btn>
        <v-btn
          type="submit"
          color="black"
          size="large"
          style="letter-spacing: 0.5px; min-width: 120px;"
          :loading="loading"
        >
          Save Changes
        </v-btn>
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
      loading: false,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      currentPassword: '',
      newPassword: '',
      showCurrentPassword: false,
      showNewPassword: false,
      emailNotifications: true,
      smsNotifications: false,
      marketingNotifications: true,
      profileVisibility: false,
      dataCollection: true
    };
  },
  computed: {
    ...mapState('user', ['user'])
  },
  methods: {
    ...mapActions('user', ['updateUserProfile']),
    async handleSubmit() {
      if (!this.$refs.form.validate()) return;

      this.loading = true;
      try {
        await this.updateUserProfile({
          firstName: this.firstName,
          lastName: this.lastName,
          phone: this.phone,
          password: this.newPassword || undefined,
          settings: {
            emailNotifications: this.emailNotifications,
            smsNotifications: this.smsNotifications,
            marketingNotifications: this.marketingNotifications,
            profileVisibility: this.profileVisibility,
            dataCollection: this.dataCollection
          }
        });
        // Show success message
      } catch (error) {
        console.error('Failed to update profile:', error);
        // Show error message
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.$refs.form.reset();
      this.loadUserData();
    },
    loadUserData() {
      if (this.user) {
        this.firstName = this.user.firstName || '';
        this.lastName = this.user.lastName || '';
        this.email = this.user.email || '';
        this.phone = this.user.phone || '';
        // Load other settings if available
      }
    }
  },
  created() {
    this.loadUserData();
  }
};
</script>

<style scoped>
.settings-container {
  max-width: 800px;
  margin: 0 auto;
}

.v-text-field :deep(.v-field__input) {
  font-size: 0.95rem !important;
  font-weight: 400 !important;
  letter-spacing: 0.5px !important;
}

.v-text-field :deep(.v-label) {
  font-size: 0.95rem !important;
  font-weight: 400 !important;
  letter-spacing: 0.5px !important;
  color: var(--v-theme-secondary) !important;
}

.v-switch :deep(.v-switch__track) {
  opacity: 0.12;
}

.v-switch :deep(.v-switch__thumb) {
  color: var(--v-theme-primary);
}

.gap-4 {
  gap: 16px;
}
</style>
