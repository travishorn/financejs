// Temporary compatibility shim. The canonical Excel-style `fvschedule` now
// lives at ./excel/fvschedule.js and delegates to the modern
// `calculateFutureValueSchedule` engine. This re-export keeps internal modules
// working untouched until they are migrated in a later increment.
export { fvschedule } from "./excel/fvschedule.js";
