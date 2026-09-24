import random
import time
from datetime import datetime

DEVICES = [
    "PC-101",
    "PC-102",
    "SERVER-01",
    "SERVER-02",
    "LAPTOP-01"
]

NETWORK_EVENTS = [
    "normal_traffic",
    "normal_traffic",
    "normal_traffic",
    "port_scan",
    "large_data_transfer",
    "suspicious_connection"
]


def generate_network_event():

    return {
        "source": "NETWORK",
        "device_id": random.choice(DEVICES),
        "event_type": random.choice(NETWORK_EVENTS),
        "data_volume_mb": random.randint(10, 1000),
        "timestamp": datetime.now().isoformat()
    }


if __name__ == "__main__":

    print("ARGUS AI - Network Activity Simulator")
    print("--------------------------------------")

    for _ in range(10):
        event = generate_network_event()
        print(event)
        time.sleep(1)