/**
 * Normalizes zero values to ensure consistent handling of positive and negative
 * zero in calculations.
 *
 * In JavaScript, +0 and -0 are distinct values that can yield different results
 * in equality checks (e.g., Object.is(+0, -0) is false), sign checks
 * (Math.sign), and division (1/0 vs 1/-0). This function coerces any zero input
 * (either +0 or -0) to positive zero (+0), providing a consistent
 * representation for downstream calculations, comparisons, and serialization.
 *
 * @param {number} value - The numeric value to normalize. If the value is +0 or
 * -0, returns +0; otherwise, returns the original value.
 * @returns {number} The normalized value, with all zeroes represented as +0.
 *
 * @example
 * normalizeZero(-0); // 0
 * normalizeZero(+0); // 0
 * normalizeZero(5);  // 5
 */
export function normalizeZero(value) {
  return value === 0 ? 0 : value;
}
