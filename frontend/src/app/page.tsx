import { api } from '@/lib/api';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let events: Awaited<ReturnType<typeof api.listEvents>> = [];
  let error: string | null = null;

  try {
    events = await api.listEvents();
  } catch (err) {
    error = (err as Error).message;
  }

  return (
    <section>
      <h1>Upcoming events</h1>
      {error && (
        <p className="error">
          Could not reach event-service: {error}. Did you run <code>npm run dev</code>?
        </p>
      )}
      {events.length === 0 && !error && <p>No events yet. Run <code>npm run seed</code>.</p>}
      {events.map((e) => (
        <article key={e.id} className="card">
          <h2>{e.title}</h2>
          <p className="meta">
            {new Date(e.startsAt).toLocaleString()} · {e.venue} · capacity {e.capacity}
          </p>
          <p>{e.description}</p>
          <Link href={`/events/${e.id}`} className="button">View &amp; reserve</Link>
        </article>
      ))}
    </section>
  );
}
