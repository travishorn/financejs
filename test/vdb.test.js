import { expect, test } from "vitest";
import { vdb } from "../src/vdb.js";

test.each(
  /** @type {[number, number, number, number, number, number | undefined, boolean | undefined, number][]} */ ([
    [2400, 300, 10 * 365, 0, 1, undefined, undefined, 1.31506849],
    [2400, 300, 10 * 12, 0, 1, undefined, undefined, 40.0],
    [2400, 300, 10, 0, 1, undefined, undefined, 480.0],
    [100, 100, 10, 0, 1, undefined, undefined, 0.0],
    [2400, 300, 10, 2, 2, undefined, undefined, 0.0],
    [2400, 300, 10 * 12, 6, 18, undefined, undefined, 396.30605326],
    [2400, 300, 10 * 12, 6, 18, 1.5, undefined, 311.80893666],
    [2400, 300, 10, 0, 0.875, 1.5, undefined, 315.0],
    [2400, 300, 10, 0, 1, undefined, true, 480.0],
    [2400, 300, 10, 0, 2, undefined, true, 864.0],
    [2400, 300, 10, 2, 3, 0.5, undefined, 210.0],
    [100, 90, 10, 2, 3, 2, undefined, 0.0],
    [2400, 300, 10, 9.5, 10, undefined, undefined, 0],
    [2400, 300, 10, 5, 6, undefined, undefined, 157.2864],
    [2400, 300, 10, 0, 10, undefined, undefined, 2100.0],
    [2400, 300, 10, 0, 1, 1.25, true, 300.0],
    [2400, 300, 10, 0, 0.5, undefined, undefined, 240.0],
  ]),
)(
  "vdb() matches Excel to 8 decimal places",
  (cost, salvage, life, startPeriod, endPeriod, factor, noSwitch, expected) => {
    expect(
      vdb(cost, salvage, life, startPeriod, endPeriod, factor, noSwitch),
    ).toBeCloseTo(expected, 8);
  },
);

test.each(
  /** @type {[number, number, number, number, number, number | undefined, boolean | undefined][]} */ ([
    [-1, 300, 10, 0, 1, undefined, undefined],
    [2400, -1, 10, 0, 1, undefined, undefined],
    [2400, 300, 0, 0, 1, undefined, undefined],
    [2400, 300, 10, 0, 1, 0, undefined],
    [2400, 300, 10, 0, 1, -1, undefined],
    [2400, 300, 10, -0.1, 1, undefined, undefined],
    [2400, 300, 10, 0, -1, undefined, undefined],
    [2400, 300, 10, 2, 1, undefined, undefined],
  ]),
)(
  "vdb() throws RangeError for invalid inputs",
  (cost, salvage, life, startPeriod, endPeriod, factor, noSwitch) => {
    expect(() =>
      vdb(cost, salvage, life, startPeriod, endPeriod, factor, noSwitch),
    ).toThrow(RangeError);
  },
);
