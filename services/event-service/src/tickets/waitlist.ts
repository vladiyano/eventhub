// A waitlist for a sold-out event: first come, first offered. An offer holds the free seat for 30 minutes.
export const OFFER_HOLD_MINUTES = 30;

export interface WaitlistEntry {
  attendeeId: string;
  joinedAt: number;
}

export interface SeatOffer {
  attendeeId: string;
  holdUntil: number;
}

export class Waitlist {
  private readonly entries: WaitlistEntry[] = [];

  /** Joins the waitlist (once per person) and answers the person's place in it, from 1. */
  join(attendeeId: string, now = Date.now()): number {
    if (!this.entries.some((e) => e.attendeeId === attendeeId)) {
      this.entries.push({ attendeeId, joinedAt: now });
    }
    return this.position(attendeeId);
  }

  leave(attendeeId: string): boolean {
    const index = this.entries.findIndex((e) => e.attendeeId === attendeeId);
    if (index < 0) return false;
    this.entries.splice(index, 1);
    return true;
  }

  /** The person's place in the waitlist, from 1, or 0 when they are not on it. */
  position(attendeeId: string): number {
    return this.entries.findIndex((e) => e.attendeeId === attendeeId) + 1;
  }

  /** A seat came free: the first person on the waitlist gets an offer that holds it for a while. */
  offerNext(now = Date.now()): SeatOffer | null {
    const next = this.entries.shift();
    return next ? { attendeeId: next.attendeeId, holdUntil: now + OFFER_HOLD_MINUTES * 60_000 } : null;
  }
}
