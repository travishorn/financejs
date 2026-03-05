import { expect, test } from "vitest";
import { sln } from "../src/sln.js";

test.each(
  /** @type {[number, number, number, number][]} */ ([
    [30000, 7500, 10, 2250],
    [10000, 1000, 5, 1800],
    [50000, 5000, 15, 3000],
    [120000, 20000, 20, 5000],
    [25000, 0, 10, 2500],
    [8000, 2000, 4, 1500],
    [60000, 10000, 8, 6250],
    [15000, 5000, 5, 2000],
    [9000, 1000, 2, 4000],
    [200000, 50000, 25, 6000],
  ]),
)(
  "sln() matches Excel to 8 decimal places",
  (cost, salvage, life, expected) => {
    expect(sln(cost, salvage, life)).toBeCloseTo(expected, 8);
  },
);
