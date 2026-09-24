from datetime import datetime


# Events that indicate suspicious activity
SUSPICIOUS_EVENTS = {
    "loitering",
    "unauthorized_access",
    "after_hours_access",
    "suspicious_connection",
    "large_data_transfer",
    "port_scan"
}


def calculate_risk(events):
    """
    Calculate a risk score based on multiple security events.
    """

    score = 0
    reasons = []

    for event in events:

        # CCTV events
        if event["source"] == "CCTV":

            if event["event_type"] == "loitering":
                score += 20
                reasons.append("CCTV detected loitering")

            elif event["event_type"] == "person_detected":
                score += 5
                reasons.append("Person detected by CCTV")

        # Access log events
        elif event["source"] == "ACCESS_LOG":

            if event["access_type"] == "unauthorized_access":
                score += 35
                reasons.append("Unauthorized access detected")

            elif event["access_type"] == "after_hours_access":
                score += 25
                reasons.append("After-hours access detected")

        # Network events
        elif event["source"] == "NETWORK":

            if event["event_type"] == "suspicious_connection":
                score += 30
                reasons.append("Suspicious network connection")

            elif event["event_type"] == "large_data_transfer":
                score += 25
                reasons.append("Large data transfer detected")

            elif event["event_type"] == "port_scan":
                score += 30
                reasons.append("Port scanning detected")

    # Determine risk level
    if score >= 70:
        risk_level = "HIGH"

    elif score >= 40:
        risk_level = "MEDIUM"

    else:
        risk_level = "LOW"

    return score, risk_level, reasons


def display_alert(events):

    score, risk_level, reasons = calculate_risk(events)

    print("\n========================================")
    print("        ARGUS AI THREAT DETECTOR")
    print("========================================")

    print(f"Risk Score : {score}")
    print(f"Risk Level : {risk_level}")

    print("\nDetected Signals:")

    for reason in reasons:
        print(f" - {reason}")

    print("\nRelated Events:")

    for event in events:
        print(event)

    print("========================================\n")


if __name__ == "__main__":

    print("ARGUS AI - Threat Detection Engine")
    print("-----------------------------------")

    # Test events
    test_events = [

        {
            "source": "CCTV",
            "camera_id": "CAM-01",
            "event_type": "loitering",
            "timestamp": datetime.now().isoformat()
        },

        {
            "source": "ACCESS_LOG",
            "user_id": "ADMIN-01",
            "location": "Server Room",
            "access_type": "unauthorized_access",
            "timestamp": datetime.now().isoformat()
        },

        {
            "source": "NETWORK",
            "device_id": "SERVER-01",
            "event_type": "suspicious_connection",
            "data_volume_mb": 433,
            "timestamp": datetime.now().isoformat()
        }
    ]

    display_alert(test_events)