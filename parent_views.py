from flask import jsonify, render_template, render_template_string, request, send_file
from extentions import db
from models import ParentCustomer as parent_customer, Student, Payment, Course
from models import student_course as StudentCourse
from models import batch_students as BatchStudents
from flask_security import roles_required  # Import roles_required decorator


def create_parent_views(app):
    @app.route('/api/entry', methods=['POST'])
    @roles_required('admin')  # Require admin role
    def add_entry():
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400

        found_entry = db.session.query(parent_customer).filter(
            (parent_customer.parent_contact == data['parentContact']) & (parent_customer.child_name == data['childName'])).first()
        if found_entry:
            return jsonify({"message": "Entry already exists"}), 400

        entry = parent_customer(
            parent_name=data['parentName'],
            address=data['address'],
            visiting_date=data['visitingDate'],
            child_name=data['childName'],
            # Store courses as a comma-separated string
            course_enrolled=", ".join(data['courses_enrolled']),
            parent_contact=data['parentContact'],
            no_of_months=data.get('noOfMonths', 1),
        )

        db.session.add(entry)

        db.session.flush()  # Flush to get the ID of the entry
        db.session.refresh(entry)  # Refresh the entry to get the ID

        student = Student(name=data['childName'], className=data['courses_enrolled'][0].split('-')[0],
                          parent_contact=data['parentContact'])

        # Enroll the student in multiple courses
        for course_name in data['courses_enrolled']:
            course_id = course_name.split('-')[1]
            course = db.session.query(Course).filter_by(
                id=course_id).first()
            if course:
                student.enrolled_courses.append(course)

        # create a deffault payment entry
        payment = Payment(
            parent_customer_id=entry.id,
            payment_status="Unpaid",
            payment_date=None,
            amount_paid=0.0,
        )

        db.session.add(student)
        db.session.add(payment)
        db.session.commit()
        return jsonify({"message": "Entry added successfully"}), 201

    @app.route('/api/entry', methods=['GET'])
    @roles_required('admin')  # Require admin role
    def get_entries():
        print('---')
        entries = parent_customer.query.all()
        data = []
        for entry in entries:
            data.append({
                'id': entry.id,
                'parentName': entry.parent_name,
                'address': entry.address,
                'visitingDate': entry.visiting_date,
                'childName': entry.child_name,
                'courseEnrolled': entry.course_enrolled,
                'parentContact': entry.parent_contact,
            })
        return jsonify(data), 200

    @app.route('/api/entry/<contact>/<child_name>', methods=['DELETE'])
    @roles_required('admin')  # Require admin role
    def delete_entry(contact, child_name):
        entry = parent_customer.query.filter(
            (parent_customer.parent_contact == contact) & (parent_customer.child_name == child_name)).first()
        if not entry:
            return jsonify({"message": "Entry not found"}), 404

        # Delete associated payments
        Payment.query.filter_by(parent_customer_id=entry.id).delete()

        db.session.delete(entry)

        print('entry and student deleted')
        student_entry = Student.query.filter(
            (Student.parent_contact == contact) & (Student.name == child_name)).first()
        # print(student_entry)
        if student_entry:
            db.session.delete(student_entry)
            print('student deleted')

            # fetch all student_course entries here
            # student_course_entry = StudentCourse.query.all()
            # print(student_course_entry)

            # student_course_entry = StudentCourse.query.filter(
            #     (StudentCourse.student_id == student_entry.id)).all()
            # print(student_course_entry)

            # for student_course_entry in student_course_entry:
            #     db.session.delete(student_course_entry)

            batch_students_entry = BatchStudents.query.filter(
                (BatchStudents.student_id == student_entry.id)).first()
            if batch_students_entry:
                db.session.delete(batch_students_entry)
        db.session.commit()
        return jsonify({"message": "Entry deleted successfully"}), 200

    @app.route('/api/entry/<id>', methods=['PUT'])
    @roles_required('admin')  # Require admin role
    def update_entry(id):
        entry = parent_customer.query.filter(
            (parent_customer.id == id)).first()
        if not entry:
            return jsonify({"message": "Entry not found"}), 404

        student = Student.query.filter(
            (Student.parent_contact == entry.parent_contact) & (Student.name == entry.child_name)).first()
        if not student:
            return jsonify({"message": "Student not found"}), 404

        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400

        print(data)
        class_name = data['courseEnrolled'][0].split(' ')[0]
        if not data:
            return jsonify({"message": "No data provided"}), 400

        if not data.get('visitingDate'):
            return jsonify({"message": "Visiting Date is required."}), 400

        # Check if the course enrolled is updated
        if data.get('courseEnrolled') and ", ".join(data['courseEnrolled']) != entry.course_enrolled:
            # Update payment status to 'Unpaid' if it is currently 'Paid'
            payment = Payment.query.filter_by(
                parent_customer_id=entry.id).first()

            if payment and payment.payment_status == 'Paid':
                payment.payment_status = 'Unpaid'

        student.name = data['childName']
        student.className = class_name
        student.parent_contact = data['parentContact']

        # Update student courses
        student.enrolled_courses = []
        for course_name in data['courseEnrolled']:
            course = db.session.query(Course).filter_by(
                name=course_name).first()
            if course:
                student.enrolled_courses.append(course)

        entry.parent_name = data.get('parentName', entry.parent_name)
        entry.address = data.get('address', entry.address)
        entry.visiting_date = data.get('visitingDate', entry.visiting_date)
        entry.child_name = data.get('childName', entry.child_name)
        entry.course_enrolled = ", ".join(data['courseEnrolled'])
        entry.parent_contact = data.get('parentContact', entry.parent_contact)

        db.session.commit()
        return jsonify({"message": "Entry updated successfully"}), 200
