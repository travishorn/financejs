import { expect, test } from "vitest";
import { mirr } from "../src/mirr.js";

/** @type {[number[], number, number, number][]} */
const mirrSuccessCases = [
  [[-120000, 39000, 30000, 21000, 37000, 46000], 0.1, 0.12, 0.12609413],
  [[-120000, 39000, 30000, 21000], 0.1, 0.12, -0.04804466],
  [[-120000, 39000, 30000, 21000, 37000, 46000], 0.1, 0.14, 0.13475911],
  [[-50000, 15000, 20000, 25000, 30000], 0.15, 0.18, 0.22336396],
  [[-10000, 4000, 4000, 4000], 0.05, 0.07, 0.08744964],
  [[-10000, 1000, 1000, 1000], 0.08, 0.1, -0.30826036],
  [[-200000, 50000, 60000, 70000, 80000], 0.03, 0.04, 0.08182259],
  [[-1000, 0, 0, 0, 2000], 0.06, 0.08, 0.18920712],
  [[-5000, 0, 2000, 2000, 2000], 0.09, 0.11, 0.07527577],
];

/**
 * @typedef {[number[], string | undefined, number] | [number[], number, string | undefined]} MirrTypeErrorCase
 */
/** @type {MirrTypeErrorCase[]} */
const mirrTypeErrorCases = [
  [[-1000, 500, 600], "notANumber", 0.1],
  [[-1000, 500, 600], 0.1, "notANumber"],
  [[-1000, 500, 600], undefined, 0.1],
  [[-1000, 500, 600], 0.1, undefined],
];

/** @type {[string | number[], number, number][]} */
const mirrRangeErrorCases = [
  ["notAnArray", 0.1, 0.1],
  [[1000], 0.1, 0.1],
  [[], 0.1, 0.1],
  [[100, 200, 300, 400], 0.1, 0.1],
  [[-100, -200, -300, -400], 0.1, 0.1],
  [[0, 0, 0, 0], 0.1, 0.1],
];

test.each(mirrSuccessCases)(
  "mirr() matches Excel to 8 decimal places",
  (values, financeRate, reinvestRate, expected) => {
    expect(mirr(values, financeRate, reinvestRate)).toBeCloseTo(expected, 8);
  },
);

test.each(mirrTypeErrorCases)(
  "mirr() throws TypeError for invalid input types",
  (values, financeRate, reinvestRate) => {
    // @ts-expect-error
    expect(() => mirr(values, financeRate, reinvestRate)).toThrow(TypeError);
  },
);

test.each(mirrRangeErrorCases)(
  "mirr() throws RangeError for invalid inputs",
  (values, financeRate, reinvestRate) => {
    // @ts-expect-error
    expect(() => mirr(values, financeRate, reinvestRate)).toThrow(RangeError);
  },
);
