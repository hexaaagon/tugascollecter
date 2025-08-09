import type { SubjectPack } from "../../../shared/types";

// Import education level specific packs
import * as elementaryPack from "./Elementary";
import * as juniorHSPack from "./Junior HS";
import * as seniorHSPack from "./Senior HS";
import * as collegePack from "./Collage";

export async function getPacks(): Promise<Record<string, SubjectPack>> {
  const packs: Record<string, SubjectPack> = {};

  // Elementary (ages 6-11)
  packs["global-2025-elementary"] = await elementaryPack.getPack();

  // Junior High School (ages 12-14)
  packs["global-2025-junior-hs"] = await juniorHSPack.getPack();

  // Senior High School (ages 15-17)
  packs["global-2025-senior-hs"] = await seniorHSPack.getPack();

  // College (ages 18+)
  packs["global-2025-college"] = await collegePack.getPack();

  return packs;
}
