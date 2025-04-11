// import Navbar from "../components/Navbar.js";
import Home from "../pages/Home.js";
import ViewAllStudents from "../pages/View_all_students.js";  
import AddCourses from "../pages/add_courses.js"; 

const routes = [
  { path: "/", 
    name: "/",
    component: Home,
    meta:{requiresLogout:false}, 
  },

  { path: "/view_all_students", 
    name: "/view_all_students",
    component: ViewAllStudents,
    meta:{requiresLogout:false},
  },

  {
    path: "/courses",
    name: "/courses",
    component: AddCourses,
    meta:{requiresLogout:false},

  }

];

const router = new VueRouter({
  routes,
});


// frontend router protection

export default router;
