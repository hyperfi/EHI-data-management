from extentions import db, security
from flask_security import UserMixin, RoleMixin
# from flask_security.models import fsqla_v3 as fsq

# fsq.FsModels.set_db_info(db)


class ParentCustomer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    visiting_date = db.Column(db.String(50), nullable=False)
    child_name = db.Column(db.String(100), nullable=False)
    course_enrolled = db.Column(db.String(100), nullable=False)
    parent_contact = db.Column(db.String(15), nullable=False)
    payment_status = db.Column(
        db.String(50), nullable=False)  # e.g., paid, unpaid
    payment_date = db.Column(db.String(50), nullable=True)  # Date of payment

    def __repr__(self):
        return f'<ParentCustomer {self.parent_name} - {self.child_name}>'


# class User(db.Model, UserMixin):
#     id = db.Column(db.Integer, primary_key=True)
#     fname = db.Column(db.String, unique=False, nullable=False)
#     lname = db.Column(db.String, unique=False)
#     email = db.Column(db.String, nullable=False, unique=True)
#     password = db.Column(db.String, nullable=False)
#     active = db.Column(db.Boolean)
#     fs_uniquifier = db.Column(db.String(), nullable=False)
#     roles = db.relationship('Role', secondary='user_roles')


# class Role(db.Model, RoleMixin):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(80), unique=True, nullable=False)
#     description = db.Column(db.String)


# class UserRoles(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
#     role_id = db.Column(db.Integer, db.ForeignKey('role.id'))


class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    duration = db.Column(db.String(50), nullable=False)
    fee = db.Column(db.Float, nullable=False)
    instructor = db.Column(db.String(100), nullable=False)
    # many-to-many relationship with Student
    enrolled_students = db.relationship(
        'Student', backref='course', lazy=True, secondary='student_course')

    def __repr__(self):
        return f'<Course {self.name}>'


class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    className = db.Column(db.String(50), nullable=False)
    parent_contact = db.Column(db.String(15), nullable=False)

    def __repr__(self):
        return f'<Student {self.name}>'


class student_course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey(
        'student.id'), nullable=False)  # Foreign key to Student

    course_id = db.Column(db.Integer, db.ForeignKey(
        'course.id'), nullable=False)  # Foreign key to Course


class Batch(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey(
        'course.id'), nullable=False)  # Foreign key to Course
    batch_name = db.Column(db.String(100), nullable=False)
    # Changed from start_date
    start_time = db.Column(db.String(50), nullable=False)
    # Changed from end_date
    end_time = db.Column(db.String(50), nullable=False)

    course = db.relationship('Course', backref='batch', lazy=True)
    # One-to-many relationship with Student
    enrolled_students = db.relationship(
        'Student', backref='batch', lazy=True, secondary='batch_students'
    )

    def __repr__(self):
        return f'<Batch {self.batch_name}>'


class batch_students(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    batch_id = db.Column(db.Integer, db.ForeignKey('batch.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey(
        'student.id'), nullable=False)

# class Instructor(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), nullable=False)
#     email = db.Column(db.String(100), unique=True, nullable=False)
#     phone = db.Column(db.String(15), unique=True, nullable=False)
#     address = db.Column(db.String(200), nullable=False)
#     # One-to-many relationship with Course
#     courses = db.relationship('Course', backref='instructor', lazy=True)

#     def __repr__(self):
#         return f'<Instructor {self.name}>'


# class Enrollment(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     student_id = db.Column(db.Integer, db.ForeignKey(
#         'student.id'), nullable=False)
#     course_id = db.Column(db.Integer, db.ForeignKey(
#         'course.id'), nullable=False)
#     enrollment_date = db.Column(
#         db.String(50), nullable=False)  # Date of enrollment
#     # Enrollment status (e.g., active, completed, dropped)
#     status = db.Column(db.String(50), nullable=False)
#     student = db.relationship('Student', backref='enrollment', lazy=True)
#     course = db.relationship('Course', backref='enrollment', lazy=True)

#     def __repr__(self):
#         return f'<Enrollment {self.student.name} - {self.course.name}>'


# class Feedback(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     student_id = db.Column(db.Integer, db.ForeignKey(
#         'student.id'), nullable=False)
#     course_id = db.Column(db.Integer, db.ForeignKey(
#         'course.id'), nullable=False)
#     feedback_text = db.Column(db.Text, nullable=False)
#     rating = db.Column(db.Integer, nullable=False)  # Rating out of 5
#     student = db.relationship('Student', backref='feedback', lazy=True)
#     course = db.relationship('Course', backref='feedback', lazy=True)

#     def __repr__(self):
#         return f'<Feedback {self.student.name} - {self.course.name}>'


# class Payment(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     student_id = db.Column(db.Integer, db.ForeignKey(
#         'student.id'), nullable=False)
#     course_id = db.Column(db.Integer, db.ForeignKey(
#         'course.id'), nullable=False)
#     payment_date = db.Column(db.String(50), nullable=False)
#     amount = db.Column(db.Float, nullable=False)
#     # e.g., credit card, cash
#     payment_method = db.Column(db.String(50), nullable=False)
#     student = db.relationship('Student', backref='payment', lazy=True)
#     course = db.relationship('Course', backref='payment', lazy=True)

#     def __repr__(self):
#         return f'<Payment {self.student.name} - {self.course.name}>'


# class Attendance(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     student_id = db.Column(db.Integer, db.ForeignKey(
#         'student.id'), nullable=False)
#     course_id = db.Column(db.Integer, db.ForeignKey(
#         'course.id'), nullable=False)
#     date = db.Column(db.String(50), nullable=False)  # Date of attendance
#     # Attendance status (e.g., present, absent)
#     status = db.Column(db.String(50), nullable=False)
#     student = db.relationship('Student', backref='attendance', lazy=True)
#     course = db.relationship('Course', backref='attendance', lazy=True)

#     def __repr__(self):
#         return f'<Attendance {self.student.name} - {self.course.name}>'


# class Assignment(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     course_id = db.Column(db.Integer, db.ForeignKey(
#         'course.id'), nullable=False)
#     title = db.Column(db.String(100), nullable=False)
#     description = db.Column(db.Text, nullable=False)
#     # Due date for submission
#     due_date = db.Column(db.String(50), nullable=False)
#     course = db.relationship('Course', backref='assignment', lazy=True)

#     def __repr__(self):
#         return f'<Assignment {self.title}>'


# class Submission(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     assignment_id = db.Column(db.Integer, db.ForeignKey(
#         'assignment.id'), nullable=False)
#     student_id = db.Column(db.Integer, db.ForeignKey(
#         'student.id'), nullable=False)
#     submission_date = db.Column(
#         db.String(50), nullable=False)  # Date of submission
#     # Grade received for the assignment
#     grade = db.Column(db.Float, nullable=True)
#     # Feedback from the instructor
#     feedback = db.Column(db.Text, nullable=True)
#     assignment = db.relationship('Assignment', backref='submission', lazy=True)
#     student = db.relationship('Student', backref='submission', lazy=True)

#     def __repr__(self):
#         return f'<Submission {self.student.name} - {self.assignment.title}>'
