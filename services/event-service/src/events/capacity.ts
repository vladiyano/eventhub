// Seats left on the event page: the number, and a short note when an event is almost sold out.
export function seatsLeft(capacity: number, sold: number): { left: number; note: string | null } {
  const left = Math.max(capacity - sold, 0);
  if (left === 0) return { left, note: 'Sold out' };
  if (left <= Math.max(10, Math.ceil(capacity * 0.05))) return { left, note: `Only ${left} seats left` };
  return { left, note: null };
}
