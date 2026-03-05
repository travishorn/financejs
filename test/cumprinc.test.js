import { expect, test } from "vitest";
import { cumprinc } from "../src/cumprinc.js";

test.each(
  /** @type {[number, number, number, number, number, 0 | 1, number][]} */ ([
    [0.09 / 12, 30 * 12, 125000, 13, 24, 0, -934.10712342],
    [0.05 / 12, 15 * 12, 200000, 1, 12, 0, -9187.701756554046],
    [0.07 / 12, 20 * 12, 150000, 25, 36, 0, -4102.996708754445],
    [0.04 / 12, 10 * 12, 100000, 1, 120, 0, -99999.9999999977],
    [0.06 / 12, 25 * 12, 300000, 100, 120, 0, -15664.259628339847],
    [0.08 / 12, 30 * 12, 250000, 13, 24, 1, -2246.7684918774785],
    [0.09 / 12, 30 * 12, 125000, 1, 12, 1, -1778.1601717552392],
    [0.05 / 12, 15 * 12, 200000, 13, 24, 1, -9617.688314281184],
    [0.07 / 12, 20 * 12, 150000, 1, 12, 0, -3568.425148501108],
    [0.04 / 12, 10 * 12, 100000, 13, 24, 1, -8609.970211961809],
  ]),
)(
  "cumprinc() matches Excel to 8 decimal places",
  (rate, nper, pv, startPeriod, endPeriod, type, expected) => {
    expect(cumprinc(rate, nper, pv, startPeriod, endPeriod, type)).toBeCloseTo(
      expected,
      8,
    );
  },
);

test.each(
  /** @type {[number, number, number, number, number, 0 | 1 | 2][]} */ ([
    // rate/nper/pv validation
    [0, 360, 125000, 1, 12, 0],
    // start/end period validation
    [0.09 / 12, 360, 125000, 13, 12, 0],
    // type validation
    [0.09 / 12, 360, 125000, 1, 12, 2],
  ]),
)(
  "cumprinc() throws RangeError for invalid inputs",
  (rate, nper, pv, startPeriod, endPeriod, type) => {
    expect(() =>
      cumprinc(
        rate,
        nper,
        pv,
        startPeriod,
        endPeriod,
        /** @type {0 | 1} */ (type),
      ),
    ).toThrow(RangeError);
  },
);
