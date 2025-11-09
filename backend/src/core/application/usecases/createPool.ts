const Decimal = require("decimal.js");


/**
 * members: { shipId, cbBeforeGrams }
 * Returns { shipId, cbBeforeGrams, cbAfterGrams }
 */

export type PoolInputMember = { shipId: string; cbBeforeGrams: number };

export function createPoolAllocation(members: PoolInputMember[]) {
  const copy = members.map((m) => ({ ...m, cbAfterGrams: m.cbBeforeGrams }));

  const total = copy.reduce((acc, m) => acc.plus(new Decimal(m.cbBeforeGrams)), new Decimal(0));
  if (total.lt(0)) {
    throw new Error("Pool sum is negative - cannot create pool");
  }

  const surplus = copy
    .filter((m) => new Decimal(m.cbBeforeGrams).gt(0))
    .sort((a, b) => new Decimal(b.cbBeforeGrams).cmp(new Decimal(a.cbBeforeGrams)));

  const deficit = copy
    .filter((m) => new Decimal(m.cbBeforeGrams).lt(0))
    .sort((a, b) => new Decimal(a.cbBeforeGrams).cmp(new Decimal(b.cbBeforeGrams)));

  let sIndex = 0;
  for (let d of deficit) {
    let need = new Decimal(d.cbAfterGrams).abs();
    while (need.gt(0) && sIndex < surplus.length) {
      const s = surplus[sIndex];
      const sAvail = new Decimal(s.cbAfterGrams);
      if (sAvail.lte(0)) {
        sIndex++;
        continue;
      }
      const transfer = Decimal.min(sAvail, need);
      s.cbAfterGrams = new Decimal(s.cbAfterGrams).minus(transfer).toNumber();
      d.cbAfterGrams = new Decimal(d.cbAfterGrams).plus(transfer).toNumber();
      need = need.minus(transfer);
      if (new Decimal(s.cbAfterGrams).lte(0)) sIndex++;
    }
    if (need.gt(0)) {
      throw new Error("Allocation failed — insufficient surplus");
    }
  }

  for (const m of copy) {
    const before = new Decimal(m.cbBeforeGrams);
    const after = new Decimal(m.cbAfterGrams);
    if (before.lt(0) && after.lt(before)) {
      throw new Error(`Deficit ship ${m.shipId} became worse`);
    }
    if (before.gt(0) && after.lt(0)) {
      throw new Error(`Surplus ship ${m.shipId} went negative`);
    }
  }

  return copy.map((m) => ({
    shipId: m.shipId,
    cbBeforeGrams: m.cbBeforeGrams,
    cbAfterGrams: m.cbAfterGrams
  }));
}
