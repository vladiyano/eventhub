import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

/**
 * Thin wrapper over ioredis that exposes a SETNX-based distributed lock.
 * Used by the ticket reservation flow to avoid double-booking the same seat.
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client!: Redis;

  constructor(private readonly cfg: ConfigService) {}

  onModuleInit(): void {
    const url = this.cfg.get<string>('REDIS_URL') ?? 'redis://localhost:6390';
    this.client = new Redis(url, { lazyConnect: false, maxRetriesPerRequest: 2 });
    this.client.on('error', (err) => this.logger.error(`redis error: ${err.message}`));
  }

  async onModuleDestroy(): Promise<void> {
    await this.client?.quit();
  }

  /** Acquire a lock for `ttlMs`. Returns true if acquired. */
  async acquireLock(key: string, ttlMs = 5000): Promise<boolean> {
    const res = await this.client.set(`lock:${key}`, '1', 'PX', ttlMs, 'NX');
    return res === 'OK';
  }

  async releaseLock(key: string): Promise<void> {
    await this.client.del(`lock:${key}`);
  }
}
