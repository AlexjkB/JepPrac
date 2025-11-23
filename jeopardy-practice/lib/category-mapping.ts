// Category mapping for API endpoint selection
export const CATEGORY_MAPPING: Record<string, {
  classifiedParam?: string;
  customKeywords?: string[];
  priority: "classified" | "custom";
}> = {
  "SCIENCE": {
    classifiedParam: "science",
    customKeywords: ["science", "biology", "chemistry", "physics"],
    priority: "classified"
  },
  "HISTORY": {
    classifiedParam: "history",
    customKeywords: ["history", "historical"],
    priority: "classified"
  },
  "LITERATURE": {
    classifiedParam: "literature",
    customKeywords: ["book", "author", "novel", "literature"],
    priority: "classified"
  },
  "GEOGRAPHY": {
    classifiedParam: "geography",
    customKeywords: ["geography", "country", "city", "location"],
    priority: "classified"
  },
  "SPORTS": {
    classifiedParam: "sports",
    customKeywords: ["sports", "athlete", "game"],
    priority: "classified"
  },
  "MUSIC": {
    classifiedParam: "music",
    customKeywords: ["music", "song", "musician", "composer"],
    priority: "classified"
  },
  "MOVIES": {
    classifiedParam: "movies",
    customKeywords: ["movie", "film", "actor", "director"],
    priority: "classified"
  },
  "ART": {
    classifiedParam: "art",
    customKeywords: ["art", "artist", "painting", "sculpture"],
    priority: "classified"
  },
  "POLITICS": {
    classifiedParam: "politics",
    customKeywords: ["politics", "government", "president", "election"],
    priority: "classified"
  },
  "RELIGION": {
    classifiedParam: "religion",
    customKeywords: ["religion", "religious", "church", "bible"],
    priority: "classified"
  }
};

export type APIEndpoint = {
  type: "classified" | "custom";
  param: string;
};

export function getCategoryAPIParams(categoryName: string): APIEndpoint {
  const normalized = normalizeCategory(categoryName);
  const mapping = CATEGORY_MAPPING[normalized];

  if (!mapping) {
    const keyword = extractKeyword(categoryName);
    return { type: "custom", param: keyword };
  }

  if (mapping.priority === "classified" && mapping.classifiedParam) {
    return { type: "classified", param: mapping.classifiedParam };
  }

  if (mapping.customKeywords && mapping.customKeywords.length > 0) {
    return { type: "custom", param: mapping.customKeywords[0] };
  }

  return { type: "custom", param: extractKeyword(categoryName) };
}

function normalizeCategory(categoryName: string): string {
  // Remove extra whitespace, convert to uppercase, remove special characters
  let normalized = categoryName.trim().toUpperCase();

  // Remove common prefixes/suffixes
  normalized = normalized.replace(/^THE\s+/, "");
  normalized = normalized.replace(/\s+&\s+.+$/, ""); // "SCIENCE & NATURE" -> "SCIENCE"

  // Check for partial matches in our mapping
  const mappingKeys = Object.keys(CATEGORY_MAPPING);
  for (const key of mappingKeys) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return key;
    }
  }

  return normalized;
}

function extractKeyword(categoryName: string): string {
  const stopWords = ["the", "a", "an", "of", "in", "on", "and", "&"];
  const words = categoryName.toLowerCase().split(/\s+/);
  const meaningful = words.filter(w => !stopWords.includes(w) && w.length > 2);
  return meaningful[0] || categoryName.toLowerCase();
}
