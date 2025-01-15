import { Kafka } from "kafkajs";

const TOPIC_NAME = "workflow-events";

const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092'],
})

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "main-worker" });

export {TOPIC_NAME , producer , consumer};