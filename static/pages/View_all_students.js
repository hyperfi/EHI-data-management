const ViewAllStudents = {
    template: `
    <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div class="card shadow-lg p-4" style="width: 90%; max-height: 90%; overflow-y: auto;">
            <h1 class="text-center mb-4">All Students</h1>
            
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
                            <th @click="sortTable('childName')" style="cursor: pointer">Child Name <i class="bi bi-arrow-down-up"></i></th>
                            <th @click="sortTable('courseEnrolled')" style="cursor: pointer">Course Enrolled <i class="bi bi-arrow-down-up"></i></th>
                            <th @click="sortTable('parentContact')" style="cursor: pointer">Contact <i class="bi bi-arrow-down-up"></i></th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="student in currentStudents" :key="student.parentContact">
                            <td>{{ student.parentName }}</td>
                            <td>{{ student.address }}</td>
                            <td>{{ student.visitingDate }}</td>
                            <td>{{ student.childName }}</td>
                            <td>{{ student.courseEnrolled }}</td>
                            <td>{{ student.parentContact }}</td>
                            <td>
                                <button class="btn btn-danger btn-sm" @click="deleteStudent(student.parentContact, student.childName)">Delete</button>
                                <button class="btn btn-info btn-sm" @click="openUpdateModal(student)">Update</button>
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
                                <label for="updateParentName" class="form-label">Parent Name</label>
                                <input type="text" id="updateParentName" v-model="updateForm.parentName" class="form-control">
                            </div>
                            <div class="mb-3">
                                <label for="updateAddress" class="form-label">Address</label>
                                <input type="text" id="updateAddress" v-model="updateForm.address" class="form-control">
                            </div>
                            <div class="mb-3">
                                <label for="updateVisitingDate" class="form-label">Visiting Date</label>
                                <input type="date" id="updateVisitingDate" v-model="updateForm.visitingDate" class="form-control">
                            </div>
                            <div class="mb-3">
                                <label for="updateChildName" class="form-label">Child Name</label>
                                <input type="text" id="updateChildName" v-model="updateForm.childName" class="form-control">
                            </div>
                            <div class="mb-3">
                                <label for="updateCourseEnrolled" class="form-label">Course Enrolled</label>
                                <input type="text" id="updateCourseEnrolled" v-model="updateForm.courseEnrolled" class="form-control">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" @click="updateStudent">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            students: [],
            searchQuery: '',
            sortKey: '',
            sortOrder: 'asc', // 'asc' or 'desc'
            currentPage: 1,
            itemsPerPage: 5,
            updateForm: {
                parentName: '',
                address: '',
                visitingDate: '',
                childName: '',
                courseEnrolled: '',
                parentContact: '',
            },
            updateErrors: [], // To store validation errors for the update form
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
            const url = window.location.origin;
            const response = await fetch(url + "/api/entry");
            if (response.ok) {
                const data = await response.json();
                this.students = data;
            } else {
                console.error("Failed to fetch students:", response.statusText);
            }
        },
        async deleteStudent(parentContact, childName) {
            const url = window.location.origin;
            const response = await fetch(url + `/api/entry/${parentContact}/${childName}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                this.fetchStudents();
            } else {
                console.error('Failed to delete entry');
            }
        },
        openUpdateModal(student) {
            this.updateForm = { ...student };
            const modal = new bootstrap.Modal(document.getElementById('updateModal'));
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
            const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
            if (!this.updateForm.visitingDate || this.updateForm.visitingDate < today) {
                errors.push("Visiting Date must be today or in the future.");
            }
            if (!this.updateForm.childName || !/^[a-zA-Z\s]+$/.test(this.updateForm.childName)) {
                errors.push("Child Name must contain only letters and spaces.");
            }
            if (!this.updateForm.courseEnrolled) {
                errors.push("Course Enrolled is required.");
            }
            if (!this.updateForm.parentContact || !/^\d{10}$/.test(this.updateForm.parentContact)) {
                errors.push("Parent Contact must be a 10-digit number.");
            }
            this.updateErrors = errors; // Bind errors to the modal
            return errors;
        },
        async updateStudent() {
            const errors = this.validateUpdateForm();
            if (errors.length > 0) {
                return; // Stop if there are validation errors
            }

            const { parentContact, childName } = this.updateForm;
            const url = window.location.origin + `/api/entry/${parentContact}/${childName}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.updateForm),
            });
            if (response.ok) {
                const modal = bootstrap.Modal.getInstance(document.getElementById('updateModal'));
                modal.hide();
                this.fetchStudents();
            } else {
                console.error('Failed to update entry');
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
    },
    mounted() {
        this.fetchStudents();
    },
};

export default ViewAllStudents;
