import { expect, test } from "vitest";
import { fvschedule } from "../src/fvschedule.js";

test.each(
  /** @type {[number, number[], number][]} */ ([
    [1, [0.09, 0.11, 0.1], 1.33089],
    [100, [0.05, 0.05, 0.05], 115.7625],
    [1000, [], 1000],
    [500, [0], 500],
    [2, [null, 0.5], 3],
    [10, [0.1, null, 0.1], 12.1],
    [1, [-0.5, 1], 1],
    [1, [0.1, 0.2, -0.1], 1.188],
    [1, [0.01, 0.01, 0.01, 0.01, 0.01], 1.0510100501],
    [0, [0.1, 0.2], 0],
  ]),
)(
  "fvschedule() matches Excel to 8 decimal places",
  (principal, schedule, expected) => {
    expect(fvschedule(principal, schedule)).toBeCloseTo(expected, 8);
  },
);

test.each(
  /** @type {[any, any[]][]} */ ([
    [null, [0.1, 0.2]],
    [1, [0.1, "bad"]],
    [1, [undefined]],
    [1, [{}]],
    [1, [0.1, [0.2]]],
    [1, [0.1, NaN]],
    [1, [0.1, Infinity]],
    [1, [0.1, -Infinity]],
    [1, "not an array"],
    [1],
  ]),
)(
  "fvschedule() throws RangeError for invalid inputs",
  (principal, schedule) => {
    expect(() => fvschedule(principal, schedule)).toThrow(RangeError);
  },
);
