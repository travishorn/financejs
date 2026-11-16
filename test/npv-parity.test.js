import { expect, test } from "vitest";
import { calculateNetPresentValue } from "../src/net-present-value.js";
import { npv } from "../src/excel/npv.js";

test.each(
  /** @type {[number, number[]][]} */ ([
    [0.02, [-50000, 91332, 95379, 83519]],
    [0.03, [-43006, 60264, 23129, 34643]],
    [0.09, [-54404, 60439, 11971, 95653]],
    [0.1, [-80427, -89098, 47970, 40361]],
    [0.2, [-12552, 41244, -93702, 84914]],
    [0.11, [78850, 12109, 35278, 97086]],
    [0.19, [-13182, 26250, 49352, 54732]],
    [0.09, [-41941, 21473, -20029, 61674]],
    [0.18, [-40433, 39029, 31605, -68195]],
    [0.04, [-89316, 66418, 54279, 60256]],
    [0.1, [-10000, 3000, 4200, 6800]],
  ]),
)(
  "npv() and calculateNetPresentValue() return identical results",
  (rate, values) => {
    const excelResult = npv(rate, ...values);
    const modernResult = calculateNetPresentValue({
      rate,
      cashFlows: values,
    });

    expect(excelResult).toBe(modernResult);
  },
);
