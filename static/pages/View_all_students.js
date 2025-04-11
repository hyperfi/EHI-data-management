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
                                <button class="btn btn-danger btn-sm" @click="deleteStudent(student.parentContact)">Delete</button>
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
        };
    },
    computed: {
        filteredStudents() {
            // Filter students based on the search query
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
            // Paginate the filtered students
            const pages = [];
            for (let i = 0; i < this.filteredStudents.length; i += this.itemsPerPage) {
                pages.push(this.filteredStudents.slice(i, i + this.itemsPerPage));
            }
            return pages;
        },
        currentStudents() {
            // Get the students for the current page
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
                console.log("Fetched students:", this.students);
            } else {
                console.error("Failed to fetch students:", response.statusText);
            }
        },
        async deleteStudent(parentContact) {
            const url = window.location.origin;
            const response = await fetch(url + "/api/entry" + "/" + parentContact, {
                method: 'DELETE'
            });
            if (!response.ok) {
                let data = await response.json();
                console.error('Failed to delete entry:', data.message);
            } else {
                console.log('Entry deleted successfully');
                this.fetchStudents();
            }
        },
        sortTable(key) {
            // Sort the table by the given key
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
            // Change the current page
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
