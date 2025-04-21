import store from './store.js';
import Home from '../pages/Home.js';
import ViewAllStudents from '../pages/View_all_students.js';
import AddCourses from '../pages/add_courses.js';
import Batches from '../pages/Batches.js';
import Pay from '../pages/payments_reciepts.js';
import AddParent from '../pages/Add_new_entry.js';
import Login from '../pages/login.js';

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { requiresLogout: true } },
  { path: '/login', name: 'Login', component: Login, meta: { requiresLogout: true } },
  { path: '/view_all_students', name: 'ViewAllStudents', component: ViewAllStudents, meta: { requiresLogin: true } },
  { path: '/courses', name: 'AddCourses', component: AddCourses, meta: { requiresLogin: true } },
  { path: '/batches', name: 'Batches', component: Batches, meta: { requiresLogin: true } },
  { path: '/payments', name: 'Payments', component: Pay, meta: { requiresLogin: true } },
  { path: '/add_parent', name: 'AddParent', component: AddParent, meta: { requiresLogin: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters.isLoggedIn;

  if (to.meta.requiresLogin && !isLoggedIn) {
    next('/login');
  } else if (to.meta.requiresLogout && isLoggedIn) {
    next('/view_all_students');
  } else {
    next();
  }
});

export default router;
