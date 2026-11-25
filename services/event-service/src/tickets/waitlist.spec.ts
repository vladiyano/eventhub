import { Waitlist, OFFER_HOLD_MINUTES } from './waitlist';

describe('Waitlist', () => {
  it('gives each person a place in order', () => {
    const w = new Waitlist();
    expect(w.join('ann')).toBe(1);
    expect(w.join('ben')).toBe(2);
    expect(w.join('ann')).toBe(1);
  });

  it('offers the next free seat to the first person, held for 30 minutes', () => {
    const w = new Waitlist();
    w.join('ann');
    w.join('ben');
    expect(w.offerNext(1_000)).toEqual({ attendeeId: 'ann', holdUntil: 1_000 + OFFER_HOLD_MINUTES * 60_000 });
    expect(w.position('ben')).toBe(1);
  });

  it('has no offer when nobody waits', () => {
    expect(new Waitlist().offerNext()).toBeNull();
  });

  it('lets a person leave the waitlist', () => {
    const w = new Waitlist();
    w.join('ann');
    expect(w.leave('ann')).toBe(true);
    expect(w.position('ann')).toBe(0);
  });
});
