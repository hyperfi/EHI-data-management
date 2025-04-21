from flask import jsonify, render_template, render_template_string, request, send_file
from extentions import db
from models import Batch, Course, ParentCustomer, Student
from flask_security import roles_required  # Import roles_required decorator


def Create_business_view(app):
    @app.route('/api/add_batch', methods=['POST'])
    @roles_required('admin')  # Require admin role
    def add_batch():
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400
        # Process the data as needed
        found_batch = db.session.query(Batch).filter_by(
            batch_name=data['batchName']).first()
        if found_batch:
            return jsonify({"message": "Batch already exists"}), 400

        found_course = db.session.query(Course).filter_by(
            name=data['courseName']).first()
        if not found_course:
            return jsonify({"message": "Course not found"}), 404

        batch = Batch(
            course_id=found_course.id,
            batch_name=data['batchName'],
            start_time=data['startTime'],
            end_time=data['endTime'],
            course=found_course,
            enrolled_students=[],
        )

        db.session.add(batch)
        db.session.commit()
        return jsonify({"message": "Batch added successfully"}), 201

    @app.route('/api/get_batches', methods=['GET'])
    @roles_required('admin')  # Require admin role
    def get_batches():
        batches = Batch.query.all()
        batch_list = []
        for batch in batches:
            batch_list.append({
                'id': batch.id,
                'course_id': batch.course_id,
                'batch_name': batch.batch_name,
                'start_time': batch.start_time,
                'end_time': batch.end_time,
                'course_name': batch.course.name if batch.course else None,
                'enrolled_students': [student.name for student in batch.enrolled_students],
            })
        return jsonify(batch_list), 200

    @app.route('/api/delete_batch/<int:batch_id>', methods=['DELETE'])
    @roles_required('admin')  # Require admin role
    def delete_batch(batch_id):
        batch = Batch.query.get(batch_id)
        if not batch:
            return jsonify({"message": "Batch not found"}), 404
        db.session.delete(batch)
        db.session.commit()
        return jsonify({"message": "Batch deleted successfully"}), 200

    @app.route('/api/update_batch/<int:batch_id>', methods=['PUT'])
    @roles_required('admin')  # Require admin role
    def update_batch(batch_id):
        batch = Batch.query.get(batch_id)
        if not batch:
            return jsonify({"message": "Batch not found"}), 404
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400
        batch.batch_name = data.get('batchName', batch.batch_name)
        batch.start_time = data['startTime']
        batch.end_time = data['endTime']
        course_name = data.get('courseName', batch.course_name)
        course = db.session.query(Course).filter_by(
            course_name=course_name).first()
        if course:
            batch.course = course
        else:
            return jsonify({"message": "Course not found"}), 404
        enrolled_students = data.get('enrolledStudents', [])
        batch.enrolled_students = []
        for student_name in enrolled_students:
            student = Student.query.filter_by(name=student_name).first()
            if student:
                batch.enrolled_students.append(student)
            else:
                return jsonify({"message": f"Student '{student_name}' not found"}), 404

        db.session.commit()
        return jsonify({"message": "Batch updated successfully"}), 200

    @app.route('/api/add_student_to_batch/<int:batch_id>/<int:student_id>', methods=['GET'])
    @roles_required('admin')  # Require admin role
    def add_student_to_batch(batch_id, student_id):
        batch = db.session.query(Batch).filter_by(id=batch_id).first()
        if not batch:
            return jsonify({"message": "Batch not found"}), 404
        found_entry = db.session.query(ParentCustomer).filter_by(
            id=student_id).first()
        if not found_entry:
            return jsonify({"message": "Student not found"}), 404

        student = db.session.query(Student).filter(
            (Student.name == found_entry.child_name) & (Student.parent_contact == found_entry.parent_contact)).first()
        print(batch_id, student_id, batch, found_entry)
        if not student:
            return jsonify({"message": "Student not found"}), 404
        if student in batch.enrolled_students:
            return jsonify({"message": "Student already enrolled in the batch"}), 400
        batch.enrolled_students.append(student)
        course_batch = batch.course
        if student in course_batch.enrolled_students:
            return jsonify({"message": "Student already enrolled in the course"}), 400
        course_batch.enrolled_students.append(student)
        db.session.commit()
        return jsonify({"message": "Student added to batch successfully"}), 201

    @app.route('/api/remove_student_from_batch/<int:batch_id>/<int:student_id>', methods=['GET'])
    @roles_required('admin')  # Require admin role
    def remove_student_from_batch(batch_id, student_id):
        batch = db.session.query(Batch).filter_by(id=batch_id).first()
        if not batch:
            return jsonify({"message": "Batch not found"}), 404
        student = db.session.query(Student).filter_by(id=student_id).first()
        if not student:
            return jsonify({"message": "Student not found"}), 404
        if student not in batch.enrolled_students:
            return jsonify({"message": "Student not enrolled in the batch"}), 400
        batch.enrolled_students.remove(student)
        db.session.commit()
        return jsonify({"message": "Student removed from batch successfully"}), 200

    @app.route('/api/create_course', methods=['POST'])
    @roles_required('admin')  # Require admin role
    def create_course():
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400
        found_course = db.session.query(Course).filter(
            (Course.name == data['courseName']) & (Course.instructor == data['instructor'])).first()
        if found_course:
            return jsonify({"message": "Course already exists"}), 400

        course = Course(
            name=data['courseName'],
            description=data['description'],
            duration=data['duration'],
            fee=data['fee'],
            instructor=data['instructor'],
            enrolled_students=[],
        )

        enrolled_students = data.get('enrolledStudents', [])
        course.enrolled_students = []
        for student_name in enrolled_students:
            student = Student.query.filter_by(name=student_name).first()
            if student:
                course.enrolled_students.append(student)
            else:
                return jsonify({"message": f"Student '{student_name}' not found"}), 404

        db.session.add(course)
        db.session.commit()
        return jsonify({"message": "Course added successfully"}), 201

    @app.route('/api/get_courses', methods=['GET'])
    @roles_required('admin')  # Require admin role
    def get_courses():
        courses = Course.query.all()
        course_list = []
        for course in courses:
            course_list.append({
                'id': course.id,
                'course_name': course.name,
                'description': course.description,
                'duration': course.duration,
                'fee': course.fee,
                'instructor': course.instructor,
                'enrolled_students': [student.name for student in course.enrolled_students],
            })
        return jsonify(course_list), 200

    @app.route('/api/delete_course/<int:course_id>', methods=['DELETE'])
    @roles_required('admin')  # Require admin role
    def delete_course(course_id):
        course = Course.query.get(course_id)
        if not course:
            return jsonify({"message": "Course not found"}), 404
        db.session.delete(course)
        db.session.commit()
        return jsonify({"message": "Course deleted successfully"}), 200

    @app.route('/api/update_course/<int:course_id>', methods=['PUT'])
    @roles_required('admin')  # Require admin role
    def update_course(course_id):
        course = Course.query.get(course_id)
        if not course:
            return jsonify({"message": "Course not found"}), 404
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400
        course.name = data.get('courseName', course.name)
        course.description = data.get('description', course.description)
        course.duration = data.get('duration', course.duration)
        course.fee = data.get('fee', course.fee)
        course.instructor = data.get('instructor', course.instructor)
        enrolled_students = data.get('enrolledStudents', [])
        course.enrolled_students = []
        for student_name in enrolled_students:
            student = Student.query.filter_by(name=student_name).first()
            if student:
                course.enrolled_students.append(student)
            else:
                return jsonify({"message": f"Student '{student_name}' not found"}), 404
        db.session.commit()
        return jsonify({"message": "Course updated successfully"}), 200

    @app.route('/api/add_student_to_course/<int:course_id>/<int:student_id>', methods=['GET'])
    @roles_required('admin')  # Require admin role
    def add_student_to_course(course_id, student_id):
        course = db.session.query(Course).filter_by(id=course_id).first()
        if not course:
            return jsonify({"message": "Course not found"}), 404

        student = db.session.query(Student).filter_by(id=student_id).first()
        if not student:
            return jsonify({"message": "Student not found"}), 404

        if student in course.enrolled_students:
            return jsonify({"message": "Student already enrolled in the course"}), 400

        course.enrolled_students.append(student)
        db.session.commit()
        return jsonify({"message": "Student added to course successfully"}), 201

    @app.route('/api/create_student', methods=['POST'])
    @roles_required('admin')  # Require admin role
    def create_student():
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400
        found_student = db.session.query(Student).filter_by(
            name=data['studentName']).first()
        if found_student:
            return jsonify({"message": "Student already exists"}), 400

        student = Student(
            name=data['studentName'],
            className=data['className'],
        )
        db.session.add(student)
        db.session.commit()
        return jsonify({"message": "Student added successfully"}), 201

    @app.route('/api/get_student_details', methods=['POST'])
    @roles_required('admin')  # Require admin role
    def get_students():
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400
        students = data.get('students', [])
        student_list = []
        for name in students:
            student = Student.query.filter_by(name=name).first()
            if not student:
                return jsonify({"message": f"Student '{name}' not found"}), 404
            student_list.append({
                'id': student.id,
                'name': student.name,
                'className': student.className,
                'parent_contact': student.parent_contact,
            })
        return jsonify(student_list), 200
