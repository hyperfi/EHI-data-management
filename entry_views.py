from flask import jsonify, render_template, render_template_string, request, send_file
from extentions import db
from models import ParentCustomer as parent_customer, Student
from models import student_course as StudentCourse
from models import batch_students as BatchStudents
from flask_security import SQLAlchemyUserDatastore
from flask_security import auth_required, current_user, roles_required, roles_accepted
from flask_security.utils import hash_password, verify_password


def create_entery_view(app, user_datastore: SQLAlchemyUserDatastore):

    @app.route('/')
    def home():
        return render_template('index.html')

    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        user = user_datastore.find_user(email=email)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        # check whether the user is active or not
        if not user.active:
            return jsonify({'message': 'User is inactive'}), 403
        if user and verify_password(password, user.password):
            # Generate an authentication token using Flask-Security
            token = user.get_auth_token()
            return jsonify({'message': 'Login successful', 'token': token}), 200
        else:
            return jsonify({'message': 'Invalid credentials'}), 401
