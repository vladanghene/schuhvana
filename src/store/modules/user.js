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
    availableScales: ['EU', 'US', 'UK', 'CM', 'JP'],
    loading: false,
    error: null
  },

  mutations: {
    setUser(state, userInfo) {
      state.userInfo = userInfo;
      state.isAuthenticated = true;
      
      // Restore user's preferred scale if saved in their profile
      if (userInfo?.preferences?.sizeScale) {
        state.userPreferredScale = userInfo.preferences.sizeScale;
        localStorage.setItem('userPreferredScale', userInfo.preferences.sizeScale);
      }
    },

    setToken(state, token) {
      localStorage.setItem(TOKEN_KEY, token);
      state.isAuthenticated = true;
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
    },

    updateUserInfo(state, info) {
      state.userInfo = {
        ...state.userInfo,
        ...info
      };
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
          name: 'Max Mustermann',
          preferences: {
            sizeScale: 'EU'
          }
        };

        const token = generateMockToken(email);
        
        commit('setToken', token);
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
        // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // Optionally fetch user data here if needed
      }
    }
  },

  getters: {
    isAuthenticated: state => state.isAuthenticated,
    getUserInfo: state => {
      if (!state.isAuthenticated) return null;
      return state.userInfo || {
        name: 'Max Mustermann',
        email: process.env.VUE_APP_TEST_USER_EMAIL || 'test@schuhvana.com',
        preferences: {
          sizeScale: state.userPreferredScale
        }
      };
    },
    userPreferredScale: state => state.userPreferredScale,
    availableScales: state => state.availableScales,
    isLoading: state => state.loading,
    error: state => state.error
  }
};