const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** "2025-06" -> "Jun 2025". Returns the input unchanged if it isn't ISO YYYY-MM. */
export function formatMonth(iso: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const [, year, month] = match;
  const name = MONTHS[Number(month) - 1];
  return name ? `${name} ${year}` : iso;
}

/** "2025-06" + "present" -> "Jun 2025 — Present". */
export function formatDateRange(start: string, end: string): string {
  const to = end === "present" ? "Present" : formatMonth(end);
  return `${formatMonth(start)} — ${to}`;
}

/** Machine-readable duration for <time datetime>. */
export function toDateTimeAttr(iso: string): string {
  return iso === "present" ? new Date().toISOString().slice(0, 7) : iso;
}
