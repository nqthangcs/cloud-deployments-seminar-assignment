from flask import Blueprint, jsonify, request
from http import HTTPStatus

from logger import logger
from services import generate_teacher_response
from models import create_appeal, get_all_appeals


grade_appeal_route = Blueprint('grade_appeal_route', __name__)


@grade_appeal_route.route('/appeals', methods=['GET'])
def get_appeals_route():

    try:
        appeals = get_all_appeals()

        return jsonify({
            "count": len(appeals),
            "data": [
                dict(appeal)
                for appeal in appeals
            ]
        }), HTTPStatus.OK

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({
            "error": "Failed to retrieve grade appeals"
        }), HTTPStatus.INTERNAL_SERVER_ERROR


@grade_appeal_route.route('/appeals', methods=['POST'])
def create_appeal_route():

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "error": "Request body must be valid JSON"
        }), HTTPStatus.BAD_REQUEST

    assignment = data.get("assignment")
    reason = data.get("reason")

    if not isinstance(assignment, str) or not assignment.strip():
        return jsonify({
            "error": "Assignment is required"
        }), HTTPStatus.BAD_REQUEST

    if not isinstance(reason, str) or not reason.strip():
        return jsonify({
            "error": "Your reason is required. Defend yourself!"
        }), HTTPStatus.BAD_REQUEST
    try: 
        joke_result = generate_teacher_response(reason)

        new_appeal = create_appeal(
                assignment=assignment.strip(),
                reason=reason.strip(),
                score=joke_result["score"],
                verdict=joke_result["verdict"],
                teacher_response=joke_result["teacher_response"]
            )

        return jsonify({
            "message": "Your appeal has been reviewed. Face your fate!",
            "data": dict(new_appeal)
        }), HTTPStatus.CREATED

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({
            "error": "Failed to submit your appeal"
        }), HTTPStatus.INTERNAL_SERVER_ERROR
