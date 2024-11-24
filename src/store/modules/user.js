import axios from 'axios';

const TOKEN_KEY = 'auth_token';

// Mock token generation for development
const generateMockToken = (email) => {
  return btoa(JSON.stringify({
    email,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  }));
};

export default {
  namespaced: true,
  state: {
    userInfo: null,
    isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
    userPreferredScale: localStorage.getItem('userPreferredScale') || 'EU',
    defaultScale: 'EU',
    availableScales: ['EU', 'US', 'UK', 'CM', 'IN'],
    loading: false,
    error: null
  },

  mutations: {
    setUser(state, userInfo) {
      state.userInfo = userInfo ? { ...userInfo } : null;
      state.isAuthenticated = !!userInfo;
      
      if (userInfo?.preferences?.sizeScale) {
        state.userPreferredScale = userInfo.preferences.sizeScale;
        localStorage.setItem('userPreferredScale', userInfo.preferences.sizeScale);
      }
    },

    updateUserInfo(state, info) {
      if (!state.userInfo) return;

      const updatedUser = { ...state.userInfo };
      
      if (info.preferences) {
        updatedUser.preferences = {
          ...updatedUser.preferences,
          ...info.preferences
        };
      }
      
      Object.keys(info).forEach(key => {
        if (key !== 'preferences') {
          updatedUser[key] = info[key];
        }
      });
      
      state.userInfo = updatedUser;
    },

    setLoading(state, status) {
      state.loading = status;
    },

    setError(state, error) {
      state.error = error;
    },

    clearError(state) {
      state.error = null;
    },

    logout(state) {
      state.userInfo = null;
      state.isAuthenticated = false;
      state.userPreferredScale = 'EU';
      localStorage.removeItem(TOKEN_KEY);
      localStorage.setItem('userPreferredScale', 'EU');
    },

    setPreferredScale(state, scale) {
      // Validate scale before setting
      if (!state.availableScales.includes(scale)) {
        scale = state.defaultScale;
      }
      
      state.userPreferredScale = scale;
      localStorage.setItem('userPreferredScale', scale);
      
      // Update the scale in user profile if logged in
      if (state.userInfo) {
        state.userInfo.preferences = {
          ...state.userInfo.preferences,
          sizeScale: scale
        };
      }
    }
  },

  actions: {
    async login({ commit }, { email, password }) {
      try {
        commit('setLoading', true);
        commit('clearError');

        // For development: check against environment variables
        const testEmail = process.env.VUE_APP_TEST_USER_EMAIL;
        const testPassword = process.env.VUE_APP_TEST_USER_PASSWORD;

        if (!testEmail || !testPassword) {
          throw new Error('Test credentials not properly configured in environment');
        }

        if (email !== testEmail || password !== testPassword) {
          throw new Error('Please check your email and password and try again');
        }

        // Mock successful login
        const mockUser = {
          id: 1,
          email: testEmail,
          firstName: 'Max',
          lastName: 'Mustermann',
          phone: '+1 (555) 123-4567',
          preferences: {
            sizeScale: 'EU',
            emailNotifications: true,
            orderUpdates: true,
            promotionalEmails: false,
            profileVisibility: 'private',
            dataSharing: false
          }
        };

        const token = generateMockToken(email);
        
        commit('setUser', mockUser);

        return { user: mockUser, token };
      } catch (error) {
        const message = error.message || 'An error occurred during login';
        commit('setError', message);
        throw new Error(message);
      } finally {
        commit('setLoading', false);
      }
    },

    async logout({ commit }) {
      try {
        // Replace with your actual API endpoint
        // await axios.post('/api/auth/logout');
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        commit('logout');
        delete axios.defaults.headers.common['Authorization'];
      }
    },

    async updatePreferredScale({ commit }, scale) {
      commit('setPreferredScale', scale);
      
      if (this.state.isAuthenticated) {
        try {
          // Replace with your actual API endpoint
          // await axios.patch('/api/user/preferences', {
          //   sizeScale: scale
          // });
        } catch (error) {
          console.error('Failed to update scale preference:', error);
        }
      }
    },

    async updateUserProfile({ commit, state }, data) {
      try {
        commit('setLoading', true);
        commit('clearError');
        
        // In a real app, this would be an API call
        // const response = await axios.patch('/api/user/profile', data);
        
        commit('updateUserInfo', data);
        const result = { ...state.userInfo };
        return result;
      } catch (error) {
        console.error('Action updateUserProfile - Error:', error);
        commit('setError', error.response?.data?.message || 'Failed to update profile');
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },

    async updateUserInfo({ commit }, info) {
      try {
        commit('setLoading', true);
        
        // Replace with your actual API endpoint
        // const response = await axios.patch('/api/user/profile', info);
        
        commit('updateUserInfo', info);
        return info;
      } catch (error) {
        commit('setError', error.response?.data?.message || 'Failed to update profile');
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },

    initialize({ commit }) {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        // Set up mock user data for development
        const mockUser = {
          id: 1,
          email: process.env.VUE_APP_TEST_USER_EMAIL,
          firstName: 'Max',
          lastName: 'Mustermann',
          phone: '+1 (555) 123-4567',
          preferences: {
            sizeScale: 'EU',
            emailNotifications: true,
            orderUpdates: true,
            promotionalEmails: false,
            profileVisibility: 'private',
            dataSharing: false
          }
        };
        
        commit('setUser', mockUser);
      }
    }
  },

  getters: {
    isAuthenticated: state => state.isAuthenticated,
    getUserInfo: state => state.userInfo,
    getCurrentScale: state => state.userPreferredScale,
    userPreferredScale: state => state.userPreferredScale,
    availableScales: state => state.availableScales,
    isLoading: state => state.loading,
    error: state => state.error
  }
};