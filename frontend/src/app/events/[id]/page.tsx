'use client';

import { useEffect, useState } from 'react';
import { api, type Availability, type EventDto } from '@/lib/api';
import { loadSession } from '@/lib/session';

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<EventDto | null>(null);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [seat, setSeat] = useState('A-1');
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const [e, a] = await Promise.all([
      api.getEvent(params.id),
      api.availability(params.id),
    ]);
    setEvent(e);
    setAvailability(a);
  }

  useEffect(() => {
    refresh().catch((ex) => setErr((ex as Error).message));
  }, [params.id]);

  async function reserve() {
    setBusy(true);
    setErr(null);
    setMsg(null);
    const session = loadSession();
    if (!session) {
      setErr('Please login first.');
      setBusy(false);
      return;
    }
    try {
      await api.reserve(session.token, params.id, seat);
      setMsg(`Reserved seat ${seat} for ${session.attendee.fullName}`);
      await refresh();
    } catch (ex) {
      setErr((ex as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (err && !event) return <p className="error">{err}</p>;
  if (!event || !availability) return <p>Loading...</p>;

  return (
    <section>
      <h1>{event.title}</h1>
      <p className="meta">
        {new Date(event.startsAt).toLocaleString()} · {event.venue}
      </p>
      <p>{event.description}</p>

      <div className="card">
        <h2>Availability</h2>
        <p>
          {availability.remaining} / {availability.total} seats remaining
        </p>

        <label htmlFor="seat">Seat label</label>
        <input
          id="seat"
          value={seat}
          onChange={(e) => setSeat(e.target.value)}
          style={{ padding: '.5rem', marginRight: '.5rem' }}
        />
        <button
          className="button"
          onClick={reserve}
          disabled={busy || availability.remaining <= 0}
        >
          {availability.remaining <= 0 ? 'Sold out' : busy ? '...' : 'Reserve'}
        </button>

        {msg && <p className="success">{msg}</p>}
        {err && <p className="error">{err}</p>}
      </div>
    </section>
  );
}
