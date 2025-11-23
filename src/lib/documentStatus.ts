// src/lib/documentStatus.ts

export type DocumentStatus = 'valid' | 'expiring' | 'expired';

const windows: Record<string, number> = {
  Passport: 180,          // 6 months
  Visa: 60,               // 2 months
  "ID Card": 90,          // 3 months
  "Travel Insurance": 14, // 2 weeks
  "Flight Ticket": 7,     // 1 week
  "Hotel Booking": 7,     // 1 week
};

// make YYYY-MM-DD safe for timezone
function parseLocalDate(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return null;
  const dt = new Date(y, m - 1, d);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

export function computeStatus(expiryDate: string | null, type: string): DocumentStatus {
  const exp = parseLocalDate(expiryDate);
  if (!exp) return 'valid';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  const window = windows[type] ?? 30; // default 30 days (fallback)

  if (diffDays < 0) return 'expired';
  if (diffDays <= window) return 'expiring';
  return 'valid';
}
