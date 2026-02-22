import os
from flask import Flask
from extentions import db, security, cache
import entry_views
import business_views
import payment_views
import parent_views
import tests_views
from flask_migrate import Migrate
from create_initial_data import create_data
from db_connection import connection_string

from dotenv import load_dotenv
# Load environment variables from .env file
load_dotenv()

ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

basedir = os.path.abspath(os.path.dirname(__file__))


def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = "should-not-be-exposed"

    if ENVIRONMENT == "production":
        app.config['SQLALCHEMY_DATABASE_URI'] = connection_string
    elif ENVIRONMENT == "development":
        app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///data.db"

    app.config['SECURITY_PASSWORD_SALT'] = 'salty-password'
    app.config['UPLOAD_FOLDER'] = os.path.join(basedir, "static/images")

    # configure token
    app.config['SECURITY_TOKEN_AUTHENTICATION_HEADER'] = 'Authentication-Token'
    app.config['SECURITY_TOKEN_MAX_AGE'] = 3600  # 1hr
    app.config['SECURITY_LOGIN_WITHOUT_CONFIRMATION'] = True

    app.config["DEBUG"] = True         # some Flask specific configs

    db.init_app(app)
    migrate = Migrate(app, db)
    with app.app_context():
        from models import User, Role
        from flask_security import SQLAlchemyUserDatastore

        user_datastore = SQLAlchemyUserDatastore(db, User, Role)
        security.init_app(app, user_datastore)
        # db.create_all()
        # create_data(user_datastore)
    # user_datastore = None
    # disable CSRF security
    app.config['WTF_CSRF_CHECK_DEFAULT'] = False
    app.config['SECURITY_CSRF_PROTECT_MECHANISHMS'] = []
    app.config['SECURITY_CSRF_IGNORE_UNAUTH_ENDPOINTS'] = True

    entry_views.create_entery_view(app, user_datastore)
    business_views.Create_business_view(app)
    payment_views.create_payment_view(app)
    parent_views.create_parent_views(app)
    tests_views.create_test_views(app)

    
    # Add this where you define your Flask routes
    @app.route('/health')
    def health_check():
        return {"status": "healthy"}, 200


app = create_app()


if __name__ == "__main__":
    # app.run(debug=True)
    app.run(host='0.0.0.0', port='7000', debug=True)





