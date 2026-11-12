from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from enum import Enum

sql_db = SQLAlchemy()

def init_sql_db(app: Flask, sql_db_uri: str) -> None:
    """Initialize the SQL database connection."""
    app.config['SQLALCHEMY_DATABASE_URI'] = sql_db_uri
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Disable modification tracking for performance
    sql_db.init_app(app)
    
    # Create the tables if they don't already exist
    with app.app_context():
        sql_db.create_all()


class DBStatusCode(Enum):
    CREATED_SUCCESSFULLY = 201  # Successfully created a new record
    RETRIEVED_SUCCESSFULLY = 200  # Successfully retrieved a record
    UPDATED_SUCCESSFULLY = 200  # Successfully updated a record
    DELETED_SUCCESSFULLY = 204  # Successfully deleted a record
    BAD_REQUEST = 400  # General client-side error, e.g., invalid input or malformed request
    FORBIDDEN = 403  # Forbidden operation (e.g., insufficient permissions)
    NOT_FOUND = 404  # Resource (e.g., user) not found in the database
    TIMEOUT = 408  # Timeout error during database query
    CONFLICT = 409  # Conflict with existing resource (e.g., duplicate entry)
    INTERNAL_SERVER_ERROR = 500  # Unexpected server error (e.g., DB connection issues)
    DATABASE_CONNECTION_ERROR = 503  # Unable to connect to the database
    CONCURRENT_OPERATION_LOCKED = 423  # Record locked due to concurrent operations
