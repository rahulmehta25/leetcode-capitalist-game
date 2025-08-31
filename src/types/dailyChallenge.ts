export interface DailyChallenge {
  id: string;
  date: string; // ISO date string for the challenge date
  problemIds: string[]; // Array of problem IDs for today's challenges
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  theme?: string; // Optional theme (e.g., "Array Day", "Dynamic Programming")
  rewards: {
    xp: number;
    money: number;
    streakBonus?: number; // Extra reward for maintaining streak
  };
  timeLimit?: number; // Optional time limit in minutes
  isCompleted: boolean;
  completedAt?: string;
  hintsAllowed: number;
  perfectBonus: number; // Bonus for completing without hints
}

export interface DailyChallengeProgress {
  challengeId: string;
  problemsCompleted: string[];
  startedAt: string;
  timeSpent: number; // in seconds
  hintsUsed: number;
}