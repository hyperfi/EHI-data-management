from sqlalchemy import URL, create_engine, text
import os
from dotenv import load_dotenv
# Load environment variables from .env file
load_dotenv()


connection_string = URL.create(
    os.getenv("DATABASE_DIALECT"),
    username=os.getenv("DATABASE_USER"),
    password=os.getenv("DATABASE_PASSWORD"),
    host=os.getenv("DATABASE_HOST"),
    database=os.getenv("DATABASE_NAME"),
)


DATABASE_URL = f"{os.getenv("DATABASE_DIALECT")}+psycopg2://{os.getenv("DATABASE_USER")}:{os.getenv("DATABASE_PASSWORD")}@{os.getenv("DATABASE_HOST")}:20087/{os.getenv("DATABASE_NAME")}?sslmode=require"

# print("password is", os.getenv("DATABASE_PASSWORD"))


if os.getenv("DB_SOURCE") == "avian":
    connection_string = DATABASE_URL

# print("Connection string:", connection_string)

if __name__ == "__main__":
    engine = create_engine(connection_string)
    connection = engine.connect()

    # Use the `text()` function for raw SQL queries
    connection.execute(text(
        "CREATE TABLE IF NOT EXISTS test (id SERIAL PRIMARY KEY, name VARCHAR(100))"))
    connection.execute(text("INSERT INTO test (name) VALUES ('Test Name')"))

    result = connection.execute(text("SELECT * FROM test"))
    for row in result:
        print(row)

    connection.close()  # Close the connection when done
