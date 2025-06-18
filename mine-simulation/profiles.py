EVENT_PROFILES = [
    {
        "type": "chemical_spill",
        "params": {"VOC": 2.5, "As": 2.0, "pH": 1.2}
    },
    {
        "type": "gas_leak",
        "params": {"CH4": 3.0, "CO": 2.0, "O2": 0.85}
    },
    {
        "type": "diesel_exhaust",
        "params": {"PM10": 1.8, "NO2": 1.7, "CO": 1.4}
    },
    {
        "type": "oxygen_drop",
        "params": {"O2": 0.7}
    },
    {
        "type": "heavy_rainfall",
        "params": {"Conductivity": 0.7, "DO": 1.2, "pH": 0.9}
    },
    {
        "type": "ground_contamination",
        "params": {"VOC": 2.0, "Pb": 1.8, "As": 1.4}
    },
    {
        "type": "wastewater_discharge",
        "params": {"Conductivity": 1.6, "DO": 0.6, "pH": 1.2}
    },
    {
        "type": "ventilation_failure",
        "params": {"CH4": 2.5, "CO": 2.0, "O2": 0.75}
    }
]

OPERATION_PROFILES = [
    {
        "type": "excavation",
        "params": {
            "PM10": 1.3,
            "PM2_5": 1.2,
            "EXTRACTED_MATERIAL": 1.4
        }
    },
    {
        "type": "material_transport",
        "params": {
            "PM10": 1.4,
            "LOADS_MOVED": 1.3,
            "VOC": 1.2
        }
    },
    {
        "type": "drilling",
        "params": {
            "PM2_5": 1.5,
            "NO2": 1.4,
            "MACHINE_OPERATING_HOURS": 1.2,
            "CO": 1.1
        }
    },
    {
        "type": "maintenance",
        "params": {
            "VOC": 1.3,
            "CO": 1.1
        }
    },
    {
        "type": "blasting",
        "params": {
            "PM10": 2.0,
            "PM2_5": 1.8,
            "NO2": 1.6
        }
    },
    {
        "type": "refueling",
        "params": {
            "VOC": 1.5,
            "CO": 1.2
        }
    },
    {
        "type": "ore_processing",
        "params": {
            "Pb": 1.4,
            "As": 1.3,
            "VOC": 1.2
        }
    },
    {
        "type": "water_treatment",
        "params": {
            "pH": 1.1,
            "Conductivity": 0.9,
            "DO": 1.2
        }
    }
]

