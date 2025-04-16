from flask import jsonify, render_template, render_template_string, request, send_file
from extentions import db
from models import ParentCustomer, Course
from flask_security import roles_required  # Import roles_required decorator


def create_payment_view(app):
    @app.route('/api/payment_status', methods=['GET'])
    @roles_required('admin')  # Require admin role
    def get_payment_status():
        entries = ParentCustomer.query.all()
        data = []
        for entry in entries:
            course = db.session.query(Course).filter_by(
                name=entry.course_enrolled).first()
            fee = course.fee
            data.append({
                'id': entry.id,
                'parentName': entry.parent_name,
                'address': entry.address,
                'visitingDate': entry.visiting_date,
                'childName': entry.child_name,
                'courseEnrolled': entry.course_enrolled,
                'parentContact': entry.parent_contact,
                'fee': fee,
                'paymentStatus': entry.payment_status,
                'paymentDate': entry.payment_date,
                'noOfMonths': entry.no_of_months if entry.no_of_months else 1,
            })
        return jsonify(data), 200

    @app.route('/api/payment_status_update', methods=['PUT'])
    @roles_required('admin')  # Require admin role
    def update_payment_status():
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400

        # Find the entry by ID
        entry = ParentCustomer.query.filter_by(id=data['id']).first()
        if not entry:
            return jsonify({"message": "Entry not found"}), 404

        # Update the payment status and date
        entry.payment_status = data['paymentStatus']
        entry.payment_date = data['paymentDate']
        entry.no_of_months = data['noOfMonths']

        db.session.commit()

        return jsonify({"message": "Payment status updated successfully"}), 200
