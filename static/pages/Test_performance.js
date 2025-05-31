const { defineComponent } = Vue;
import { apiRequest } from '../utils/api.js'; // Import the apiRequest utility function

export default defineComponent({
  name: 'TestPerformance',
  template: `
    <div class="position-relative">
      <div class="d-flex justify-content-center align-items-center homestyle" style="background-color: rgba(255, 255, 255, 0.1);">
        <div class="card shadow-lg p-4" style="width: 90%; max-height: 90%; overflow-y: auto; background-color: rgba(255, 255, 255, 0.9);">
          <h1 class="text-center mb-4 display-5">Test Performance</h1>

          <!-- Add New Performance Button -->
          <div class="mb-4 text-end">
            <button class="btn btn-primary" @click="openAddPerformanceModal">
              Add New Performance
            </button>
          </div>

          <!-- Search Bar -->
          <div class="mb-4">
            <input
              type="text"
              v-model="searchQuery"
              class="form-control"
              placeholder="Search by test name, student name, or remarks..."
            />
          </div>

          <!-- Performance Table -->
          <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
            <table class="table table-hover table-striped table-bordered align-middle">
              <thead class="table-dark text-center">
                <tr>
                  <th>Test Name</th>
                  <th>Student Name</th>
                  <th>Marks Obtained</th>
                  <th>Max Marks</th>
                  <th>Remarks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody v-if="loadingPerformance">
                <tr>
                  <td colspan="6" class="text-center">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr v-if="filteredPerformance.length === 0">
                  <td colspan="6" class="text-center text-muted">No performance data available</td>
                </tr>
                <tr v-else v-for="performance in filteredPerformance" :key="performance.id">
                  <td>{{ performance.test_name }}</td>
                  <td>{{ performance.student_name }}</td>
                  <td class="text-center">{{ performance.marks_obtained }}</td>
                  <td class="text-center">{{ performance.max_marks }}</td>
                  <td>{{ performance.remarks }}</td>
                  <td class="text-center">
                    <button
                      class="btn btn-danger btn-sm me-2"
                      @click="deletePerformance(performance.id)"
                    >
                      <i class="bi bi-trash"></i> Delete
                    </button>
                    <button
                      class="btn btn-info btn-sm"
                      @click="openUpdatePerformanceModal(performance)"
                    >
                      <i class="bi bi-pencil"></i> Update
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Add Performance Modal -->
        <div class="modal fade" id="addPerformanceModal" tabindex="-1" aria-labelledby="addPerformanceModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="addPerformanceModalLabel">Add New Performance</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="addPerformance">
                  <div class="mb-3">
                    <label for="testId" class="form-label text-dark">Test</label>
                    <select
                      id="testId"
                      v-model="newPerformance.test_id"
                      class="form-select"
                      required
                    >
                      <option value="" disabled>Select a test</option>
                      <option v-for="test in tests" :key="test.id" :value="test.id">
                        {{ test.test_name }}
                      </option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label for="studentId" class="form-label text-dark">Student</label>
                    <select
                      id="studentId"
                      v-model="newPerformance.student_id"
                      class="form-select"
                      required
                    >
                      <option value="" disabled>Select a student</option>
                      <option v-for="student in students" :key="student.id" :value="student.id">
                        {{ student.name }} - {{ student.id }}
                      </option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label for="marksObtained" class="form-label text-dark">Marks Obtained</label>
                    <input
                      type="float"
                      id="marksObtained"
                      v-model="newPerformance.marks_obtained"
                      class="form-control"
                      placeholder="Enter marks obtained"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="remarks" class="form-label text-dark">Remarks</label>
                    <input
                      type="text"
                      id="remarks"
                      v-model="newPerformance.remarks"
                      class="form-control"
                      placeholder="Enter remarks"
                    />
                  </div>
                  <button type="submit" class="btn btn-primary w-100">Add Performance</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- Update Performance Modal -->
        <div class="modal fade" id="updatePerformanceModal" tabindex="-1" aria-labelledby="updatePerformanceModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="updatePerformanceModalLabel">Update Performance</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="updatePerformance">
                  <div class="mb-3">
                    <label for="updateMarksObtained" class="form-label text-dark">Marks Obtained</label>
                    <input
                      type="float"
                      id="updateMarksObtained"
                      v-model="updatePerformanceForm.marks_obtained"
                      class="form-control"
                      placeholder="Enter marks obtained"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="updateRemarks" class="form-label text-dark">Remarks</label>
                    <input
                      type="text"
                      id="updateRemarks"
                      v-model="updatePerformanceForm.remarks"
                      class="form-control"
                      placeholder="Enter remarks"
                    />
                  </div>
                  <button type="submit" class="btn btn-primary w-100">Update Performance</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      performanceData: [], // List of test performance data
      tests: [], // List of tests
      students: [], // List of students
      searchQuery: "", // Search query for filtering performance data
      loadingPerformance: true, // Loading state for performance data
      newPerformance: {
        test_id: "",
        student_id: "",
        marks_obtained: "",
        remarks: "",
      },
      updatePerformanceForm: {
        id: null,
        marks_obtained: "",
        remarks: "",
      },
    };
  },
  computed: {
    filteredPerformance() {
      const query = this.searchQuery.toLowerCase();
      return this.performanceData.filter(
        (performance) =>
          performance.test_name.toLowerCase().includes(query) ||
          performance.student_name.toLowerCase().includes(query) ||
          performance.remarks.toLowerCase().includes(query)
      );
    },
  },
  methods: {
    async fetchPerformanceData() {
      try {
        const token = sessionStorage.getItem('authToken');
        const response = await apiRequest(window.location.origin + "/api/test_results", {
          headers: { "Authentication-Token": `${token}` },
        });
        if (response.ok) {
          this.performanceData = await response.json();
          this.loadingPerformance = false;
        } else {
          console.error("Failed to fetch performance data");
        }
      } catch (error) {
        console.error("Error fetching performance data:", error);
      }
    },
    async fetchTests() {
      try {
        const token = sessionStorage.getItem('authToken');
        const response = await apiRequest(window.location.origin + "/api/tests", {
          headers: { "Authentication-Token": `${token}` },
        });
        if (response.ok) {
          this.tests = await response.json();
        } else {
          console.error("Failed to fetch tests");
        }
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    },
    async fetchStudents() {
      try {
        const token = sessionStorage.getItem('authToken');
        const response = await apiRequest(window.location.origin + "/api/students", {
          headers: { "Authentication-Token": `${token}` },
        });
        if (response.ok) {
          this.students = await response.json();
          console.log(this.students);
        } else {
          const data = await response.json();
          console.log(data.message);
          console.error("Failed to fetch students");
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    },
    async addPerformance() {
      try {
        const token = sessionStorage.getItem('authToken');
        const response = await apiRequest(window.location.origin + "/api/test_results", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authentication-Token": `${token}` },
          body: JSON.stringify(this.newPerformance),
        });
        if (response.ok) {
          this.newPerformance = { test_id: "", student_id: "", marks_obtained: "", remarks: "" };
          const modal = bootstrap.Modal.getInstance(document.getElementById("addPerformanceModal"));
          modal.hide();
          this.fetchPerformanceData();
        } else {
          console.error("Failed to add performance");
        }
      } catch (error) {
        console.error("Error adding performance:", error);
      }
    },
    async updatePerformance() {
      try {
        const token = sessionStorage.getItem('authToken');
        const response = await apiRequest(window.location.origin + `/api/test_results/${this.updatePerformanceForm.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authentication-Token": `${token}` },
          body: JSON.stringify(this.updatePerformanceForm),
        });
        if (response.ok) {
          const modal = bootstrap.Modal.getInstance(document.getElementById("updatePerformanceModal"));
          modal.hide();
          this.fetchPerformanceData();
        } else {
          console.error("Failed to update performance");
        }
      } catch (error) {
        console.error("Error updating performance:", error);
      }
    },
    async deletePerformance(performanceId) {
      try {
        const token = sessionStorage.getItem('authToken');
        const response = await apiRequest(window.location.origin + `/api/test_results/${performanceId}`, {
          method: "DELETE",
          headers: { "Authentication-Token": `${token}` },
        });
        if (response.ok) {
          this.fetchPerformanceData();
        } else {
          console.error("Failed to delete performance");
        }
      } catch (error) {
        console.error("Error deleting performance:", error);
      }
    },
    openAddPerformanceModal() {
      const modal = new bootstrap.Modal(document.getElementById("addPerformanceModal"));
      modal.show();
    },
    openUpdatePerformanceModal(performance) {
      this.updatePerformanceForm = {
        id: performance.id,
        marks_obtained: performance.marks_obtained,
        remarks: performance.remarks,
      };
      const modal = new bootstrap.Modal(document.getElementById("updatePerformanceModal"));
      modal.show();
    },
  },
  mounted() {
    this.fetchPerformanceData();
    this.fetchTests();
    this.fetchStudents();
  },
});