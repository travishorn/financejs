import { expect, test } from "vitest";
import { db } from "../src/db.js";

test.each(
  /** @type {[number, number, number, number, number, number][]} */ ([
    [1000000, 100000, 6, 1, 7, 186083.33333333],
    [1000000, 100000, 6, 2, 7, 259639.41666667],
    [1000000, 100000, 6, 6, 7, 55841.75673603],
    [1000000, 100000, 6, 7, 7, 15845.09847385],
    [50000, 5000, 5, 1, 12, 18450],
    [50000, 5000, 5, 2, 12, 11641.95],
    [50000, 5000, 5, 5, 12, 2924.91875644245],
    [25000, 1000, 10, 1, 6, 3437.5000000000005],
    [25000, 1000, 10, 10, 6, 452.6222079246033],
    [10000, 1000, 3, 2, 9, 3205.28],
  ]),
)(
  "db() matches Excel to 8 decimal places",
  (cost, salvage, life, period, month, expected) => {
    expect(db(cost, salvage, life, period, month)).toBeCloseTo(expected, 8);
  },
);
