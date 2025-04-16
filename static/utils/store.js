// import Vue from 'vue';
// import Vuex from 'vuex';

// Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoggedIn: sessionStorage.getItem('isLoggedIn') === 'true', // Initialize from sessionStorage
    authToken: sessionStorage.getItem('authToken') || null, // Initialize token from sessionStorage
  },
  mutations: {
    login(state) {
      state.isLoggedIn = true; // Set logged-in state to true
    },
    logout(state) {
      state.isLoggedIn = false; // Set logged-in state to false
      state.authToken = null; // Clear the auth token
    },
    setAuthToken(state, token) {
      state.authToken = token; // Set the auth token
    },
  },
  actions: {
    login({ commit }) {
      commit('login'); // Commit the login mutation
    },
    logout({ commit }) {
      commit('logout'); // Commit the logout mutation
      sessionStorage.removeItem('authToken'); // Remove token from sessionStorage
      sessionStorage.removeItem('isLoggedIn'); // Remove login state from sessionStorage
    },
    setAuthToken({ commit }, token) {
      commit('setAuthToken', token); // Commit the token mutation
      sessionStorage.setItem('authToken', token); // Save token to sessionStorage
    },
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn, // Getter to access the logged-in state
    authToken: (state) => state.authToken, // Getter to access the auth token
  },
});