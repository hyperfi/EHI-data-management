const { defineComponent } = Vue;
import store from '../utils/store.js'; // Import the Vuex store
import { apiRequest } from '../utils/api.js'; // Import the apiRequest utility function

export default defineComponent({
  name: 'ViewAllStudents',
  template: `
    <div class="position-relative">
      <!-- Background Video -->
        
      
      <div class="d-flex justify-content-center align-items-center homestyle" style="background-color: rgba(255, 255, 255, 0.1);">

        <div class="card shadow-lg p-4" style="width: 90%; max-height: 90%; overflow-y: auto; background-color: rgba(255, 255, 255, 0.9);">
            <h1 class="text-center mb-4 display-5">All Students</h1>

            <!-- Notification Message -->
            <div v-if="notification.message" :class="'alert alert-' + notification.type" role="alert">
                {{ notification.message }}
            </div>

            <!-- Search Bar -->
            <div class="mb-3">
                <input type="text" v-model="searchQuery" class="form-control" placeholder="Search students by name, course, or contact..." />
            </div>
            
            <!-- Responsive Table -->
            <div class="table-responsive">
                <table class="table table-hover table-bordered">
                    <thead class="table-dark">
                        <tr>
                            <th @click="sortTable('parentName')" style="cursor: pointer">Parent Name <i class="bi bi-arrow-down-up"></i></th>
                            <th @click="sortTable('address')" style="cursor: pointer">Address <i class="bi bi-arrow-down-up"></i></th>
                            <th @click="sortTable('visitingDate')" style="cursor: pointer">Visiting Date <i class="bi bi-arrow-down-up"></i></th>
                            <th @click="sortTable('childName')" style="cursor: pointer">Student Name <i class="bi bi-arrow-down-up"></i></th>
                            <th @click="sortTable('courseEnrolled')" style="cursor: pointer">Course Enrolled <i class="bi bi-arrow-down-up"></i></th>
                            <th @click="sortTable('parentContact')" style="cursor: pointer">Contact <i class="bi bi-arrow-down-up"></i></th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <!-- Table Body -->
                    <tbody v-if="loadingStudents">
                        <tr>
                            <td colspan="7" class="text-center">
                                <div class="spinner-border" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr v-if="currentStudents.length === 0">
                            <td colspan="7" class="text-center">No students found.</td>
                        </tr>
                        <!-- Table Rows -->
                        <tr v-for="student in currentStudents" :key="student.parentContact + student.childName">
                            <td>{{ student.parentName }}</td>
                            <td>{{ student.address }}</td>
                            <td>{{ student.visitingDate }}</td>
                            <td>{{ student.childName }}</td>
                            <td>{{ student.courseEnrolled }}</td>
                            <td>{{ student.parentContact }}</td>
                            <td>
                                <button class="btn btn-danger btn-sm m-1" @click="deleteStudent(student.parentContact, student.childName)"> <i class="bi bi-trash"></i> Delete</button>
                                <button class="btn btn-info btn-sm m-1" @click="openUpdateModal(student)"> <i class="bi bi-pencil"></i> Update</button>
                                <button class="btn btn-success btn-sm m-1" @click="openAssignBatchModal(student)"> <i class="bi bi-plus-circle"></i> Assign to Batch</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <nav v-if="paginatedStudents.length > 1">
                <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
                    </li>
                    <li class="page-item" v-for="page in paginatedStudents.length" :key="page" :class="{ active: currentPage === page }">
                        <button class="page-link" @click="changePage(page)">{{ page }}</button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === paginatedStudents.length }">
                        <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
                    </li>
                </ul>
            </nav>
        </div>

        <!-- Update Modal -->
        <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="updateModalLabel">Update Student</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <!-- Error Messages -->
                        <div v-if="updateErrors.length" class="alert alert-danger">
                            <ul>
                                <li v-for="error in updateErrors" :key="error">{{ error }}</li>
                            </ul>
                        </div>
                        <form>
                            <div class="mb-3">
                                <label for="updateParentName" class="form-label text-dark">Parent Name</label>
                                <input type="text" id="updateParentName" v-model="updateForm.parentName" class="form-control">
                            </div>
                            <div class="mb-3">
                                <label for="updateAddress" class="form-label text-dark">Address</label>
                                <input type="text" id="updateAddress" v-model="updateForm.address" class="form-control">
                            </div>
                            <div class="mb-3">
                                <label for="updateVisitingDate" class="form-label text-dark">Visiting Date</label>
                                <input type="date" id="updateVisitingDate" v-model="updateForm.visitingDate" class="form-control">
                            </div>
                            <div class="mb-3">
                                <label for="updateChildName" class="form-label text-dark">Child Name</label>
                                <input type="text" id="updateChildName" v-model="updateForm.childName" class="form-control">
                            </div>

                            

                            <div class="mb-3">
                              <label class="form-label text-dark">Courses Enrolled</label>
                              <div v-for="course in courses" :key="course.course_name+'-'+course.id" class="form-check">
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  :id="'course-' + course.course_name + '-' + course.id"
                                  :value="course.course_name + '-' + course.id"
                                  v-model="updateForm.courseEnrolled"
                                />
                                <label class="form-check-label text-dark" :for="'course-' + course.course_name + '-' + course.id" >
                                  {{ course.course_name }} by {{ course.instructor }}
                                </label>
                              </div>
                            </div>
                            



                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" @click="updateStudent">
                          <span v-if="isLoading_update" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                          <span v-if="!isLoading_update"> <i class="bi bi-check-lg"></i>  Save Changes</span>

                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Assign to Batch Modal -->
        <div class="modal fade" id="assignBatchModal" tabindex="-1" aria-labelledby="assignBatchModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="assignBatchModalLabel">Assign Student to Batch</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="mb-3">
                                <label for="batchSelect" class="form-label text-dark">Select Batch</label>
                                <select id="batchSelect" v-model="selectedBatchId" class="form-select" required>
                                    <option value="" disabled>Select a batch</option>
                                    <option v-for="batch in batches" :key="batch.id" :value="batch.id">
                                        {{ batch.course_name }} ({{ batch.start_time }} - {{ batch.end_time }})
                                    </option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" @click="assignStudentToBatch">
                          <span v-if="isLoading_assign" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                          <span v-if="!isLoading_assign"> <i class="bi bi-check-lg"></i>  Assign</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
  `,
  data() {
    return {
      students: [],
      batches: [],
      courses: [], // Add courses array to store fetched courses
      searchQuery: '',
      sortKey: '',
      sortOrder: 'asc',
      currentPage: 1,
      itemsPerPage: 5,
      updateForm: {
        parentName: '',
        address: '',
        visitingDate: '',
        childName: '',
        courseEnrolled: [], // Changed to courses (plural) to reflect multiple courses
        parentContact: '',
      },
      updateErrors: [],
      selectedStudent: null,
      selectedBatchId: '',
      notification: {
        message: '',
        type: '',
      },
      isLoading_update: false,
      isLoading_assign: false,
      loadingStudents: true,
    };
  },
  computed: {
    filteredStudents() {
      return this.students.filter(student => {
        const query = this.searchQuery.toLowerCase();
        return (
          student.parentName.toLowerCase().includes(query) ||
          student.childName.toLowerCase().includes(query) ||
          student.courseEnrolled.toLowerCase().includes(query) ||
          student.parentContact.includes(query)
        );
      });
    },
    paginatedStudents() {
      const pages = [];
      for (let i = 0; i < this.filteredStudents.length; i += this.itemsPerPage) {
        pages.push(this.filteredStudents.slice(i, i + this.itemsPerPage));
      }
      return pages;
    },
    currentStudents() {
      return this.paginatedStudents[this.currentPage - 1] || [];
    },
  },
  methods: {
    async fetchStudents() {
      const url = window.location.origin + "/api/entry";
      const token = sessionStorage.getItem('authToken');
      try {
        const response = await apiRequest(url, {
          headers: {
            'Authentication-Token': `${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          this.students = data;
          console.log("Fetched students:", data);
          this.loadingStudents = false;
          // this.updateForm.courses = data.courseEnrolled.split(',').map(course => course.trim());
          // console.log("Courses enrolled:",data.courseEnrolled);
        } else {
          this.showNotification("Failed to fetch students.", "danger");
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    },
    async fetchBatches() {
      const url = window.location.origin + "/api/get_batches";
      const token = sessionStorage.getItem('authToken');
      try {
        const response = await apiRequest(url, {
          headers: {
            'Authentication-Token': `${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          this.batches = data;
        } else {
          this.showNotification("Failed to fetch batches.", "danger");
        }
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    },
    async fetchCourses() {
      const url = window.location.origin + "/api/get_courses";
      const token = sessionStorage.getItem('authToken');
      try {
        const response = await apiRequest(url, {
          headers: {
            'Authentication-Token': `${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          this.courses = data;
          console.log("Fetched courses:", this.courses);
        } else {
          this.showNotification("Failed to fetch courses.", "danger");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    },
    async deleteStudent(parentContact, childName) {
      const url = window.location.origin + `/api/entry/${parentContact}/${childName}`;
      const token = sessionStorage.getItem('authToken');
      try {
        const response = await apiRequest(url, {
          method: 'DELETE',
          headers: {
            'Authentication-Token': `${token}`,
          },
        });
        if (response.ok) {
          this.fetchStudents();
          this.showNotification("Student deleted successfully.", "success");
        } else {
          this.showNotification("Failed to delete student.", "danger");
        }
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    },
    openUpdateModal(student) {
      this.updateForm = { ...student };
      this.updateForm.courseEnrolled = student.courseEnrolled.split(',').map(course => course.trim());
      console.log("Update form data:", this.updateForm);
      const modalElement = document.getElementById('updateModal');
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    },
    validateUpdateForm() {
      const errors = [];
      if (!this.updateForm.parentName || !/^[a-zA-Z\s]+$/.test(this.updateForm.parentName)) {
        errors.push("Parent Name must contain only letters and spaces. Name is required.");
      }
      if (!this.updateForm.address) {
        errors.push("Address is required.");
      }
      const today = new Date().toISOString().split('T')[0];
      if (!this.updateForm.visitingDate) {
        errors.push("Visiting Date must be today or in the future.");
      }
      if (!this.updateForm.childName || !/^[a-zA-Z\s]+$/.test(this.updateForm.childName)) {
        errors.push("Child Name must contain only letters and spaces.");
      }
      if (!this.updateForm.courseEnrolled.length) {
        errors.push("At least one Course Enrolled is required.");
      }
      if (!this.updateForm.parentContact || !/^\d{10}$/.test(this.updateForm.parentContact)) {
        errors.push("Parent Contact must be a 10-digit number.");
      }
      this.updateErrors = errors;
      return errors;
    },
    async updateStudent() {
      const errors = this.validateUpdateForm();
      if (errors.length > 0) {
        return;
      }
      this.isLoading_update = true;

      const { id } = this.updateForm;
      const url = window.location.origin + `/api/entry/${id}`;
      const token = sessionStorage.getItem('authToken');
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authentication-Token': `${token}`,
        },
        body: JSON.stringify(this.updateForm),
      });
      const modalElement = document.getElementById('updateModal');
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (response.ok) {
        this.isLoading_update = false;
        modal.hide();
        this.fetchStudents();
        this.showNotification("Student updated successfully.", "success");
      } else {
        this.showNotification("Failed to update student.", "danger");
        this.isLoading_update = false;
        modal.hide();
      }
    },
    openAssignBatchModal(student) {
      this.selectedStudent = student;
      const modalElement = document.getElementById('assignBatchModal');
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    },
    async assignStudentToBatch() {
      if (!this.selectedBatchId || !this.selectedStudent) {
        this.showNotification("Please select a batch and a student.", "danger");
        return;
      }
      this.isLoading_assign = true;
      const url = window.location.origin + `/api/add_student_to_batch/${this.selectedBatchId}/${this.selectedStudent.id}`;
      const token = sessionStorage.getItem('authToken');
      try {
        const response = await apiRequest(url, {
          method: 'GET',
          headers: {
            'Authentication-Token': `${token}`,
          },
        });

        const modalElement = document.getElementById('assignBatchModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (response.ok) {
          this.isLoading_assign = false;
          modal.hide();
          this.fetchStudents();
          this.showNotification("Student assigned to batch successfully.", "success");
        } else {
          const responseData = await response.json();
          this.showNotification(`Failed to assign student to batch: ${responseData.message}`, "danger");
          this.isLoading_assign = false;
          modal.hide();
        }
      } catch (error) {
        console.error("Error assigning student to batch:", error);
        this.isLoading_assign = false;
        modal.hide();
      }
    },
    sortTable(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
      }
      this.students.sort((a, b) => {
        const aValue = a[key].toString().toLowerCase();
        const bValue = b[key].toString().toLowerCase();
        if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    },
    changePage(page) {
      if (page > 0 && page <= this.paginatedStudents.length) {
        this.currentPage = page;
      }
    },
    showNotification(message, type) {
      this.notification.message = message;
      this.notification.type = type;
      setTimeout(() => {
        this.notification.message = '';
        this.notification.type = '';
      }, 2000);
    },
  },
  mounted() {
    this.fetchStudents();
    this.fetchBatches();
    this.fetchCourses(); // Fetch courses on component mount
  },
});
