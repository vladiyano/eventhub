import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

/**
 * Cross-service HTTP client.
 * Verifies an attendee exists by calling the attendee-service.
 * This is intentional: each service owns its own DB.
 */
@Injectable()
export class AttendeeClient {
  private readonly logger = new Logger(AttendeeClient.name);
  private readonly baseUrl: string;

  constructor(private readonly http: HttpService, cfg: ConfigService) {
    this.baseUrl =
      cfg.get<string>('ATTENDEE_SERVICE_URL') ?? 'http://localhost:4102';
  }

  async exists(attendeeId: string): Promise<boolean> {
    try {
      const res = await firstValueFrom(
        this.http.get<{ exists: boolean }>(
          `${this.baseUrl}/attendees/${attendeeId}/exists`,
        ),
      );
      return Boolean(res.data?.exists);
    } catch (err) {
      this.logger.warn(
        `attendee-service unreachable: ${(err as Error).message}`,
      );
      throw new ServiceUnavailableException('attendee-service unreachable');
    }
  }
}
