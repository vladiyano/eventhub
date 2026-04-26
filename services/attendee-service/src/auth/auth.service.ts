import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AttendeesService } from '../attendees/attendees.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export interface AuthResult {
  token: string;
  attendee: { id: string; email: string; fullName: string };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly attendees: AttendeesService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const created = await this.attendees.register(dto);
    return this.toAuthResult(created._id.toString(), created.email, created.fullName);
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const a = await this.attendees.verifyCredentials(dto.email, dto.password);
    return this.toAuthResult(a._id.toString(), a.email, a.fullName);
  }

  private toAuthResult(id: string, email: string, fullName: string): AuthResult {
    const token = this.jwt.sign({ sub: id, email });
    return { token, attendee: { id, email, fullName } };
  }
}
