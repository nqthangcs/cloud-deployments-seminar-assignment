from flask import Blueprint, jsonify
from http import HTTPStatus


healthcheck_route = Blueprint('healthcheck_route', __name__)


@healthcheck_route.route('/livez', methods=['GET'])
def livez():
    return jsonify({
        "status": "alive"
    }), HTTPStatus.OK

@healthcheck_route.route('/readyz', methods=['GET'])
def readyz():
    return jsonify({
        "status": "ready"
    }), HTTPStatus.OK
