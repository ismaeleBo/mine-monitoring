import datetime

class Operation:
    def __init__(self, operation_type, duration_seconds, impact_factors):
        self.operation_type = operation_type
        self.start_time = datetime.datetime.utcnow()
        self.duration_seconds = duration_seconds
        self.impact_factors = impact_factors  # Es: {"PM2_5": 1.2, "fuel_consumption": 1.1}

    def is_expired(self):
        elapsed = (datetime.datetime.utcnow() - self.start_time).total_seconds()
        return elapsed > self.duration_seconds

    def apply_operation(self, values):
        modified_values = values.copy()
        for param, multiplier in self.impact_factors.items():
            if param in modified_values:
                modified_values[param] = round(modified_values[param] * multiplier, 2)
        return modified_values
