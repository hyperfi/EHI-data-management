from flask_security import SQLAlchemyUserDatastore
from flask_security.utils import hash_password
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

    db.session.commit()
    print('------- Initial Data Created--------')
