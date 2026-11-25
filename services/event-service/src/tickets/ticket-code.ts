import { createHmac, timingSafeEqual } from 'crypto';

// Every ticket carries a signed code: the ticket id, a dot, and a signature the door scanner checks.
export function ticketCode(ticketId: string, secret: string): string {
  const signature = createHmac('sha256', secret).update(ticketId).digest('base64url').slice(0, 16);
  return `${ticketId}.${signature}`;
}

/** The ticket id when the code is genuine, or null for a copied or edited code. */
export function checkTicketCode(code: string, secret: string): string | null {
  const dot = code.indexOf('.');
  if (dot < 1) return null;
  const ticketId = code.slice(0, dot);
  const expected = Buffer.from(ticketCode(ticketId, secret));
  const given = Buffer.from(code);
  return expected.length === given.length && timingSafeEqual(expected, given) ? ticketId : null;
}
