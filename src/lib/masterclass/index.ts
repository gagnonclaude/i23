import { masterclassTemps, type MasterclassData } from "./temps";
import { masterclassEnergie } from "./energie";
import { masterclassMethode } from "./methode";

export type { MasterclassData, MasterclassPart, MasterclassSection } from "./temps";

export const allMasterclasses: MasterclassData[] = [masterclassMethode, masterclassTemps, masterclassEnergie];

export function getMasterclass(slug: string): MasterclassData | undefined {
  return allMasterclasses.find((m) => m.slug === slug);
}
