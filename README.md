# Event Horizon Institute - Web Application

Welcome to the **Event Horizon Institute** web application! This project is designed to manage and streamline the operations of an educational institute, including managing students, courses, batches, payments, and more.

---

## **Features**
- **Student Management**: Add, update, delete, and view student details.
- **Course Management**: Create, update, and manage courses offered by the institute.
- **Batch Management**: Organize students into batches and manage batch schedules.
- **Payment Tracking**: Record and track payment statuses for students.
- **Responsive Design**: Fully responsive UI for seamless use across devices.
- **Secure Authentication**: Login system with session management for secure access.

---

## **Technologies Used**
- **Frontend**: Vue.js (v2.7.16), Bootstrap 5
- **Backend**: Flask (v3.1.0)
- **Database**: SQLAlchemy with Flask-Migrate
- **Styling**: Custom CSS and Bootstrap
- **Authentication**: Flask-Security with session-based authentication

---

## **Setup Instructions**

### **1. Clone the Repository**
```bash
git clone https://github.com/your-repo/event-horizon-institute.git
cd event-horizon-institute
```
### **2. Set Up the Virtual Environment**
```bash
python3 -m venv .venv
source .venv/bin/activate
```
### **3. Install Dependencies**
```bash
pip install -r requirements.txt
```
### **4. Set Up the Database**
```bash
flask db init
flask db migrate
flask db upgrade
```
### **5. Run the Application**
```bash
flask run
```
The application will be available at http://127.0.0.1:5000.

---

## **Key Files**
- **`app.py`**: Entry point for the Flask application.
- **`models.py`**: Defines the database models for students, courses, batches, etc.
- **`static/pages/`**: Contains Vue.js components for different pages.
- **`static/styles.css`**: Custom CSS for styling the application.
- **`templates/index.html`**: Main HTML template for the application.

---

## **Usage**
1. **Login**: Use your credentials to log in to the system.
2. **Manage Students**: Add or update student details, assign them to batches, and track their progress.
3. **Manage Courses**: Create and manage courses offered by the institute.
4. **Track Payments**: Record and monitor payment statuses for students.
5. **Batch Management**: Organize students into batches and manage schedules.

---

## **Contributing**
We welcome contributions to improve this project! To contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push them to your fork.
4. Submit a pull request with a detailed description of your changes.

---

## **License**
This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## **Contact**
For any queries or support, please contact us at:
- **Email**: [eventhorizoninstitute25@gmail.com](mailto:eventhorizoninstitute25@gmail.com)
---

Thank you for using the Event Horizon Institute web application! 🚀


