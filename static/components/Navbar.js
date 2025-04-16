const Navbar = {
  template: `
    <nav class="navbar sticky-top navbar-expand-lg" style="background-color:rgb(22, 34, 58);" data-bs-theme="dark">
      <div class="container-fluid">
        <!-- Logo -->
        <router-link to="/" class="navbar-brand d-flex align-items-center">
          <img src="/static/images/logo.jpg" alt="Logo" width="40" height="40" class="rounded-circle me-2">
          <span class="display-6 brand-text">Event Horizon Institute</span>
        </router-link>

        <!-- Toggler Button for Mobile -->
        <button 
          class="navbar-toggler position-absolute top-1 end-0 m-2" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navbar Links -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto justify-content-center">
            <li class="nav-item" v-if="!isLoggedIn">
              <router-link to="/" exact class="nav-link">
                Home
              </router-link>
            </li>
            <li class="nav-item" v-if="isLoggedIn">
              <router-link to="/add_parent" exact class="nav-link">
                Add Parent
              </router-link>
            </li>
            <li class="nav-item" v-if="isLoggedIn">
              <router-link to="/view_all_students" class="nav-link">
                View All Students
              </router-link>
            </li>
            <li class="nav-item" v-if="isLoggedIn">
              <router-link to="/courses" class="nav-link">
                Courses
              </router-link>
            </li>
            <li class="nav-item" v-if="isLoggedIn">
              <router-link to="/batches" class="nav-link">
                Batches
              </router-link>
            </li>
            <li class="nav-item" v-if="isLoggedIn">
              <router-link to="/payments" class="nav-link">
                Payments
              </router-link>
            </li>
            <li class="nav-item" v-if="isLoggedIn">
              <button type="button" class="btn btn-danger me-3" @click="logout">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn; // Access the login state from Vuex store
    },
  },
  methods: {
    logout() {
      this.$store.dispatch("logout"); // Dispatch the logout action
      this.$router.push("/"); // Redirect to the login page
    },
  },
};

export default Navbar;
