import { calculateDollarDecimal } from "../dollar-decimal.js";

/**
 * Converts a dollar price expressed as an integer part and a fraction part,
 * such as `1.02`, into a dollar price expressed as a decimal number. Fractional
 * dollar numbers are sometimes used for security prices.
 *
 * The fraction part of the value is divided by an integer that you specify. For
 * example, if you want your price to be expressed to a precision of 1/16 of a
 * dollar, you divide the fraction part by 16. In this case, `1.02` represents
 * `$1.125 ($1 + 2/16 = $1.125)`.
 *
 * Remarks:
 * - If `fraction` is not an integer, it is truncated.
 * - If `fraction` is less than `0`, this function will throw a RangeError.
 * - If `fraction` is greater than or equal to `0` and less than `1`, division
 *   by zero is impossible and this function will throw a RangeError.
 *
 * @param {number} fractionalDollar - A number expressed as an integer part and
 * a fraction part, separated by a decimal symbol.
 * @param {number} fraction - The integer to use in the denominator of the
 * fraction.
 * @returns {number} the converted dollar price expressed as a decimal number
 *
 * @example
 * dollarde(1.02, 16); // 1.125
 */
export function dollarde(fractionalDollar, fraction) {
  return calculateDollarDecimal({ fractionalDollar, fraction });
}
