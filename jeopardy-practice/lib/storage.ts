import { UserProfile, Question, CategoryStats, SeenState } from "@/types/shared-states";

const PROFILE_KEY = "jeopardy_user_profile";
const MAX_HISTORY = 200;

export function initializeProfile(): UserProfile {
  return {
    categoryStats: {},
    totalCorrect: 0,
    totalWrong: 0,
    totalSkipped: 0,
    totalScore: 0,
    questionsHistory: [],
    lastUpdated: new Date().toISOString(),
  };
}

export function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem(PROFILE_KEY);
    if (!stored) {
      return null;
    }

    const profile = JSON.parse(stored) as UserProfile;

    if (!profile.categoryStats || typeof profile.totalCorrect !== "number") {
      return null;
    }

    return profile;
  } catch (error) {
    console.error("Failed to load profile:", error);
    return null;
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    profile.lastUpdated = new Date().toISOString();
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error("Failed to save profile:", error);
  }
}

export function updateCategoryStats(
  profile: UserProfile,
  question: Question,
  result: SeenState
): UserProfile {
  const categoryName = question.category;
  const currentStats = profile.categoryStats[categoryName] || {
    category: categoryName,
    correct: 0,
    wrong: 0,
    skipped: 0,
    totalSeen: 0,
    accuracy: 0,
    avgValue: 0,
  };

  const updatedStats = { ...currentStats };
  updatedStats.totalSeen += 1;

  if (result === SeenState.Correct) {
    updatedStats.correct += 1;
  } else if (result === SeenState.Wrong) {
    updatedStats.wrong += 1;
  } else if (result === SeenState.Skipped) {
    updatedStats.skipped += 1;
  }

  const totalAttempted = updatedStats.correct + updatedStats.wrong;
  updatedStats.accuracy = totalAttempted > 0 ? updatedStats.correct / totalAttempted : 0;

  const totalValue = (currentStats.avgValue * currentStats.totalSeen) + question.value;
  updatedStats.avgValue = totalValue / updatedStats.totalSeen;

  const newHistory = [...profile.questionsHistory, question];
  if (newHistory.length > MAX_HISTORY) {
    newHistory.shift();
  }

  let totalCorrect = profile.totalCorrect;
  let totalWrong = profile.totalWrong;
  let totalSkipped = profile.totalSkipped;
  let totalScore = profile.totalScore;

  if (result === SeenState.Correct) {
    totalCorrect += 1;
    totalScore += question.value;
  } else if (result === SeenState.Wrong) {
    totalWrong += 1;
    totalScore -= question.value;
  } else if (result === SeenState.Skipped) {
    totalSkipped += 1;
  }

  return {
    ...profile,
    categoryStats: {
      ...profile.categoryStats,
      [categoryName]: updatedStats,
    },
    totalCorrect,
    totalWrong,
    totalSkipped,
    totalScore,
    questionsHistory: newHistory,
  };
}

export function resetProfile(): UserProfile {
  const fresh = initializeProfile();
  saveProfile(fresh);
  return fresh;
}
