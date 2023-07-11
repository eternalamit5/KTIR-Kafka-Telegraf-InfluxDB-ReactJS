import time
from kafka import KafkaProducer
import json


def send_temperature_data(producer, topic):
    temperature = 25.0  # Initial temperature
    while True:
        # Generate temperature data
        temperature += 0.5

        # Create JSON payload
        payload = {"temperature": temperature}

        # Serialize payload to JSON
        data = json.dumps(payload)

        # Send data to Kafka topic
        producer.send(topic, value=data.encode("utf-8"))
        producer.flush()

        print(f"Sent temperature data: {temperature}")

        time.sleep(5)  # Wait for 5 seconds


if __name__ == "__main__":
    bootstrap_servers = "localhost:9093"  # Kafka broker address
    topic = "states"  # Kafka topic to send data

    # Create Kafka producer
    producer = KafkaProducer(
        bootstrap_servers=bootstrap_servers,
        # Use default serialization
        value_serializer=lambda v: v,
        api_version=(2, 0, 2)
    )

    try:
        send_temperature_data(producer, topic)
    except KeyboardInterrupt:
        pass
    finally:
        producer.close()
