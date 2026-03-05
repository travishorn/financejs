import { expect, test } from "vitest";
import { ddb } from "../src/ddb.js";

test.each(
  /** @type {[number, number, number, number, number, number][]} */ ([
    [2400, 300, 10 * 365, 1, 2, 1.31506849],
    [10000, 1000, 5, 1, 2, 4000],
    [10000, 1000, 5, 2, 2, 2400],
    [10000, 1000, 5, 5, 2, 296],
    [50000, 5000, 10, 1, 2, 10000],
    [50000, 5000, 10, 10, 2, 1342.17728],
    [25000, 0, 8, 3, 2, 3515.625],
    [25000, 1000, 8, 8, 2, 834.2742919921875],
    [12000, 0, 6, 4, 1.5, 1265.625],
    [12000, 0, 6, 6, 1.5, 711.9140625],
  ]),
)(
  "ddb() matches Excel to 8 decimal places",
  (cost, salvage, life, period, factor, expected) => {
    expect(ddb(cost, salvage, life, period, factor)).toBeCloseTo(expected, 8);
  },
);
