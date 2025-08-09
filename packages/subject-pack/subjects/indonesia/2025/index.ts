import type { SubjectPack } from "../../../shared/types";

// Import education level specific packs
import * as sdPack from "./SD";
import * as smpPack from "./SMP";
import * as smaPack from "./SMA";
import * as kuliahPack from "./Kuliah";

export async function getPacks(): Promise<Record<string, SubjectPack>> {
  const packs: Record<string, SubjectPack> = {};

  // SD (Sekolah Dasar - Elementary)
  packs["indonesia-2025-sd"] = await sdPack.getPack();

  // SMP (Sekolah Menengah Pertama - Junior High)
  packs["indonesia-2025-smp"] = await smpPack.getPack();

  // SMA (Sekolah Menengah Atas - Senior High)
  packs["indonesia-2025-sma"] = await smaPack.getPack();

  // Kuliah (University)
  packs["indonesia-2025-kuliah"] = await kuliahPack.getPack();

  return packs;
}
