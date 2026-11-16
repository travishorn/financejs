// Temporary compatibility shim. The canonical Excel-style `vdb` now lives at
// ./excel/vdb.js and delegates to the modern
// `calculateVariableDecliningBalanceDepreciation` engine. This re-export keeps
// internal modules working untouched until they are migrated in a later
// increment.
export { vdb } from "./excel/vdb.js";
