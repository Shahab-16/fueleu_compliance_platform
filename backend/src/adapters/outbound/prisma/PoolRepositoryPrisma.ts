import prisma from "../../../prismaClient";
const Decimal = require("decimal.js");


export class PoolRepositoryPrisma {
  async createPool(year: number, members: { shipId: string; cbBeforeGrams: number; cbAfterGrams: number }[]) {
    const p = await prisma.pool.create({
      data: {
        year,
        members: {
          create: members.map((m) => ({
            shipId: m.shipId,
            cbBefore: new Decimal(m.cbBeforeGrams),
            cbAfter: new Decimal(m.cbAfterGrams)
          }))
        }
      },
      include: { members: true }
    });
    return p;
  }
}
