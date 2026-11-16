// Temporary compatibility shim. The canonical Excel-style `pduration` now
// lives at ./excel/pduration.js and delegates to the modern
// `calculatePeriodsToTarget` engine. This re-export keeps internal modules
// working untouched until they are migrated in a later increment.
export { pduration } from "./excel/pduration.js";
