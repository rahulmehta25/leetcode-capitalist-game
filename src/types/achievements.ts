export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'problems' | 'money' | 'businesses' | 'streak' | 'special';
  requirement: {
    type: 'problems_solved' | 'money_earned' | 'businesses_owned' | 'streak_days' | 'level_reached' | 'domain_mastery' | 'perfect_solutions' | 'managers_hired';
    value: number;
    domain?: string; // For domain-specific achievements
  };
  reward: {
    xp?: number;
    money?: number;
    multiplier?: number;
    title?: string;
  };
  isUnlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface AchievementProgress {
  achievementId: string;
  currentValue: number;
  targetValue: number;
  percentage: number;
}