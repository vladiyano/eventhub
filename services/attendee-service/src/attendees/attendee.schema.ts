import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AttendeeDocument = Attendee & Document;

@Schema({ collection: 'attendees', timestamps: true })
export class Attendee {
  _id!: Types.ObjectId;

  @Prop({ required: true, unique: true, index: true })
  email!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ required: true })
  fullName!: string;

  @Prop({ type: [String], default: [] })
  rsvpEventIds!: string[];
}

export const AttendeeSchema = SchemaFactory.createForClass(Attendee);
