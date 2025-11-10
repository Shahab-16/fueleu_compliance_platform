// src/core/application/usecases/compute.ts
import { TARGET_INTENSITY, ENERGY_FACTOR_MJ_PER_T } from "../../../shared/constants";
import type { Route } from "../../domain/Route";

/**
 * Compute energy MJ and CB (grams) for a route.
 * CB = (Target - Actual) * EnergyMJ
 */
export function computeCBForRoute(route: Route): { energyMJ: number; cbGrams: number } {
  const fuel = route.fuelConsumption ?? route.fuelConsumptionT ?? 0;
  const energyMJ = fuel * ENERGY_FACTOR_MJ_PER_T;
  const diff = TARGET_INTENSITY - (route.ghgIntensity ?? 0);
  const cbGrams = diff * energyMJ;
  return { energyMJ, cbGrams };
}
