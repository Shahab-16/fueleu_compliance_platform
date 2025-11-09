import express from "express";
import { createPoolAllocation } from "../../../core/application/usecases/createPool";
import { PoolRepositoryPrisma } from "../../outbound/prisma/PoolRepositoryPrisma";

const poolRepo = new PoolRepositoryPrisma();
export const poolsRouter = express.Router();

poolsRouter.post("/", async (req, res) => {
  const { year, members } = req.body;
  if (!year || !members || !Array.isArray(members)) {
    return res.status(400).json({ error: "year and members[] required" });
  }
  try {
    const allocated = createPoolAllocation(members);
    const created = await poolRepo.createPool(Number(year), allocated);
    const responseMembers = allocated.map((m:any) => ({
      shipId: m.shipId,
      cbBeforeGrams: m.cbBeforeGrams,
      cbAfterGrams: m.cbAfterGrams
    }));
    res.json({ data: { poolId: created.id, members: responseMembers } });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});
