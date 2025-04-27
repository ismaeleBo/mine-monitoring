import random
import datetime
import numpy as np

class Sensor:
    def __init__(self, sensor_id, sensor_type, location, parameters, baseline, anomaly_rate=0.05):
        self.sensor_id = sensor_id
        self.sensor_type = sensor_type
        self.location = location
        self.parameters = parameters  # Esempio: ["PM2_5", "PM10"]
        self.baseline = baseline      # Esempio: {"PM2_5": (10, 40), "PM10": (20, 70)}
        self.anomaly_rate = anomaly_rate

    def generate_data(self):
        timestamp = datetime.datetime.utcnow().isoformat() + "Z"

        # Decide se generare valori normali o anomali usando Poisson
        is_anomaly = np.random.poisson(self.anomaly_rate) > 0

        if is_anomaly:
            values = self.simulate_anomaly()
        else:
            values = self.simulate_normal()

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
            # Genera valori anomali oltre il normale range
            anomaly_low = low * 0.5
            anomaly_high = high * 2.0
            value = round(random.uniform(anomaly_high, anomaly_high * 1.2), 2)
            values[param] = value
        return values
