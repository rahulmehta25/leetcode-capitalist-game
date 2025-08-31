import { useState, useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useAchievements } from '../hooks/useAchievements';
import { useDailyChallenge } from '../hooks/useDailyChallenge';
import { GameHeader } from './GameHeader';
import { BusinessCard } from './BusinessCard';
import { FloatingMoney } from './FloatingMoney';
import { ProblemModal } from './ProblemModal';
import { AchievementNotification } from './AchievementNotification';
import { AchievementsModal } from './AchievementsModal';
import { DailyChallengeCard } from './DailyChallengeCard';
import { CodingProblem } from '../types/leetcode';
import { LEETCODE_PROBLEMS } from '../data/leetcodeProblems';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Code2, Trophy, Zap, Award } from 'lucide-react';

export const Game = () => {
  const {
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
    applyAchievementRewards,
  } = useGameState();
  
  const {
    achievements,
    newlyUnlocked,
    progress,
    clearNotification,
    getUnlockedCount,
    getTotalCount,
    getActiveTitle,
  } = useAchievements(gameState);
  
  const {
    todayChallenge,
    progress: challengeProgress,
    timeRemaining,
    startChallenge,
    completeProblem,
    getChallengeProblems,
    getDailyChallengeStreak,
    formatTime,
  } = useDailyChallenge();
  
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem | null>(null);
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const [isDailyChallenge, setIsDailyChallenge] = useState(false);
  
  // Listen for achievement rewards
  useEffect(() => {
    const handleAchievementRewards = (event: CustomEvent) => {
      if (event.detail) {
        applyAchievementRewards(event.detail);
      }
    };
    
    window.addEventListener('achievementUnlocked', handleAchievementRewards as EventListener);
    return () => {
      window.removeEventListener('achievementUnlocked', handleAchievementRewards as EventListener);
    };
  }, [applyAchievementRewards]);
  
  const getAvailableProblems = (domain: string): CodingProblem[] => {
    return LEETCODE_PROBLEMS.filter(
      p => p.domain === domain && !gameState.solvedProblems.includes(p.id)
    );
  };
  
  const handleSolveProblem = (domain: string) => {
    const problems = getAvailableProblems(domain);
    if (problems.length > 0) {
      setSelectedProblem(problems[0]);
      setIsProblemModalOpen(true);
      setIsDailyChallenge(false);
    }
  };
  
  const handleDailyChallengeProblem = (problem: CodingProblem) => {
    setSelectedProblem(problem);
    setIsProblemModalOpen(true);
    setIsDailyChallenge(true);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 cyber-grid opacity-20" />
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-green-900/20" 
           style={{
             backgroundSize: '400% 400%',
             animation: 'gradient-shift 15s ease infinite'
           }} />
      
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Floating Balance Overlay */}
      <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-xl opacity-50 animate-pulse group-hover:opacity-70 transition-opacity" />
          <div className="relative glass-dark p-4 rounded-2xl border border-green-500/30 neon-border min-w-[280px] hover:scale-105 transition-transform cursor-default">
            <div className="flex items-center gap-3">
              <div className="text-3xl animate-float">💰</div>
              <div className="flex-1">
                <div className="text-xs text-white/60 uppercase tracking-wider font-semibold">Current Balance</div>
                <div className="text-2xl font-black text-white holographic money-counter">
                  {formatMoney(gameState.money)}
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50">Total Earned</span>
                <span className="text-white/80 font-semibold">{formatMoney(gameState.totalEarned)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50">Level</span>
                <span className="text-yellow-400 font-semibold">Lvl {gameState.level}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50">Achievements</span>
                <span className="text-purple-400 font-semibold">{getUnlockedCount()}/{getTotalCount()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Achievements Button */}
      <div className="fixed top-20 right-6 z-40">
        <Button
          onClick={() => setIsAchievementsModalOpen(true)}
          variant="outline"
          className="glass-dark border-purple-500/30 hover:border-purple-500/50 hover:scale-105 transition-all"
        >
          <Award className="w-5 h-5 mr-2 text-purple-400" />
          <span className="font-semibold">Achievements</span>
          <Badge className="ml-2 bg-purple-500/20 text-purple-400">
            {getUnlockedCount()}/{getTotalCount()}
          </Badge>
        </Button>
      </div>

      <GameHeader gameState={gameState} formatMoney={formatMoney} />
      
      <main className="max-w-4xl mx-auto p-4 space-y-4 relative z-10">
        <div className="text-center mb-6 glass-dark rounded-2xl p-8 animate-slide-up">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Code2 className="w-8 h-8 text-primary animate-float" />
            <h2 className="text-3xl font-bold gradient-text">Code Capital Academy</h2>
          </div>
          <p className="text-muted-foreground text-lg">
            Master programming concepts by solving LeetCode problems and earn rewards!
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Badge className="px-4 py-2 neon-border bg-gradient-to-r from-blue-600/20 to-purple-600/20">
              <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
              <span className="font-bold">Level {gameState.level}</span>
            </Badge>
            <Badge className="px-4 py-2 neon-border bg-gradient-to-r from-green-600/20 to-blue-600/20">
              <Zap className="w-5 h-5 mr-2 text-yellow-300 animate-pulse" />
              <span className="font-bold">{gameState.xp} XP</span>
            </Badge>
            <Badge className="px-4 py-2 hover-lift bg-gradient-to-r from-purple-600/20 to-pink-600/20">
              <span className="font-semibold">Problems Solved: {gameState.solvedProblems.length}</span>
            </Badge>
            {gameState.problemStreak > 0 && (
              <Badge className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 animate-pulse-glow">
                <span className="font-bold text-white">{gameState.problemStreak} Day Streak! 🔥</span>
              </Badge>
            )}
          </div>
          <div className="w-full max-w-md mx-auto mt-6">
            <div className="h-3 bg-black/40 rounded-full overflow-hidden backdrop-blur-sm">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 transition-all shimmer"
                style={{ width: `${calculateLevelProgress() * 100}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2 font-medium">
              <span className="holographic">{(calculateLevelProgress() * 100).toFixed(0)}%</span> to Level {gameState.level + 1}
            </p>
          </div>
        </div>
        
        {/* Daily Challenge Card */}
        {todayChallenge && (
          <DailyChallengeCard
            challenge={todayChallenge}
            progress={challengeProgress}
            problems={getChallengeProblems()}
            timeRemaining={timeRemaining}
            streak={getDailyChallengeStreak()}
            onStart={startChallenge}
            onSelectProblem={handleDailyChallengeProblem}
            formatTime={formatTime}
          />
        )}

        <div className="space-y-4">
          {gameState.businesses.map((business) => {
            const manager = gameState.managers.find(m => m.businessId === business.id);
            const cost = calculateBusinessCost(business);
            const canAfford = gameState.money >= cost;
            const canAffordManager = manager ? gameState.money >= manager.cost : false;

            const availableProblems = getAvailableProblems(business.problemDomain || '');
            const solvedInDomain = LEETCODE_PROBLEMS.filter(
              p => p.domain === business.problemDomain && gameState.solvedProblems.includes(p.id)
            ).length;
            const totalInDomain = LEETCODE_PROBLEMS.filter(
              p => p.domain === business.problemDomain
            ).length;
            
            return (
              <div key={business.id} className="space-y-2">
                <BusinessCard
                  business={business}
                  manager={manager}
                  formatMoney={formatMoney}
                  calculateCost={calculateBusinessCost}
                  calculateRevenue={calculateBusinessRevenue}
                  onPurchase={purchaseBusiness}
                  onManualCollect={manualCollect}
                  onHireManager={hireManager}
                  canAfford={canAfford}
                  canAffordManager={canAffordManager}
                />
                {business.owned > 0 && business.problemDomain && (
                  <div className="ml-4 p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          Domain Progress: {solvedInDomain}/{totalInDomain} problems solved
                        </p>
                        <div className="w-full bg-muted rounded-full h-2 mt-1">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${(solvedInDomain / totalInDomain) * 100}%` }}
                          />
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleSolveProblem(business.problemDomain!)}
                        disabled={availableProblems.length === 0}
                        className="ml-4"
                      >
                        {availableProblems.length === 0 ? 'All Solved!' : 'Solve Problem'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm">
            More businesses unlock as you earn money. Keep growing your empire!
          </p>
        </div>
      </main>

      <FloatingMoney floatingMoney={floatingMoney} formatMoney={formatMoney} />
      
      <ProblemModal
        problem={selectedProblem}
        isOpen={isProblemModalOpen}
        onClose={() => {
          setIsProblemModalOpen(false);
          setSelectedProblem(null);
        }}
        onSolve={(problemId, xp, money, hintsUsed = 0) => {
          handleProblemSolved(problemId, xp, money);
          if (isDailyChallenge) {
            completeProblem(problemId, hintsUsed);
          }
          setIsProblemModalOpen(false);
          setSelectedProblem(null);
          setIsDailyChallenge(false);
        }}
      />
      
      <AchievementsModal
        isOpen={isAchievementsModalOpen}
        onClose={() => setIsAchievementsModalOpen(false)}
        achievements={achievements}
        progress={progress}
      />
      
      <AchievementNotification
        achievement={newlyUnlocked}
        onClose={clearNotification}
      />
    </div>
  );
};