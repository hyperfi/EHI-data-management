const AddCourses = {
  template: `
    <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div class="card shadow-lg p-4" style="width: 90%; max-height: 90%; overflow-y: auto;">
        <h1 class="text-center mb-4">Manage Courses</h1>

        <!-- Add New Course Button -->
        <div class="mb-4 text-end">
          <button class="btn btn-primary" @click="openAddCourseModal">
            Add New Course
          </button>
        </div>

        <!-- Courses Table -->
        <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
          <h4 class="mt-4">Existing Courses</h4>
          <table class="table table-hover table-bordered">
            <thead class="table-dark">
              <tr>
                <th>Course ID</th>
                <th>Course Name</th>
                <th>Description</th>
                <th>Duration (Hrs)</th>
                <th>Fee</th>
                <th>Instructor</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="courses.length === 0">
                <td colspan="7" class="text-center">No courses available</td>
              </tr>
              <tr v-else v-for="course in courses" :key="course.id">
                <td>{{ course.id }}</td>
                <td>{{ course.course_name }}</td>
                <td>{{ course.description }}</td>
                <td>{{ course.duration }}</td>
                <td>{{ course.fee }}</td>
                <td>{{ course.instructor }}</td>
                <td>
                  <button
                    class="btn btn-danger btn-sm"
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
                  <label for="duration" class="form-label">Duration (in weeks)</label>
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
      // Populate the updateCourseForm with the selected course's details
      this.updateCourseForm = {
        id: course.id,
        courseName: course.course_name,
        description: course.description,
        duration: course.duration,
        fee: course.fee,
        instructor: course.instructor,
      };
      console.log(this.updateCourseForm);
      // Open the modal
      const modal = new bootstrap.Modal(document.getElementById("updateCourseModal"));
      modal.show();
    },
  },
  mounted() {
    this.fetchCourses();
  },
};

export default AddCourses;