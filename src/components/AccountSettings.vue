<template>
  <div class="account-settings">
    <h3>Account Settings</h3>
    
    <div class="settings-section">
      <h4>Profile Information</h4>
      <div class="form-group">
        <label>Name</label>
        <input type="text" v-model="profileData.name" @change="updateProfile" />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="profileData.email" @change="updateProfile" />
      </div>
    </div>

    <div class="settings-section">
      <h4>Shopping Preferences</h4>
      <div class="form-group">
        <label>Preferred Size Scale</label>
        <select v-model="selectedScale" @change="updateSizePreference">
          <option v-for="scale in availableScales" :key="scale" :value="scale">
            {{ scale }} Size
          </option>
        </select>
        <p class="help-text">This will be your default size scale when shopping.</p>
      </div>
    </div>

    <div v-if="updateStatus" :class="['update-status', updateStatus.type]">
      {{ updateStatus.message }}
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'AccountSettings',
  data() {
    return {
      profileData: {
        name: '',
        email: ''
      },
      selectedScale: null,
      updateStatus: null
    };
  },
  computed: {
    ...mapState('user', ['userInfo', 'userPreferredScale']),
    ...mapGetters('user', ['getAvailableScales', 'getDefaultScale']),
    availableScales() {
      return this.getAvailableScales;
    }
  },
  methods: {
    ...mapActions('user', ['updatePreferredScale', 'updateUserInfo']),
    async updateProfile() {
      try {
        await this.updateUserInfo(this.profileData);
        this.showStatus('success', 'Profile updated successfully');
      } catch (error) {
        this.showStatus('error', 'Failed to update profile');
      }
    },
    async updateSizePreference() {
      try {
        await this.updatePreferredScale(this.selectedScale);
        this.showStatus('success', 'Size preference updated');
      } catch (error) {
        this.showStatus('error', 'Failed to update size preference');
      }
    },
    showStatus(type, message) {
      this.updateStatus = { type, message };
      setTimeout(() => {
        this.updateStatus = null;
      }, 3000);
    }
  },
  created() {
    // Initialize form with current user data
    if (this.userInfo) {
      this.profileData = { ...this.userInfo };
    }
    this.selectedScale = this.userPreferredScale;
  }
};
</script>

<style scoped>
.account-settings {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

.settings-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #eee;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input, select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.help-text {
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
}

.update-status {
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
}

.success {
  background-color: #d4edda;
  color: #155724;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
}
</style>
