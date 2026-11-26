export type SortDirection = "asc" | "desc";

export type SortValue = string | number;

// Ignores case and accents, and orders "Track 2" before "Track 10"
const collator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });

export function compareSortValues(a: SortValue, b: SortValue): number {
  if (typeof a === "string" && typeof b === "string") return collator.compare(a, b);
  return Number(a) - Number(b);
}

/** A sorted copy of the items, by the value `getValue` picks. Equal items keep their order */
export function sortBy<Item>(
  items: Item[],
  getValue: (item: Item) => SortValue,
  direction: SortDirection
): Item[] {
  const sign = direction === "asc" ? 1 : -1;
  return items.toSorted((a, b) => sign * compareSortValues(getValue(a), getValue(b)));
}
