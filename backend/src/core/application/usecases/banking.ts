const Decimal = require("decimal.js");

export async function bankSurplus(bankRepo: any, shipId: string, year: number, amountGrams: number) {
  if (amountGrams <= 0) throw new Error("Only positive CB can be banked");
  const entry = await bankRepo.addBankEntry(shipId, year, amountGrams);
  return entry;
}

export async function applyBanked(bankRepo: any, shipId: string, year: number, amountGrams: number) {
  if (amountGrams <= 0) throw new Error("Apply amount must be positive");
  const available = await bankRepo.getBankedTotalForShip(shipId, year);
  const availDec = new Decimal(available);
  const reqDec = new Decimal(amountGrams);
  if (reqDec.gt(availDec)) {
    throw new Error("Requested apply amount exceeds available banked credits");
  }
  const entry = await bankRepo.addBankEntry(shipId, year, -amountGrams);
  return entry;
}
