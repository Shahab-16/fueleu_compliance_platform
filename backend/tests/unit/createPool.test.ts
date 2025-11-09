import { createPoolAllocation } from "../../src/core/application/usecases/createPool";

describe("createPoolAllocation", () => {
  it("allocates surplus to deficits correctly (valid pool)", () => {
    const members = [
      { shipId: "A", cbBeforeGrams: 500000000 }, // +500 t (grams)
      { shipId: "B", cbBeforeGrams: -200000000 }, // -200 t
      { shipId: "C", cbBeforeGrams: -100000000 } // -100 t
    ];
    const res = createPoolAllocation(members);
    const a = res.find((r) => r.shipId === "A")!;
    const b = res.find((r) => r.shipId === "B")!;
    const c = res.find((r) => r.shipId === "C")!;
    expect(a.cbAfterGrams).toBeGreaterThanOrEqual(0);
    expect(b.cbAfterGrams).toBe(0);
    expect(c.cbAfterGrams).toBe(0);
  });

  it("throws when total pool is negative", () => {
    const members = [
      { shipId: "A", cbBeforeGrams: 100000000 }, // +100 t
      { shipId: "B", cbBeforeGrams: -300000000 } // -300 t
    ];
    expect(() => createPoolAllocation(members)).toThrow();
  });
});
