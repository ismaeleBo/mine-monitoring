from zone import Zone
from sensor import Sensor

def build_world():
    zones = []

    # --- Openpit Sector ---
    openpit = Zone(zone_id="openpit-sector", name="Openpit Sector")
    openpit.add_sensor(Sensor(
        sensor_id="AIR-001",
        sensor_type="air_quality",
        location="openpit-sector",
        parameters=["PM2_5", "PM10", "NO2", "SO2", "VOC"],
        baseline={
            "PM2_5": (25, 50),
            "PM10": (40, 70),
            "NO2": (20, 50),
            "SO2": (5, 25),
            "VOC": (50, 200),
        }
    ))
    zones.append(openpit)

    # --- Tunnel Ventilation ---
    tunnel = Zone(zone_id="tunnel-ventilation", name="Tunnel Ventilation")
    tunnel.add_sensor(Sensor(
        sensor_id="AIR-002",
        sensor_type="air_quality",
        location="tunnel-ventilation",
        parameters=["CO", "NO2", "O2", "CH4", "VOC"],
        baseline={
            "CO": (0.5, 2),
            "NO2": (20, 50),
            "O2": (20.5, 20.9),
            "CH4": (0, 2),
            "VOC": (50, 200),
        }
    ))
    zones.append(tunnel)

    # --- Perimeter ---
    perimeter = Zone(zone_id="perimeter", name="Perimeter")
    perimeter.add_sensor(Sensor(
        sensor_id="AIR-003",
        sensor_type="air_quality",
        location="perimeter",
        parameters=["PM2_5", "PM10", "NO2", "SO2"],
        baseline={
            "PM2_5": (5, 30),
            "PM10": (10, 50),
            "NO2": (5, 60),
            "SO2": (2, 25),
        }
    ))
    zones.append(perimeter)

    # --- Workshop Area ---
    workshop = Zone(zone_id="workshop-area", name="Workshop Area")
    workshop.add_sensor(Sensor(
        sensor_id="AIR-004",
        sensor_type="air_quality",
        location="workshop-area",
        parameters=["CO", "PM2_5", "PM10", "VOC"],
        baseline={
            "CO": (0.5, 2),
            "PM2_5": (25, 50),
            "PM10": (40, 70),
            "VOC": (50, 200),
        }
    ))
    zones.append(workshop)

    # --- Stockpile Area ---
    stockpile = Zone(zone_id="stockpile-area", name="Stockpile Area")
    stockpile.add_sensor(Sensor(
        sensor_id="AIR-005",
        sensor_type="air_quality",
        location="stockpile-area",
        parameters=["PM10"],
        baseline={
            "PM10": (40, 70),
        }
    ))
    zones.append(stockpile)

    # --- Internal Roads ---
    roads = Zone(zone_id="internal-roads", name="Internal Roads")
    roads.add_sensor(Sensor(
        sensor_id="AIR-006",
        sensor_type="air_quality",
        location="internal-roads",
        parameters=["PM10"],
        baseline={
            "PM10": (40, 70),
        }
    ))
    zones.append(roads)

    # --- Fuel Storage ---
    fuel_storage = Zone(zone_id="fuel-storage", name="Fuel Storage")
    fuel_storage.add_sensor(Sensor(
        sensor_id="AIR-007",
        sensor_type="air_quality",
        location="fuel-storage",
        parameters=["VOC"],
        baseline={
            "VOC": (50, 200),
        }
    ))
    zones.append(fuel_storage)

    # --- Loading Zone ---
    loading_zone = Zone(zone_id="loading-zone", name="Loading Zone")
    loading_zone.add_sensor(Sensor(
        sensor_id="AIR-008",
        sensor_type="air_quality",
        location="loading-zone",
        parameters=["NO2"],
        baseline={
            "NO2": (20, 50),
        }
    ))
    zones.append(loading_zone)

    # --- Underground Pit ---
    underground_pit = Zone(zone_id="underground-pit", name="Underground Pit")
    underground_pit.add_sensor(Sensor(
        sensor_id="AIR-009",
        sensor_type="air_quality",
        location="underground-pit",
        parameters=["O2", "CH4"],
        baseline={
            "O2": (20.5, 20.9),
            "CH4": (0, 2),
        }
    ))
    zones.append(underground_pit)
    
    # --- Tailings Pond ---
    tailings_pond = Zone(zone_id="tailings-pond", name="Tailings Pond")
    tailings_pond.add_sensor(Sensor(
        sensor_id="WATER-001",
        sensor_type="water_quality",
        location="tailings-pond",
        parameters=["pH", "Conductivity", "As"],
        baseline={
            "pH": (6.5, 8.5),
            "Conductivity": (300, 800),
            "As": (0.005, 0.01),
        }
    ))
    zones.append(tailings_pond)

    # --- Surface Stream ---
    surface_stream = Zone(zone_id="surface-stream", name="Surface Stream")
    surface_stream.add_sensor(Sensor(
        sensor_id="WATER-002",
        sensor_type="water_quality",
        location="surface-stream",
        parameters=["pH", "Conductivity", "DO"],
        baseline={
            "pH": (6.5, 8.5),
            "Conductivity": (300, 800),
            "DO": (6.0, 9.0),
        }
    ))
    zones.append(surface_stream)

    # --- Groundwater Monitoring Well ---
    groundwater = Zone(zone_id="groundwater-monitoring", name="Groundwater Monitoring")
    groundwater.add_sensor(Sensor(
        sensor_id="WATER-003",
        sensor_type="water_quality",
        location="groundwater-monitoring",
        parameters=["pH", "As"],
        baseline={
            "pH": (6.5, 8.5),
            "As": (0.004, 0.009),
        }
    ))
    zones.append(groundwater)

    # --- Drainage Channel ---
    drainage_channel = Zone(zone_id="drainage-channel", name="Drainage Channel")
    drainage_channel.add_sensor(Sensor(
        sensor_id="WATER-004",
        sensor_type="water_quality",
        location="drainage-channel",
        parameters=["DO"],
        baseline={
            "DO": (6.0, 9.0),
        }
    ))
    zones.append(drainage_channel)

    return zones
