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
  if (typeof fraction !== "number" || isNaN(fraction) || !isFinite(fraction)) {
    throw new RangeError("fraction must be a finite number");
  }
  if (fraction < 0) throw new RangeError("fraction must be >= 0");
  if (fraction > 0 && fraction < 1)
    throw new RangeError("fraction must be >= 1 or 0");

  // Truncate fraction to integer
  fraction = Math.trunc(fraction);

  const sign = fractionalDollar < 0 ? -1 : 1;
  const abs = Math.abs(fractionalDollar);
  const intPart = Math.trunc(abs);
  const fracPart = abs - intPart;

  // Multiply the decimal piece by 10 to the power of the length of fraction digits
  const power = Math.ceil(Math.log10(fraction));
  const result = intPart + (fracPart * Math.pow(10, power)) / fraction;

  return sign * result;
}
