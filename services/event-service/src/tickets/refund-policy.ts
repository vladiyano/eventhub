// Refunds close 48 hours before the event starts.
export const REFUND_CLOSES_HOURS = 48;

export function canRefund(eventStartsAt: Date, now: Date = new Date()): boolean {
  return eventStartsAt.getTime() - now.getTime() >= REFUND_CLOSES_HOURS * 3_600_000;
}
