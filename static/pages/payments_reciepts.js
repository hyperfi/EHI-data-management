import store from '../utils/store.js'; // Import the Vuex store
import { apiRequest } from '../utils/api.js'; // Import the apiRequest utility function

const PaymentStatus = {
  template: `
    <div class="position-relative">
      <!-- Background Video -->
      <video autoplay loop muted playsinline class="position-absolute w-100 h-100" style="object-fit: cover; z-index: -1;">
            <source src="/static/videos/background.mp4" type="video/mp4">
            Your browser does not support the video tag.
      </video>
    <div class="d-flex justify-content-center align-items-center vh-100 bg-light bg-opacity-25" style="height: 80vh;">

      <div class="card shadow-lg p-4" style="width: 90%; max-height: 90%; overflow-y: auto; background-color: rgba(255, 255, 255, 0.9);">
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
            <option value="childName">Sort by Student Name</option>
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
                <th>Student Name</th>
                <th>Course Enrolled</th>
                <th>Parent Contact</th>
                <th>Fee (₹)</th>
                <th>No. of Months</th>
                <th>Payment Status</th>
                <th>Payment Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody class="text-center">
              <tr v-if="filteredAndSortedPayments.length === 0">
                <td colspan="11" class="text-center text-muted">No payment records found</td>
              </tr>
              <tr v-else v-for="payment in filteredAndSortedPayments" :key="payment.id">
                <td>{{ payment.parentName }}</td>
                <td>{{ payment.address }}</td>
                <td>{{ payment.visitingDate }}</td>
                <td>{{ payment.childName }}</td>
                <td>{{ payment.courseEnrolled }}</td>
                <td>{{ payment.parentContact }}</td>
                <td>{{ payment.fee }}</td>
                <td>{{ payment.noOfMonths }}</td>
                <td>
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
                <td>
                  <button class="btn btn-info btn-sm mb-2" @click="openUpdateModal(payment)">Update</button> <!-- Added 'me-3' for spacing -->
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
          <!-- Add the Download CSV Button -->
          <div class="text-center mt-3">
            <button class="btn btn-success" @click="downloadCSV">Download Table</button>
          </div>
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
                <div class="mb-3">
                  <label for="noOfMonths" class="form-label">No. of Months</label>
                  <input type="number" id="noOfMonths" v-model="updateForm.noOfMonths" class="form-control" min="1" required />
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
        noOfMonths: 1, // Default value for noOfMonths
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
      const url = "/api/payment_status";
      const token = store.getters.authToken; // Get the token from Vuex store
      try {
        const response = await apiRequest(url, {
          headers: {
            "Authentication-Token": `${token}`, // Include the token in the Authentication-Token header
          },
        });
        if (response.ok) {
          this.payments = await response.json();
        } else {
          this.showNotification("Error fetching payment records", "danger");
        }
      } catch (error) {
        console.error("Error fetching payment records:", error);
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
        noOfMonths: payment.noOfMonths || 1, // Default to 1 if no value is provided
      };
      const modal = new bootstrap.Modal(document.getElementById("updatePaymentModal"));
      modal.show();
    },
    async updatePaymentStatus() {
      const url = "/api/payment_status_update";
      const token = store.getters.authToken; // Get the token from Vuex store
      try {
        const response = await apiRequest(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": `${token}`, // Include the token in the Authentication-Token header
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
      }
    },

    textToNumber(text) {
    let number = 0;
    const prime = 31; // A prime number helps distribute the values

    for (let i = 0; i < text.length; i++) {
      number = number * prime + text.charCodeAt(i);
    }

    return number;
    },

    generateReceiptNumber(parentName, childName, fee) {
      // Generate a unique receipt number using a combination of parentName, childName, and fee
      const parentNameNumber = this.textToNumber(parentName);
      const childNameNumber = this.textToNumber(childName);
      const feeNumber = this.textToNumber(fee);
      const receiptNumber = (parentNameNumber + childNameNumber + feeNumber) % 1000000; // Limit to 6 digits
      return receiptNumber.toString().padStart(6, '0'); // Pad with leading zeros if necessary
    },
    generateReceipt(payment) {
      const { parentName, childName, courseEnrolled, paymentDate, paymentStatus, fee, noOfMonths } = payment;
      const receiptNumber = this.generateReceiptNumber(parentName, childName, fee); // Generate a receipt number from the parentName and childName and fee using a math function
      const totalFee = Number(fee) * Number(noOfMonths); // Calculate the total fee based on the number of months
      // Get the current date and time for the "Generated On" timestamp
      const generatedOn = new Date().toLocaleString();
      let months = noOfMonths; // Store the number of months in a variable for later use
      if (Number(noOfMonths) > 1) {
        months = Number(noOfMonths) + " Months";
      } else {
        months = Number(noOfMonths) + " Month";
      }
      
      // Create a new HTML structure for the receipt
      const receiptHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Payment Receipt</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

          @page {
            size: A4;
            margin: 20mm;
          }

          @media print {
            body {
              margin: 0;
              padding: 0;
              background-color: #fff !important;
            }

            .receipt-container {
              box-shadow: none;
              border: none;
              page-break-inside: avoid;
            }

            .no-print {
              display: none !important;
            }
          }

          body {
            font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f8fa;
            color: #333;
          }

          .receipt-container {
            width: 210mm;
            margin: 20mm auto;
            background-color: #ffffff;
            border-radius: 10px;
            border: 1px solid #e0e0e0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            padding: 30px;
            box-sizing: border-box;
          }

          .top-bar {
            background-color: rgb(22, 34, 58);
            color: #fff;
            padding: 12px 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }

          .top-bar h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }

          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 30px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 20px;
          }

          .header .logo {
            display: flex;
            align-items: center;
          }

          .header .logo img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            object-fit: cover;
            margin-right: 15px;
          }

          .header .institute-name {
            font-family: 'Segoe UI', Tahoma, Geneva, sans-serif;
            font-size: 24px;
            font-weight: 600;
            color: rgb(22, 34, 58);

            
          }

          .header .contact {
            text-align: right;
            font-size: 14px;
            color: #666;
          }

          .details {
            margin-top: 30px;
            font-size: 16px;
            line-height: 1.6;
          }

          .details p {
            margin: 8px 0;
          }

          .details p strong {
            width: 180px;
            display: inline-block;
          }

          .receipt-info {
            margin-top: 20px;
            padding: 15px;
            background-color: #f1f5fb;
            border-left: 4px solid #007bff;
            border-radius: 6px;
            font-size: 15px;
          }

          .footer {
            text-align: center;
            margin-top: 40px;
            font-size: 14px;
            color: #555;
          }

          .footer .generated-on {
            margin-top: 10px;
            font-size: 12px;
            color: #888;
          }

          .graphics {
            text-align: center;
            margin-top: 30px;
          }

          .graphics img {
            width: 200px;
            opacity: 0.75;
          }

        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="top-bar">
            <h1>Payment Receipt</h1>
          </div>

          <div class="header">
            <div class="logo">
              <img src="/static/images/logo.jpg" alt="Logo">
              <div class="institute-name">Event Horizon Institute</div>
            </div>
            <div class="contact">
              eventhorizoninstitute25@gmail.com<br/>
              +91-82954-33285
            </div>
          </div>

          <div class="receipt-info">
            <p><strong>Receipt Number:</strong> #${receiptNumber}</p>
            <p><strong>Payment Date:</strong> ${paymentDate}</p>
            <p><strong>Payment Status:</strong> ${paymentStatus}</p>
          </div>

          <div class="details">
            <p><strong>Parent Name:</strong> ${parentName}</p>
            <p><strong>Student Name:</strong> ${childName}</p>
            <p><strong>Course Enrolled:</strong> ${courseEnrolled}</p>
            <p><strong>Enrolled for: </strong> ${months}</p>
            <p><strong>Amount Paid:</strong> ₹${totalFee}</p>
          </div>

          <div class="footer">
            <p>Thank you for your payment and trust in us.</p>
            <p>&copy; ${new Date().getFullYear()} Event Horizon Institute. All rights reserved.</p>
            <p class="generated-on"><strong>Generated On:</strong> ${generatedOn}</p>
          </div>
          <button onclick="window.print()" class = "no-print" >Print Receipt</button>


          
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
    downloadCSV() {
      const headers = [
        "Parent Name",
        "Address",
        "Visiting Date",
        "Child Name",
        "Course Enrolled",
        "Parent Contact",
        "Fee (₹)",
        "No. of Months",
        "Payment Status",
        "Payment Date",
      ];
      const rows = this.filteredAndSortedPayments.map((payment) => [
        payment.parentName,
        payment.address,
        payment.visitingDate,
        payment.childName,
        payment.courseEnrolled,
        payment.parentContact,
        payment.fee,
        payment.noOfMonths,
        payment.paymentStatus,
        payment.paymentDate,
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers, ...rows].map((e) => e.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "payment_records.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
  mounted() {
    this.fetchPayments();
  },
};

export default PaymentStatus;

