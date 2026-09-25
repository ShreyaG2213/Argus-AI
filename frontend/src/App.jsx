import { useEffect, useMemo, useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentEventIndex, setCurrentEventIndex] = useState(0);

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
        setCurrentEventIndex(0);
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

  const events = data?.events || [];

  const currentEvent = events[currentEventIndex];

  /*
   * Find correlations related to the currently selected event.
   * Backend data is unchanged.
   */
  const currentCorrelations = useMemo(() => {
    if (!currentEvent || !data?.correlated_incidents) {
      return [];
    }

    return data.correlated_incidents.filter((incident) =>
      incident.sources?.includes(currentEvent.source)
    );
  }, [currentEvent, data]);

  const nextEvent = () => {
    if (currentEventIndex < events.length - 1) {
      setCurrentEventIndex(currentEventIndex + 1);
    }
  };

  const previousEvent = () => {
    if (currentEventIndex > 0) {
      setCurrentEventIndex(currentEventIndex - 1);
    }
  };

  const getSourceIcon = (source) => {
    if (source === "CCTV") return "◉";
    if (source === "ACCESS_LOG") return "▣";
    if (source === "NETWORK") return "◈";
    return "●";
  };

  const getEventIdentifier = (event) => {
    if (!event) return "—";

    if (event.camera_id) return event.camera_id;
    if (event.user_id) return event.user_id;
    if (event.device_id) return event.device_id;

    return "—";
  };

  const getEventType = (event) => {
    if (!event) return "Security Event";

    return (
      event.event_type ||
      event.access_type ||
      "Security event detected"
    );
  };

  return (
    <div className="app">

      {/* ================= HEADER ================= */}

      <header className="header">
        <div className="brand-mark">A</div>

        <h1>ARGUS AI</h1>

        <p>Unified Security Intelligence Platform</p>

        <div className="system-status">
          <span className="status-indicator"></span>
          SYSTEM ONLINE
        </div>
      </header>


      {/* ================= MAIN ================= */}

      <main className="dashboard">

        <section className="page-heading">
          <div className="section-eyebrow">
            SECURITY OPERATIONS CENTER
          </div>

          <h2>Live Threat Analysis</h2>

          <p>
            Real-time security event assessment and cross-source threat
            correlation
          </p>
        </section>


        {/* ================= LOADING ================= */}

        {loading && !data && (
          <div className="status-panel">
            <div className="loading-spinner"></div>

            <h3>Analyzing Security Events</h3>

            <p>
              ARGUS AI is processing connected security sources...
            </p>
          </div>
        )}


        {/* ================= ERROR ================= */}

        {error && (
          <div className="error-panel">
            <div className="error-title">
              CONNECTION ERROR
            </div>

            <p>{error}</p>

            <button
              className="primary-button"
              onClick={analyzeThreats}
            >
              Retry Analysis
            </button>
          </div>
        )}


        {/* ================= DASHBOARD ================= */}

        {data && events.length > 0 && currentEvent && (
          <>

            {/* ================= EVENT NAVIGATION ================= */}

            <section className="event-navigation">

              <div>
                <span className="navigation-label">
                  CURRENT SECURITY EVENT
                </span>

                <h3>
                  EVENT {String(currentEventIndex + 1).padStart(2, "0")}
                  <span className="of-text">
                    {" "}OF{" "}
                  </span>
                  {String(events.length).padStart(2, "0")}
                </h3>
              </div>

              <div className="navigation-controls">

                <button
                  className="navigation-button"
                  onClick={previousEvent}
                  disabled={currentEventIndex === 0}
                >
                  ← Previous
                </button>

                <div className="event-counter">
                  {currentEventIndex + 1} / {events.length}
                </div>

                <button
                  className="navigation-button"
                  onClick={nextEvent}
                  disabled={currentEventIndex === events.length - 1}
                >
                  Next →
                </button>

              </div>

            </section>


            {/* ================= CURRENT EVENT ================= */}

            <section className="current-event-card">

              <div className="event-source-header">

                <div className="source-icon">
                  {getSourceIcon(currentEvent.source)}
                </div>

                <div>

                  <span className="source-label">
                    SECURITY SOURCE
                  </span>

                  <h2>{currentEvent.source}</h2>

                </div>

                <span className="detected-badge">
                  DETECTED
                </span>

              </div>


              <div className="event-main-content">

                <div className="event-main-info">

                  <span className="event-label">
                    EVENT TYPE
                  </span>

                  <h3>
                    {getEventType(currentEvent)
                      .replaceAll("_", " ")
                      .toUpperCase()}
                  </h3>

                </div>


                <div className="event-main-info">

                  <span className="event-label">
                    IDENTIFIER
                  </span>

                  <h3>
                    {getEventIdentifier(currentEvent)}
                  </h3>

                </div>

              </div>

            </section>


            {/* ================= RISK ================= */}

            <section className="risk-card">

              <div className="risk-header">

                <div>
                  <span className="section-eyebrow">
                    THREAT ASSESSMENT
                  </span>

                  <h3>Current Threat Risk</h3>
                </div>

                <div className="risk-status">
                  {data.risk_level}
                </div>

              </div>


              <div className="risk-content">

                <div className="risk-score">
                  {data.risk_score}
                </div>

                <div className="risk-scale">
                  <div className="risk-bar">
                    <div
                      className="risk-fill"
                      style={{
                        width: `${Math.min(
                          data.risk_score,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>

                  <div className="risk-scale-labels">
                    <span>LOW</span>
                    <span>MEDIUM</span>
                    <span>HIGH</span>
                  </div>
                </div>

              </div>

              <p className="risk-description">
                Current aggregated security risk score generated by
                ARGUS AI.
              </p>

            </section>


            {/* ================= OVERVIEW ================= */}

            <section className="overview-grid">

              <div className="overview-card">

                <span className="overview-icon">◉</span>

                <span className="overview-label">
                  EVENTS ANALYZED
                </span>

                <strong>{events.length}</strong>

                <p>Security events processed</p>

              </div>


              <div className="overview-card">

                <span className="overview-icon">⌘</span>

                <span className="overview-label">
                  CORRELATIONS
                </span>

                <strong>
                  {data.correlated_incidents?.length || 0}
                </strong>

                <p>Cross-source patterns</p>

              </div>


              <div className="overview-card">

                <span className="overview-icon">◈</span>

                <span className="overview-label">
                  DATA SOURCES
                </span>

                <strong>
                  {new Set(events.map((e) => e.source)).size}
                </strong>

                <p>Active security sources</p>

              </div>

            </section>


            {/* ================= DATA SOURCES ================= */}

            <section className="panel">

              <div className="panel-heading">

                <div>
                  <span className="section-eyebrow">
                    DATA SOURCES
                  </span>

                  <h3>Security Event Sources</h3>
                </div>

                <span className="panel-count">
                  {new Set(events.map((e) => e.source)).size} ACTIVE
                </span>

              </div>


              <div className="source-grid">

                <div className="source-card">

                  <span className="large-source-icon">
                    ◉
                  </span>

                  <div>
                    <strong>CCTV</strong>

                    <p>
                      {
                        events.filter(
                          (event) => event.source === "CCTV"
                        ).length
                      }{" "}
                      video events
                    </p>
                  </div>

                </div>


                <div className="source-card">

                  <span className="large-source-icon">
                    ▣
                  </span>

                  <div>
                    <strong>ACCESS CONTROL</strong>

                    <p>
                      {
                        events.filter(
                          (event) =>
                            event.source === "ACCESS_LOG"
                        ).length
                      }{" "}
                      access events
                    </p>
                  </div>

                </div>


                <div className="source-card">

                  <span className="large-source-icon">
                    ◈
                  </span>

                  <div>
                    <strong>NETWORK</strong>

                    <p>
                      {
                        events.filter(
                          (event) =>
                            event.source === "NETWORK"
                        ).length
                      }{" "}
                      network events
                    </p>
                  </div>

                </div>

              </div>

            </section>


            {/* ================= SIGNALS ================= */}

            <section className="panel">

              <div className="panel-heading">

                <div>
                  <span className="section-eyebrow">
                    THREAT DETECTION
                  </span>

                  <h3>Detected Security Signals</h3>
                </div>

                <span className="panel-count">
                  {data.detected_signals.length} SIGNALS
                </span>

              </div>


              {data.detected_signals.length > 0 ? (

                <div className="signals-list">

                  {data.detected_signals.map(
                    (signal, index) => (

                      <div
                        className="signal-item"
                        key={index}
                      >

                        <span className="signal-indicator"></span>

                        <span>{signal}</span>

                        <span className="signal-status">
                          DETECTED
                        </span>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <div className="empty-state">
                  No suspicious signals detected.
                </div>

              )}

            </section>


            {/* ================= CURRENT EVENT DETAILS ================= */}

            <section className="panel">

              <div className="panel-heading">

                <div>
                  <span className="section-eyebrow">
                    EVENT STREAM
                  </span>

                  <h3>Current Security Event</h3>
                </div>

                <span className="panel-count">
                  EVENT {currentEventIndex + 1}
                </span>

              </div>


              <div className="event-detail-grid">

                <div className="detail-item">
                  <span>SOURCE</span>
                  <strong>{currentEvent.source}</strong>
                </div>

                <div className="detail-item">
                  <span>EVENT TYPE</span>
                  <strong>
                    {getEventType(currentEvent)}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>IDENTIFIER</span>
                  <strong>
                    {getEventIdentifier(currentEvent)}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>STATUS</span>
                  <strong className="detail-detected">
                    DETECTED
                  </strong>
                </div>

              </div>

            </section>


            {/* ================= CORRELATION ================= */}

            <section className="panel intelligence-panel">

              <div className="panel-heading">

                <div>
                  <span className="section-eyebrow">
                    INTELLIGENCE ENGINE
                  </span>

                  <h3>
                    Cross-Source Threat Correlation
                  </h3>
                </div>

                <span className="panel-count">
                  {currentCorrelations.length} PATTERNS
                </span>

              </div>


              {currentCorrelations.length > 0 ? (

                <div className="correlation-list">

                  {currentCorrelations.map(
                    (incident, index) => (

                      <div
                        className="correlation-item"
                        key={index}
                      >

                        <div className="correlation-top">

                          <span className="correlation-number">
                            {String(index + 1).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <strong>
                            {incident.type
                              ?.replaceAll("_", " ")
                              .toUpperCase()}
                          </strong>

                          <span className="correlation-badge">
                            CORRELATED
                          </span>

                        </div>


                        <p>
                          {incident.description}
                        </p>


                        <div className="source-relationship">

                          <span>
                            SOURCE RELATIONSHIP
                          </span>

                          <strong>
                            {incident.sources?.join(" + ")}
                          </strong>

                        </div>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <div className="empty-state">
                  No cross-source correlation is associated
                  with this event.
                </div>

              )}

            </section>


            {/* ================= THREAT ASSESSMENT ================= */}

            {data.threat_assessment && (

              <section className="assessment-panel">

                <div className="assessment-heading">

                  <span className="section-eyebrow">
                    ARGUS INTELLIGENCE
                  </span>

                  <h3>Threat Assessment</h3>

                  <span className="assessment-level">
                    {data.risk_level}
                  </span>

                </div>


                <div className="assessment-section">

                  <span className="assessment-label">
                    ASSESSMENT
                  </span>

                  <p>
                    {data.threat_assessment.summary}
                  </p>

                </div>


                <div className="assessment-section">

                  <span className="assessment-label">
                    WHY IT MATTERS
                  </span>

                  <ul>

                    {data.threat_assessment.why_it_matters.map(
                      (item, index) => (

                        <li key={index}>
                          {item}
                        </li>

                      )
                    )}

                  </ul>

                </div>


                <div className="assessment-action">

                  <span className="assessment-label">
                    RECOMMENDED ACTION
                  </span>

                  <p>
                    {data.threat_assessment.recommendation}
                  </p>

                </div>

              </section>

            )}


            {/* ================= NAVIGATION BOTTOM ================= */}

            <div className="bottom-navigation">

              <button
                className="navigation-button large"
                onClick={previousEvent}
                disabled={currentEventIndex === 0}
              >
                ← Previous Event
              </button>


              <div className="bottom-counter">

                <span>
                  SECURITY EVENT
                </span>

                <strong>
                  {String(currentEventIndex + 1).padStart(
                    2,
                    "0"
                  )}{" "}
                  /{" "}
                  {String(events.length).padStart(2, "0")}
                </strong>

              </div>


              <button
                className="navigation-button large"
                onClick={nextEvent}
                disabled={
                  currentEventIndex === events.length - 1
                }
              >
                Next Event →
              </button>

            </div>


            {/* ================= NEW ANALYSIS ================= */}

            <div className="new-analysis">

              <button
                className="primary-button"
                onClick={analyzeThreats}
                disabled={loading}
              >
                {loading
                  ? "Analyzing..."
                  : "↻  Analyze Threats"}
              </button>

              <p>
                Run a new security analysis across all connected
                sources
              </p>

            </div>

          </>
        )}

      </main>


      {/* ================= FOOTER ================= */}

      <footer>

        <p>
          ARGUS AI
          <span>•</span>
          Unified Security Intelligence Platform
          <span>•</span>
          Security Intelligence Prototype
        </p>

      </footer>

    </div>
  );
}

export default App;