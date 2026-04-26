export interface EventDto {
  id: string;
  title: string;
  description: string;
  venue: string;
  startsAt: string;
  capacity: number;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
}

export interface Availability {
  remaining: number;
  total: number;
}

export interface AuthResult {
  token: string;
  attendee: { id: string; email: string; fullName: string };
}

const eventBase = process.env.NEXT_PUBLIC_EVENT_API ?? 'http://localhost:4101';
const attendeeBase = process.env.NEXT_PUBLIC_ATTENDEE_API ?? 'http://localhost:4102';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  listEvents: (): Promise<EventDto[]> => request(`${eventBase}/events`),
  getEvent: (id: string): Promise<EventDto> => request(`${eventBase}/events/${id}`),
  availability: (id: string): Promise<Availability> =>
    request(`${eventBase}/tickets/availability/${id}`),

  reserve: (token: string, eventId: string, seatLabel: string) =>
    request(`${eventBase}/tickets/reserve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ eventId, seatLabel }),
    }),

  login: (email: string, password: string): Promise<AuthResult> =>
    request(`${attendeeBase}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (
    email: string,
    password: string,
    fullName: string,
  ): Promise<AuthResult> =>
    request(`${attendeeBase}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    }),
};
