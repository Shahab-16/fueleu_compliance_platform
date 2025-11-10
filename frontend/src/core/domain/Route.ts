// frontend/src/core/domain/Route.ts
export type Route = {
  id?: number;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumptionT?: number;
  fuelConsumption?: number;
  distanceKm?: number;
  distance?: number;
  totalEmissionsT?: number;
  totalEmissions?: number;
  isBaseline?: boolean;
};
