from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.data_fusion import collect_security_events
from core.threat_detector import calculate_risk


app = FastAPI(title="ARGUS AI")


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


@app.get("/")
def home():
    return {
        "system": "ARGUS AI",
        "status": "online",
        "message": "ARGUS AI backend is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/analyze")
def analyze():
    events = collect_security_events()

    risk_score, risk_level, signals = calculate_risk(events)

    return {
        "system": "ARGUS AI",
        "risk_score": risk_score,
        "risk_level": risk_level,
        "detected_signals": signals,
        "events": events
    }