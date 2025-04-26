from zone import Zone
from sensor import Sensor

def build_world():
    zones = []

    # --- Definizione Zone ---

    # Openpit Sector
    openpit = Zone(zone_id="openpit-sector", name="Area di Scavo a Cielo Aperto")
    openpit.add_sensor(Sensor(
        sensor_id="AIR-001",
        sensor_type="air_quality",
        location="openpit-sector",
        parameters=["PM2_5", "PM10", "NO2"],
        baseline={
            "PM2_5": (10, 40),
            "PM10": (20, 70),
            "NO2": (30, 80)
        }
    ))
    openpit.add_sensor(Sensor(
        sensor_id="PROD-001",
        sensor_type="production",
        location="openpit-sector",
        parameters=["tons_extracted_per_hour"],
        baseline={
            "tons_extracted_per_hour": (50, 150)
        }
    ))
    zones.append(openpit)

    # Tailings Pond
    tailings = Zone(zone_id="tailings-pond", name="Bacino di Decantazione")
    tailings.add_sensor(Sensor(
        sensor_id="WATER-001",
        sensor_type="water_quality",
        location="tailings-pond",
        parameters=["pH", "conductivity", "arsenic"],
        baseline={
            "pH": (6.5, 8.5),
            "conductivity": (300, 800),
            "arsenic": (0.0, 0.01)
        }
    ))
    zones.append(tailings)

    # Workshop Area
    workshop = Zone(zone_id="workshop-area", name="Officine Manutenzione")
    workshop.add_sensor(Sensor(
        sensor_id="VOC-001",
        sensor_type="voc_air",
        location="workshop-area",
        parameters=["voc_air_concentration"],
        baseline={
            "voc_air_concentration": (10, 100)
        }
    ))
    workshop.add_sensor(Sensor(
        sensor_id="SOIL-001",
        sensor_type="soil_quality",
        location="workshop-area",
        parameters=["lead_concentration", "voc_concentration"],
        baseline={
            "lead_concentration": (20, 50),
            "voc_concentration": (0, 100)
        }
    ))
    zones.append(workshop)

    # Internal Roads
    roads = Zone(zone_id="internal-roads", name="Strade Interne")
    roads.add_sensor(Sensor(
        sensor_id="AIR-002",
        sensor_type="air_quality",
        location="internal-roads",
        parameters=["PM10"],
        baseline={
            "PM10": (20, 80)
        }
    ))
    zones.append(roads)

    return zones
