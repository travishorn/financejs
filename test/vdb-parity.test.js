import { expect, test } from "vitest";
import { calculateVariableDecliningBalanceDepreciation } from "../src/variable-declining-balance-depreciation.js";
import { vdb } from "../src/excel/vdb.js";

test.each(
  /** @type {[number, number, number, number, number, number | undefined, boolean | undefined][]} */ ([
    [2400, 300, 10 * 365, 0, 1, undefined, undefined],
    [2400, 300, 10 * 12, 0, 1, undefined, undefined],
    [2400, 300, 10, 0, 1, undefined, undefined],
    [100, 100, 10, 0, 1, undefined, undefined],
    [2400, 300, 10, 2, 2, undefined, undefined],
    [2400, 300, 10 * 12, 6, 18, undefined, undefined],
    [2400, 300, 10 * 12, 6, 18, 1.5, undefined],
    [2400, 300, 10, 0, 0.875, 1.5, undefined],
    [2400, 300, 10, 0, 1, undefined, true],
    [2400, 300, 10, 0, 2, undefined, true],
    [2400, 300, 10, 2, 3, 0.5, undefined],
    [100, 90, 10, 2, 3, 2, undefined],
    [2400, 300, 10, 9.5, 10, undefined, undefined],
    [2400, 300, 10, 5, 6, undefined, undefined],
    [2400, 300, 10, 0, 10, undefined, undefined],
    [2400, 300, 10, 0, 1, 1.25, true],
    [2400, 300, 10, 0, 0.5, undefined, undefined],
  ]),
)(
  "vdb() and calculateVariableDecliningBalanceDepreciation() return identical results",
  (cost, salvage, life, startPeriod, endPeriod, factor, noSwitch) => {
    const excelResult = vdb(
      cost,
      salvage,
      life,
      startPeriod,
      endPeriod,
      factor,
      noSwitch,
    );
    const modernResult = calculateVariableDecliningBalanceDepreciation({
      cost,
      salvage,
      life,
      startPeriod,
      endPeriod,
      factor,
      noSwitch,
    });

    expect(excelResult).toBe(modernResult);
  },
);
