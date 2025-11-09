export interface Route {
  id: string;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;     // gCO2e / MJ
  fuelConsumptionT: number; // tonnes
  distanceKm?: number;
  totalEmissionsT?: number;
  isBaseline?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
