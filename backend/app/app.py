from flask import Flask, jsonify
from flask_cors import CORS
import os

from models import init_sql_db
from routes import healthcheck_route, grade_appeal_route

app = Flask(__name__)

app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'your_secret_key_here')

# Enable CORS for React frontend
cors_origins = [
    origin.strip().rstrip("/")
    for origin in os.getenv(
        "CORS_ORIGIN",
        "http://localhost:3000"
    ).split(",")
    if origin.strip()
]

CORS(
    app,
    resources={
        r"/*": {
            "origins": cors_origins,
        }
    }
)

init_sql_db(app, os.getenv('DB_URL'))

app.register_blueprint(healthcheck_route, url_prefix='/api')
app.register_blueprint(grade_appeal_route, url_prefix='/api')


@app.route('/api/message')
def hello_world_mesage():
    return jsonify({
            "message": 'Hello, World! I want to sleep!!!',
        })

@app.route('/api')
def hello_world():
    return jsonify({
            "message": 'Hello, World!',
        })

@app.route('/')
def hello_world_root():
    return 'Hello, World!'


if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    app.run(debug=False,
            host='0.0.0.0',
            port=port)
