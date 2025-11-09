import express from "express";
import { RouteRepositoryPrisma } from "../../outbound/prisma/RouteRepositoryPrisma";
import { computeCB } from "../../../core/application/usecases/computeCB";
import { TARGET_INTENSITY } from "../../../shared/constants";

const repo = new RouteRepositoryPrisma();
export const routeRouter = express.Router();

routeRouter.get("/", async (_req, res) => {
  const data = await repo.getAll();
  res.json({ data });
});

routeRouter.post("/:routeId/baseline", async (req, res) => {
  const { routeId } = req.params;
  try {
    const updated = await repo.setBaseline(routeId);
    res.json({ data: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

routeRouter.get("/comparison", async (_req, res) => {
  try {
    const baseline = await repo.getBaseline();
    if (!baseline) return res.status(404).json({ error: "baseline not set" });
    const all = await repo.getAll();
    const others = all.filter((r:any) => r.routeId !== baseline.routeId);
    const result = others.map((r:any) => {
      const percentDiff = ((r.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
      const compliant = r.ghgIntensity <= TARGET_INTENSITY;
      return {
        routeId: r.routeId,
        vesselType: r.vesselType,
        fuelType: r.fuelType,
        year: r.year,
        ghgIntensity: r.ghgIntensity,
        percentDiff,
        compliant
      };
    });
    res.json({ baseline: { routeId: baseline.routeId, ghgIntensity: baseline.ghgIntensity }, comparisons: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

routeRouter.get("/compute-cb", async (req, res) => {
  const { routeId } = req.query;
  try {
    if (routeId) {
      const r = await repo.findByRouteId(String(routeId));
      if (!r) return res.status(404).json({ error: "route not found" });
      const cb = computeCB(r);
      return res.json({ routeId: r.routeId, cb });
    } else {
      return res.status(400).json({ error: "routeId required" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
