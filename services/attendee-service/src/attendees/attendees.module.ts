import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Attendee, AttendeeSchema } from './attendee.schema';
import { AttendeesController } from './attendees.controller';
import { AttendeesService } from './attendees.service';
import { JwtAuthStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Attendee.name, schema: AttendeeSchema }]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get<string>('JWT_SECRET') ?? 'dev_secret',
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AttendeesController],
  providers: [AttendeesService, JwtAuthStrategy, JwtAuthGuard],
  exports: [AttendeesService, JwtModule, JwtAuthGuard],
})
export class AttendeesModule {}
