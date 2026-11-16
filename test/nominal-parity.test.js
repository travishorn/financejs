import { expect, test } from "vitest";
import { calculateNominalRate } from "../src/nominal-rate.js";
import { nominal } from "../src/excel/nominal.js";

test.each(
  /** @type {[number, number][]} */ ([
    [0.053543, 4],
    [0.05, 1],
    [0.05094533691406222, 4],
    [0.0511619, 12],
    [0.1, 2],
    [0.10381289, 4],
    [0.10471306744155207, 12],
    [0.071225, 2],
    [0.0722900808562359, 12],
    [0.15, 2],
  ]),
)(
  "nominal() and calculateNominalRate() return identical results",
  (effectRate, npery) => {
    const excelResult = nominal(effectRate, npery);
    const modernResult = calculateNominalRate({
      effectiveRate: effectRate,
      periodsPerYear: npery,
    });

    expect(excelResult).toBe(modernResult);
  },
);
