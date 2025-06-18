from zone import Zone
from sensor import Sensor

def build_world():
    zones = []

    # --- Openpit Sector ---
    openpit = Zone(zone_id="openpit-sector", name="Openpit Sector")
    openpit.add_sensor(Sensor("AIR-001", "air_quality", "openpit-sector", ["PM2_5", "NO2", "SO2"], {
        "PM2_5": (25, 50), "NO2": (20, 50), "SO2": (5, 25)
    }))
    openpit.add_sensor(Sensor("PROD-001", "production_metrics", "openpit-sector", ["EXTRACTED_MATERIAL"], {
        "EXTRACTED_MATERIAL": (80, 120)
    }))
    zones.append(openpit)

    # --- Tunnel Ventilation ---
    tunnel = Zone(zone_id="tunnel-ventilation", name="Tunnel Ventilation")
    tunnel.add_sensor(Sensor("AIR-002", "air_quality", "tunnel-ventilation", ["PM2_5", "CO", "O2", "CH4"], {
        "PM2_5": (25, 50), "CO": (0.5, 2), "O2": (20.5, 20.9), "CH4": (0, 2)
    }))
    zones.append(tunnel)

    # --- Perimeter ---
    perimeter = Zone(zone_id="perimeter", name="Perimeter")
    perimeter.add_sensor(Sensor("AIR-003", "air_quality", "perimeter", ["PM2_5", "PM10", "SO2"], {
        "PM2_5": (25, 50), "PM10": (40, 70), "SO2": (5, 25)
    }))
    perimeter.add_sensor(Sensor("SOIL-001", "soil_quality", "perimeter", ["Pb"], {
        "Pb": (20, 50)
    }))
    zones.append(perimeter)

    # --- Workshop Area ---
    workshop = Zone(zone_id="workshop-area", name="Workshop Area")
    workshop.add_sensor(Sensor("AIR-004", "air_quality", "workshop-area", ["PM2_5", "PM10", "CO", "VOC"], {
        "PM2_5": (25, 50), "PM10": (40, 70), "CO": (0.5, 2), "VOC": (50, 200)
    }))
    workshop.add_sensor(Sensor("SOIL-002", "soil_quality", "workshop-area", ["Pb", "VOC"], {
        "Pb": (20, 50), "VOC": (50, 200)
    }))
    workshop.add_sensor(Sensor("PROD-002", "production_metrics", "workshop-area", ["MACHINE_OPERATING_HOURS"], {
        "MACHINE_OPERATING_HOURS": (18, 22)
    }))
    zones.append(workshop)

    # --- Stockpile Area ---
    stockpile = Zone(zone_id="stockpile-area", name="Stockpile Area")
    stockpile.add_sensor(Sensor("AIR-005", "air_quality", "stockpile-area", ["PM10"], {
        "PM10": (40, 70)
    }))
    stockpile.add_sensor(Sensor("SOIL-003", "soil_quality", "stockpile-area", ["Pb"], {
        "Pb": (20, 50)
    }))
    stockpile.add_sensor(Sensor("PROD-003", "production_metrics", "stockpile-area", ["LOADS_MOVED"], {
        "LOADS_MOVED": (8, 15)
    }))
    zones.append(stockpile)

    # --- Internal Roads ---
    roads = Zone(zone_id="internal-roads", name="Internal Roads")
    roads.add_sensor(Sensor("AIR-006", "air_quality", "internal-roads", ["PM10"], {
        "PM10": (40, 70)
    }))
    roads.add_sensor(Sensor("PROD-004", "production_metrics", "internal-roads", ["LOADS_MOVED"], {
        "LOADS_MOVED": (8, 15)
    }))
    zones.append(roads)

    # --- Fuel Storage ---
    fuel = Zone(zone_id="fuel-storage", name="Fuel Storage")
    fuel.add_sensor(Sensor("AIR-007", "air_quality", "fuel-storage", ["VOC"], {
        "VOC": (50, 200)
    }))
    fuel.add_sensor(Sensor("SOIL-004", "soil_quality", "fuel-storage", ["VOC"], {
        "VOC": (50, 200)
    }))
    zones.append(fuel)

    # --- Loading Zone ---
    loading = Zone(zone_id="loading-zone", name="Loading Zone")
    loading.add_sensor(Sensor("AIR-008", "air_quality", "loading-zone", ["NO2"], {
        "NO2": (20, 50)
    }))
    loading.add_sensor(Sensor("PROD-005", "production_metrics", "loading-zone", ["EXTRACTED_MATERIAL"], {
        "EXTRACTED_MATERIAL": (80, 120)
    }))
    zones.append(loading)

    # --- Underground Pit ---
    underground = Zone(zone_id="underground-pit", name="Underground Pit")
    underground.add_sensor(Sensor("AIR-009", "air_quality", "underground-pit", ["O2", "CH4"], {
        "O2": (20.5, 20.9), "CH4": (0, 2)
    }))
    zones.append(underground)

    # --- Machine Fleet ---
    fleet = Zone(zone_id="machine-fleet", name="Machine Fleet")
    fleet.add_sensor(Sensor("PROD-006", "production_metrics", "machine-fleet", ["MACHINE_OPERATING_HOURS"], {
        "MACHINE_OPERATING_HOURS": (18, 22)
    }))
    zones.append(fleet)

    # --- Tailings Pond ---
    tailings = Zone(zone_id="tailings-pond", name="Tailings Pond")
    tailings.add_sensor(Sensor("WATER-001", "water_quality", "tailings-pond", ["pH", "Conductivity", "As"], {
        "pH": (6.5, 8.5), "Conductivity": (300, 800), "As": (0.005, 0.01)
    }))
    zones.append(tailings)

    # --- Surface Stream ---
    surface = Zone(zone_id="surface-stream", name="Surface Stream")
    surface.add_sensor(Sensor("WATER-002", "water_quality", "surface-stream", ["pH", "Conductivity", "DO"], {
        "pH": (6.5, 8.5), "Conductivity": (300, 800), "DO": (6, 9)
    }))
    zones.append(surface)

    # --- Groundwater Monitoring ---
    groundwater = Zone(zone_id="groundwater-monitoring", name="Groundwater Monitoring")
    groundwater.add_sensor(Sensor("WATER-003", "water_quality", "groundwater-monitoring", ["pH", "As"], {
        "pH": (6.5, 8.5), "As": (0.004, 0.01)
    }))
    zones.append(groundwater)

    # --- Drainage Channel ---
    drainage = Zone(zone_id="drainage-channel", name="Drainage Channel")
    drainage.add_sensor(Sensor("WATER-004", "water_quality", "drainage-channel", ["DO"], {
        "DO": (6, 9)
    }))
    zones.append(drainage)

    return zones