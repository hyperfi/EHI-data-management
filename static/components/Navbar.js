const Navbar = {
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <!-- Logo -->
        <router-link to="/" class="navbar-brand d-flex align-items-center">
          <img src="/static/images/logo.jpg" alt="Logo" width="40" height="40" class="rounded-circle me-2">
          <span class="brand-text">Event Horizon Institute</span>
        </router-link>

        <!-- Toggler Button for Mobile -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navbar Links -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/" exact class="nav-link">
                Home
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/view_all_students" class="nav-link">
                View All Students
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/courses" class="nav-link">
                Courses
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/batches" class="nav-link">
                Batches
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/payments" class="nav-link">
                Payments
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
};

export default Navbar;
