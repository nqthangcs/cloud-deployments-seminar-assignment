import random


TEACHER_RESPONSES = {
    "Approved": {
        "score": 10,
        "responses": [
            "I was going to give you a 2, but your confidence convinced me otherwise.",
            "For once, a student has made a valid argument. Enjoy your 10.",
            "I don't know what happened here, but I'm impressed.",
            "You have successfully manipulated the education system. Congratulations.",
            "Your argument is stronger than the assignment itself.",
            "I respect the dedication. Take your 10 and leave before I change my mind."
        ]
    },

    "Almost": {
        "score": 8,
        "responses": [
            "I appreciate your effort, but unfortunately, effort doesn't compile.",
            "You were this close. Unfortunately, I don't grade on vibes.",
            "Your argument is convincing. Your assignment is not.",
            "I'll give you an 8 because I had coffee this morning.",
            "Good attempt. Unfortunately, this is not a charity.",
            "You deserve recognition, but not necessarily a perfect score."
        ]
    },

    "Suspicious": {
        "score": 6,
        "responses": [
            "Interesting. I'll pretend I believe you.",
            "I have several questions, and none of them are academic.",
            "Your explanation raises more questions than answers.",
            "I'm not saying you're lying, but even ChatGPT is disappointed.",
            "This excuse has more holes than your assignment.",
            "I need to consult the academic investigation department."
        ]
    },

    "Delusional": {
        "score": 3,
        "responses": [
            "I admire your imagination. Have you considered becoming a novelist?",
            "Your confidence is 10/10. Your assignment is not.",
            "This is not a negotiation. This is an academic evaluation.",
            "You are living in a different grading system.",
            "I wish I could give you a 10 for entertainment value.",
            "Your dreams are valid. Your grade is not."
        ]
    },

    "Rejected": {
        "score": 0,
        "responses": [
            "No.",
            "I read your argument twice. It got worse the second time.",
            "Even your keyboard deserves a better grade.",
            "I would give you a 10, but I don't want to encourage this behavior.",
            "Please submit an assignment next time, not a comedy script.",
            "Your confidence has been approved. Your grade has not."
        ]
    }
}


def generate_teacher_response(reason: str) -> dict:
    verdict = random.choice(list(TEACHER_RESPONSES.keys()))

    verdict_data = TEACHER_RESPONSES[verdict]

    teacher_response = random.choice(
        verdict_data["responses"]
    )

    return {
        "score": verdict_data["score"],
        "verdict": verdict,
        "teacher_response": teacher_response
    }
