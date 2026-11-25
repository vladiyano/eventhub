import { ticketTotal } from './pricing';

describe('ticketTotal', () => {
  it('four tickets cost four times the price', () => {
    expect(ticketTotal(35, 4)).toBe(140);
  });

  it('five tickets take 10% off', () => {
    expect(ticketTotal(35, 5)).toBe(157.5);
  });
});
