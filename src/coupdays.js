// Temporary compatibility shim. The canonical Excel-style `coupdays` now lives
// at ./excel/coupdays.js and delegates to the modern `calculateCouponDays`
// engine. This re-export keeps internal modules working untouched until they
// are migrated in a later increment.
export { coupdays } from "./excel/coupdays.js";
