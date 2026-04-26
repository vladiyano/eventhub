import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AttendeesService } from '../attendees/attendees.service';

describe('AuthService', () => {
  let service: AuthService;

  const attendeeDoc = {
    _id: { toString: () => 'attendee-1' },
    email: 'alice@example.com',
    fullName: 'Alice',
  };
  const attendeesMock = {
    register: jest.fn().mockResolvedValue(attendeeDoc),
    verifyCredentials: jest.fn().mockResolvedValue(attendeeDoc),
  };
  const jwtMock = { sign: jest.fn().mockReturnValue('jwt-token') };

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AttendeesService, useValue: attendeesMock },
        { provide: JwtService, useValue: jwtMock },
      ],
    }).compile();
    service = mod.get(AuthService);
  });

  it('login() returns a token and the attendee profile', async () => {
    const result = await service.login({
      email: 'alice@example.com',
      password: 'pw-12345678',
    });
    expect(result.token).toBe('jwt-token');
    expect(result.attendee).toEqual({
      id: 'attendee-1',
      email: 'alice@example.com',
      fullName: 'Alice',
    });
  });
});
