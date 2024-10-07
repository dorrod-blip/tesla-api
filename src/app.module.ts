import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthsModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from './kafka/kafka.module';
import { TelemetryData } from './kafka/kafka/kafka.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AuthsModule,
    DashboardModule,
    KafkaModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost', // Update with your MySQL host
      port: 3306,
      username: 'your-username',
      password: 'your-password',
      database: 'your-database',
      entities: [TelemetryData],
      synchronize: true, // Set to false in production
    }),
    TypeOrmModule.forFeature([TelemetryData]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
