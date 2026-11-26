import { sortBy } from "./sorting";

describe("sortBy", () => {
  it("sorts text ignoring case and accents", () => {
    const sorted = sortBy(["été", "Bravo", "alpha"], (word) => word, "asc");
    expect(sorted).toEqual(["alpha", "Bravo", "été"]);
  });

  it("orders numbers inside text naturally", () => {
    const sorted = sortBy(["Track 10", "Track 2", "Track 1"], (title) => title, "asc");
    expect(sorted).toEqual(["Track 1", "Track 2", "Track 10"]);
  });

  it("sorts numbers, in both directions", () => {
    expect(sortBy([3, 1, 2], (n) => n, "asc")).toEqual([1, 2, 3]);
    expect(sortBy([3, 1, 2], (n) => n, "desc")).toEqual([3, 2, 1]);
  });

  it("keeps the original order of equal items", () => {
    const items = [
      { name: "b", order: 1 },
      { name: "a", order: 2 },
      { name: "b", order: 3 }
    ];
    const sorted = sortBy(items, (item) => item.name, "asc");
    expect(sorted.map((item) => item.order)).toEqual([2, 1, 3]);
  });

  it("returns a copy, without changing the original list", () => {
    const items = [2, 1];
    sortBy(items, (n) => n, "asc");
    expect(items).toEqual([2, 1]);
  });
});
