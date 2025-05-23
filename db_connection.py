from sqlalchemy import URL, create_engine, text
import os
from dotenv import load_dotenv
# Load environment variables from .env file
load_dotenv()


connection_string = URL.create(
    'postgresql',
    username=os.getenv("DATABASE_USER"),
    password=os.getenv("DATABASE_PASSWORD"),
    host=os.getenv("DATABASE_HOST"),
    database=os.getenv("DATABASE_NAME"),
)

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
