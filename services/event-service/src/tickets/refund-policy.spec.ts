import { canRefund } from './refund-policy';

describe('canRefund', () => {
  const startsAt = new Date('2026-12-10T20:00:00Z');

  it('allows a refund three days before the event', () => {
    expect(canRefund(startsAt, new Date('2026-12-07T20:00:00Z'))).toBe(true);
  });

  it('allows a refund exactly 48 hours before', () => {
    expect(canRefund(startsAt, new Date('2026-12-08T20:00:00Z'))).toBe(true);
  });

  it('refuses a refund one hour before the event', () => {
    expect(canRefund(startsAt, new Date('2026-12-10T19:00:00Z'))).toBe(false);
  });
});
