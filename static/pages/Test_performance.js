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
            <button class="btn btn-secondary ms-2" @click="downloadCSV">
              <i class="bi bi-download"></i> Download CSV
            </button>
          </div>

          <!-- Search Bar -->
          <div class="mb-4 d-flex gap-2">
            <input
              type="text"
              v-model="searchTestName"
              class="form-control"
              placeholder="Search by test name..."
            />
            <input
              type="text"
              v-model="searchStudentName"
              class="form-control"
              placeholder="Search by student name..."
            />
          </div>

          <!-- Performance Table -->
          <div class="d-flex flex-column align-items-center">
            <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
              <table class="table table-hover table-striped table-bordered align-middle">
                <thead class="table-dark text-center">
                  <tr>
                    <th>Test Name</th>
                    <th>Test Date</th>
                    <th>Student Name</th>
                    <th>Marks Obtained</th>
                    <th>Max Marks</th>
                    <th>Remarks</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody v-if="loadingPerformance">
                  <tr>
                    <td colspan="7" class="text-center">
                      <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr v-if="filteredPerformance.length === 0">
                    <td colspan="7" class="text-center text-muted">No performance data available</td>
                  </tr>
                  <tr v-else v-for="performance in filteredPerformance" :key="performance.id">
                    <td>{{ performance.test_name }}</td>
                    <td>{{ performance.test_date }}</td>
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

            <!-- Chart Container -->
            <! add a button to redraw the chart -->
            <button v-if="!this.loadingPerformance" class="btn btn-secondary mb-3" @click="reDrawChart">
              <i class="bi bi-refresh"></i> Refresh Chart
            </button>
            <div class="chart-container mt-5" style="width: 80%; max-width: 100%; margin: auto;">
              <canvas id="myChart"></canvas>
            </div>
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
      searchTestName: "", // Search query for filtering performance data by test name
      searchStudentName: "", // Search query for filtering performance data by student name
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
      const testQuery = this.searchTestName.toLowerCase();
      const studentQuery = this.searchStudentName.toLowerCase();
      return this.performanceData.map(performance => {
        const test = this.tests.find(test => test.id === performance.test_id);
        return {
          ...performance,
          test_date: test ? test.test_date : 'N/A',
        };
      }).filter(
        performance =>
          performance.test_name.toLowerCase().includes(testQuery) &&
          performance.student_name.toLowerCase().includes(studentQuery)
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
          this.CreateChart();
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
    
    downloadCSV() {
      const headers = ["Test Name", "Test Date" , "Student Name", "Marks Obtained", "Max Marks", "Remarks"];
      const rows = this.filteredPerformance.map((performance) => [
        performance.test_name,
        performance.test_date,
        performance.student_name,
        performance.marks_obtained,
        performance.max_marks,
        performance.remarks,
      ]);

      // Combine headers and rows into a CSV string
      const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
      
      // Create a Blob and download the CSV file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "test_performance.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    CreateChart() {
      // console.log("data", this.filteredPerformance);
      const ctx = document.getElementById("myChart");

      const labels = this.filteredPerformance.map(performance => performance.test_name);
      const data = {
        labels: labels,
        datasets: [{
          label: '% of Marks',
          data: this.filteredPerformance.map(performance => performance.marks_obtained / performance.max_marks * 100),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 3, // Increased line thickness
          fill: true // Fill the area between the line and x-axis
        }]
      };
      const config = {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              min: 0,
              max: 100,
              grace: '15%' // Add space between y-axis and x values
            },
            x: {
              ticks: {
                callback: function(value, index, ticks) {
                  const label = this.getLabelForValue(value);
                  if (/\s/.test(label)) { // Check for whitespace
                    return label.split(' ').slice(1); // Split by space and choose from second word onwards
                  } else {
                    return label;
                  }
                },
                maxRotation: 0, // Prevent rotation
                minRotation: 0,
                
              }
            }
          },
          plugins: {
            legend: {
              display: true
            }
          }
        }
      };
      const chartContainer = document.getElementById('myChart').parentElement;
      chartContainer.style.height = '440px'; // Adjust height to fit the card
      const myChart = new Chart(ctx, config);
    },

    reDrawChart() {
      let chartStatus = Chart.getChart("myChart"); // <canvas> id
      if (chartStatus != undefined) {
        chartStatus.destroy();
      }
      this.CreateChart();
    },

    
  },

  mounted() {
    this.fetchPerformanceData();
    this.fetchTests();
    this.fetchStudents();
    
  },
});