import { Route } from "../../domain/entities/Route";
import { TARGET_INTENSITY, ENERGY_FACTOR_MJ_PER_T } from "../../../shared/constants";

export interface ComputeCBResult {
  cbGrams: number;
  cbTonnes: number;
  energyMJ: number;
}

/**
 * Compute Compliance Balance (CB)
 */
export function computeCB(
  route: Pick<Route, "ghgIntensity" | "fuelConsumptionT">,
  options?: { targetIntensity?: number; energyFactorMJperT?: number }
): ComputeCBResult {
  const targetIntensity = options?.targetIntensity ?? TARGET_INTENSITY;
  const energyFactor = options?.energyFactorMJperT ?? ENERGY_FACTOR_MJ_PER_T;

  const actualIntensity = Number(route.ghgIntensity);
  const fuelT = Number(route.fuelConsumptionT);

  const energyMJ = fuelT * energyFactor;
  const cbGrams = (targetIntensity - actualIntensity) * energyMJ;
  const cbTonnes = cbGrams / 1_000_000;

  return {
    cbGrams,
    cbTonnes,
    energyMJ
  };
}
