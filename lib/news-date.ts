const SHANGHAI_TIME_ZONE = "Asia/Shanghai";

const shanghaiDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: SHANGHAI_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function isValidDate(value: string | Date): boolean {
  return !Number.isNaN(new Date(value).getTime());
}

export function toIsoString(value: string | Date): string | null {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function getShanghaiDate(value: string | Date): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new TypeError("Expected a valid date");
  }

  const parts = shanghaiDateFormatter.formatToParts(date);
  const values: Record<string, string> = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}
