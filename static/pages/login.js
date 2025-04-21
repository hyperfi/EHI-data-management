const { defineComponent } = Vue;
import store from '../utils/store.js';

export default defineComponent({
  name: 'Login',
  template: `
  <div class="position-relative">
      <!-- Background Video -->
      

      <!-- Login Card -->
      <div class="d-flex justify-content-center align-items-center homestyle" style="background-color: rgba(255, 255, 255, 0.1);">
          <div class="card shadow-lg p-4 w-100" style="max-width: 400px; max-height: 90%; overflow-y: auto; background-color: rgba(255, 255, 255, 0.8);">
              <h1 class="text-center mb-4 display-6">Login</h1>
              <!-- Display error message if it exists -->
              <div v-if="errorMessage" class="alert alert-danger text-center" role="alert">
                  {{ errorMessage }}
              </div>
              <form @submit.prevent="login" class="needs-validation" novalidate>
                  <div class="mb-3">
                      <label for="email" class="form-label">Email:</label>
                      <input 
                        type="email" 
                        id="email" 
                        v-model="formData.email" 
                        class="form-control" 
                        placeholder="Enter your email"
                        required
                        @input="validateEmail">
                      <small class="text-danger" v-if="emailError">{{ emailError }}</small>
                  </div>
                  <div class="mb-3">
                      <label for="password" class="form-label">Password:</label>
                      <input 
                        type="password" 
                        id="password" 
                        v-model="formData.password" 
                        class="form-control" 
                        placeholder="Enter your password"
                        required
                        minlength="6"
                        @input="validatePassword" 
                      />
                      <small class="text-danger" v-if="passwordError">{{ passwordError }}</small>
                  </div>
                  <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
                      <span v-if="isLoading" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      <span v-if="!isLoading">Login</span>
                      <span v-else>Loading...</span>
                  </button>
              </form>
          </div>
      </div>
  </div>
  `,
  data() {
    return {
      formData: {
        email: '',
        password: '',
      },
      errorMessage: '', // To store the error message for display
      emailError: '', // To store email validation error
      passwordError: '', // To store password validation error
      isLoading: false, // To track the loading state of the login button
    };
  },
  methods: {
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.formData.email) {
        this.emailError = 'Email is required.';
      } else if (!emailRegex.test(this.formData.email)) {
        this.emailError = 'Please enter a valid email address.';
      } else {
        this.emailError = '';
      }
    },
    validatePassword() {
      if (!this.formData.password) {
        this.passwordError = 'Password is required.';
      } else if (this.formData.password.length < 6) {
        this.passwordError = 'Password must be at least 6 characters long.';
      } else {
        this.passwordError = '';
      }
    },
    async login() {
      this.validateEmail();
      this.validatePassword();

      if (this.emailError || this.passwordError) {
        return; // Stop if there are validation errors
      }

      this.isLoading = true; // Set loading state to true
      const url = window.location.origin + "/api/login";
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.formData),
        });

        if (!response.ok) {
          const data = await response.json();
          this.errorMessage = data.message || 'Login failed. Please try again.';
        } else {
          const data = await response.json();
          console.log('Login successful:', data.message, data.token);
          this.errorMessage = ''; // Clear any previous error message

          // Save the token and login state in sessionStorage
          sessionStorage.setItem('authToken', data.token);
          sessionStorage.setItem('isLoggedIn', 'true');

          // Update the Vuex store
          store.dispatch('login');
          // clear session storage after a time
          setTimeout(() => {
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('isLoggedIn');
          }, 3600000); // 1 hour in milliseconds

          // Redirect to /add_parent
          // this.$router.go(); // Force a reload to ensure the new route is rendered
          this.$router.push('/add_parent');
        }
      } catch (error) {
        console.error('Error during login:', error);
        this.errorMessage = 'An error occurred. Please try again later.';
      } finally {
        this.isLoading = false; // Reset loading state
      }
    },
  },
});
