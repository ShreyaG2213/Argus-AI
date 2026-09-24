import random
import time
from datetime import datetime

USERS = [
    "EMP-101",
    "EMP-102",
    "EMP-103",
    "ADMIN-01",
    "GUEST-01"
]

LOCATIONS = [
    "Main Gate",
    "Server Room",
    "Control Room",
    "Office Floor",
    "Storage Area"
]

ACCESS_TYPES = [
    "normal_access",
    "normal_access",
    "normal_access",
    "unauthorized_access",
    "after_hours_access"
]


def generate_access_event():

    return {
        "source": "ACCESS_LOG",
        "user_id": random.choice(USERS),
        "location": random.choice(LOCATIONS),
        "access_type": random.choice(ACCESS_TYPES),
        "timestamp": datetime.now().isoformat()
    }


if __name__ == "__main__":

    print("ARGUS AI - Access Log Simulator")
    print("--------------------------------")

    for _ in range(10):
        event = generate_access_event()
        print(event)
        time.sleep(1)