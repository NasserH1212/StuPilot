export interface LocalDateTimeComponents {
  readonly year: number;
  readonly month: number; // 1-12
  readonly day: number;
  readonly hour: number;
  readonly minute: number;
}

function offsetMillisAt(timeZone: string, instantMs: number): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const lookup: Record<string, string> = {};
  for (const part of formatter.formatToParts(new Date(instantMs))) {
    if (part.type !== "literal") lookup[part.type] = part.value;
  }

  const asUtc = Date.UTC(
    Number(lookup.year),
    Number(lookup.month) - 1,
    Number(lookup.day),
    Number(lookup.hour) % 24, // some engines format midnight as "24"
    Number(lookup.minute),
    Number(lookup.second),
  );

  return asUtc - instantMs;
}

/**
 * Converts a local wall-clock date/time in the given IANA time zone to the
 * UTC instant it represents, using only `Intl.DateTimeFormat` (no date
 * library). Standard "guess, then correct" method: treat the components as
 * UTC to get a first estimate of the zone's offset, then re-check the
 * offset at the corrected instant in case the guess crossed a DST
 * transition, applying at most one correction.
 *
 * Convention for the two DST edge cases a single correction can't resolve
 * perfectly:
 * - A nonexistent local time (spring-forward gap) resolves using the offset
 *   that applies after the gap.
 * - An ambiguous local time (fall-back overlap) resolves using the offset
 *   determined by the initial guess.
 * Asia/Riyadh — this app's primary time zone — has not observed DST since
 * the 1980s, so neither edge case arises for it in practice.
 */
export function zonedTimeToUtc(
  components: LocalDateTimeComponents,
  timeZone: string,
): Date {
  const guessMs = Date.UTC(
    components.year,
    components.month - 1,
    components.day,
    components.hour,
    components.minute,
    0,
  );

  const firstOffset = offsetMillisAt(timeZone, guessMs);
  const correctedMs = guessMs - firstOffset;
  const secondOffset = offsetMillisAt(timeZone, correctedMs);

  return secondOffset === firstOffset
    ? new Date(correctedMs)
    : new Date(guessMs - secondOffset);
}
