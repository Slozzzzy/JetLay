// src/lib/googleCalendar.ts
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;
const GOOGLE_ACCESS_TOKEN = process.env.GOOGLE_ACCESS_TOKEN;

export type MinimalDocument = {
  id: string;
  title: string;
  expiry_date: string | null;
  document_type: string;
};

function ensureConfig() {
  if (!GOOGLE_CALENDAR_ID || !GOOGLE_ACCESS_TOKEN) {
    console.warn('Google Calendar env vars not set; skipping calendar sync.');
    return false;
  }
  return true;
}

function getEndDate(expiryDate: string) {
  const d = new Date(expiryDate);
  d.setDate(d.getDate() + 1); // all-day event end date is next day
  return d.toISOString().split('T')[0];
}

export async function createCalendarEventForDocument(
  doc: MinimalDocument
): Promise<string | null> {
  if (!ensureConfig() || !doc.expiry_date) return null;

  const startDate = doc.expiry_date;
  const endDate = getEndDate(startDate);

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      GOOGLE_CALENDAR_ID!
    )}/events`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GOOGLE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: `${doc.document_type} expiry – ${doc.title}`,
        description: `JetLay document ID: ${doc.id}`,
        start: { date: startDate }, // all-day event
        end: { date: endDate },
      }),
    }
  );

  if (!res.ok) {
    console.error('Failed to create calendar event:', await res.text());
    return null;
  }

  const data = await res.json();
  return data.id as string;
}

export async function updateCalendarEventForDocument(
  eventId: string,
  doc: MinimalDocument
) {
  if (!ensureConfig() || !doc.expiry_date) return;

  const startDate = doc.expiry_date;
  const endDate = getEndDate(startDate);

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      GOOGLE_CALENDAR_ID!
    )}/events/${encodeURIComponent(eventId)}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${GOOGLE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: `${doc.document_type} expiry – ${doc.title}`,
        description: `JetLay document ID: ${doc.id}`,
        start: { date: startDate },
        end: { date: endDate },
      }),
    }
  );

  if (!res.ok) {
    console.error('Failed to update calendar event:', await res.text());
  }
}

export async function deleteCalendarEvent(eventId: string) {
  if (!ensureConfig()) return;

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      GOOGLE_CALENDAR_ID!
    )}/events/${encodeURIComponent(eventId)}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${GOOGLE_ACCESS_TOKEN}`,
      },
    }
  );

  if (!res.ok && res.status !== 404) {
    console.error('Failed to delete calendar event:', await res.text());
  }
}
