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
  if (typeof fraction !== "number" || isNaN(fraction) || !isFinite(fraction)) {
    throw new RangeError("fraction must be a finite number");
  }
  if (fraction < 0) throw new RangeError("fraction must be >= 0");
  if (fraction === 0) throw new RangeError("fraction must be >= 1 or 0");

  // Truncate fraction to integer
  fraction = Math.trunc(fraction);

  const sign = decimalDollar < 0 ? -1 : 1;
  const abs = Math.abs(decimalDollar);
  const intPart = Math.trunc(abs);
  const fracPart = abs - intPart;

  // Use the same scale as dollarde() so this function is its algebraic inverse.
  const power = Math.ceil(Math.log10(fraction));
  const result = intPart + (fracPart * fraction) / Math.pow(10, power);

  return sign * result;
}
