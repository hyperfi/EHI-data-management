const { defineComponent } = Vue;
import store from '../utils/store.js';
import { apiRequest } from '../utils/api.js';

export default defineComponent({
  name: 'Batches',
  template: `
    <div class="position-relative">
      <!-- Background Video -->
      
      
      <div class="d-flex justify-content-center align-items-center homestyle" style="background-color: rgba(255, 255, 255, 0.1);">

        <div class="card shadow-lg p-4" style="width: 90%; max-height: 90%; overflow-y: auto; background-color: rgba(255, 255, 255, 0.9);">
          <h1 class="text-center mb-4 display-5">Batches</h1>

          <!-- Notification Message -->
          <div v-if="notification.message" :class="'alert alert-' + notification.type" role="alert">
            {{ notification.message }}
          </div>

          <!-- Add New Batch Button -->
          <div class="mb-4 text-end">
            <button class="btn btn-primary" @click="openAddBatchModal">
              Add New Batch
            </button>
          </div>

          <!-- Batches Table -->
          <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
            <table class="table table-hover table-striped table-bordered align-middle">
              <thead class="table-dark text-center">
                <tr>
                  <th>Batch ID</th>
                  <th>Batch Name</th>
                  <th>Course Name</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Enrolled Students</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="batches.length === 0">
                  <td colspan="7" class="text-center text-muted">No batches available</td>
                </tr>
                <tr v-else v-for="batch in batches" :key="batch.id">
                  <td class="text-center">{{ batch.id }}</td>
                  <td>{{ batch.batch_name }}</td>
                  <td>{{ batch.course_name }}</td>
                  <td class="text-center">{{ batch.start_time }}</td>
                  <td class="text-center">{{ batch.end_time }}</td>
                  <td>
                    <a href="#" @click.prevent="viewStudents(batch)" class="text-decoration-none text-primary">
                      <i class="fas fa-users"></i>
                      {{ batch.enrolled_students.length }} Students
                    </a>
                  </td>
                  <td class="text-center">
                    <button
                      class="btn btn-danger btn-sm me-2"
                      @click="deleteBatch(batch.id)"
                    >
                      Delete
                    </button>
                    <button
                      class="btn btn-info btn-sm"
                      @click="openUpdateBatchModal(batch)"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Add Batch Modal -->
        <div class="modal fade" id="addBatchModal" tabindex="-1" aria-labelledby="addBatchModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="addBatchModalLabel">Add New Batch</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="addBatch">
                  <div class="mb-3">
                    <label for="batchName" class="form-label text-dark">Batch Name</label>
                    <input
                      type="text"
                      id="batchName"
                      v-model="newBatch.batchName"
                      class="form-control"
                      placeholder="Enter batch name"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="courseName" class="form-label text-dark">Course Name</label>
                    <select
                      id="courseName"
                      v-model="newBatch.courseName"
                      class="form-select"
                      required
                    >
                      <option value="" disabled>Select a course</option>
                      <option v-for="course in courses" :key="course.id" :value="course.course_name">
                        {{ course.course_name }}
                      </option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label for="startTime" class="form-label text-dark">Start Time</label>
                    <input
                      type="time"
                      id="startTime"
                      v-model="newBatch.startTime"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="endTime" class="form-label text-dark">End Time</label>
                    <input
                      type="time"
                      id="endTime"
                      v-model="newBatch.endTime"
                      class="form-control"
                      required
                    />
                  </div>
                  <button type="submit" class="btn btn-primary w-100">Add Batch</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- Update Batch Modal -->
        <div class="modal fade" id="updateBatchModal" tabindex="-1" aria-labelledby="updateBatchModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="updateBatchModalLabel">Update Batch</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="updateBatch">
                  <div class="mb-3">
                    <label for="updateBatchName" class="form-label text-dark">Batch Name</label>
                    <input
                      type="text"
                      id="updateBatchName"
                      v-model="updateBatchForm.batchName"
                      class="form-control"
                      placeholder="Enter batch name"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="updateCourseName" class="form-label text-dark">Course Name</label>
                    <select
                      id="updateCourseName"
                      v-model="updateBatchForm.courseName"
                      class="form-select"
                      required
                    >
                      <option value="" disabled>Select a course</option>
                      <option v-for="course in courses" :key="course.id" :value="course.course_name">
                        {{ course.course_name }}
                      </option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label for="updateStartTime" class="form-label text-dark">Start Time</label>
                    <input
                      type="time"
                      id="updateStartTime"
                      v-model="updateBatchForm.startTime"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="updateEndTime" class="form-label text-dark">End Time</label>
                    <input
                      type="time"
                      id="updateEndTime"
                      v-model="updateBatchForm.endTime"
                      class="form-control"
                      required
                    />
                  </div>
                  <button type="submit" class="btn btn-primary w-100">Update Batch</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- View Students Modal -->
        <div class="modal fade" id="viewStudentsModal" tabindex="-1" aria-labelledby="viewStudentsModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="viewStudentsModalLabel">Enrolled Students</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div v-if="selectedStudents.length === 0" class="text-center text-muted">
                  No students enrolled in this batch.
                </div>
                <div v-else>
                  <table class="table table-hover table-bordered">
                    <thead class="table-dark text-center">
                      <tr>
                        <th>Student Name</th>
                        <th>Class</th>
                        <th>Parent Contact</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="student in selectedStudents" :key="student.id">
                        <td>{{ student.name }}</td>
                        <td>{{ student.className }}</td>
                        <td>{{ student.parent_contact }}</td>
                        <td class="text-center">
                          <button
                            class="btn btn-danger btn-sm"
                            @click="removeStudentFromBatch(currentBatch.id, student.id)"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      batches: [],
      courses: [],
      newBatch: {
        batchName: "",
        courseName: "",
        startTime: "",
        endTime: "",
      },
      updateBatchForm: {
        id: null,
        batchName: "",
        courseName: "",
        startTime: "",
        endTime: "",
      },
      selectedStudents: [],
      currentBatch: null,
      notification: {
        message: "",
        type: "",
      },
    };
  },
  methods: {
    async fetchBatches() {
      const url = "/api/get_batches";
      const token = sessionStorage.getItem('authToken');
      try {
        const response = await apiRequest(url, {
          headers: {
            "Authentication-Token": `${token}`,
          },
        });
        if (response.ok) {
          this.batches = await response.json();
        } else {
          this.showNotification("Error fetching batches", "danger");
        }
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    },
    async fetchCourses() {
      const url = "/api/get_courses";
      const token = sessionStorage.getItem('authToken');
      try {
        const response = await apiRequest(url, {
          headers: {
            "Authentication-Token": `${token}`,
          },
        });
        if (response.ok) {
          this.courses = await response.json();
        } else {
          this.showNotification("Error fetching courses", "danger");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    },
    async addBatch() {
      const url = "/api/add_batch";
      const token = sessionStorage.getItem('authToken');
      try {
        const response = await apiRequest(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": `${token}`,
          },
          body: JSON.stringify(this.newBatch),
        });
        if (response.ok) {
          this.showNotification("Batch added successfully!", "success");
          this.fetchBatches();
          const modal = bootstrap.Modal.getInstance(document.getElementById("addBatchModal"));
          modal.hide();
        } else {
          const errorData = await response.json();
          this.showNotification("Error adding batch: " + errorData.message, "danger");
        }
      } catch (error) {
        console.error("Error adding batch:", error);
      }
    },
    async updateBatch() {
      const url = `/api/update_batch/${this.updateBatchForm.id}`;
      const token = sessionStorage.getItem('authToken');
      try {
        const response = await apiRequest(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": `${token}`,
          },
          body: JSON.stringify(this.updateBatchForm),
        });
        if (response.ok) {
          this.showNotification("Batch updated successfully!", "success");
          this.fetchBatches();
          const modal = bootstrap.Modal.getInstance(document.getElementById("updateBatchModal"));
          modal.hide();
        } else {
          const errorData = await response.json();
          this.showNotification("Error updating batch: " + errorData.message, "danger");
        }
      } catch (error) {
        console.error("Error updating batch:", error);
      }
    },
    async deleteBatch(batchId) {
      const url = `/api/delete_batch/${batchId}`;
      const token = sessionStorage.getItem('authToken');
      try {
        const response = await apiRequest(url, {
          method: "DELETE",
          headers: {
            "Authentication-Token": `${token}`,
          },
        });
        if (response.ok) {
          this.showNotification("Batch deleted successfully!", "success");
          this.fetchBatches();
        } else {
          const errorData = await response.json();
          this.showNotification("Error deleting batch: " + errorData.message, "danger");
        }
      } catch (error) {
        console.error("Error deleting batch:", error);
      }
    },
    openAddBatchModal() {
      const modal = new bootstrap.Modal(document.getElementById("addBatchModal"));
      modal.show();
    },
    openUpdateBatchModal(batch) {
      this.updateBatchForm = {
        id: batch.id,
        batchName: batch.batch_name,
        courseName: batch.course_name,
        startTime: batch.start_time,
        endTime: batch.end_time,
      };
      const modal = new bootstrap.Modal(document.getElementById("updateBatchModal"));
      modal.show();
    },
    async fetchStudentDetails(enrolledStudents) {
      try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch("/api/get_student_details", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": `${token}`,
          },
          body: JSON.stringify({ students: enrolledStudents }),
        });
        if (response.ok) {
          this.selectedStudents = await response.json();
        } else {
          const errorData = await response.json();
          console.error("Error fetching student details:", errorData.message);
          this.showNotification("Error fetching student details", "danger");
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
        this.showNotification("Error fetching student details", "danger");
      }
    },
    async removeStudentFromBatch(batchId, studentId) {
      try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch(`/api/remove_student_from_batch/${batchId}/${studentId}`, {
          method: "GET",
          headers: {
            "Authentication-Token": `${token}`,
          },
        });
        if (response.ok) {
          this.showNotification("Student removed from batch successfully", "success");
          this.fetchBatches();
          this.selectedStudents = this.selectedStudents.filter(student => student.id !== studentId);
        } else {
          const errorData = await response.json();
          this.showNotification(`Error: ${errorData.message}`, "danger");
        }
      } catch (error) {
        console.error("Error removing student from batch:", error);
        this.showNotification("Error removing student from batch", "danger");
      }
    },
    viewStudents(batch) {
      this.selectedStudents = batch.enrolled_students;
      this.currentBatch = batch;
      this.fetchStudentDetails(batch.enrolled_students);
      const modal = new bootstrap.Modal(document.getElementById("viewStudentsModal"));
      modal.show();
    },
    showNotification(message, type) {
      this.notification.message = message;
      this.notification.type = type;
      setTimeout(() => {
        this.notification.message = "";
        this.notification.type = "";
      }, 2000);
    },
  },
  mounted() {
    this.fetchBatches();
    this.fetchCourses();
  },
});

