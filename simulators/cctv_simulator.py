import random
import time
from datetime import datetime

CAMERAS = ["CAM-01", "CAM-02", "CAM-03"]

EVENTS = [
    "person_detected",
    "vehicle_detected",
    "restricted_area_entry",
    "loitering",
    "normal_activity"
]

def generate_cctv_event():
    event = random.choices(
        EVENTS,
        weights=[35, 15, 10, 15, 25]
    )[0]

    return {
        "source": "CCTV",
        "camera_id": random.choice(CAMERAS),
        "event_type": event,
        "timestamp": datetime.now().isoformat()
    }


if __name__ == "__main__":
    print("ARGUS AI - CCTV Event Simulator")
    print("--------------------------------")

    for _ in range(10):
        event = generate_cctv_event()
        print(event)
        time.sleep(1)