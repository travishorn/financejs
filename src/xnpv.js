// Temporary compatibility shim. The canonical Excel-style `xnpv` now lives at
// ./excel/xnpv.js and delegates to the modern `calculateDatedNetPresentValue`
// engine. This re-export keeps internal modules working untouched until they
// are migrated in a later increment.
export { xnpv } from "./excel/xnpv.js";
