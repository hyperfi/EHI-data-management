const { defineComponent } = Vue;
import { apiRequest } from '../utils/api.js'; // Import the apiRequest utility function

export default defineComponent({
  name: 'Tests',
  template: `
    <div class="position-relative">
      <div class="d-flex justify-content-center align-items-center homestyle" style="background-color: rgba(255, 255, 255, 0.1);">
        <div class="card shadow-lg p-4" style="width: 90%; max-height: 90%; overflow-y: auto; background-color: rgba(255, 255, 255, 0.9);">
          <h1 class="text-center mb-4 display-5">Tests</h1>

          <!-- Add New Test Button -->
          <div class="mb-4 text-end">
            <button class="btn btn-primary" @click="openAddTestModal">
              Add New Test
            </button>
          </div>

          <!-- Search Bar -->
          <div class="mb-4">
            <input
              type="text"
              v-model="searchQuery"
              class="form-control"
              placeholder="Search tests by name, course, or date..."
            />
          </div>

          <!-- Tests Table -->
          <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
            <table class="table table-hover table-striped table-bordered align-middle">
              <thead class="table-dark text-center">
                <tr>
                  <th @click="sortTable('id')" style="cursor: pointer">
                    Test ID <i :class="getSortIcon('id')"></i>
                  </th>
                  <th @click="sortTable('test_name')" style="cursor: pointer">
                    Test Name <i :class="getSortIcon('test_name')"></i>
                  </th>
                  <th @click="sortTable('course_name')" style="cursor: pointer">
                    Course Name <i :class="getSortIcon('course_name')"></i>
                  </th>
                  <th @click="sortTable('test_date')" style="cursor: pointer">
                    Test Date <i :class="getSortIcon('test_date')"></i>
                  </th>
                  <th @click="sortTable('max_marks')" style="cursor: pointer">
                    Max Marks <i :class="getSortIcon('max_marks')"></i>
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody v-if="loadingTests">
                <tr>
                  <td colspan="6" class="text-center">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr v-if="filteredTests.length === 0">
                  <td colspan="6" class="text-center text-muted">No tests available</td>
                </tr>
                <tr v-else v-for="test in filteredTests" :key="test.id">
                  <td class="text-center">{{ test.id }}</td>
                  <td>{{ test.test_name }}</td>
                  <td>{{ test.course_name }}</td>
                  <td class="text-center">{{ test.test_date }}</td>
                  <td class="text-center">{{ test.max_marks }}</td>
                  <td class="text-center">
                    <button
                      class="btn btn-danger btn-sm me-2"
                      @click="deleteTest(test.id)"
                    >
                      <i class="bi bi-trash"></i> Delete
                    </button>
                    <button
                      class="btn btn-info btn-sm"
                      @click="openUpdateTestModal(test)"
                    >
                      <i class="bi bi-pencil"></i> Update
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Add Test Modal -->
        <div class="modal fade" id="addTestModal" tabindex="-1" aria-labelledby="addTestModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="addTestModalLabel">Add New Test</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="addTest">
                  <div class="mb-3">
                    <label for="testName" class="form-label text-dark">Test Name</label>
                    <input
                      type="text"
                      id="testName"
                      v-model="newTest.test_name"
                      class="form-control"
                      placeholder="Enter test name"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="courseName" class="form-label text-dark">Course Name</label>
                    <select
                      id="courseName"
                      v-model="newTest.course_id"
                      class="form-select"
                      required
                    >
                      <option value="" disabled>Select a course</option>
                      <option v-for="course in courses" :key="course.id" :value="course.id">
                        {{ course.course_name }} - {{ course.id }}
                      </option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label for="testDate" class="form-label text-dark">Test Date</label>
                    <input
                      type="date"
                      id="testDate"
                      v-model="newTest.test_date"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="maxMarks" class="form-label text-dark">Max Marks</label>
                    <input
                      type="number"
                      id="maxMarks"
                      v-model="newTest.max_marks"
                      class="form-control"
                      placeholder="Enter max marks"
                      required
                    />
                  </div>
                  <button type="submit" class="btn btn-primary w-100">Add Test</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- Update Test Modal -->
        <div class="modal fade" id="updateTestModal" tabindex="-1" aria-labelledby="updateTestModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="updateTestModalLabel">Update Test</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="updateTest">
                  <div class="mb-3">
                    <label for="updateTestName" class="form-label text-dark">Test Name</label>
                    <input
                      type="text"
                      id="updateTestName"
                      v-model="updateTestForm.test_name"
                      class="form-control"
                      placeholder="Enter test name"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="courseName" class="form-label text-dark">Course Name</label>
                    <select
                      id="courseName"
                      v-model="newTest.course_id"
                      class="form-select"
                      required
                    >
                      <option value="" disabled>Select a course</option>
                      <option v-for="course in courses" :key="course.id" :value="course.id">
                        {{ course.course_name }}
                      </option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label for="updateTestDate" class="form-label text-dark">Test Date</label>
                    <input
                      type="date"
                      id="updateTestDate"
                      v-model="updateTestForm.test_date"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="updateMaxMarks" class="form-label text-dark">Max Marks</label>
                    <input
                      type="number"
                      id="updateMaxMarks"
                      v-model="updateTestForm.max_marks"
                      class="form-control"
                      placeholder="Enter max marks"
                      required
                    />
                  </div>
                  <button type="submit" class="btn btn-primary w-100">Update Test</button>
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
      tests: [], // List of tests
      courses: [], // List of courses
      searchQuery: "", // Search query for filtering tests
      sortKey: "", // Key to sort by
      sortOrder: "asc", // Sort order: 'asc' or 'desc'
      newTest: {
        test_name: "",
        course_id: "",
        test_date: "",
        max_marks: "",
      },
      updateTestForm: {
        id: null,
        test_name: "",
        course_id: "",
        test_date: "",
        max_marks: "",
      },
      loadingTests: true, // Loading state for tests
    };
  },
  computed: {
    filteredTests() {
      const query = this.searchQuery.toLowerCase();
      return this.tests
        .filter(
          (test) =>
            test.test_name.toLowerCase().includes(query) ||
            test.course_name.toLowerCase().includes(query) ||
            test.test_date.toLowerCase().includes(query)
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
    async fetchTests() {
      try {
        const token = sessionStorage.getItem('authToken'); // Get the token from Vuex store
        const response = await apiRequest(window.location.origin + "/api/tests", {
          headers: {
            "Authentication-Token": `${token}`, // Include the token in the Authentication-Token header
          },
        });
        if (response.ok) {
          this.tests = await response.json();
          this.loadingTests = false;
        } else {
          console.error("Failed to fetch tests");
        }
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    },

    async fetchCourses() {
      try {
        const token = sessionStorage.getItem('authToken'); // Get the token from Vuex store
        const response = await apiRequest(window.location.origin + "/api/get_courses", {
          headers: {
            "Authentication-Token": `${token}`, // Include the token in the Authentication-Token header
          },
        });
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
        this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
      } else {
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
    async addTest() {
      try {
        const token = sessionStorage.getItem('authToken'); // Get the token from Vuex store
        const response = await apiRequest(window.location.origin + "/api/tests", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authentication-Token": `${token}` },
          body: JSON.stringify(this.newTest),
        });
        if (response.ok) {
          this.newTest = {
            test_name: "",
            course_id: "",
            test_date: "",
            max_marks: "",
          };
          const modal = bootstrap.Modal.getInstance(document.getElementById("addTestModal"));
          modal.hide();
          this.fetchTests();
        } else {
          console.error("Failed to add test");
        }
      } catch (error) {
        console.error("Error adding test:", error);
      }
    },
    async updateTest() {
      try {
        const token = sessionStorage.getItem('authToken'); // Get the token from Vuex store
        const response = await apiRequest(window.location.origin + `/api/tests/${this.updateTestForm.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authentication-Token": `${token}` },
          body: JSON.stringify(this.updateTestForm),
        });
        if (response.ok) {
          const modal = bootstrap.Modal.getInstance(document.getElementById("updateTestModal"));
          modal.hide();
          this.fetchTests();
        } else {
          console.error("Failed to update test");
        }
      } catch (error) {
        console.error("Error updating test:", error);
      }
    },
    async deleteTest(testId) {
      try {
        const token = sessionStorage.getItem('authToken'); // Get the token from Vuex store
        const response = await apiRequest(window.location.origin + `/api/tests/${testId}`, {
          headers: { "Authentication-Token": `${token}` },
          method: "DELETE",
        });
        if (response.ok) {
          this.fetchTests();
        } else {
          console.error("Failed to delete test");
        }
      } catch (error) {
        console.error("Error deleting test:", error);
      }
    },
    openAddTestModal() {
      const modal = new bootstrap.Modal(document.getElementById("addTestModal"));
      modal.show();
    },
    openUpdateTestModal(test) {
      this.updateTestForm = {
        id: test.id,
        test_name: test.test_name,
        course_id: test.course_id,
        test_date: test.test_date,
        max_marks: test.max_marks,
      };
      const modal = new bootstrap.Modal(document.getElementById("updateTestModal"));
      modal.show();
    },
  },
  mounted() {
    this.fetchTests();
    this.fetchCourses(); // Fetch courses when the component is mounted
  },
});