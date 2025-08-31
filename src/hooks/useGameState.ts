import { useState, useEffect, useCallback } from 'react';
import { GameState, Business, Manager, FloatingMoney } from '../types/game';
import { INITIAL_BUSINESSES, MANAGERS } from '../data/businesses';

const SAVE_KEY = 'rahuls-capital-save';
const AUTO_SAVE_INTERVAL = 5000; // Save every 5 seconds

const initialGameState: GameState = {
  money: 50,
  totalEarned: 0,
  businesses: INITIAL_BUSINESSES,
  managers: MANAGERS,
  knowledgePoints: 0,
  prestigeLevel: 0,
  lastSaveTime: Date.now(),
  xp: 0,
  level: 1,
  solvedProblems: [],
  problemStreak: 0,
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [floatingMoney, setFloatingMoney] = useState<FloatingMoney[]>([]);

  // Load saved game on mount
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        // Merge businesses with new fields
        const mergedBusinesses = INITIAL_BUSINESSES.map(defaultBusiness => {
          const savedBusiness = parsedState.businesses?.find((b: any) => b.id === defaultBusiness.id);
          return savedBusiness ? {
            ...defaultBusiness,
            ...savedBusiness,
            problemDomain: defaultBusiness.problemDomain,
            solvedProblems: savedBusiness.solvedProblems || [],
          } : defaultBusiness;
        });
        
        setGameState({
          ...initialGameState,
          ...parsedState,
          businesses: mergedBusinesses,
          // Ensure new properties exist for backward compatibility
          xp: parsedState.xp ?? 0,
          level: parsedState.level ?? 1,
          solvedProblems: parsedState.solvedProblems ?? [],
          problemStreak: parsedState.problemStreak ?? 0,
          lastProblemDate: parsedState.lastProblemDate,
          lastSaveTime: Date.now(),
        });
      } catch (error) {
        console.error('Failed to load saved game:', error);
      }
    }
  }, []);

  // Auto-save game state
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(current => {
        const stateToSave = { ...current, lastSaveTime: Date.now() };
        localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
        return stateToSave;
      });
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Production cycle for automated businesses
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(current => {
        const now = Date.now();
        let newMoney = current.money;
        let newTotalEarned = current.totalEarned;

        const updatedBusinesses = current.businesses.map(business => {
          // Ensure problemDomain and solvedProblems exist
          const businessWithDefaults = {
            ...business,
            problemDomain: business.problemDomain || '',
            solvedProblems: business.solvedProblems || [],
          };
          
          if (businessWithDefaults.isAutomatic && businessWithDefaults.owned > 0) {
            const timeSinceLastProduction = now - businessWithDefaults.lastProduction;
            
            if (timeSinceLastProduction >= businessWithDefaults.productionTime) {
              const revenue = calculateBusinessRevenue(businessWithDefaults);
              newMoney += revenue;
              newTotalEarned += revenue;
              
              return {
                ...businessWithDefaults,
                lastProduction: now,
              };
            }
          }
          return businessWithDefaults;
        });

        // Unlock new businesses based on total earned
        const unlockedBusinesses = updatedBusinesses.map(business => ({
          ...business,
          isUnlocked: business.isUnlocked || newTotalEarned >= business.unlockCondition,
        }));

        if (newMoney !== current.money || newTotalEarned !== current.totalEarned) {
          return {
            ...current,
            money: newMoney,
            totalEarned: newTotalEarned,
            businesses: unlockedBusinesses,
          };
        }

        return {
          ...current,
          businesses: unlockedBusinesses,
        };
      });
    }, 500); // Check every 500ms for smoother automation

    return () => clearInterval(interval);
  }, []);

  const calculateBusinessCost = (business: Business): number => {
    return Math.floor(business.baseCost * Math.pow(1.15, business.owned));
  };

  const calculateBusinessRevenue = (business: Business): number => {
    const manager = gameState.managers.find(m => m.businessId === business.id && m.isHired);
    const managerMultiplier = manager ? manager.multiplier : 1;
    return Math.floor(business.baseRevenue * business.owned * business.multiplier * managerMultiplier);
  };

  const manualCollect = useCallback((business: Business, x: number, y: number) => {
    if (business.owned === 0) return;

    const revenue = calculateBusinessRevenue(business);
    
    setGameState(current => ({
      ...current,
      money: current.money + revenue,
      totalEarned: current.totalEarned + revenue,
    }));

    // Add floating money animation
    const floatingId = Date.now().toString();
    setFloatingMoney(current => [...current, {
      id: floatingId,
      amount: revenue,
      x,
      y,
      startTime: Date.now(),
    }]);

    // Remove floating money after animation
    setTimeout(() => {
      setFloatingMoney(current => current.filter(fm => fm.id !== floatingId));
    }, 1000);
  }, [gameState.managers]);

  const purchaseBusiness = useCallback((businessId: string) => {
    setGameState(current => {
      const business = current.businesses.find(b => b.id === businessId);
      if (!business || !business.isUnlocked) return current;

      const cost = calculateBusinessCost(business);
      if (current.money < cost) return current;

      const updatedBusinesses = current.businesses.map(b =>
        b.id === businessId
          ? { ...b, owned: b.owned + 1, lastProduction: Date.now() }
          : b
      );

      return {
        ...current,
        money: current.money - cost,
        businesses: updatedBusinesses,
      };
    });
  }, []);

  const hireManager = useCallback((managerId: string) => {
    setGameState(current => {
      const manager = current.managers.find(m => m.id === managerId);
      if (!manager || manager.isHired) return current;

      if (current.money < manager.cost) return current;

      const updatedManagers = current.managers.map(m =>
        m.id === managerId ? { ...m, isHired: true } : m
      );

      const updatedBusinesses = current.businesses.map(b =>
        b.id === manager.businessId ? { ...b, isAutomatic: true } : b
      );

      return {
        ...current,
        money: current.money - manager.cost,
        managers: updatedManagers,
        businesses: updatedBusinesses,
      };
    });
  }, []);

  const formatMoney = (amount: number): string => {
    if (amount < 1000) return `$${amount.toFixed(0)}`;
    if (amount < 1000000) return `$${(amount / 1000).toFixed(1)}K`;
    if (amount < 1000000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount < 1000000000000) return `$${(amount / 1000000000).toFixed(1)}B`;
    return `$${(amount / 1000000000000).toFixed(1)}T`;
  };

  const handleProblemSolved = useCallback((problemId: string, earnedXP: number, earnedMoney: number) => {
    setGameState(current => {
      const newXP = current.xp + earnedXP;
      const newLevel = Math.floor(newXP / 100) + 1; // Level up every 100 XP
      const today = new Date().toDateString();
      const isNewStreak = current.lastProblemDate !== today;
      
      return {
        ...current,
        money: current.money + earnedMoney,
        totalEarned: current.totalEarned + earnedMoney,
        xp: newXP,
        level: newLevel,
        solvedProblems: [...current.solvedProblems, problemId],
        problemStreak: isNewStreak ? current.problemStreak + 1 : current.problemStreak,
        lastProblemDate: today,
      };
    });
  }, []);

  const calculateLevelProgress = (): number => {
    return (gameState.xp % 100) / 100;
  };

  return {
    gameState,
    floatingMoney,
    manualCollect,
    purchaseBusiness,
    hireManager,
    calculateBusinessCost,
    calculateBusinessRevenue,
    formatMoney,
    handleProblemSolved,
    calculateLevelProgress,
  };
};