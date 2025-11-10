// src/adapters/inbound/http/complianceController.ts
import express from "express";
import prisma from "../../../prismaClient";
import { TARGET_INTENSITY } from "../../../shared/constants";

export const complianceRouter = express.Router();

/**
 * Helpers
 */
const ENERGY_FACTOR_MJ_PER_T = 41000; // MJ per tonne

function toNumber(n: any, fallback = 0): number {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}

function computeRouteCBGrams(row: any): number {
  const fuelT = toNumber(row.fuelConsumption) || toNumber(row.fuelConsumptionT) || 0;
  const ghg = toNumber(row.ghgIntensity);
  const energyMJ = fuelT * ENERGY_FACTOR_MJ_PER_T;
  const diff = TARGET_INTENSITY - ghg; // gCO2e / MJ
  return diff * energyMJ; // grams
}

/**
 * GET /compliance/cb?year=YYYY[&shipId=ROUTE_ID]
 */
complianceRouter.get("/cb", async (req, res) => {
  try {
    const yearStr = String(req.query.year ?? "");
    if (!yearStr) return res.status(400).json({ error: "year is required" });
    const year = Number(yearStr);
    const shipId = req.query.shipId ? String(req.query.shipId) : null;

    const where: any = { year };
    if (shipId) where.routeId = shipId;

    const routes = await prisma.route.findMany({ where });

    if (!routes || routes.length === 0) {
      return res.status(404).json({ error: "no routes for given criteria", year, shipId });
    }

    const cbSum = routes.reduce((acc, r) => acc + computeRouteCBGrams(r), 0);

    // Placeholder for applied/banked values (requires bank repo wiring)
    const result = {
      year,
      shipId: shipId ?? undefined,
      cb_before: cbSum,
      applied: 0,
      cb_after: cbSum,
    };

    return res.json(result);
  } catch (err: any) {
    console.error("compliance/cb error:", err);
    return res.status(500).json({ error: err.message ?? "internal error" });
  }
});

/**
 * GET /compliance/adjusted-cb?year=YYYY
 * returns per-ship CBs as [{ shipId, cb_before, cb_after }]
 */
complianceRouter.get("/adjusted-cb", async (req, res) => {
  try {
    const yearStr = String(req.query.year ?? "");
    if (!yearStr) return res.status(400).json({ error: "year is required" });
    const year = Number(yearStr);

    const routes = await prisma.route.findMany({ where: { year } });
    if (!routes || routes.length === 0) {
      return res.status(404).json({ error: "no routes for given year", year });
    }

    const members = routes.map((r) => {
      const cb = computeRouteCBGrams(r);
      return {
        shipId: r.routeId,
        cb_before: cb,
        cb_after: cb, // placeholder until bank/applied logic integrated
      };
    });

    return res.json(members);
  } catch (err: any) {
    console.error("compliance/adjusted-cb error:", err);
    return res.status(500).json({ error: err.message ?? "internal error" });
  }
});
