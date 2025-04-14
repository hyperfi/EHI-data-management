const PaymentStatus = {
  template: `
    <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div class="card shadow-lg p-4" style="width: 90%; max-height: 90%; overflow-y: auto;">
        <h1 class="text-center mb-4 display-5">Payment Details</h1>

        <!-- Notification Message -->
        <div v-if="notification.message" :class="'alert alert-' + notification.type" role="alert">
          {{ notification.message }}
        </div>

        <!-- Search and Sort Controls -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            v-model="searchQuery"
            class="form-control w-50"
            placeholder="Search by Parent Name, Child Name, or Course"
          />
          <select v-model="sortKey" class="form-select w-25">
            <option value="parentName">Sort by Parent Name</option>
            <option value="childName">Sort by Child Name</option>
            <option value="courseEnrolled">Sort by Course</option>
            <option value="fee">Sort by Fee</option>
            <option value="paymentDate">Sort by Payment Date</option>
          </select>
          <button class="btn btn-secondary" @click="toggleSortOrder">
            {{ sortOrder === 'asc' ? 'Ascending' : 'Descending' }}
          </button>
        </div>

        <!-- Payment Status Table -->
        <div class="table-responsive">
          <table class="table table-hover table-bordered">
            <thead class="table-dark text-center">
              <tr>
                <th>Parent Name</th>
                <th>Address</th>
                <th>Visiting Date</th>
                <th>Child Name</th>
                <th>Course Enrolled</th>
                <th>Parent Contact</th>
                <th>Fee (Rs.)</th>
                <th>Payment Status</th>
                <th>Payment Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredAndSortedPayments.length === 0">
                <td colspan="10" class="text-center text-muted">No payment records found</td>
              </tr>
              <tr v-else v-for="payment in filteredAndSortedPayments" :key="payment.id">
                <td>{{ payment.parentName }}</td>
                <td>{{ payment.address }}</td>
                <td>{{ payment.visitingDate }}</td>
                <td>{{ payment.childName }}</td>
                <td>{{ payment.courseEnrolled }}</td>
                <td>{{ payment.parentContact }}</td>
                <td>{{ payment.fee }}</td>
                <td class="text-center">
                  <span
                    class="badge"
                    :class="{
                      'bg-success': payment.paymentStatus === 'Paid',
                      'bg-danger': payment.paymentStatus === 'Unpaid'
                    }"
                  >
                    {{ payment.paymentStatus }}
                  </span>
                </td>
                <td>{{ payment.paymentDate }}</td>
                <td class="text-center">
                  <button class="btn btn-info btn-sm me-2" @click="openUpdateModal(payment)">
                    Update
                  </button>
                  <button
                    v-if="payment.paymentStatus === 'Paid'"
                    class="btn btn-primary btn-sm"
                    @click="generateReceipt(payment)"
                  >
                    Generate Receipt
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Update Payment Status Modal -->
      <div class="modal fade" id="updatePaymentModal" tabindex="-1" aria-labelledby="updatePaymentModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="updatePaymentModalLabel">Update Payment Status</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form>
                <div class="mb-3">
                  <label for="paymentStatus" class="form-label">Payment Status</label>
                  <select id="paymentStatus" v-model="updateForm.paymentStatus" class="form-select" required>
                    <option value="" disabled>Select status</option>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="paymentDate" class="form-label">Payment Date</label>
                  <input type="date" id="paymentDate" v-model="updateForm.paymentDate" class="form-control" required />
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" @click="updatePaymentStatus">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      payments: [], // List of payment records
      searchQuery: "", // Search input
      sortKey: "parentName", // Default sort key
      sortOrder: "asc", // Default sort order
      updateForm: {
        id: null,
        paymentStatus: "",
        paymentDate: "",
      },
      notification: {
        message: "",
        type: "", // 'success' or 'danger'
      },
    };
  },
  computed: {
    filteredAndSortedPayments() {
      // Filter payments based on the search query
      let filtered = this.payments.filter((payment) => {
        const query = this.searchQuery.toLowerCase();
        return (
          payment.parentName.toLowerCase().includes(query) ||
          payment.childName.toLowerCase().includes(query) ||
          payment.courseEnrolled.toLowerCase().includes(query)
        );
      });

      // Sort the filtered payments
      return filtered.sort((a, b) => {
        let result = 0;
        if (a[this.sortKey] < b[this.sortKey]) result = -1;
        if (a[this.sortKey] > b[this.sortKey]) result = 1;
        return this.sortOrder === "asc" ? result : -result;
      });
    },
  },
  methods: {
    async fetchPayments() {
      try {
        const response = await fetch("/api/payment_status");
        if (response.ok) {
          this.payments = await response.json();
        } else {
          this.showNotification("Error fetching payment records", "danger");
        }
      } catch (error) {
        console.error("Error fetching payment records:", error);
        this.showNotification("Error fetching payment records", "danger");
      }
    },
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
    },
    openUpdateModal(payment) {
      this.updateForm = {
        id: payment.id,
        paymentStatus: payment.paymentStatus,
        paymentDate: payment.paymentDate,
      };
      const modal = new bootstrap.Modal(document.getElementById("updatePaymentModal"));
      modal.show();
    },
    async updatePaymentStatus() {
      try {
        const response = await fetch("/api/payment_status_update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.updateForm),
        });
        if (response.ok) {
          this.showNotification("Payment status updated successfully", "success");
          const modal = bootstrap.Modal.getInstance(document.getElementById("updatePaymentModal"));
          modal.hide();
          this.fetchPayments(); // Refresh the payment records
        } else {
          const errorData = await response.json();
          this.showNotification(`Error: ${errorData.message}`, "danger");
        }
      } catch (error) {
        console.error("Error updating payment status:", error);
        this.showNotification("Error updating payment status", "danger");
      }
    },
    generateReceipt(payment) {
      const { parentName, childName, courseEnrolled, paymentDate, paymentStatus, fee } = payment;

      // Get the current date and time for the "Generated On" timestamp
      const generatedOn = new Date().toLocaleString();

      // Create a new HTML structure for the receipt
      const receiptHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Receipt</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              .receipt-container {
                page-break-inside: avoid; /* Prevent page breaks inside the container */
              }
            }
            body {
              font-family: 'Poppins', sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f8fb;
              color: #333;
            }
            .receipt-container {
              width: 210mm; /* A4 width */
              margin: 20mm auto; /* Center the receipt with margins */
              background-color: #fff;
              border: 1px solid #ddd;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              padding: 20mm; /* Add padding for better layout */
              box-sizing: border-box;
            }
            .top-bar {
              background-color: #007bff;
              color: #fff;
              padding: 10px 20px;
              border-radius: 8px 8px 0 0;
              text-align: center;
            }
            .top-bar h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .header {
              text-align: center;
              margin: 20px 0;
            }
            .header img {
              width: 60px;
              height: 60px;
              border-radius: 50%;
              object-fit: cover;
            }
            .header h2 {
              color: #007bff;
              margin: 10px 0 0;
              font-size: 20px;
              font-weight: 600;
            }
            .details {
              margin: 30px 0;
              font-size: 16px;
            }
            .details p {
              margin: 8px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 14px;
              color: #555;
            }
            .footer .generated-on {
              margin-top: 10px;
              font-size: 12px;
              color: #777;
            }
            .graphics {
              text-align: center;
              margin-top: 20px;
            }
            .graphics img {
              width: 200px;
              opacity: 0.8;
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="top-bar">
              <h1>Payment Receipt</h1>
            </div>
            <div class="header">
              <img src="/static/images/logo.jpg" alt="Logo">
              <h2>Event Horizon Institute</h2>
            </div>
            <div class="details">
              <p><strong>Parent Name:</strong> ${parentName}</p>
              <p><strong>Child Name:</strong> ${childName}</p>
              <p><strong>Course Enrolled:</strong> ${courseEnrolled}</p>
              <p><strong>Payment Date:</strong> ${paymentDate}</p>
              <p><strong>Payment Status:</strong> ${paymentStatus}</p>
              <p><strong>Fee:</strong> Rs. ${fee}</p>
            </div>
            <div class="footer">
              <p>Thank you for your payment!</p>
              <p>&copy; ${new Date().getFullYear()} Event Horizon Institute</p>
              <p class="generated-on"><strong>Generated On:</strong> ${generatedOn}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Open the receipt in a new tab
      const newTab = window.open();
      newTab.document.open();
      newTab.document.write(receiptHTML);
      newTab.document.close();
    },
    showNotification(message, type) {
      this.notification.message = message;
      this.notification.type = type;
      setTimeout(() => {
        this.notification.message = "";
        this.notification.type = "";
      }, 2000); // Clear the notification after 2 seconds
    },
  },
  mounted() {
    this.fetchPayments();
  },
};

export default PaymentStatus;

