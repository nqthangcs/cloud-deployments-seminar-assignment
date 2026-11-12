import { useEffect, useState } from "react";


export default function Appeals({ apiUrl }) {
  const [appeals, setAppeals] = useState([]);
  const [assignment, setAssignment] = useState("");
  const [reason, setReason] = useState("");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadAppeals() {
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/api/appeals`);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const result = await res.json();
      setAppeals(result.data || []);
      setError(null);
    } catch (err) {
      setError(`Could not load appeals: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppeals();
  }, [apiUrl]);

  async function submitAppeal(event) {
    event.preventDefault();

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${apiUrl}/api/appeals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignment: assignment.trim(),
          reason: reason.trim(),
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || `HTTP ${res.status}`);
      }

      setAssignment("");
      setReason("");
      setSuccess("Your appeal has been submitted successfully!");

      await loadAppeals();
    } catch (err) {
      setError(`Could not submit appeal: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  function getVerdictClass(verdict) {
    const value = String(verdict || "").toLowerCase();

    if (value.includes("accept") || value.includes("approved")) {
      return "accepted";
    }

    if (value.includes("reject") || value.includes("denied")) {
      return "rejected";
    }

    if (value.includes("suspicious")) {
      return "suspicious";
    }

    return "pending";
  }

  return (
    <main className="appeals-page">
      <section className="appeals-container">

        {/* Header */}
        <header className="page-header">
          <div>
            <span className="eyebrow">STUDENT PORTAL</span>
            <h1>Grade Appeals</h1>
            <p>
              Think your grade deserves another look?
              Submit an appeal and let your teacher review it.
            </p>
          </div>

          <div className="header-icon">📝</div>
        </header>

        {/* Appeal Form */}
        <div className="form-card">
          <div className="section-heading">
            <div>
              <h2>Submit an Appeal</h2>
              <p>Provide the assignment and explain your reasoning.</p>
            </div>
          </div>

          <form onSubmit={submitAppeal}>
            <div className="form-grid">

              <div className="form-group">
                <label htmlFor="assignment">Assignment name</label>
                <input
                  id="assignment"
                  type="text"
                  value={assignment}
                  onChange={(e) => setAssignment(e.target.value)}
                  placeholder="e.g. Final Project"
                  maxLength={255}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="reason">Reason for appeal</label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why you believe your grade should be reconsidered..."
                  rows={5}
                  required
                  disabled={submitting}
                />
                <span className="character-count">
                  {reason.length} characters
                </span>
              </div>

            </div>

            <div className="form-footer">
              <span className="form-hint">
                Please provide a clear and respectful explanation.
              </span>

              <button
                type="submit"
                className="submit-button"
                disabled={submitting || !assignment.trim() || !reason.trim()}
              >
                {submitting ? (
                  <>
                    <span className="spinner"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Appeal <span>→</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="notification error-notification" role="alert">
              <span>⚠️</span>
              {error}
            </div>
          )}

          {success && (
            <div className="notification success-notification" role="status">
              <span>✓</span>
              {success}
            </div>
          )}
        </div>

        {/* Appeal History */}
        <div className="history-section">

          <div className="history-header">
            <div>
              <h2>Appeal History</h2>
              <p>Review your previously submitted appeals.</p>
            </div>

            <span className="appeal-count">
              {appeals.length} {appeals.length === 1 ? "Appeal" : "Appeals"}
            </span>
          </div>

          {loading ? (
            <div className="empty-state">
              <div className="spinner large-spinner"></div>
              <p>Loading your appeal history...</p>
            </div>
          ) : appeals.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No appeals yet</h3>
              <p>
                Your submitted appeals will appear here.
                Start by submitting your first appeal above.
              </p>
            </div>
          ) : (
            <div className="appeal-list">
              {appeals.map((appeal) => (
                <article className="appeal-card" key={appeal.id}>

                  <div className="appeal-card-header">
                    <div>
                      <span className="card-label">ASSIGNMENT</span>
                      <h3>{appeal.assignment}</h3>
                    </div>

                    <span
                      className={`verdict-badge ${getVerdictClass(
                        appeal.verdict
                      )}`}
                    >
                      {appeal.verdict || "Pending"}
                    </span>
                  </div>

                  <div className="appeal-reason">
                    <h4>Your reason</h4>
                    <p>{appeal.reason}</p>
                  </div>

                  <div className="appeal-details">
                    <div className="detail-item">
                      <span>Score</span>
                      <strong>{appeal.score ?? "—"}</strong>
                    </div>

                    <div className="detail-item">
                      <span>Verdict</span>
                      <strong>{appeal.verdict || "Pending"}</strong>
                    </div>
                  </div>

                  <div className="teacher-response">
                    <div className="response-heading">
                      <span>💬</span>
                      <h4>Teacher's Response</h4>
                    </div>

                    <p>
                      {appeal.teacher_response ||
                        "Your teacher has not responded yet."}
                    </p>
                  </div>

                  <div className="appeal-card-footer">
                    <span>
                      Submitted{" "}
                      {appeal.created_at
                        ? new Date(appeal.created_at).toLocaleString()
                        : "Date unavailable"}
                    </span>
                  </div>

                </article>
              ))}
            </div>
          )}
        </div>

        <footer className="page-footer">
          Grade Appeals Portal · Your voice matters.
        </footer>

      </section>
    </main>
  );
}