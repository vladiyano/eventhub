import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AttendeesModule } from './attendees/attendees.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        uri:
          cfg.get<string>('MONGODB_URL') ??
          'mongodb://eventhub:eventhub_dev@localhost:27018/eventhub_attendees?authSource=admin',
      }),
    }),
    AuthModule,
    AttendeesModule,
  ],
})
export class AppModule {}
