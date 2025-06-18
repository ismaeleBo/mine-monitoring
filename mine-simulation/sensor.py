import random
import datetime
import numpy as np

class Sensor:
    def __init__(self, sensor_id, sensor_type, location, parameters, baseline, anomaly_rate=0.05):
        self.sensor_id = sensor_id
        self.sensor_type = sensor_type
        self.location = location
        self.parameters = parameters  # es. ["PM2_5", "PM10"]
        self.baseline = baseline      # es. {"PM2_5": (10, 40), "PM10": (20, 70)}
        self.anomaly_rate = anomaly_rate

    def generate_data(self):
        timestamp = datetime.datetime.utcnow().isoformat() + "Z"

        # Decidi se generare anomalie usando distribuzione di Poisson
        is_anomaly = np.random.poisson(self.anomaly_rate) > 0

        values = self.simulate_anomaly() if is_anomaly else self.simulate_normal()

        payload = {
            "sensor_id": self.sensor_id,
            "timestamp": timestamp,
            "type": self.sensor_type,
            "location": self.location,
            "values": values
        }

        return payload

    def simulate_normal(self):
        values = {}
        for param in self.parameters:
            low, high = self.baseline[param]
            value = round(random.uniform(low, high), 2)
            values[param] = value
        return values

    def simulate_anomaly(self):
        values = {}
        for param in self.parameters:
            low, high = self.baseline[param]

            margin = high - low
            value = round(high + margin * random.uniform(1.0, 2.0), 2)
            values[param] = value
        return values
