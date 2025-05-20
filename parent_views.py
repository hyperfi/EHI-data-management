from flask import jsonify, render_template, render_template_string, request, send_file
from extentions import db
from models import ParentCustomer as parent_customer, Student, Payment
from models import student_course as StudentCourse
from models import batch_students as BatchStudents
from flask_security import roles_required  # Import roles_required decorator


def create_parent_views(app):
    @app.route('/api/entry', methods=['POST'])
    @roles_required('admin')  # Require admin role
    def add_entry():
        data = request.get_json()
        print(data)
        if not data:
            return jsonify({"message": "No data provided"}), 400
        found_entry = db.session.query(parent_customer).filter(
            (parent_customer.parent_contact == data['parentContact']) & (parent_customer.child_name == data['childName'])).first()
        print(found_entry)
        if found_entry:
            return jsonify({"message": "Entry already exists"}), 400
        entry = parent_customer(
            parent_name=data['parentName'],
            address=data['address'],
            visiting_date=data['visitingDate'],
            child_name=data['childName'],
            course_enrolled=data['courseEnrolled'],
            parent_contact=data['parentContact'],
            no_of_months=data.get('noOfMonths', 1),  # Default to 1 month if not provided
        )
        class_name = data['courseEnrolled'].split(' ')[0]
        student = Student(name=data['childName'], className=class_name,
                          parent_contact=data['parentContact'])
        db.session.add(student)
        db.session.add(entry)
        db.session.commit()

        # Add a default payment entry
        payment = Payment(
            parent_customer_id=entry.id,
            payment_status='Unpaid',
            payment_date=None,
            amount_paid=0.0
        )
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
        student_entry = Student.query.filter(
            (Student.parent_contact == contact) & (Student.name == child_name)).first()
        if student_entry:
            db.session.delete(student_entry)
            student_course_entry = StudentCourse.query.filter(
                (StudentCourse.student_id == student_entry.id)).first()
            if student_course_entry:
                db.session.delete(student_course_entry)
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
        print(student, entry)
        if not student:
            return jsonify({"message": "Student not found"}), 404

        data = request.get_json()
        class_name = data['courseEnrolled'].split(' ')[0]
        if not data:
            return jsonify({"message": "No data provided"}), 400

        if not data.get('visitingDate'):
            return jsonify({"message": "Visiting Date is required."}), 400

        # Check if the course enrolled is updated
        if data.get('courseEnrolled') and data['courseEnrolled'] != entry.course_enrolled:
            # Update payment status to 'Unpaid' if it is currently 'Paid'
            payment = Payment.query.filter_by(parent_customer_id=entry.id).first()
            if payment and payment.payment_status == 'Paid':
                payment.payment_status = 'Unpaid'

        student.name = data['childName']
        student.className = class_name
        student.parent_contact = data['parentContact']
        entry.parent_name = data.get('parentName', entry.parent_name)
        entry.address = data.get('address', entry.address)
        entry.visiting_date = data.get('visitingDate', entry.visiting_date)
        entry.child_name = data.get('childName', entry.child_name)
        entry.course_enrolled = data.get(
            'courseEnrolled', entry.course_enrolled)
        entry.parent_contact = data.get('parentContact', entry.parent_contact)

        db.session.commit()
        return jsonify({"message": "Entry updated successfully"}), 200
