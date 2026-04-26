import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Attendee, AttendeeDocument } from './attendee.schema';

const SALT_ROUNDS = 10;

@Injectable()
export class AttendeesService {
  constructor(
    @InjectModel(Attendee.name)
    private readonly model: Model<AttendeeDocument>,
  ) {}

  async register(input: {
    email: string;
    password: string;
    fullName: string;
  }): Promise<AttendeeDocument> {
    const existing = await this.model.findOne({ email: input.email }).lean();
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    return this.model.create({
      email: input.email,
      passwordHash,
      fullName: input.fullName,
    });
  }

  async verifyCredentials(
    email: string,
    password: string,
  ): Promise<AttendeeDocument> {
    const attendee = await this.model.findOne({ email });
    if (!attendee) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, attendee.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return attendee;
  }

  async getById(id: string): Promise<AttendeeDocument> {
    const attendee = await this.model.findById(id);
    if (!attendee) throw new NotFoundException(`Attendee ${id} not found`);
    return attendee;
  }

  async exists(id: string): Promise<boolean> {
    if (!/^[a-f\d]{24}$/i.test(id)) return false;
    const found = await this.model.exists({ _id: id });
    return Boolean(found);
  }

  async addRsvp(attendeeId: string, eventId: string): Promise<AttendeeDocument> {
    const updated = await this.model.findByIdAndUpdate(
      attendeeId,
      { $addToSet: { rsvpEventIds: eventId } },
      { new: true },
    );
    if (!updated) throw new NotFoundException(`Attendee ${attendeeId} not found`);
    return updated;
  }

  async listRsvps(attendeeId: string): Promise<string[]> {
    const a = await this.getById(attendeeId);
    return a.rsvpEventIds;
  }
}
