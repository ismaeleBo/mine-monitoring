EVENT_PROFILES = [
    {
        "type": "chemical_spill",
        "params": {"VOC": 2.0, "As": 1.5}
    },
    {
        "type": "gas_leak",
        "params": {"CH4": 3.0, "CO": 2.5}
    },
    {
        "type": "diesel_exhaust",
        "params": {"PM10": 1.8, "NO2": 1.6}
    },
    {
        "type": "oxygen_drop",
        "params": {"O2": 0.8}
    }
]

OPERATION_PROFILES = [
    {
        "type": "excavation",
        "params": {
            "PM10": 1.3,
            "PM2_5": 1.2,
            "tons_extracted_per_hour": 1.5
        }
    },
    {
        "type": "material_transport",
        "params": {
            "PM10": 1.4,
            "LOADS_MOVED": 1.2
        }
    },
    {
        "type": "drilling",
        "params": {
            "PM2_5": 1.5,
            "NO2": 1.3,
            "MACHINE_OPERATING_HOURS": 1.1
        }
    },
    {
        "type": "maintenance",
        "params": {
            "VOC": 1.4,
            "CO": 1.2
        }
    }
]
