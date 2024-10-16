export default {
    namespaced: true,
    state: {
      userInfo: null,
      isAuthenticated: false,
    },
    mutations: {
      setUser(state, userInfo) {
        state.userInfo = userInfo;
        state.isAuthenticated = true;
      },
      logout(state) {
        state.userInfo = null;
        state.isAuthenticated = false;
      },
    },
    actions: {
      login({ commit }, userInfo) {
        // Mock login action
        commit('setUser', userInfo);
      },
      logout({ commit }) {
        commit('logout');
      },
    },
    getters: {
      isAuthenticated: (state) => state.isAuthenticated,
      getUserInfo: (state) => state.userInfo,
    },
  };