from datetime import datetime, timezone

from .db_config import sql_db


class GradeAppeal(sql_db.Model):
    __tablename__ = "grade_appeals"

    id = sql_db.Column(sql_db.Integer, primary_key=True)

    assignment = sql_db.Column(
        sql_db.String(255),
        nullable=False
    )

    reason = sql_db.Column(
        sql_db.Text,
        nullable=False
    )

    score = sql_db.Column(
        sql_db.Integer,
        nullable=False
    )

    verdict = sql_db.Column(
        sql_db.String(100),
        nullable=False
    )

    teacher_response = sql_db.Column(
        sql_db.Text,
        nullable=False
    )

    created_at = sql_db.Column(
        sql_db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    def __iter__(self):
        yield "id", self.id
        yield "assignment", self.assignment
        yield "reason", self.reason
        yield "score", self.score
        yield "verdict", self.verdict
        yield "teacher_response", self.teacher_response
        yield "created_at", (
            self.created_at.isoformat()
            if self.created_at else None
        )


# Get all appeals
def get_all_appeals():
    return GradeAppeal.query.order_by(
        GradeAppeal.created_at.desc()
    ).all()


# Create an appeal
def create_appeal(
    assignment: str,
    reason: str,
    score: int,
    verdict: str,
    teacher_response: str
):
    new_appeal = GradeAppeal(
        assignment=assignment,
        reason=reason,
        score=score,
        verdict=verdict,
        teacher_response=teacher_response
    )

    try:
        sql_db.session.add(new_appeal)
        sql_db.session.commit()

        return new_appeal

    except Exception:
        sql_db.session.rollback()
        raise
