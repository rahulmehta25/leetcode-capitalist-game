import { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { GameHeader } from './GameHeader';
import { BusinessCard } from './BusinessCard';
import { FloatingMoney } from './FloatingMoney';
import { ProblemModal } from './ProblemModal';
import { CodingProblem } from '../types/leetcode';
import { LEETCODE_PROBLEMS } from '../data/leetcodeProblems';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Code2, Trophy, Zap } from 'lucide-react';

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
  } = useGameState();
  
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem | null>(null);
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
  
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
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <GameHeader gameState={gameState} formatMoney={formatMoney} />
      
      <main className="max-w-4xl mx-auto p-4 space-y-4">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Code2 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Code Capital Academy</h2>
          </div>
          <p className="text-muted-foreground">
            Master programming concepts by solving LeetCode problems and earn rewards!
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Badge variant="outline" className="px-3 py-1">
              <Trophy className="w-4 h-4 mr-1" />
              Level {gameState.level}
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <Zap className="w-4 h-4 mr-1" />
              {gameState.xp} XP
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              Problems Solved: {gameState.solvedProblems.length}
            </Badge>
            {gameState.problemStreak > 0 && (
              <Badge className="px-3 py-1 bg-orange-500">
                {gameState.problemStreak} Day Streak!
              </Badge>
            )}
          </div>
          <div className="w-full max-w-md mx-auto mt-2">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                style={{ width: `${calculateLevelProgress() * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {(calculateLevelProgress() * 100).toFixed(0)}% to Level {gameState.level + 1}
            </p>
          </div>
        </div>

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
        onSolve={(problemId, xp, money) => {
          handleProblemSolved(problemId, xp, money);
          setIsProblemModalOpen(false);
          setSelectedProblem(null);
        }}
      />
    </div>
  );
};