const Navbar = {
  template: `
    <nav class="navbar navbar-expand-sm navbar-dark bg-dark">
      <div class="container-fluid d-flex justify-content-center">
        <!-- Logo -->
        <img src="/static/images/logo.jpg" alt="Logo" width="50" height="50" class="rounded-circle me-3">
        
        <!-- Navbar Links -->
        <ul class="navbar-nav d-flex flex-row gap-3">
          <li class="nav-item">
            <router-link to="/" class="btn btn-primary">
              Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/view_all_students" class="btn btn-primary">
              View All Students
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/courses" class="btn btn-primary">
              Courses
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  `,

  data() {
    return {
      LoginState: { true: "&#128994", false: "&#128997" }
    };
  },

  methods: {}
};

export default Navbar;
