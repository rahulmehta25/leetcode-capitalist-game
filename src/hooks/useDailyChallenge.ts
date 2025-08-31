import { useState, useEffect, useCallback } from 'react';
import { DailyChallenge, DailyChallengeProgress } from '../types/dailyChallenge';
import { LEETCODE_PROBLEMS } from '../data/leetcodeProblems';
import { CodingProblem } from '../types/leetcode';

const DAILY_CHALLENGE_KEY = 'daily-challenges';
const CHALLENGE_PROGRESS_KEY = 'daily-challenge-progress';

export const useDailyChallenge = () => {
  const [todayChallenge, setTodayChallenge] = useState<DailyChallenge | null>(null);
  const [progress, setProgress] = useState<DailyChallengeProgress | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Generate a deterministic challenge for a given date
  const generateDailyChallenge = (date: Date): DailyChallenge => {
    const dateString = date.toISOString().split('T')[0];
    const seed = dateString.split('-').reduce((acc, val) => acc + parseInt(val), 0);
    
    // Deterministically select problems based on the date
    const allProblems = [...LEETCODE_PROBLEMS];
    const shuffled = allProblems.sort((a, b) => {
      const aHash = a.id.charCodeAt(0) * seed;
      const bHash = b.id.charCodeAt(0) * seed;
      return aHash - bHash;
    });
    
    // Select difficulty based on day of week
    const dayOfWeek = date.getDay();
    let difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
    let problemCount: number;
    let baseXP: number;
    let baseMoney: number;
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // Weekend: Mixed difficulty, more problems
      difficulty = 'mixed';
      problemCount = 5;
      baseXP = 500;
      baseMoney = 2500;
    } else if (dayOfWeek === 1 || dayOfWeek === 2) {
      // Monday/Tuesday: Easy
      difficulty = 'easy';
      problemCount = 3;
      baseXP = 200;
      baseMoney = 1000;
    } else if (dayOfWeek === 3 || dayOfWeek === 4) {
      // Wednesday/Thursday: Medium
      difficulty = 'medium';
      problemCount = 3;
      baseXP = 350;
      baseMoney = 1750;
    } else {
      // Friday: Hard
      difficulty = 'hard';
      problemCount = 2;
      baseXP = 600;
      baseMoney = 3000;
    }
    
    // Filter problems by difficulty if not mixed
    let eligibleProblems = shuffled;
    if (difficulty !== 'mixed') {
      eligibleProblems = shuffled.filter(p => 
        p.difficulty.toLowerCase() === difficulty
      );
    }
    
    // Select problems
    const selectedProblems = eligibleProblems.slice(0, Math.min(problemCount, eligibleProblems.length));
    
    // Determine theme based on most common domain
    const domains = selectedProblems.map(p => p.domain).filter(Boolean);
    const domainCounts: Record<string, number> = {};
    domains.forEach(domain => {
      if (domain) domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    });
    const theme = Object.entries(domainCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    
    return {
      id: `daily-${dateString}`,
      date: dateString,
      problemIds: selectedProblems.map(p => p.id),
      difficulty,
      theme: theme ? `${theme.charAt(0).toUpperCase() + theme.slice(1)} Focus` : undefined,
      rewards: {
        xp: baseXP,
        money: baseMoney,
        streakBonus: Math.floor(baseXP * 0.5),
      },
      timeLimit: difficulty === 'hard' ? 60 : difficulty === 'medium' ? 45 : 30,
      isCompleted: false,
      hintsAllowed: difficulty === 'hard' ? 5 : difficulty === 'medium' ? 3 : 2,
      perfectBonus: Math.floor(baseXP * 0.3),
    };
  };

  // Load or generate today's challenge
  useEffect(() => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    // Load saved challenges
    const savedChallenges = localStorage.getItem(DAILY_CHALLENGE_KEY);
    let challenges: DailyChallenge[] = [];
    
    if (savedChallenges) {
      try {
        challenges = JSON.parse(savedChallenges);
      } catch {
        challenges = [];
      }
    }
    
    // Check if we have today's challenge
    let challenge = challenges.find(c => c.date === todayString);
    
    if (!challenge) {
      // Generate new challenge for today
      challenge = generateDailyChallenge(today);
      challenges.push(challenge);
      
      // Keep only last 30 days of challenges
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      challenges = challenges.filter(c => new Date(c.date) >= thirtyDaysAgo);
      
      localStorage.setItem(DAILY_CHALLENGE_KEY, JSON.stringify(challenges));
    }
    
    setTodayChallenge(challenge);
    
    // Load progress
    const savedProgress = localStorage.getItem(CHALLENGE_PROGRESS_KEY);
    if (savedProgress) {
      try {
        const progressData = JSON.parse(savedProgress);
        if (progressData.challengeId === challenge.id) {
          setProgress(progressData);
        }
      } catch {
        // Invalid progress data
      }
    }
  }, []);

  // Update timer
  useEffect(() => {
    if (!todayChallenge || !progress || todayChallenge.isCompleted) {
      setTimeRemaining(null);
      return;
    }
    
    if (!todayChallenge.timeLimit) {
      setTimeRemaining(null);
      return;
    }
    
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - new Date(progress.startedAt).getTime()) / 1000);
      const limit = todayChallenge.timeLimit * 60;
      const remaining = Math.max(0, limit - elapsed);
      setTimeRemaining(remaining);
      
      if (remaining === 0) {
        // Time's up!
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [todayChallenge, progress]);

  const startChallenge = useCallback(() => {
    if (!todayChallenge) return;
    
    const newProgress: DailyChallengeProgress = {
      challengeId: todayChallenge.id,
      problemsCompleted: [],
      startedAt: new Date().toISOString(),
      timeSpent: 0,
      hintsUsed: 0,
    };
    
    setProgress(newProgress);
    localStorage.setItem(CHALLENGE_PROGRESS_KEY, JSON.stringify(newProgress));
  }, [todayChallenge]);

  const completeProblem = useCallback((problemId: string, hintsUsed: number) => {
    if (!progress || !todayChallenge) return;
    
    const updatedProgress = {
      ...progress,
      problemsCompleted: [...progress.problemsCompleted, problemId],
      timeSpent: Math.floor((Date.now() - new Date(progress.startedAt).getTime()) / 1000),
      hintsUsed: progress.hintsUsed + hintsUsed,
    };
    
    setProgress(updatedProgress);
    localStorage.setItem(CHALLENGE_PROGRESS_KEY, JSON.stringify(updatedProgress));
    
    // Check if challenge is complete
    if (updatedProgress.problemsCompleted.length === todayChallenge.problemIds.length) {
      completeChallenge();
    }
  }, [progress, todayChallenge]);

  const completeChallenge = useCallback(() => {
    if (!todayChallenge || !progress) return;
    
    const completedChallenge = {
      ...todayChallenge,
      isCompleted: true,
      completedAt: new Date().toISOString(),
    };
    
    // Update saved challenges
    const savedChallenges = localStorage.getItem(DAILY_CHALLENGE_KEY);
    if (savedChallenges) {
      try {
        const challenges: DailyChallenge[] = JSON.parse(savedChallenges);
        const index = challenges.findIndex(c => c.id === todayChallenge.id);
        if (index !== -1) {
          challenges[index] = completedChallenge;
          localStorage.setItem(DAILY_CHALLENGE_KEY, JSON.stringify(challenges));
        }
      } catch {
        // Error updating challenges
      }
    }
    
    setTodayChallenge(completedChallenge);
    
    // Calculate rewards
    let totalXP = todayChallenge.rewards.xp;
    let totalMoney = todayChallenge.rewards.money;
    
    // Perfect bonus (no hints used)
    if (progress.hintsUsed === 0) {
      totalXP += todayChallenge.perfectBonus;
      totalMoney += Math.floor(todayChallenge.perfectBonus * 5);
    }
    
    // Time bonus (completed within time limit)
    if (todayChallenge.timeLimit && timeRemaining && timeRemaining > 0) {
      const timeBonus = Math.floor((timeRemaining / (todayChallenge.timeLimit * 60)) * 100);
      totalXP += timeBonus;
      totalMoney += timeBonus * 10;
    }
    
    // Return rewards to be applied
    return { xp: totalXP, money: totalMoney };
  }, [todayChallenge, progress, timeRemaining]);

  const getChallengeProblems = (): CodingProblem[] => {
    if (!todayChallenge) return [];
    return todayChallenge.problemIds
      .map(id => LEETCODE_PROBLEMS.find(p => p.id === id))
      .filter(Boolean) as CodingProblem[];
  };

  const getDailyChallengeStreak = (): number => {
    const savedChallenges = localStorage.getItem(DAILY_CHALLENGE_KEY);
    if (!savedChallenges) return 0;
    
    try {
      const challenges: DailyChallenge[] = JSON.parse(savedChallenges);
      const sortedChallenges = challenges
        .filter(c => c.isCompleted)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      if (sortedChallenges.length === 0) return 0;
      
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < sortedChallenges.length; i++) {
        const challengeDate = new Date(sortedChallenges[i].date);
        challengeDate.setHours(0, 0, 0, 0);
        
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);
        
        if (challengeDate.getTime() === expectedDate.getTime()) {
          streak++;
        } else {
          break;
        }
      }
      
      return streak;
    } catch {
      return 0;
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    todayChallenge,
    progress,
    timeRemaining,
    startChallenge,
    completeProblem,
    getChallengeProblems,
    getDailyChallengeStreak,
    formatTime,
  };
};