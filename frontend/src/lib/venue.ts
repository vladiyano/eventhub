// A map link for an event's venue, so people find the place.
export function venueMapLink(venue: string): string {
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(venue.trim())}`;
}
