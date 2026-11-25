import { transferTicket, TransferableTicket } from './transfer';

describe('transferTicket', () => {
  const ticket: TransferableTicket = { id: 't-1042', attendeeId: 'ann', status: 'CONFIRMED' };
  const startsAt = new Date('2026-12-10T20:00:00Z');
  const now = new Date('2026-12-05T10:00:00Z');

  it('sends a confirmed ticket to a friend', () => {
    expect(transferTicket(ticket, 'ann', 'Ben@Example.com', startsAt, now)).toEqual({ ticketId: 't-1042', toEmail: 'ben@example.com' });
  });

  it('refuses when someone else holds the ticket', () => {
    expect(() => transferTicket(ticket, 'ben', 'ben@example.com', startsAt, now)).toThrow('Only the ticket holder');
  });

  it('refuses on the day of the event', () => {
    expect(() => transferTicket(ticket, 'ann', 'ben@example.com', startsAt, new Date('2026-12-10T09:00:00Z'))).toThrow('24 hours');
  });
});
