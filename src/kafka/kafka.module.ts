import { Module } from '@nestjs/common';
import { KafkaConsumerService } from './kafka/kafka.service';

@Module({
  providers: [KafkaConsumerService]
})
export class KafkaModule {}
