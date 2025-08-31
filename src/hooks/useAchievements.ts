import { useState, useEffect, useCallback } from 'react';
import { Achievement, AchievementProgress } from '../types/achievements';
import { ACHIEVEMENTS } from '../data/achievements';
import { GameState } from '../types/game';
import { LEETCODE_PROBLEMS } from '../data/leetcodeProblems';

export const useAchievements = (gameState: GameState) => {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const savedAchievements = localStorage.getItem('achievements');
    if (savedAchievements) {
      try {
        const parsed = JSON.parse(savedAchievements);
        return ACHIEVEMENTS.map(a => ({
          ...a,
          isUnlocked: parsed.includes(a.id),
          unlockedAt: parsed.includes(a.id) ? new Date().toISOString() : undefined
        }));
      } catch {
        return ACHIEVEMENTS;
      }
    }
    return ACHIEVEMENTS;
  });
  
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement | null>(null);
  const [progress, setProgress] = useState<AchievementProgress[]>([]);

  // Calculate progress for each achievement
  const calculateProgress = useCallback(() => {
    const progressData: AchievementProgress[] = [];
    
    achievements.forEach(achievement => {
      if (achievement.isUnlocked) return;
      
      let currentValue = 0;
      let targetValue = achievement.requirement.value;
      
      switch (achievement.requirement.type) {
        case 'problems_solved':
          currentValue = gameState.solvedProblems.length;
          break;
        case 'money_earned':
          currentValue = gameState.totalEarned;
          break;
        case 'businesses_owned':
          currentValue = Math.min(...gameState.businesses.map(b => b.owned));
          break;
        case 'streak_days':
          currentValue = gameState.problemStreak;
          break;
        case 'level_reached':
          currentValue = gameState.level;
          break;
        case 'managers_hired':
          currentValue = gameState.managers.filter(m => m.isHired).length;
          break;
        case 'domain_mastery':
          if (achievement.requirement.domain) {
            const domainProblems = LEETCODE_PROBLEMS.filter(p => p.domain === achievement.requirement.domain);
            const solvedInDomain = domainProblems.filter(p => gameState.solvedProblems.includes(p.id));
            currentValue = solvedInDomain.length === domainProblems.length ? 1 : 0;
            targetValue = 1;
          }
          break;
        case 'perfect_solutions':
          currentValue = gameState.perfectSolutions || 0;
          break;
      }
      
      progressData.push({
        achievementId: achievement.id,
        currentValue,
        targetValue,
        percentage: Math.min((currentValue / targetValue) * 100, 100)
      });
    });
    
    setProgress(progressData);
  }, [achievements, gameState]);

  // Check for newly unlocked achievements
  const checkAchievements = useCallback(() => {
    const updatedAchievements = [...achievements];
    let hasNewUnlock = false;
    let latestUnlocked: Achievement | null = null;
    let totalMultiplier = 1;
    let totalXP = 0;
    let totalMoney = 0;
    
    updatedAchievements.forEach(achievement => {
      if (achievement.isUnlocked) {
        if (achievement.reward.multiplier) {
          totalMultiplier *= achievement.reward.multiplier;
        }
        return;
      }
      
      let shouldUnlock = false;
      
      switch (achievement.requirement.type) {
        case 'problems_solved':
          shouldUnlock = gameState.solvedProblems.length >= achievement.requirement.value;
          break;
        case 'money_earned':
          shouldUnlock = gameState.totalEarned >= achievement.requirement.value;
          break;
        case 'businesses_owned':
          const minOwned = Math.min(...gameState.businesses.filter(b => b.isUnlocked).map(b => b.owned));
          shouldUnlock = minOwned >= achievement.requirement.value;
          break;
        case 'streak_days':
          shouldUnlock = gameState.problemStreak >= achievement.requirement.value;
          break;
        case 'level_reached':
          shouldUnlock = gameState.level >= achievement.requirement.value;
          break;
        case 'managers_hired':
          shouldUnlock = gameState.managers.filter(m => m.isHired).length >= achievement.requirement.value;
          break;
        case 'domain_mastery':
          if (achievement.requirement.domain) {
            const domainProblems = LEETCODE_PROBLEMS.filter(p => p.domain === achievement.requirement.domain);
            const solvedInDomain = domainProblems.filter(p => gameState.solvedProblems.includes(p.id));
            shouldUnlock = solvedInDomain.length === domainProblems.length && domainProblems.length > 0;
          }
          break;
        case 'perfect_solutions':
          shouldUnlock = (gameState.perfectSolutions || 0) >= achievement.requirement.value;
          break;
      }
      
      if (shouldUnlock) {
        achievement.isUnlocked = true;
        achievement.unlockedAt = new Date().toISOString();
        hasNewUnlock = true;
        latestUnlocked = achievement;
        
        // Accumulate rewards
        if (achievement.reward.xp) totalXP += achievement.reward.xp;
        if (achievement.reward.money) totalMoney += achievement.reward.money;
        if (achievement.reward.multiplier) totalMultiplier *= achievement.reward.multiplier;
      }
    });
    
    if (hasNewUnlock) {
      setAchievements(updatedAchievements);
      setNewlyUnlocked(latestUnlocked);
      
      // Save to localStorage
      const unlockedIds = updatedAchievements.filter(a => a.isUnlocked).map(a => a.id);
      localStorage.setItem('achievements', JSON.stringify(unlockedIds));
      
      // Return rewards to be applied
      return { xp: totalXP, money: totalMoney, multiplier: totalMultiplier };
    }
    
    return null;
  }, [achievements, gameState]);

  // Check achievements when game state changes
  useEffect(() => {
    const rewards = checkAchievements();
    calculateProgress();
    
    if (rewards) {
      // The parent component should handle applying these rewards
      const event = new CustomEvent('achievementUnlocked', { detail: rewards });
      window.dispatchEvent(event);
    }
  }, [gameState.solvedProblems.length, gameState.totalEarned, gameState.level, gameState.problemStreak, gameState.perfectSolutions]);

  const clearNotification = useCallback(() => {
    setNewlyUnlocked(null);
  }, []);

  const getUnlockedCount = () => achievements.filter(a => a.isUnlocked).length;
  const getTotalCount = () => achievements.length;
  
  const getActiveTitle = () => {
    const titledAchievements = achievements
      .filter(a => a.isUnlocked && a.reward.title)
      .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime());
    
    return titledAchievements[0]?.reward.title || null;
  };

  return {
    achievements,
    newlyUnlocked,
    progress,
    clearNotification,
    getUnlockedCount,
    getTotalCount,
    getActiveTitle,
    checkAchievements
  };
};