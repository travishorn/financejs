import { expect, test } from "vitest";
import { ipmt } from "../src/excel/ipmt.js";

test.each(
  /** @type {[number, number, number, number, number | undefined, 0 | 1 | undefined, number][]} */ ([
    [0.02, 5, 5, -608926, 37115, 0, 3121.01575472915],
    [0.0025, 9, 24, -62088, 16679, 0, 118.13247244596],
    [0.0075, 1, 36, -303575, 0, 1, 0],
    [0.0083333333333333, 56, 240, -244184, 40099, 1, 1863.87630524189],
    [0.05, 4, 8, -204252, 4793, 1, 6590.64284869969],
    [0.00916666666666667, 10, 60, -276452, 0, 0, 2236.57965430518],
    [0.0158333333333333, 98, 180, -740363, 1255, 1, 8939.86781612986],
    [0.0225, 4, 16, -324779, 0, 1, 5993.04338111598],
    [0.015, 36, 48, -518630, 39718, 0, 3071.36493572514],
    [0.00333333333333333, 244, 360, -490152, 36758, 0, 820.609615385237],
  ]),
)(
  "ipmt() matches Excel to 8 decimal places",
  (rate, per, nper, pv, fv, type, expected) => {
    expect(ipmt(rate, per, nper, pv, fv, type)).toBeCloseTo(expected, 8);
  },
);

test.each(
  /** @type {[number, number, number, number, number | undefined, 0 | 1 | undefined][]} */ ([
    [0.0525, 0, 24, -10000, undefined, undefined],
    [0.0525, 25, 24, -10000, undefined, undefined],
  ]),
)(
  "ipmt() throws RangeError for invalid inputs",
  (rate, per, nper, pv, fv, type) => {
    expect(() => ipmt(rate, per, nper, pv, fv, type)).toThrow(RangeError);
  },
);
