from flask_security import SQLAlchemyUserDatastore
from flask_security.utils import hash_password
from models import ParentCustomer, Student, Payment, Course
from extentions import db


def create_data(user_datastore: SQLAlchemyUserDatastore):
    print('------- Creating Initial Data--------')

    # create roles
    user_datastore.find_or_create_role(
        name='admin', description="Administrator")
    user_datastore.find_or_create_role(name='teach', description="Teacher")
    user_datastore.find_or_create_role(
        name='stud', description="Student")
    if not user_datastore.find_user(email="admin@admin.com"):
        print('not found admin')
        user_datastore.create_user(fname='ADMIN', lname='ADMIN',
                                   email="admin@admin.com", password=hash_password('ourdream25'), active=True, roles=['admin'])
    if not user_datastore.find_user(email="abi00779@gmail.com"):
        user_datastore.create_user(fname='Dr', lname='Abhishek',
                                   email="abi00779@gmail.com", password=hash_password('23021995'), active=True, roles=['teach'])
    if not user_datastore.find_user(email="charubharti14@gmail.com"):
        user_datastore.create_user(fname='Dr', lname='Bharti',
                                   email="charubharti14@gmail.com", password=hash_password('14121994'), active=True, roles=['teach'])

    print('=== created users ===')

    # create dummy parent customers
    parent_customers = [
        {
            'parent_name': 'John Doe',
            'address': '123 Elm St',
            'visiting_date': '2023-10-01',
            'child_name': 'Jane Doe',
            'course_enrolled': '9th Class Science',
            'parent_contact': '1234567890',
            'no_of_months': 3
        },
        {
            'parent_name': 'Alice Smith',
            'address': '456 Oak St',
            'visiting_date': '2023-10-02',
            'child_name': 'Bob Smith',
            'course_enrolled': '10th Class Math',
            'parent_contact': '0987654321',
            'no_of_months': 6
        }
    ]

    # for customer in parent_customers:
    #     existing_customer = db.session.query(ParentCustomer).filter(
    #         (ParentCustomer.parent_contact == customer['parent_contact']) & (ParentCustomer.child_name == customer['child_name'])).first()
    #     # print(existing_customer)
    #     if not existing_customer:
    #         new_customer = ParentCustomer(
    #             parent_name=customer['parent_name'],
    #             address=customer['address'],
    #             visiting_date=customer['visiting_date'],
    #             child_name=customer['child_name'],
    #             course_enrolled=customer['course_enrolled'],
    #             parent_contact=customer['parent_contact'],
    #             no_of_months=customer['no_of_months']
    #         )
    #         db.session.add(new_customer)
    #         try:
    #             db.session.commit()
    #         except Exception as e:
    #             db.session.rollback()
    #             print(f"Error adding ParentCustomer: {e}")
    #         else:
    #             print(f"Added ParentCustomer: {new_customer}")

    #         # Add a new student entry
    #         class_name = customer['course_enrolled'].split(' ')[0]
    #         student = Student(
    #             name=customer['child_name'],
    #             className=class_name,
    #             parent_contact=customer['parent_contact']
    #         )
    #         db.session.add(student)

    #         # Add a default payment entry
    #         payment = Payment(
    #             parent_customer_id=new_customer.id,
    #             payment_status='Unpaid',
    #             payment_date=None,
    #             amount_paid=0.0
    #         )
    #         db.session.add(payment)

    #         # add the new default course entry
    #         course = Course(
    #             name=customer['course_enrolled'],
    #             fee=1500.0,  # Default fee
    #             duration='1 Hr',  # Default duration
    #             description=customer['course_enrolled'] + ' course description',
    #             instructor='Dr Abhishek'  # Default instructor
    #         )
    #         db.session.add(course)
    #     else:
    #         print(f"Customer with contact {customer['parent_contact']} and child name {customer['child_name']} already exists.")

    db.session.commit()
    print('------- Initial Data Created--------')
