from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.data_fusion import collect_security_events
from core.threat_detector import calculate_risk
from core.correlation_engine import correlate_events


app = FastAPI(title="ARGUS AI")


# =========================================================
# CORS CONFIGURATION
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# HOME ENDPOINT
# =========================================================

@app.get("/")
def home():
    return {
        "system": "ARGUS AI",
        "status": "online",
        "message": "ARGUS AI backend is running"
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# =========================================================
# THREAT ASSESSMENT
# =========================================================

def generate_threat_assessment(
    risk_score,
    risk_level,
    signals,
    correlated_incidents
):
    """
    Generate a human-readable threat assessment
    based on risk score, detected signals and
    cross-source correlations.
    """

    # -----------------------------------------------------
    # Main assessment
    # -----------------------------------------------------

    if risk_level == "HIGH":

        summary = (
            "ARGUS AI detected multiple suspicious security "
            "events with significant threat indicators."
        )

    elif risk_level == "MEDIUM":

        summary = (
            "ARGUS AI detected suspicious activity that "
            "requires further investigation."
        )

    else:

        summary = (
            "ARGUS AI detected limited suspicious activity. "
            "No immediate high-risk pattern was identified."
        )


    # -----------------------------------------------------
    # Why it matters
    # -----------------------------------------------------

    why_it_matters = []

    if signals:
        why_it_matters.extend(signals)

    if correlated_incidents:

        why_it_matters.append(
            f"{len(correlated_incidents)} cross-source "
            "correlation pattern(s) detected"
        )

    if len(correlated_incidents) >= 3:

        why_it_matters.append(
            "Multiple independent security sources indicate "
            "a potentially coordinated incident"
        )


    # -----------------------------------------------------
    # Recommended action
    # -----------------------------------------------------

    if risk_level == "HIGH":

        recommendation = (
            "Investigate the affected access point, network "
            "device and associated CCTV activity. Verify "
            "whether the events are related."
        )

    elif risk_level == "MEDIUM":

        recommendation = (
            "Review the detected events and verify the "
            "associated CCTV, access and network activity."
        )

    else:

        recommendation = (
            "Continue monitoring the security event sources "
            "for additional suspicious activity."
        )


    # -----------------------------------------------------
    # Return assessment
    # -----------------------------------------------------

    return {
        "summary": summary,
        "why_it_matters": why_it_matters,
        "recommendation": recommendation
    }


# =========================================================
# ANALYZE SECURITY EVENTS
# =========================================================

@app.get("/analyze")
def analyze():

    # -----------------------------------------------------
    # 1. Collect events from all security sources
    # -----------------------------------------------------

    events = collect_security_events()


    # -----------------------------------------------------
    # 2. Calculate individual threat risk
    # -----------------------------------------------------

    risk_score, risk_level, signals = calculate_risk(events)


    # -----------------------------------------------------
    # 3. Correlate events across different sources
    # -----------------------------------------------------

    correlated_incidents = correlate_events(events)


    # -----------------------------------------------------
    # 4. Generate human-readable threat intelligence
    # -----------------------------------------------------

    threat_assessment = generate_threat_assessment(
        risk_score,
        risk_level,
        signals,
        correlated_incidents
    )


    # -----------------------------------------------------
    # 5. Return complete ARGUS AI analysis
    # -----------------------------------------------------

    return {
        "system": "ARGUS AI",

        "risk_score": risk_score,

        "risk_level": risk_level,

        "detected_signals": signals,

        "events": events,

        "correlated_incidents": correlated_incidents,

        "threat_assessment": threat_assessment
    }