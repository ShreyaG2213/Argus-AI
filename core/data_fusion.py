import random
import time
from datetime import datetime

from core.threat_detector import calculate_risk


def generate_cctv_event():
    events = [
        "normal_activity",
        "person_detected",
        "loitering",
        "restricted_area_entry"
    ]

    return {
        "source": "CCTV",
        "camera_id": random.choice(["CAM-01", "CAM-02", "CAM-03"]),
        "event_type": random.choice(events),
        "timestamp": datetime.now().isoformat()
    }


def generate_access_event():
    events = [
        "normal_access",
        "normal_access",
        "unauthorized_access",
        "after_hours_access"
    ]

    return {
        "source": "ACCESS_LOG",
        "user_id": random.choice([
            "EMP-101",
            "EMP-102",
            "ADMIN-01",
            "GUEST-01"
        ]),
        "location": random.choice([
            "Main Gate",
            "Office Floor",
            "Server Room",
            "Control Room"
        ]),
        "access_type": random.choice(events),
        "timestamp": datetime.now().isoformat()
    }


def generate_network_event():
    events = [
        "normal_traffic",
        "normal_traffic",
        "port_scan",
        "large_data_transfer",
        "suspicious_connection"
    ]

    return {
        "source": "NETWORK",
        "device_id": random.choice([
            "PC-101",
            "PC-102",
            "SERVER-01",
            "SERVER-02"
        ]),
        "event_type": random.choice(events),
        "data_volume_mb": random.randint(10, 1000),
        "timestamp": datetime.now().isoformat()
    }


def collect_security_events():

    events = []

    events.append(generate_cctv_event())
    events.append(generate_access_event())
    events.append(generate_network_event())

    return events


def analyze_security_batch(events):

    score, risk_level, reasons = calculate_risk(events)

    print("\n========== THREAT ANALYSIS ==========")

    print(f"Risk Score : {score}")
    print(f"Risk Level : {risk_level}")

    print("\nDetected Signals:")

    if reasons:
        for reason in reasons:
            print(f" - {reason}")
    else:
        print(" - No suspicious activity detected")

    print("=====================================")


if __name__ == "__main__":

    print("ARGUS AI - DATA FUSION ENGINE")
    print("==============================")

    for _ in range(5):

        events = collect_security_events()

        print("\n--- Unified Security Event Batch ---")

        for event in events:
            print(event)

        # Send unified events to Threat Detector
        analyze_security_batch(events)

        time.sleep(2)