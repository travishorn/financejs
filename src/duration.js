// Temporary compatibility shim. The canonical Excel-style `duration` now lives
// at ./excel/duration.js and delegates to the modern
// `calculateMacaulayDuration` engine. This re-export keeps internal modules
// working untouched until they are migrated in a later increment.
export { duration } from "./excel/duration.js";
