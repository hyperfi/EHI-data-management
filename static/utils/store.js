
export default Vuex.createStore({
  state: {
    isLoggedIn: sessionStorage.getItem('isLoggedIn') === 'true',
    authToken: sessionStorage.getItem('authToken') || null,
  },
  mutations: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.authToken = null;
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('isLoggedIn');
    },
    setAuthToken(state, token) {
      state.authToken = token;
      sessionStorage.setItem('authToken', token);
    },
  },
  actions: {
    login({ commit }) {
      commit('login');
    },
    logout({ commit }) {
      commit('logout');
    },
    setAuthToken({ commit }, token) {
      commit('setAuthToken', token);
    },
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
    authToken: (state) => state.authToken,
  },
});