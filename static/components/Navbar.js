const { defineComponent, computed, onMounted, onBeforeUnmount } = Vue;
const { useStore } = Vuex;
const { useRouter } = VueRouter;

export default defineComponent({
  name: 'Navbar',
  template: `
    <nav class="navbar sticky-top navbar-expand-lg" style="background-color:rgb(22, 34, 58);" data-bs-theme="dark">
      <div class="container-fluid">
        <!-- Logo -->
        <router-link to="/" v-if="!isLoggedIn" class="navbar-brand d-flex align-items-center">
          <img src="/static/images/logo1.jpg" alt="Logo" width="40" height="40" class="rounded-circle me-2">
          <span class="display-6 brand-text">Event Horizon Institute</span>
        </router-link>
        <router-link to="/add_parent" v-else class="navbar-brand d-flex align-items-center">
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
            <li class="nav-item" v-if="!isLoggedIn">
              <router-link to="/login" exact class="nav-link">
                Login
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
              <router-link to="/tests" class="nav-link">
                Tests
              </router-link>
            </li>
            <li class="nav-item" v-if="isLoggedIn">
              <router-link to="/test_performance" class="nav-link">
                Test Performance
              </router-link>
            </li>
            <li class="nav-item" v-if="isLoggedIn">
              <router-link to="/payments" class="nav-link">
                Payments
              </router-link>
            </li>
            <li class="nav-item" v-if="isLoggedIn">
              <button type="button" class="btn btn-danger me-3 mt-1" @click="logout">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  setup() {
    const store = useStore();
    const router = useRouter();

    const isLoggedIn = computed(() => store.getters.isLoggedIn);

    const logout = () => {
      store.dispatch('logout');
      router.push('/');
    };

    const handleOutsideClick = (event) => {
      const navbar = document.getElementById('navbarNav');
      const toggler = document.querySelector('.navbar-toggler');

      if (navbar.classList.contains('show') && !navbar.contains(event.target) && !toggler.contains(event.target)) {
        toggler.click();
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleOutsideClick);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleOutsideClick);
    });

    return {
      isLoggedIn,
      logout,
    };
  },
});
