
import { useEffect, useState } from "react";
import Appeals from "./Appeals.jsx";

// API URL
const API_URL =
  window.APP_CONFIG?.apiUrl ?? "http://localhost:8081";

export default function App() {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAPI() {
      try {
        setChecking(true);

        const res = await fetch(`${API_URL}/api/message`);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        setMessage(data.message);
        setError(null);
      } catch (err) {
        setError(err.message);
        setMessage(null);
      } finally {
        setChecking(false);
      }
    }

    checkAPI();
  }, []);

  const connected = Boolean(message) && !error;

  const status = checking
    ? "Connecting..."
    : connected
      ? "Connected"
      : "Connection Failed";

  return (
    <main className="app-page">

      {/* Main Header */}
      <section className="app-hero">
        <div className="hero-content">
          <span className="eyebrow">
            STUDENT ACADEMIC PORTAL
          </span>

          <h1>
            Your Grades.
            <br />
            <span>Your Voice Matters.</span>
          </h1>

          <p>
            Welcome to the Grade Appeal System.
            Submit an appeal, track its progress, and
            communicate with your teacher in one place.
          </p>

          <div className="hero-tag">
            <span>✦</span>
            Fairness starts with being heard.
          </div>
        </div>

        <div className="hero-decoration">
          <div className="hero-icon">🎓</div>
          <div className="floating-icon icon-one">📝</div>
          <div className="floating-icon icon-two">✨</div>
          <div className="floating-icon icon-three">📚</div>
        </div>
      </section>

      {/* API Connection Information */}
      <section className="api-section">

        <div className="api-card">

          <div className="api-card-left">
            <div className="api-icon">⚡</div>

            <div>
              <span className="card-label">
                SYSTEM STATUS
              </span>

              <h2>API Connection</h2>

              <p>
                {checking
                  ? "Establishing connection to the server..."
                  : connected
                    ? "Your application is connected and ready."
                    : "Unable to communicate with the server."}
              </p>
            </div>
          </div>

          <div className={`status-badge ${
            checking
              ? "status-loading"
              : connected
                ? "status-connected"
                : "status-error"
          }`}>
            <span className="status-dot" />
            {status}
          </div>

        </div>

        {/* API Message */}
        <div className="api-message-card">

          <div className="message-heading">
            <div className="message-icon">💬</div>

            <div>
              <h3>Server Response</h3>
              <p>Live communication with your backend</p>
            </div>
          </div>

          {checking && (
            <div className="api-feedback">
              <span className="spinner" />
              <span>Waiting for server response...</span>
            </div>
          )}

          {message && !error && (
            <div className="api-feedback success-feedback">
              <span>✓</span>
              {message}
            </div>
          )}

          {error && (
            <div className="api-feedback error-feedback">
              <span>⚠</span>
              <div>
                <strong>Connection Error</strong>
                <p>
                  {error}. Please check whether the API
                  is running and CORS is configured.
                </p>
              </div>
            </div>
          )}

          <div className="api-url">
            <span>SERVER ENDPOINT</span>
            <code>{API_URL}/api/message</code>
          </div>

        </div>
      </section>

      {/* Grade Appeals */}
      <Appeals apiUrl={API_URL} />

    </main>
  );
}
