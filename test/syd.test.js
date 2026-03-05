import { expect, test } from "vitest";
import { syd } from "../src/syd.js";

test.each(
  /** @type {[number, number, number, number, number][]} */ ([
    [30000, 7500, 10, 1, 4090.90909091],
    [30000, 7500, 10, 10, 409.09090909],
    [10000, 1000, 5, 1, 3000],
    [10000, 1000, 5, 5, 600],
    [50000, 5000, 8, 1, 10000],
    [50000, 5000, 8, 8, 1250],
    [25000, 0, 4, 2, 7500],
    [25000, 1000, 4, 3, 4800],
    [12000, 2000, 6, 4, 1428.5714285714287],
    [12000, 0, 6, 6, 571.4285714285714],
  ]),
)(
  "syd() matches Excel to 8 decimal places",
  (cost, salvage, life, per, expected) => {
    expect(syd(cost, salvage, life, per)).toBeCloseTo(expected, 8);
  },
);
