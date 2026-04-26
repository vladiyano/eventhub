import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AttendeesModule } from '../attendees/attendees.module';

@Module({
  imports: [AttendeesModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
