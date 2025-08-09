import type { SubjectPack } from "../../shared/types";

// Import year-specific packs
import * as packs2025 from "./2025";

export async function getAvailablePacks(): Promise<
  Record<string, SubjectPack>
> {
  const packs: Record<string, SubjectPack> = {};

  // Load 2025 packs
  const packs2025Data = await packs2025.getPacks();
  Object.assign(packs, packs2025Data);

  return packs;
}
