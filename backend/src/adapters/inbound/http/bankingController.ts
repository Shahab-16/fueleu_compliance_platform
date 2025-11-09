import express from "express";
import { BankRepositoryPrisma } from "../../outbound/prisma/BankRepositoryPrisma";
import { bankSurplus, applyBanked } from "../../../core/application/usecases/banking";

const bankRepo = new BankRepositoryPrisma();
export const bankingRouter = express.Router();

bankingRouter.get("/records", async (req, res) => {
  const { shipId, year } = req.query;
  if (!shipId || !year) return res.status(400).json({ error: "shipId and year required" });
  const total = await bankRepo.getBankedTotalForShip(String(shipId), Number(year));
  res.json({ shipId, year: Number(year), bankedGrams: total });
});

bankingRouter.post("/bank", async (req, res) => {
  const { shipId, year, amountGrams } = req.body;
  try {
    const entry = await bankSurplus(bankRepo, shipId, Number(year), Number(amountGrams));
    res.json({ data: entry });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

bankingRouter.post("/apply", async (req, res) => {
  const { shipId, year, amountGrams } = req.body;
  try {
    const entry = await applyBanked(bankRepo, shipId, Number(year), Number(amountGrams));
    res.json({ data: entry });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});
