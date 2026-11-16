// Temporary compatibility shim. The canonical Excel-style `coupdaysnc` now
// lives at ./excel/coupdaysnc.js and delegates to the modern
// `calculateCouponDaysToNextCoupon` engine. This re-export keeps internal
// modules working untouched until they are migrated in a later increment.
export { coupdaysnc } from "./excel/coupdaysnc.js";
