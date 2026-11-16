// Temporary compatibility shim. The canonical Excel-style `npv` now lives at
// ./excel/npv.js and delegates to the modern `calculateNetPresentValue`
// engine. This re-export keeps internal modules working untouched until they
// are migrated in a later increment.
export { npv } from "./excel/npv.js";
