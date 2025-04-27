from engine import StateEngine
from world_builder import build_world

if __name__ == "__main__":
    engine = StateEngine(
        tick_interval=5, 
        broker_address="localhost", 
        broker_port=1883, 
        site_id="mine-sim"
    )

    zones = build_world()
    for zone in zones:
        engine.add_zone(zone)

    engine.run()

