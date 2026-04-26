import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { RedisService } from './redis.service';
import { JwtAuthStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AttendeeClient } from './attendee.client';

@Global()
@Module({
  imports: [
    PassportModule,
    HttpModule.register({ timeout: 5000 }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get<string>('JWT_SECRET') ?? 'dev_secret',
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [
    PrismaService,
    RedisService,
    JwtAuthStrategy,
    JwtAuthGuard,
    AttendeeClient,
  ],
  exports: [
    PrismaService,
    RedisService,
    JwtAuthGuard,
    JwtModule,
    AttendeeClient,
  ],
})
export class SharedModule {}
