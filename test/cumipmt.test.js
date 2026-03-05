import { expect, test } from "vitest";
import { cumipmt } from "../src/cumipmt.js";

test.each(
  /** @type {[number, number, number, number, number, 0 | 1, number][]} */ ([
    [0.09 / 12, 30 * 12, 125000, 13, 24, 0, -11135.232130750845],
    [0.09 / 12, 30 * 12, 125000, 1, 1, 0, -937.5],
    [0.05, 10, 10000, 1, 10, 0, -2950.45749654567],
    [0.05, 10, 10000, 1, 5, 0, -2082.099108801883],
    [0.05, 10, 10000, 6, 10, 0, -868.3583877437869],
    [0.07 / 12, 12, 5000, 1, 12, 0, -191.60476588828374],
    [0.07 / 12, 12, 5000, 1, 6, 0, -139.42084606271757],
    [0.07 / 12, 12, 5000, 7, 12, 0, -52.18391982556619],
    [0.09 / 12, 30 * 12, 125000, 1, 12, 1, -10201.33288449],
    [0.09 / 12, 30 * 12, 125000, 13, 24, 1, -11052.33958387],
  ]),
)(
  "cumipmt() matches Excel to 8 decimal places",
  (rate, nper, pv, startPeriod, endPeriod, type, expected) => {
    expect(cumipmt(rate, nper, pv, startPeriod, endPeriod, type)).toBeCloseTo(
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
  "cumipmt() throws RangeError for invalid inputs",
  (rate, nper, pv, startPeriod, endPeriod, type) => {
    expect(() =>
      cumipmt(
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
