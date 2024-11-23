export default {
  namespaced: true,
  state: {
    userInfo: null,
    isAuthenticated: false,
    userPreferredScale: localStorage.getItem('userPreferredScale') || 'EU',
    defaultScale: 'EU', // Default fallback scale
    availableScales: ['EU', 'US', 'UK', 'CM', 'IN'],
  },
  mutations: {
    setUser(state, userInfo) {
      state.userInfo = userInfo;
      state.isAuthenticated = true;
      
      // Restore user's preferred scale if saved in their profile
      if (userInfo?.preferences?.sizeScale) {
        const scale = userInfo.preferences.sizeScale;
        // Validate the scale before setting it
        if (state.availableScales.includes(scale)) {
          state.userPreferredScale = scale;
          localStorage.setItem('userPreferredScale', scale);
        }
      }
    },
    logout(state) {
      state.userInfo = null;
      state.isAuthenticated = false;
      state.userPreferredScale = 'EU';
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
    },
    initializeScale(state) {
      // Ensure we have a valid scale, even if not logged in
      if (!state.availableScales.includes(state.userPreferredScale)) {
        state.userPreferredScale = state.defaultScale;
        localStorage.setItem('userPreferredScale', state.defaultScale);
      }
    }
  },
  actions: {
    login({ commit }, userInfo) {
      // Mock login action
      commit('setUser', userInfo);
    },
    logout({ commit }) {
      commit('logout');
    },
    updatePreferredScale({ commit }, scale) {
      commit('setPreferredScale', scale);
    },
    updateUserInfo({ commit }, info) {
      // Mock API call to update user info
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('updateUserInfo', info);
          resolve();
        }, 500);
      });
    },
    initialize({ commit }) {
      commit('initializeScale');
    }
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    getUserInfo: state => state.userInfo,
    getDefaultScale: state => state.defaultScale,
    getAvailableScales: state => state.availableScales,
    getCurrentScale: state => state.userPreferredScale || state.defaultScale,
  },
};