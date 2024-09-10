import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthsService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
      global: true,
    }),
  ],
  providers: [AuthsService],
  controllers: [AuthController],
})
export class AuthsModule {}
