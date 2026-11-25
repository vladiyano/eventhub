import { searchEvents, ListedEvent } from './search';

describe('searchEvents', () => {
  const now = new Date('2026-12-01T10:00:00Z');
  const events: ListedEvent[] = [
    { title: 'Jazz on the Roof', city: 'Haifa', startsAt: new Date('2026-12-12T19:00:00Z') },
    { title: 'Winter Jazz Night', city: 'Tel Aviv', startsAt: new Date('2026-12-05T20:00:00Z') },
    { title: 'Autumn Jazz', city: 'Tel Aviv', startsAt: new Date('2026-11-20T20:00:00Z') },
  ];

  it('finds upcoming events in a city', () => {
    expect(searchEvents(events, 'tel aviv', now).map((e) => e.title)).toEqual(['Winter Jazz Night']);
  });

  it('finds events by words in the title, soonest first', () => {
    expect(searchEvents(events, 'jazz', now).map((e) => e.title)).toEqual(['Winter Jazz Night', 'Jazz on the Roof']);
  });

  it('finds nothing for an empty search', () => {
    expect(searchEvents(events, '  ', now)).toEqual([]);
  });
});
