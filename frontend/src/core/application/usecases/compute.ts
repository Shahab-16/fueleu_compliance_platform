// frontend/src/core/application/usecases/compute.ts
import type { Route } from "../../domain/Route";

/*
  Local compute helper matching backend formula:
  - TARGET_INTENSITY: 89.3368 gCO2e/MJ
  - ENERGY_FACTOR: fuelConsumption (t) * 41000 MJ/t
  - CB (grams) = (Target - Actual) * Energy_in_scope * 1000 (to convert to grams? careful)
  We'll compute CB in grams:
    Energy (MJ) = fuelConsumption_t * 41000
    CB (gCO2e) = (Target_gCO2e_per_MJ - Actual_gCO2e_per_MJ) * Energy(MJ)
*/

export const TARGET_INTENSITY = 89.3368;
export const ENERGY_FACTOR_MJ_PER_T = 41000;

export function computeCBForRoute(r: Route) {
  const fuelT = r.fuelConsumption ?? r.fuelConsumptionT ?? 0;
  const actual = r.ghgIntensity ?? 0;
  const energyMJ = fuelT * ENERGY_FACTOR_MJ_PER_T;
  // CB in grams:
  const cbGrams = (TARGET_INTENSITY - actual) * energyMJ;
  // return numeric plus sign (positive surplus, negative deficit)
  return { cbGrams, cbTonnes: cbGrams / 1_000_000 };
}

