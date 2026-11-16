// Temporary compatibility shim. The canonical Excel-style `nominal` now lives
// at ./excel/nominal.js and delegates to the modern `calculateNominalRate`
// engine. This re-export keeps internal modules working untouched until they
// are migrated in a later increment.
export { nominal } from "./excel/nominal.js";
