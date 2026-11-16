// Temporary compatibility shim. The canonical Excel-style `syd` now lives at
// ./excel/syd.js and delegates to the modern
// `calculateSumOfYearsDepreciation` engine. This re-export keeps internal
// modules working untouched until they are migrated in a later increment.
export { syd } from "./excel/syd.js";
