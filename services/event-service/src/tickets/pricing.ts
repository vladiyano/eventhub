// The total for a number of tickets, in whole cents: 10% off from 5 tickets.
export const GROUP_SIZE = 5;
export const GROUP_DISCOUNT = 0.1;

export function ticketTotal(unitPrice: number, quantity: number): number {
  const cents = Math.round(unitPrice * 100) * quantity;
  const off = quantity >= GROUP_SIZE ? Math.round(cents * GROUP_DISCOUNT) : 0;
  return (cents - off) / 100;
}
