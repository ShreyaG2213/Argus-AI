import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeThreats = () => {
    setLoading(true);
    setError("");

    fetch("http://127.0.0.1:8000/analyze")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend request failed");
        }
        return response.json();
      })
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    analyzeThreats();
  }, []);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>ARGUS AI</h1>
        <p>Unified Security Intelligence Platform</p>
      </header>

      {/* Main Content */}
      <main className="dashboard">

        <div className="title-section">
          <h2>Live Threat Analysis</h2>
          <p>Real-time security event assessment</p>
        </div>

        {/* Loading */}
        {loading && !data && (
          <div className="status-message">
            Analyzing security events...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-box">
            <strong>Connection Error</strong>
            <p>{error}</p>
            <button onClick={analyzeThreats}>
              Retry Analysis
            </button>
          </div>
        )}

        {/* Dashboard */}
        {data && (
          <>
            {/* Risk Card */}
            <section className="risk-card">
              <p className="card-label">CURRENT RISK SCORE</p>

              <div className="risk-score">
                {data.risk_score}
              </div>

              <div className="risk-level">
                {data.risk_level}
              </div>

              <p className="risk-description">
                Security events analyzed by ARGUS AI
              </p>
            </section>

            {/* Signals */}
            <section className="signals-card">
              <h3>Detected Security Signals</h3>

              {data.detected_signals.length > 0 ? (
                <div className="signals-list">
                  {data.detected_signals.map((signal, index) => (
                    <div className="signal" key={index}>
                      <span className="signal-dot"></span>
                      <span>{signal}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-threats">
                  No suspicious signals detected.
                </p>
              )}
            </section>
            {/* Threat Summary */}
<section className="summary-card">
  <h3>Threat Summary</h3>

  <div className="summary-grid">
    <div className="summary-item">
      <span>📹</span>
      <strong>
        {data.events.filter((event) => event.source === "CCTV").length}
      </strong>
      <p>CCTV Events</p>
    </div>

    <div className="summary-item">
      <span>🚪</span>
      <strong>
        {data.events.filter((event) => event.source === "ACCESS_LOG").length}
      </strong>
      <p>Access Events</p>
    </div>

    <div className="summary-item">
      <span>🌐</span>
      <strong>
        {data.events.filter((event) => event.source === "NETWORK").length}
      </strong>
      <p>Network Events</p>
    </div>

    <div className="summary-item">
      <span>📊</span>
      <strong>{data.events.length}</strong>
      <p>Total Events</p>
    </div>
  </div>
</section>
            {/* Analyzed Security Events */}
<section className="events-card">
  <h3>Analyzed Security Events</h3>

  {data.events && data.events.length > 0 ? (
    <div className="events-list">
      {data.events.map((event, index) => (
        <div className="event" key={index}>
          <div>
            <strong>{event.source}</strong>

            <p>
              {event.event_type ||
                event.access_type ||
                "Security event detected"}
            </p>
          </div>

          <span className="event-status">
            DETECTED
          </span>
        </div>
      ))}
    </div>
  ) : (
    <p className="no-events">
      No security events detected.
    </p>
  )}
</section>
{/* Cross-Source Threat Correlation */}
<section className="correlation-card">
  <h3>🔗 Cross-Source Threat Correlation</h3>

  {data.correlated_incidents &&
  data.correlated_incidents.length > 0 ? (
    <div className="correlation-list">
      {data.correlated_incidents.map((incident, index) => (
        <div className="correlation-item" key={index}>
          <div className="correlation-header">
            <strong>
              {incident.type.replaceAll("_", " ").toUpperCase()}
            </strong>

            <span className="correlation-badge">
              CORRELATED
            </span>
          </div>

          <p>{incident.description}</p>

          <div className="correlation-sources">
            Sources: {incident.sources.join(" + ")}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="no-correlation">
      🟢 No cross-source incidents detected.
    </div>
  )}
</section>

            {/* Event Sources */}
            <section className="sources-card">
              <h3>Security Event Sources</h3>

              <div className="sources">
                <div className="source">
                  <span>📹</span>
                  <p>CCTV</p>
                </div>

                <div className="source">
                  <span>🚪</span>
                  <p>Access Control</p>
                </div>

                <div className="source">
                  <span>🌐</span>
                  <p>Network</p>
                </div>
              </div>
            </section>

            {/* Analyze Button */}
            <button
              className="analyze-button"
              onClick={analyzeThreats}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Threats"}
            </button>
          </>
        )}

      </main>

      <footer>
        <p>ARGUS AI • Security Intelligence Prototype</p>
      </footer>
    </div>
  );
}

export default App;