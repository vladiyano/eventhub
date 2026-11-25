// Ticket transfer: the holder sends a confirmed ticket to a friend's email, up to 24 hours before the event.
export const TRANSFER_CLOSES_HOURS = 24;

export interface TransferableTicket {
  id: string;
  attendeeId: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'CHECKED_IN';
}

export function transferTicket(
  ticket: TransferableTicket,
  fromAttendeeId: string,
  toEmail: string,
  eventStartsAt: Date,
  now: Date = new Date(),
): { ticketId: string; toEmail: string } {
  if (ticket.attendeeId !== fromAttendeeId) throw new Error('Only the ticket holder can send it');
  if (ticket.status !== 'CONFIRMED') throw new Error('Only a confirmed ticket can be sent');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(toEmail)) throw new Error('The email address is not valid');
  if (eventStartsAt.getTime() - now.getTime() < TRANSFER_CLOSES_HOURS * 3_600_000) {
    throw new Error('Tickets can be sent until 24 hours before the event');
  }
  return { ticketId: ticket.id, toEmail: toEmail.trim().toLowerCase() };
}
