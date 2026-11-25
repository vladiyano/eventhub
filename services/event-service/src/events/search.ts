// Event search: upcoming events in a city, or with the words in their title, soonest first.
export interface ListedEvent {
  title: string;
  city: string;
  startsAt: Date;
}

export function searchEvents(events: ListedEvent[], query: string, now: Date = new Date()): ListedEvent[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return events
    .filter((e) => e.startsAt.getTime() >= now.getTime())
    .filter((e) => e.city.toLowerCase() === q || e.title.toLowerCase().includes(q))
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
}
