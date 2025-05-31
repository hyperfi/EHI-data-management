from flask import jsonify, request
from extentions import db
from models import Test, TestResult, Course, Student
from flask_security import roles_required


def create_test_views(app):
    # API to create a new test
    @app.route('/api/tests', methods=['POST'])
    @roles_required('admin')  # Require admin role
    def create_test():
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400

        course = Course.query.filter_by(id=data.get('course_id')).first()
        if not course:
            return jsonify({"message": "Course not found"}), 404

        new_test = Test(
            course_id=data['course_id'],
            test_name=data['test_name'],
            test_date=data['test_date'],
            max_marks=data['max_marks']
        )
        db.session.add(new_test)
        db.session.commit()
        return jsonify({"message": "Test created successfully"}), 201

    # API to get all tests
    @app.route('/api/tests', methods=['GET'])
    @roles_required('admin')  # Require admin role
    def get_tests():
        tests = Test.query.all()
        data = []
        for test in tests:
            data.append({
                'id': test.id,
                'course_id': test.course_id,
                'course_name': test.course.name,
                'test_name': test.test_name,
                'test_date': test.test_date,
                'max_marks': test.max_marks
            })
        return jsonify(data), 200

    # API to create a test result
    @app.route('/api/test_results', methods=['POST'])
    @roles_required('admin')  # Require admin role
    def create_test_result():
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400

        test = Test.query.filter_by(id=data.get('test_id')).first()
        if not test:
            return jsonify({"message": "Test not found"}), 404

        student = Student.query.filter_by(id=data.get('student_id')).first()
        if not student:
            return jsonify({"message": "Student not found"}), 404

        new_result = TestResult(
            test_id=data['test_id'],
            student_id=data['student_id'],
            marks_obtained=data['marks_obtained'],
            remarks=data.get('remarks', '')
        )
        db.session.add(new_result)
        db.session.commit()
        return jsonify({"message": "Test result created successfully"}), 201

    # API to get all test results
    @app.route('/api/test_results', methods=['GET'])
    @roles_required('admin')  # Require admin role
    def get_test_results():
        results = TestResult.query.all()
        data = []
        for result in results:
            data.append({
                'id': result.id,
                'test_id': result.test_id,
                'test_name': result.test.test_name,
                'student_id': result.student_id,
                'student_name': result.student.name,
                'marks_obtained': result.marks_obtained,
                'max_marks': result.test.max_marks,
                'remarks': result.remarks
            })
        return jsonify(data), 200

    # API to delete a test
    @app.route('/api/tests/<int:test_id>', methods=['DELETE'])
    @roles_required('admin')  # Require admin role
    def delete_test(test_id):
        test = Test.query.filter_by(id=test_id).first()
        if not test:
            return jsonify({"message": "Test not found"}), 404

        # Delete associated test results
        TestResult.query.filter_by(test_id=test.id).delete()

        db.session.delete(test)
        db.session.commit()
        return jsonify({"message": "Test deleted successfully"}), 200

    # API to delete a test result
    @app.route('/api/test_results/<int:result_id>', methods=['DELETE'])
    @roles_required('admin')  # Require admin role
    def delete_test_result(result_id):
        result = TestResult.query.filter_by(id=result_id).first()
        if not result:
            return jsonify({"message": "Test result not found"}), 404

        db.session.delete(result)
        db.session.commit()
        return jsonify({"message": "Test result deleted successfully"}), 200

    # API to update a test result
    @app.route('/api/test_results/<int:result_id>', methods=['PUT'])
    @roles_required('admin')  # Require admin role
    def update_test_result(result_id):
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400

        result = TestResult.query.filter_by(id=result_id).first()
        if not result:
            return jsonify({"message": "Test result not found"}), 404

        result.marks_obtained = data.get(
            'marks_obtained', result.marks_obtained)
        result.remarks = data.get('remarks', result.remarks)

        db.session.commit()
        return jsonify({"message": "Test result updated successfully"}), 200

    # api to update a test
    @app.route('/api/tests/<int:test_id>', methods=['PUT'])
    @roles_required('admin')  # Require admin role
    def update_test(test_id):
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400

        test = Test.query.filter_by(id=test_id).first()
        if not test:
            return jsonify({"message": "Test not found"}), 404

        test.test_name = data.get('test_name', test.test_name)
        test.test_date = data.get('test_date', test.test_date)
        test.max_marks = data.get('max_marks', test.max_marks)

        db.session.commit()
        return jsonify({"message": "Test updated successfully"}), 200
