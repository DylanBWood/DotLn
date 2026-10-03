// A static host dependency used only by WO-184's virtual closure perturbation.
import { readFileSync } from "node:fs";
export const fixtureHostRead = readFileSync;
