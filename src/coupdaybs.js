// Temporary compatibility shim. The canonical Excel-style `coupdaybs` now
// lives at ./excel/coupdaybs.js and delegates to the modern
// `calculateCouponDaysBeforeSettlement` engine. This re-export keeps internal
// modules working untouched until they are migrated in a later increment.
export { coupdaybs } from "./excel/coupdaybs.js";
