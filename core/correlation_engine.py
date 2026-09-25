def correlate_events(events):
    """
    Identify relationships between suspicious events
    coming from different security sources.
    """

    correlated_incidents = []

    cctv_events = [
        event for event in events
        if event["source"] == "CCTV"
    ]

    access_events = [
        event for event in events
        if event["source"] == "ACCESS_LOG"
    ]

    network_events = [
        event for event in events
        if event["source"] == "NETWORK"
    ]

    # CCTV + Access correlation
    cctv_suspicious = any(
        event["event_type"] in [
            "loitering",
            "restricted_area_entry"
        ]
        for event in cctv_events
    )

    access_suspicious = any(
        event["access_type"] in [
            "unauthorized_access",
            "after_hours_access"
        ]
        for event in access_events
    )

    if cctv_suspicious and access_suspicious:
        correlated_incidents.append({
            "type": "possible_physical_intrusion",
            "sources": ["CCTV", "ACCESS_LOG"],
            "description": (
                "Suspicious physical activity and "
                "unauthorized access detected together"
            )
        })

    # Access + Network correlation
    network_suspicious = any(
        event["event_type"] in [
            "port_scan",
            "large_data_transfer",
            "suspicious_connection"
        ]
        for event in network_events
    )

    if access_suspicious and network_suspicious:
        correlated_incidents.append({
            "type": "possible_coordinated_intrusion",
            "sources": ["ACCESS_LOG", "NETWORK"],
            "description": (
                "Unauthorized access occurred together "
                "with suspicious network activity"
            )
        })

    # CCTV + Network correlation
    if cctv_suspicious and network_suspicious:
        correlated_incidents.append({
            "type": "possible_multi_stage_attack",
            "sources": ["CCTV", "NETWORK"],
            "description": (
                "Suspicious physical activity occurred "
                "together with suspicious network activity"
            )
        })

    # All three sources correlated
    if cctv_suspicious and access_suspicious and network_suspicious:
        correlated_incidents.append({
            "type": "high_confidence_security_incident",
            "sources": ["CCTV", "ACCESS_LOG", "NETWORK"],
            "description": (
                "Suspicious activity detected across "
                "all three security sources"
            )
        })

    return correlated_incidents