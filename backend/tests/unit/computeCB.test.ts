import { computeCB } from "../../src/core/application/usecases/computeCB";

describe("computeCB", () => {
  it("returns zero CB for route with intensity equal to target", () => {
    const route = {
      ghgIntensity: 89.3368,
      fuelConsumptionT: 1000
    };
    const res = computeCB(route);
    expect(Math.abs(res.cbGrams)).toBeLessThan(1e-6);
    expect(Math.abs(res.cbTonnes)).toBeLessThan(1e-9);
  });

  it("computes positive CB (surplus) when actual < target", () => {
    const route = {
      ghgIntensity: 88.0,
      fuelConsumptionT: 4800
    };
    const res = computeCB(route);
    expect(res.cbTonnes).toBeGreaterThan(0);
    // approximate check
    expect(Math.abs(res.cbGrams - 263082240)).toBeLessThan(2000);
  });

  it("computes negative CB (deficit) when actual > target", () => {
    const route = {
      ghgIntensity: 93.5,
      fuelConsumptionT: 5100
    };
    const res = computeCB(route);
    expect(res.cbTonnes).toBeLessThan(0);
    expect(Math.abs(res.cbGrams + 870525120)).toBeLessThan(10000);
  });
});
