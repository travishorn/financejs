// Temporary compatibility shim. The canonical Excel-style `mirr` now lives at
// ./excel/mirr.js and delegates to the modern
// `calculateModifiedInternalRateOfReturn` engine. This re-export keeps internal
// modules working untouched until they are migrated in a later increment.
export { mirr } from "./excel/mirr.js";
