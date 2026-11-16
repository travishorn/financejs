import { calculateDollarFraction } from "../dollar-fraction.js";

/**
 * Converts a decimal number to a fractional dollar number, such as a securities
 * price.
 *
 * Remarks:
 * - If `fraction` is not an integer, it is truncated.
 * - If `fraction` is less than `0`, this function will throw a RangeError.
 * - If `fraction` is `0`, division by zero is impossible and this function will
 *   throw a RangeError.
 *
 * @param {number} decimalDollar - A decimal number.
 * @param {number} fraction - The integer to use in the denominator of the
 * fraction.
 * @returns {number} the converted dollar price expressed as a fractional dollar
 * number
 *
 * @example
 * dollarfr(1.125, 16); // 1.02
 */
export function dollarfr(decimalDollar, fraction) {
  return calculateDollarFraction({ decimalDollar, fraction });
}
