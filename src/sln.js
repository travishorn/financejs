// Temporary compatibility shim. The canonical Excel-style `sln` now lives at
// ./excel/sln.js and delegates to the modern
// `calculateStraightLineDepreciation` engine. This re-export keeps internal
// modules working untouched until they are migrated in a later increment.
export { sln } from "./excel/sln.js";
