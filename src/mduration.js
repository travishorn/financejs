// Temporary compatibility shim. The canonical Excel-style `mduration` now
// lives at ./excel/mduration.js and delegates to the modern
// `calculateModifiedDuration` engine. This re-export keeps internal modules
// working untouched until they are migrated in a later increment.
export { mduration } from "./excel/mduration.js";
