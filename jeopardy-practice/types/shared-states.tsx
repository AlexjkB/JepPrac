export enum State {
  Question = "question",
  Answer = "answer",
  Answered = "answered"
}

export enum SeenState {
  Current = "current",
  Skipped = "skipped",
  Correct = "correct",
  Wrong = "wrong"
}

export type Question = {
  year: number;
  value: number;
  category: string;
  clue: string;
  answer: string;
  seenState: SeenState;
};

export type CategoryStats = {
  category: string;
  correct: number;
  wrong: number;
  skipped: number;
  totalSeen: number;
  accuracy: number;
  avgValue: number;
};

export type UserProfile = {
  categoryStats: Record<string, CategoryStats>;
  totalCorrect: number;
  totalWrong: number;
  totalSkipped: number;
  totalScore: number;
  questionsHistory: Question[];
  lastUpdated: string;
};