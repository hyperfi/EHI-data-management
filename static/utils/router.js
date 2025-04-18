
import store from "./store.js"; // Import Vuex store
import Home from "../pages/Home.js";
import ViewAllStudents from "../pages/View_all_students.js";
import AddCourses from "../pages/add_courses.js";
import Batches from "../pages/Batches.js";
import Pay from "../pages/payments_reciepts.js";
import AddParent from "../pages/Add_new_entry.js";
import Login from "../pages/login.js"; // Import the Login component


const routes = [
  {
    path: "/",
    name: "/",
    component: Home,
    meta: { requiresLogout: true }, // Accessible only when logged out
  },
  {
    path: "/login",
    name: "/login",
    component: Login,
    meta: { requiresLogout: true }, // Accessible only when logged out
  },
  {
    path: "/view_all_students",
    name: "/view_all_students",
    component: ViewAllStudents,
    meta: { requiresLogin: true }, // Requires login
  },
  {
    path: "/courses",
    name: "/courses",
    component: AddCourses,
    meta: { requiresLogin: true }, // Requires login
  },
  {
    path: "/batches",
    name: "/batches",
    component: Batches,
    meta: { requiresLogin: true }, // Requires login
  },
  {
    path: "/payments",
    name: "/payments",
    component: Pay,
    meta: { requiresLogin: true }, // Requires login
  },
  {
    path: "/add_parent",
    name: "/add_parent",
    component: AddParent,
    meta: { requiresLogin: true }, // Requires login
  },
];

const router = new VueRouter({
  routes,
});

// Frontend router protection
router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters.isLoggedIn; // Get login state from Vuex store

  if (to.matched.some((record) => record.meta.requiresLogin)) {
    // If the route requires login and the user is not logged in
    if (!isLoggedIn) {
      next("/"); // Redirect to the home page
    } else {
      next(); // Allow access
    }
  } else if (to.matched.some((record) => record.meta.requiresLogout)) {
    // If the route requires logout and the user is logged in
    if (isLoggedIn) {
      next("/add_parent"); // Redirect to a logged-in page
    } else {
      next(); // Allow access
    }
  } else {
    next(); // Allow access to routes without restrictions
  }
});

export default router;
