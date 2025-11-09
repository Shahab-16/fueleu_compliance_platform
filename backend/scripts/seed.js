
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function run() {
  console.log("Seeding DB (JS script)...");

  // delete in order to avoid FK issues (ignore errors)
  try { await prisma.poolMember.deleteMany(); } catch (e) { /* ignore */ }
  try { await prisma.pool.deleteMany(); } catch (e) { /* ignore */ }
  try { await prisma.bankEntry.deleteMany(); } catch (e) { /* ignore */ }
  try { await prisma.shipCompliance.deleteMany(); } catch (e) { /* ignore */ }
  try { await prisma.route.deleteMany(); } catch (e) { /* ignore */ }

  const seed = [
    { routeId: "R001", vesselType: "Container", fuelType: "HFO", year: 2024, ghgIntensity: 91.0, fuelConsumptionT: 5000, distanceKm: 12000, totalEmissionsT: 4500, isBaseline: true },
    { routeId: "R002", vesselType: "BulkCarrier", fuelType: "LNG", year: 2024, ghgIntensity: 88.0, fuelConsumptionT: 4800, distanceKm: 11500, totalEmissionsT: 4200, isBaseline: false },
    { routeId: "R003", vesselType: "Tanker", fuelType: "MGO", year: 2024, ghgIntensity: 93.5, fuelConsumptionT: 5100, distanceKm: 12500, totalEmissionsT: 4700, isBaseline: false },
    { routeId: "R004", vesselType: "RoRo", fuelType: "HFO", year: 2025, ghgIntensity: 89.2, fuelConsumptionT: 4900, distanceKm: 11800, totalEmissionsT: 4300, isBaseline: false },
    { routeId: "R005", vesselType: "Container", fuelType: "LNG", year: 2025, ghgIntensity: 90.5, fuelConsumptionT: 4950, distanceKm: 11900, totalEmissionsT: 4400, isBaseline: false }
  ];

  for (const r of seed) {
    await prisma.route.create({ data: r });
    console.log("Inserted", r.routeId);
  }

  console.log("Seed completed.");
  await prisma.$disconnect();
}

run().catch((e) => {
  console.error("Seed error:", e);
  prisma.$disconnect().finally(() => process.exit(1));
});
