import datetime

class Event:
    def __init__(self, event_type, duration_seconds, intensity, impacted_parameters):
        self.event_type = event_type
        self.start_time = datetime.datetime.utcnow()
        self.duration_seconds = duration_seconds
        self.intensity = intensity                      # Damage Multiplier
        self.impacted_parameters = impacted_parameters  # E.g.: {"PM2_5": 2.0, "PM10": 1.5}

    def is_expired(self):
        elapsed = (datetime.datetime.utcnow() - self.start_time).total_seconds()
        return elapsed > self.duration_seconds

    def apply_impact(self, values):
        impacted_values = values.copy()
        for param, multiplier in self.impacted_parameters.items():
            if param in impacted_values:
                impacted_values[param] = round(impacted_values[param] * multiplier * self.intensity, 2)
        return impacted_values
