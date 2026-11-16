import { expect, test } from "vitest";
import { calculateEffectiveRate } from "../src/effective-rate.js";
import { effect } from "../src/excel/effect.js";

test.each(
  /** @type {[number, number][]} */ ([
    [0.0525, 4],
    [0.05, 1],
    [0.05, 2],
    [0.05, 4],
    [0.05, 12],
    [0.1, 2],
    [0.1, 4],
    [0.1, 12],
    [0.07, 2],
    [0.07, 12],
  ]),
)(
  "effect() and calculateEffectiveRate() return identical results",
  (nominalRate, npery) => {
    const excelResult = effect(nominalRate, npery);
    const modernResult = calculateEffectiveRate({
      nominalRate,
      periodsPerYear: npery,
    });

    expect(excelResult).toBe(modernResult);
  },
);
