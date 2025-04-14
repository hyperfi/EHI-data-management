const AddCourses = {
  template: `
    <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div class="card shadow-lg p-4" style="width: 90%; max-height: 90%; overflow-y: auto;">
        <h1 class="text-center mb-4 display-5">Courses</h1>

        <!-- Add New Course Button -->
        <div class="mb-4 text-end">
          <button class="btn btn-primary" @click="openAddCourseModal">
            Add New Course
          </button>
        </div>

        <!-- Search Bar -->
        <div class="mb-4">
          <input
            type="text"
            v-model="searchQuery"
            class="form-control"
            placeholder="Search courses by name, description, or instructor..."
          />
        </div>

        <!-- Courses Table -->
        <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
          <table class="table table-hover table-striped table-bordered align-middle">
            <thead class="table-dark text-center">
              <tr>
                <th @click="sortTable('id')" style="cursor: pointer">
                  Course ID <i :class="getSortIcon('id')"></i>
                </th>
                <th @click="sortTable('course_name')" style="cursor: pointer">
                  Course Name <i :class="getSortIcon('course_name')"></i>
                </th>
                <th @click="sortTable('description')" style="cursor: pointer">
                  Description <i :class="getSortIcon('description')"></i>
                </th>
                <th @click="sortTable('duration')" style="cursor: pointer">
                  Duration (Hrs) <i :class="getSortIcon('duration')"></i>
                </th>
                <th @click="sortTable('fee')" style="cursor: pointer">
                  Fee <i :class="getSortIcon('fee')"></i>
                </th>
                <th @click="sortTable('instructor')" style="cursor: pointer">
                  Instructor <i :class="getSortIcon('instructor')"></i>
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredCourses.length === 0">
                <td colspan="7" class="text-center text-muted">No courses available</td>
              </tr>
              <tr v-else v-for="course in filteredCourses" :key="course.id">
                <td class="text-center">{{ course.id }}</td>
                <td>{{ course.course_name }}</td>
                <td>{{ course.description }}</td>
                <td class="text-center">{{ course.duration }}</td>
                <td class="text-center">{{ course.fee }}</td>
                <td>{{ course.instructor }}</td>
                <td class="text-center">
                  <button
                    class="btn btn-danger btn-sm me-2"
                    @click="deleteCourse(course.id)"
                  >
                    Delete
                  </button>
                  <button
                    class="btn btn-info btn-sm"
                    @click="openUpdateCourseModal(course)"
                  >
                    Update
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Course Modal -->
      <div class="modal fade" id="addCourseModal" tabindex="-1" aria-labelledby="addCourseModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="addCourseModalLabel">Add New Course</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="addCourse">
                <div class="mb-3">
                  <label for="courseName" class="form-label">Course Name</label>
                  <input
                    type="text"
                    id="courseName"
                    v-model="newCourse.courseName"
                    class="form-control"
                    placeholder="Enter course name"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="description" class="form-label">Description</label>
                  <textarea
                    id="description"
                    v-model="newCourse.description"
                    class="form-control"
                    placeholder="Enter course description"
                    required
                  ></textarea>
                </div>
                <div class="mb-3">
                  <label for="duration" class="form-label">Duration (in hours)</label>
                  <input
                    type="number"
                    id="duration"
                    v-model="newCourse.duration"
                    class="form-control"
                    placeholder="Enter course duration"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="fee" class="form-label">Fee</label>
                  <input
                    type="number"
                    id="fee"
                    v-model="newCourse.fee"
                    class="form-control"
                    placeholder="Enter course fee"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="instructor" class="form-label">Instructor</label>
                  <input
                    type="text"
                    id="instructor"
                    v-model="newCourse.instructor"
                    class="form-control"
                    placeholder="Enter instructor name"
                    required
                  />
                </div>
                <button type="submit" class="btn btn-primary w-100">Add Course</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Update Course Modal -->
      <div class="modal fade" id="updateCourseModal" tabindex="-1" aria-labelledby="updateCourseModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="updateCourseModalLabel">Update Course</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="updateCourse">
                <div class="mb-3">
                  <label for="updateCourseName" class="form-label">Course Name</label>
                  <input
                    type="text"
                    id="updateCourseName"
                    v-model="updateCourseForm.courseName"
                    class="form-control"
                    placeholder="Enter course name"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="updateDescription" class="form-label">Description</label>
                  <textarea
                    id="updateDescription"
                    v-model="updateCourseForm.description"
                    class="form-control"
                    placeholder="Enter course description"
                    required
                  ></textarea>
                </div>
                <div class="mb-3">
                  <label for="updateDuration" class="form-label">Duration (hrs)</label>
                  <input
                    type="number"
                    id="updateDuration"
                    v-model="updateCourseForm.duration"
                    class="form-control"
                    placeholder="Enter course duration"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="updateFee" class="form-label">Fee</label>
                  <input
                    type="number"
                    id="updateFee"
                    v-model="updateCourseForm.fee"
                    class="form-control"
                    placeholder="Enter course fee"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="updateInstructor" class="form-label">Instructor</label>
                  <input
                    type="text"
                    id="updateInstructor"
                    v-model="updateCourseForm.instructor"
                    class="form-control"
                    placeholder="Enter instructor name"
                    required
                  />
                </div>
                <button type="submit" class="btn btn-primary w-100">Update Course</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      courses: [], // List of courses
      searchQuery: "", // Search query for filtering courses
      sortKey: "", // Key to sort by
      sortOrder: "asc", // Sort order: 'asc' or 'desc'
      newCourse: {
        courseName: "",
        description: "",
        duration: "",
        fee: "",
        instructor: "",
      },
      updateCourseForm: {
        id: null,
        courseName: "",
        description: "",
        duration: "",
        fee: "",
        instructor: "",
      },
    };
  },
  computed: {
    filteredCourses() {
      // Filter courses based on the search query
      const query = this.searchQuery.toLowerCase();
      return this.courses
        .filter(
          (course) =>
            course.course_name.toLowerCase().includes(query) ||
            course.description.toLowerCase().includes(query) ||
            course.instructor.toLowerCase().includes(query)
        )
        .sort((a, b) => {
          if (!this.sortKey) return 0;
          const valueA = a[this.sortKey];
          const valueB = b[this.sortKey];
          if (this.sortOrder === "asc") {
            return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
          } else {
            return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
          }
        });
    },
  },
  methods: {
    async fetchCourses() {
      try {
        const response = await fetch(window.location.origin + "/api/get_courses");
        if (response.ok) {
          this.courses = await response.json();
        } else {
          console.error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    },
    sortTable(key) {
      if (this.sortKey === key) {
        // Toggle sort order if the same column is clicked
        this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
      } else {
        // Set the new sort key and default to ascending order
        this.sortKey = key;
        this.sortOrder = "asc";
      }
    },
    getSortIcon(key) {
      if (this.sortKey === key) {
        return this.sortOrder === "asc" ? "bi bi-arrow-up" : "bi bi-arrow-down";
      }
      return "bi bi-arrow-down-up";
    },
    async addCourse() {
      try {
        const response = await fetch(window.location.origin + "/api/create_course", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.newCourse),
        });
        if (response.ok) {
          this.newCourse = {
            courseName: "",
            description: "",
            duration: "",
            fee: "",
            instructor: "",
          };
          const modal = bootstrap.Modal.getInstance(document.getElementById("addCourseModal"));
          modal.hide();
          this.fetchCourses();
        } else {
          console.error("Failed to add course");
        }
      } catch (error) {
        console.error("Error adding course:", error);
      }
    },
    async updateCourse() {
      try {
        const response = await fetch(window.location.origin + `/api/update_course/${this.updateCourseForm.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.updateCourseForm),
        });
        if (response.ok) {
          const modal = bootstrap.Modal.getInstance(document.getElementById("updateCourseModal"));
          modal.hide();
          this.fetchCourses();
        } else {
          console.error("Failed to update course");
        }
      } catch (error) {
        console.error("Error updating course:", error);
      }
    },
    async deleteCourse(courseId) {
      try {
        const response = await fetch(window.location.origin + `/api/delete_course/${courseId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          this.fetchCourses();
        } else {
          console.error("Failed to delete course");
        }
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    },
    openAddCourseModal() {
      const modal = new bootstrap.Modal(document.getElementById("addCourseModal"));
      modal.show();
    },
    openUpdateCourseModal(course) {
      this.updateCourseForm = {
        id: course.id,
        courseName: course.course_name,
        description: course.description,
        duration: course.duration,
        fee: course.fee,
        instructor: course.instructor,
      };
      const modal = new bootstrap.Modal(document.getElementById("updateCourseModal"));
      modal.show();
    },
  },
  mounted() {
    this.fetchCourses();
  },
};

export default AddCourses;