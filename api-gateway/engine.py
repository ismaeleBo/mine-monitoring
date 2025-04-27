import time
import random
import datetime
from event import Event
from operation import Operation
import paho.mqtt.client as mqtt
from alarm_manager import AlarmManager

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

    def trigger_random_event(self):
        """Con una bassa probabilità genera un evento straordinario su una zona"""
        if random.random() < 0.01:  # ~1% probabilità a ogni tick
            zone = random.choice(self.zones)
            event = Event(
                event_type="chemical_spill",
                duration_seconds=random.randint(300, 900),
                intensity=random.uniform(1.2, 2.0),
                impacted_parameters={
                    "PM2_5": 2.5,
                    "voc_air_concentration": 3.0
                }
            )
            zone.trigger_event(event)
            print(f"[EVENT] Evento '{event.event_type}' scattato su zona {zone.zone_id}")

    def trigger_random_operation(self):
        """Genera operazioni standard con probabilità più alta"""
        if random.random() < 0.2:  # ~20% probabilità a ogni tick
            zone = random.choice(self.zones)
            operation = Operation(
                operation_type="excavation",
                duration_seconds=random.randint(600, 1800),
                impact_factors={
                    "PM10": 1.2,
                    "tons_extracted_per_hour": 1.1
                }
            )
            zone.trigger_operation(operation)
            print(f"[OPERATION] Operazione '{operation.operation_type}' avviata su zona {zone.zone_id}")

    def update_world(self):
        """Esegue un ciclo di aggiornamento completo"""
        self.global_time = datetime.datetime.utcnow()

        self.trigger_random_event()
        self.trigger_random_operation()

        for zone in self.zones:
            zone.resolve_events()
            packets = zone.update_sensors()
            for packet in packets:
                topic = f"mining/{self.site_id}/{packet['location']}/{packet['type']}/{packet['sensor_id']}"
                message = str(packet)
                self.mqtt_client.publish(topic, message)
                print(f"[PUBLISH] {topic} -> {message}")
		self.alarm_manager.evaluate(packet)

    def run(self):
        """Loop infinito della simulazione"""
        print("[ENGINE] Simulazione avviata...")
        while True:
            self.update_world()
            time.sleep(self.tick_interval)