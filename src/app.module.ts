import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthsModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from './kafka/kafka.module';
import { TelemetryData } from './kafka/kafka.entity'; // Adjust the import path if necessary
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AuthsModule,
    DashboardModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Admin123!!@@##',
      database: 'tesla_telemetry',
      entities: [TelemetryData],
      synchronize: true,
    }),
    KafkaModule, // Ensure this is included
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
