from flask import jsonify, render_template, render_template_string, request, send_file
from extentions import db
from models import ParentCustomer, Course, Payment
from flask_security import roles_required  # Import roles_required decorator


def create_payment_view(app):
    @app.route('/api/payment_status', methods=['GET'])
    @roles_required('admin')  # Require admin role
    def get_payment_status():
        payments = Payment.query.all()
        data = []
        for payment in payments:
            parent = ParentCustomer.query.get(payment.parent_customer_id)
            all_courses = parent.course_enrolled.split(',')
            all_fees = []
            for crs in all_courses:
                course = db.session.query(Course).filter_by(
                    id=crs.split('-')[1]).first()
                all_fees.append(course.fee if course else None)

            print(all_fees)
            data.append({
                'id': payment.id,
                'parentName': parent.parent_name,
                'address': parent.address,
                'visitingDate': parent.visiting_date,
                'childName': parent.child_name,
                'courseEnrolled': [course.split('-')[0] for course in parent.course_enrolled.split(',')],
                'parentContact': parent.parent_contact,
                'allFees': all_fees,
                'totalFees': sum(all_fees) if all_fees else 0,
                'paymentStatus': payment.payment_status,
                'paymentDate': payment.payment_date,
                'amountPaid': payment.amount_paid,
                'noOfMonths': parent.no_of_months
            })
        return jsonify(data), 200

    @app.route('/api/payment_status_update', methods=['PUT'])
    @roles_required('admin')  # Require admin role
    def update_payment_status():
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400

        # Find the payment entry by ID
        payment = Payment.query.filter_by(id=data['id']).first()
        if not payment:
            return jsonify({"message": "Payment entry not found"}), 404

        # Update the payment details
        payment.payment_status = data['paymentStatus']
        payment.payment_date = data['paymentDate']
        # Default to current amount if not provided
        payment.amount_paid = data.get('amountPaid', payment.amount_paid)
        # Update the parent customer details if necessary
        parent = ParentCustomer.query.get(payment.parent_customer_id)
        if parent:
            parent.no_of_months = data.get('noOfMonths', parent.no_of_months)
        db.session.commit()

        return jsonify({"message": "Payment status updated successfully"}), 200
