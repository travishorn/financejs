// Temporary compatibility shim. The canonical Excel-style `cumprinc` now lives
// at ./excel/cumprinc.js and delegates to the modern
// `calculateCumulativePrincipal` engine. This re-export keeps internal modules
// working untouched until they are migrated in a later increment.
export { cumprinc } from "./excel/cumprinc.js";
