import { checkTicketCode, ticketCode } from './ticket-code';

describe('ticket codes', () => {
  const secret = 'door-scanner-test-secret';

  it('a genuine code gives back its ticket id', () => {
    expect(checkTicketCode(ticketCode('t-1042', secret), secret)).toBe('t-1042');
  });

  it('an edited code is refused', () => {
    const code = ticketCode('t-1042', secret).replace('t-1042', 't-1043');
    expect(checkTicketCode(code, secret)).toBeNull();
  });

  it('a ticket id with a dot still checks', () => {
    expect(checkTicketCode(ticketCode('evt.7.t-1042', secret), secret)).toBe('evt.7.t-1042');
  });
});
