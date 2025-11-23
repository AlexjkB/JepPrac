import { CategoryStats, UserProfile } from "@/types/shared-states";

export type CategoryInsight = CategoryStats & {
  performanceLevel: "excellent" | "good" | "needs-work" | "weak";
};

export function getCategoryInsights(profile: UserProfile): CategoryInsight[] {
  const categories = Object.values(profile.categoryStats);

  const insights: CategoryInsight[] = categories.map((stat) => {
    let performanceLevel: CategoryInsight["performanceLevel"];

    if (stat.accuracy >= 0.8) {
      performanceLevel = "excellent";
    } else if (stat.accuracy >= 0.6) {
      performanceLevel = "good";
    } else if (stat.accuracy >= 0.4) {
      performanceLevel = "needs-work";
    } else {
      performanceLevel = "weak";
    }

    return {
      ...stat,
      performanceLevel,
    };
  });

  return insights;
}

export function getWeakPoints(profile: UserProfile, limit: number = 3): CategoryInsight[] {
  const insights = getCategoryInsights(profile);

  const categoriesWithAttempts = insights.filter(
    (stat) => stat.correct + stat.wrong >= 3
  );

  return categoriesWithAttempts
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, limit);
}

export function getStrongCategories(profile: UserProfile, limit: number = 3): CategoryInsight[] {
  const insights = getCategoryInsights(profile);

  const categoriesWithAttempts = insights.filter(
    (stat) => stat.correct + stat.wrong >= 3
  );

  return categoriesWithAttempts
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, limit);
}

export function getAllCategoriesSorted(
  profile: UserProfile,
  sortBy: "accuracy" | "totalSeen" | "category" = "accuracy"
): CategoryInsight[] {
  const insights = getCategoryInsights(profile);

  if (sortBy === "accuracy") {
    return insights.sort((a, b) => b.accuracy - a.accuracy);
  } else if (sortBy === "totalSeen") {
    return insights.sort((a, b) => b.totalSeen - a.totalSeen);
  } else {
    return insights.sort((a, b) => a.category.localeCompare(b.category));
  }
}

export function getPerformanceColor(accuracy: number): string {
  if (accuracy >= 0.8) return "text-green-500";
  if (accuracy >= 0.6) return "text-yellow-500";
  if (accuracy >= 0.4) return "text-orange-500";
  return "text-red-500";
}

export function getPerformanceBadgeVariant(
  accuracy: number
): "default" | "secondary" | "destructive" | "outline" {
  if (accuracy >= 0.7) return "default";
  if (accuracy >= 0.5) return "secondary";
  return "destructive";
}
