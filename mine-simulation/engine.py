import time
import random
import datetime
from event import Event
from operation import Operation
import paho.mqtt.client as mqtt
from alarm_manager import AlarmManager
import json

class StateEngine:
    def __init__(self, tick_interval=5, broker_address="localhost", broker_port=1883, site_id="site-a"):
        self.zones = []
        self.global_time = datetime.datetime.utcnow()
        self.tick_interval = tick_interval
        self.site_id = site_id
        self.mqtt_client = mqtt.Client(client_id="StateEnginePublisher", protocol=mqtt.MQTTv311)
        self.mqtt_client.connect(broker_address, broker_port)
        self.alarm_manager = AlarmManager(self.mqtt_client)

    
    def add_zone(self, zone):
        self.zones.append(zone)

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

    def trigger_random_event(self):
        """With a low probability it generates an extraordinary event in an area"""
        if random.random() < 0.01:  # ~1% probability per tick
            profile = random.choice(EVENT_PROFILES)
            zone = random.choice(self.zones)
            event = Event(
                event_type=profile["type"],
                duration_seconds=random.randint(300, 900),
                intensity=random.uniform(1.2, 2.0),
                impacted_parameters=profile["params"]
            )
            zone.trigger_event(event)
            print(f"[EVENT] Event '{event.event_type}' in zone {zone.zone_id}")

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


    def trigger_random_operation(self):
        """Generate standard operations with higher probability"""
        if random.random() < 0.2:  # ~20% probability per tick
            profile = random.choice(OPERATION_PROFILES)
            zone = random.choice(self.zones)
            operation = Operation(
                operation_type=profile["type"],
                duration_seconds=random.randint(600, 1800),
                impact_factors=profile["params"]
            )
            zone.trigger_operation(operation)
            print(f"[OPERATION] Operation '{operation.operation_type}' in zone {zone.zone_id}")

    def get_service_prefix(self, sensor_type):
        """Returns the service prefix based on the sensor type"""
        mapping = {
            'air_quality': 'air-quality',
            'water_quality': 'water-quality',
            'soil_quality': 'land-impact',
            'production': 'production-monitoring',
            'voc_air': 'air-quality',
        }
        return mapping.get(sensor_type, 'misc')

    def update_world(self):
        """Performs a full update cycle"""
        self.global_time = datetime.datetime.utcnow()

        self.trigger_random_event()
        self.trigger_random_operation()

        for zone in self.zones:
            zone.resolve_events()
            packets = zone.update_sensors()
            for packet in packets:
                service_prefix = self.get_service_prefix(packet['type'])
                topic = f"mining/{service_prefix}/readings/{self.site_id}/{packet['location']}/{packet['sensor_id']}"
                message = json.dumps(packet)
                self.mqtt_client.publish(topic, message)
                print(f"[PUBLISH] {topic} -> {message}")
                self.alarm_manager.evaluate(packet)

    def run(self):
        """Infinite simulation loop"""
        print("[ENGINE] Simulation started...")
        while True:
            self.update_world()
            time.sleep(self.tick_interval)
