import { expect, test } from "vitest";
import { ppmt } from "../src/ppmt.js";

test.each(
  /** @type {[number, number, number, number, number | undefined, 0 | 1 | undefined, number][]} */ ([
    [0.02, 5, 5, -608926, 37115, 0, 118935.787736457],
    [0.0025, 9, 24, -62088, 16679, 0, 1875.2988823337],
    [0.0075, 1, 36, -303575, 0, 1, 9581.74078634391],
    [0.00833333333333333, 56, 240, -244184, 40099, 1, 420.708247831785],
    [0.05, 4, 8, -204252, 4793, 1, 23028.6983173609],
    [0.00916666666666667, 10, 60, -276452, 0, 0, 3774.15668897321],
    [0.0158333333333333, 98, 180, -740363, 1255, 1, 3324.09497421923],
    [0.0225, 4, 16, -324779, 0, 1, 17866.4226038686],
    [0.015, 36, 48, -518630, 39718, 0, 11592.444876619],
    [0.00333333333333333, 244, 360, -490152, 36758, 0, 1466.48935600409],
  ]),
)(
  "ppmt() matches Excel to 8 decimal places",
  (rate, per, nper, pv, fv, type, expected) => {
    expect(ppmt(rate, per, nper, pv, fv, type)).toBeCloseTo(expected, 8);
  },
);

test.each(
  /** @type {[number, number, number, number, number | undefined, 0 | 1 | undefined][]} */ ([
    [0.0525, 0, 24, -10000, undefined, undefined],
    [0.0525, 25, 24, -10000, undefined, undefined],
  ]),
)(
  "ppmt() throws RangeError for invalid inputs",
  (rate, per, nper, pv, fv, type) => {
    expect(() => ppmt(rate, per, nper, pv, fv, type)).toThrow(RangeError);
  },
);

test("ppmt() returns +0 for zero-valued result", () => {
  const result = ppmt(0.05, 1, 10, 0, 0, 1);

  expect(result).toBe(0);
  expect(Object.is(result, -0)).toBe(false);
});
