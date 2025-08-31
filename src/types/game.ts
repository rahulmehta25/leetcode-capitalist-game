export interface Business {
  id: string;
  name: string;
  description: string;
  icon: string;
  baseCost: number;
  baseRevenue: number;
  owned: number;
  multiplier: number;
  isUnlocked: boolean;
  unlockCondition: number; // Total money needed to unlock
  productionTime: number; // Time in milliseconds for one production cycle
  lastProduction: number; // Timestamp of last production
  isAutomatic: boolean; // Has manager hired
  problemDomain?: string; // Programming domain for problems
  solvedProblems?: string[]; // IDs of solved problems in this domain
}

export interface Manager {
  id: string;
  businessId: string;
  name: string;
  description: string;
  cost: number;
  isHired: boolean;
  multiplier: number;
}

export interface GameState {
  money: number;
  totalEarned: number;
  businesses: Business[];
  managers: Manager[];
  knowledgePoints: number;
  prestigeLevel: number;
  lastSaveTime: number;
  xp: number; // Experience points from solving problems
  level: number; // Developer level based on XP
  solvedProblems: string[]; // All solved problem IDs
  problemStreak: number; // Current daily streak
  lastProblemDate?: string; // Last date a problem was solved
}

export interface FloatingMoney {
  id: string;
  amount: number;
  x: number;
  y: number;
  startTime: number;
}