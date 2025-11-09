import prisma from "../../../prismaClient";
import { Route } from "../../../core/domain/entities/Route";

export class RouteRepositoryPrisma {
  async getAll(): Promise<Route[]> {
    const rows = await prisma.route.findMany({ orderBy: { routeId: "asc" } });
    return rows.map((r:any) => ({
      id: r.id,
      routeId: r.routeId,
      vesselType: r.vesselType,
      fuelType: r.fuelType,
      year: r.year,
      ghgIntensity: Number(r.ghgIntensity),
      fuelConsumptionT: Number(r.fuelConsumptionT),
      distanceKm: r.distanceKm ?? undefined,
      totalEmissionsT: r.totalEmissionsT ?? undefined,
      isBaseline: r.isBaseline,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString()
    }));
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    const r = await prisma.route.findUnique({ where: { routeId } });
    if (!r) return null;
    return {
      id: r.id,
      routeId: r.routeId,
      vesselType: r.vesselType,
      fuelType: r.fuelType,
      year: r.year,
      ghgIntensity: Number(r.ghgIntensity),
      fuelConsumptionT: Number(r.fuelConsumptionT),
      distanceKm: r.distanceKm ?? undefined,
      totalEmissionsT: r.totalEmissionsT ?? undefined,
      isBaseline: r.isBaseline,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString()
    };
  }

  async setBaseline(routeId: string) {
    await prisma.route.updateMany({ where: { isBaseline: true }, data: { isBaseline: false } });
    const updated = await prisma.route.update({
      where: { routeId },
      data: { isBaseline: true }
    });
    return updated;
  }

  async getBaseline(): Promise<Route | null> {
    const r = await prisma.route.findFirst({ where: { isBaseline: true } });
    if (!r) return null;
    return {
      id: r.id,
      routeId: r.routeId,
      vesselType: r.vesselType,
      fuelType: r.fuelType,
      year: r.year,
      ghgIntensity: Number(r.ghgIntensity),
      fuelConsumptionT: Number(r.fuelConsumptionT),
      distanceKm: r.distanceKm ?? undefined,
      totalEmissionsT: r.totalEmissionsT ?? undefined,
      isBaseline: r.isBaseline,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString()
    };
  }

  async getByYear(year: number): Promise<Route[]> {
    const rows = await prisma.route.findMany({ where: { year } });
    return rows.map((r:any) => ({
      id: r.id,
      routeId: r.routeId,
      vesselType: r.vesselType,
      fuelType: r.fuelType,
      year: r.year,
      ghgIntensity: Number(r.ghgIntensity),
      fuelConsumptionT: Number(r.fuelConsumptionT),
      distanceKm: r.distanceKm ?? undefined,
      totalEmissionsT: r.totalEmissionsT ?? undefined,
      isBaseline: r.isBaseline,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString()
    }));
  }
}
