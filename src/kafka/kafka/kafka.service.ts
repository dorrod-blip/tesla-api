import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TelemetryData } from './kafka.entity'; // Import your entity

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private kafka = new Kafka({
    clientId: 'telemetry-service',
    brokers: ['kafka:9092'], // Update with your broker address
  });
  private consumer = this.kafka.consumer({ groupId: 'telemetry' });

  constructor(
    @InjectRepository(TelemetryData)
    private telemetryRepository: Repository<TelemetryData>,
  ) {}

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'telemetry_V', fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const data = JSON.parse(message.value.toString()); // Parse your message
        console.log("telemetry live data: ", data);
        // await this.saveData(data);
      },
    });
  }

  private async saveData(data: any) {
    const telemetryData = this.telemetryRepository.create(data);
    await this.telemetryRepository.save(telemetryData);
  }
}
