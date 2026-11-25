import { seatsLeft } from './capacity';

describe('seatsLeft', () => {
  it('shows the seats left with no note when plenty remain', () => {
    expect(seatsLeft(500, 120)).toEqual({ left: 380, note: null });
  });

  it('warns when an event is almost sold out', () => {
    expect(seatsLeft(500, 492)).toEqual({ left: 8, note: 'Only 8 seats left' });
  });

  it('says sold out when no seat is left', () => {
    expect(seatsLeft(200, 200)).toEqual({ left: 0, note: 'Sold out' });
  });
});
