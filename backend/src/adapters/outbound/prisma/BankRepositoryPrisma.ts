import prisma from "../../../prismaClient";
const Decimal = require("decimal.js");


export class BankRepositoryPrisma {
  async addBankEntry(shipId: string, year: number, amountGrams: number) {
    const entry = await prisma.bankEntry.create({
      data: {
        shipId,
        year,
        amount: new Decimal(amountGrams)
      }
    });
    return entry;
  }

  async getBankedTotalForShip(shipId: string, year: number): Promise<number> {
    const rows = await prisma.bankEntry.findMany({ where: { shipId, year } });
    const total = rows.reduce((acc, r) => acc.plus(r.amount), new Decimal(0));
    return Number(total.toNumber());
  }
}
