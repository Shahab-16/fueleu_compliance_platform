// src/adapters/inbound/http/poolsController.ts
import express from "express";
import { createPoolAllocation } from "../../../core/application/usecases/createPool";
import { PoolRepositoryPrisma } from "../../outbound/prisma/PoolRepositoryPrisma";
import { RouteRepositoryPrisma } from "../../outbound/prisma/RouteRepositoryPrisma";
import { computeCB } from "../../../core/application/usecases/computeCB";

const poolRepo = new PoolRepositoryPrisma();
const routeRepo = new RouteRepositoryPrisma();
export const poolsRouter = express.Router();

/**
 * POST /pools
 * body: { year: number, members: ["R001", "R002", ...] }
 */
poolsRouter.post("/", async (req, res) => {
  const { year, members } = req.body;
  if (!year || !members || !Array.isArray(members)) {
    return res.status(400).json({ error: "year and members[] required" });
  }

  try {
    // Resolve each route -> compute CB (grams)
    const resolved: Array<{ shipId: string; cbBeforeGrams: number }> = [];

    for (const m of members) {
      const route = await routeRepo.findByRouteId(String(m));
      if (!route) return res.status(404).json({ error: `route not found: ${m}` });

      // computeCB may return a number (grams) or object — normalize
      const cbResult = computeCB(route);
      const cbGrams =
        typeof cbResult === "number"
          ? cbResult
          : (cbResult && (cbResult.cbGrams ?? cbResult.cb ?? 0)) ?? 0;

      resolved.push({ shipId: route.routeId, cbBeforeGrams: Number(cbGrams) });
    }

    // Validate pool sum >= 0
    const total = resolved.reduce((s, r) => s + Number(r.cbBeforeGrams || 0), 0);
    if (total < 0) {
      return res.status(400).json({
        error: "pool sum negative",
        detail: `Sum of cb_before for selected members is ${total} grams. Pool requires non-negative total.`,
      });
    }

    // Prepare allocation input for use-case
    const allocationInput = resolved.map((r) => ({
      shipId: r.shipId,
      cbBeforeGrams: r.cbBeforeGrams,
      cbAfterGrams: r.cbBeforeGrams, // placeholder; allocator will change cbAfterGrams
    }));

    // Run allocation (pure function)
    const allocated = createPoolAllocation(allocationInput);

    // Persist pool and members
    const created = await poolRepo.createPool(Number(year), allocated);

    const responseMembers = allocated.map((m: any) => ({
      shipId: m.shipId,
      cbBeforeGrams: m.cbBeforeGrams,
      cbAfterGrams: m.cbAfterGrams,
    }));

    return res.json({
      data: { poolId: created.id, year: Number(year), members: responseMembers, sumBefore: total },
    });
  } catch (err: any) {
    console.error("pools POST error:", err);
    return res.status(400).json({ error: err.message ?? "invalid pool request" });
  }
});
