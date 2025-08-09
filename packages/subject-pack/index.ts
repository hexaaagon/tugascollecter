import type {
  SubjectPackRegistry,
  SubjectPack,
  SubjectTemplate,
  SubjectPackQuery,
  SubjectPackSearchResult,
  CountryEducationSystem,
} from "./shared/types";

// Import country-specific packs
import * as globalPacks from "./subjects/global";
import * as indonesiaPacks from "./subjects/indonesia";

export * from "./shared/types";

/**
 * Subject Pack Manager
 * Provides pre-defined subjects for different countries and education levels
 */
export class SubjectPackManager {
  private static registry: SubjectPackRegistry | null = null;

  /**
   * Initialize and get the subject pack registry
   */
  private static async getRegistry(): Promise<SubjectPackRegistry> {
    if (SubjectPackManager.registry) {
      return SubjectPackManager.registry;
    }

    // Load all packs
    const packs: Record<string, SubjectPack> = {};

    // Load global packs
    const globalPacksData = await globalPacks.getAvailablePacks();
    Object.assign(packs, globalPacksData);

    // Load Indonesia packs
    const indonesiaPacksData = await indonesiaPacks.getAvailablePacks();
    Object.assign(packs, indonesiaPacksData);

    // Define country education systems
    const countries: CountryEducationSystem[] = [
      {
        countryCode: "GL",
        countryName: "Global",
        localizedName: {
          en: "Global",
          id: "Global",
        },
        educationLevels: [
          {
            id: "elementary",
            name: "Elementary",
            localizedName: { en: "Elementary", id: "Sekolah Dasar" },
            ageRange: { min: 6, max: 11 },
            duration: 6,
            order: 1,
          },
          {
            id: "junior-hs",
            name: "Junior High School",
            localizedName: {
              en: "Junior High School",
              id: "Sekolah Menengah Pertama",
            },
            ageRange: { min: 12, max: 14 },
            duration: 3,
            order: 2,
          },
          {
            id: "senior-hs",
            name: "Senior High School",
            localizedName: {
              en: "Senior High School",
              id: "Sekolah Menengah Atas",
            },
            ageRange: { min: 15, max: 17 },
            duration: 3,
            order: 3,
          },
          {
            id: "college",
            name: "College",
            localizedName: { en: "College", id: "Perguruan Tinggi" },
            ageRange: { min: 18, max: 22 },
            duration: 4,
            order: 4,
          },
        ],
      },
      {
        countryCode: "ID",
        countryName: "Indonesia",
        localizedName: {
          en: "Indonesia",
          id: "Indonesia",
        },
        educationLevels: [
          {
            id: "sd",
            name: "SD",
            localizedName: { en: "Elementary School", id: "Sekolah Dasar" },
            ageRange: { min: 6, max: 11 },
            duration: 6,
            order: 1,
          },
          {
            id: "smp",
            name: "SMP",
            localizedName: {
              en: "Junior High School",
              id: "Sekolah Menengah Pertama",
            },
            ageRange: { min: 12, max: 14 },
            duration: 3,
            order: 2,
          },
          {
            id: "sma",
            name: "SMA",
            localizedName: {
              en: "Senior High School",
              id: "Sekolah Menengah Atas",
            },
            ageRange: { min: 15, max: 17 },
            duration: 3,
            order: 3,
          },
          {
            id: "kuliah",
            name: "Kuliah",
            localizedName: { en: "University", id: "Perguruan Tinggi" },
            ageRange: { min: 18, max: 22 },
            duration: 4,
            order: 4,
          },
        ],
      },
    ];

    SubjectPackManager.registry = {
      countries,
      packs,
    };

    return SubjectPackManager.registry;
  }

  /**
   * Get all available countries
   */
  static async getCountries(): Promise<CountryEducationSystem[]> {
    const registry = await SubjectPackManager.getRegistry();
    return registry.countries;
  }

  /**
   * Get education levels for a specific country
   */
  static async getEducationLevels(
    countryCode: string
  ): Promise<CountryEducationSystem["educationLevels"] | null> {
    const registry = await SubjectPackManager.getRegistry();
    const country = registry.countries.find(
      (c) => c.countryCode === countryCode
    );
    return country?.educationLevels || null;
  }

  /**
   * Get subject pack for specific country, year, and education level
   */
  static async getSubjectPack(
    country: string,
    year: number,
    educationLevel: string
  ): Promise<SubjectPack | null> {
    const registry = await SubjectPackManager.getRegistry();
    // Convert country code to pack key format
    let countryKey = country.toLowerCase();
    if (countryKey === "gl") countryKey = "global";
    if (countryKey === "id") countryKey = "indonesia";

    const key = `${countryKey}-${year}-${educationLevel.toLowerCase()}`;
    console.log(
      "Looking for pack key:",
      key,
      "Available keys:",
      Object.keys(registry.packs)
    );
    return registry.packs[key] || null;
  }

  /**
   * Search subject packs based on query
   */
  static async searchSubjects(
    query: SubjectPackQuery
  ): Promise<SubjectPackSearchResult[]> {
    const registry = await SubjectPackManager.getRegistry();
    const results: SubjectPackSearchResult[] = [];

    for (const [key, pack] of Object.entries(registry.packs)) {
      // Filter by country
      if (query.country && pack.country !== query.country) continue;

      // Filter by year
      if (query.year && pack.year !== query.year) continue;

      // Filter by education level
      if (query.educationLevel && pack.educationLevel !== query.educationLevel)
        continue;

      // Filter subjects within the pack
      let filteredSubjects = pack.subjects;

      if (query.category) {
        filteredSubjects = filteredSubjects.filter(
          (s) => s.category === query.category
        );
      }

      if (query.isCore !== undefined) {
        filteredSubjects = filteredSubjects.filter(
          (s) => s.isCore === query.isCore
        );
      }

      if (query.searchTerm) {
        const searchTerm = query.searchTerm.toLowerCase();
        filteredSubjects = filteredSubjects.filter(
          (s) =>
            s.name.toLowerCase().includes(searchTerm) ||
            s.description?.toLowerCase().includes(searchTerm) ||
            s.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
        );
      }

      if (filteredSubjects.length > 0) {
        results.push({
          pack,
          subjects: filteredSubjects,
          totalResults: filteredSubjects.length,
        });
      }
    }

    return results;
  }

  /**
   * Get subjects ready to be imported (converts SubjectTemplate to CreateSubjectInput)
   */
  static async getSubjectsForImport(
    country: string,
    year: number,
    educationLevel: string
  ): Promise<any[]> {
    const pack = await SubjectPackManager.getSubjectPack(
      country,
      year,
      educationLevel
    );
    if (!pack) return [];

    return pack.subjects.map((subject) => ({
      name: subject.name,
      color: subject.color,
      description: subject.description,
      day: subject.defaultSchedule?.day || [],
    }));
  }

  /**
   * Get all available packs (for admin/debugging purposes)
   */
  static async getAllPacks(): Promise<Record<string, SubjectPack>> {
    const registry = await SubjectPackManager.getRegistry();
    return registry.packs;
  }

  /**
   * Clear registry cache (useful for testing or hot reload)
   */
  static clearCache(): void {
    SubjectPackManager.registry = null;
  }
}

// Export convenience methods
export const getCountries = SubjectPackManager.getCountries;
export const getEducationLevels = SubjectPackManager.getEducationLevels;
export const getSubjectPack = SubjectPackManager.getSubjectPack;
export const searchSubjects = SubjectPackManager.searchSubjects;
export const getSubjectsForImport = SubjectPackManager.getSubjectsForImport;
