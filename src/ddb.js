// Temporary compatibility shim. The canonical Excel-style `ddb` now lives at
// ./excel/ddb.js and delegates to the modern
// `calculateDoubleDecliningBalanceDepreciation` engine. This re-export keeps
// internal modules working untouched until they are migrated in a later
// increment.
export { ddb } from "./excel/ddb.js";
