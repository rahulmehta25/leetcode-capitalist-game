import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { GameState } from '../types/game';
import { LEETCODE_PROBLEMS } from '../data/leetcodeProblems';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award, 
  DollarSign, 
  Code2, 
  Briefcase, 
  Users,
  Flame,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { useMemo } from 'react';

interface StatisticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  formatMoney: (amount: number) => string;
  dailyChallengeStreak?: number;
  achievementCount?: { unlocked: number; total: number };
}

export const StatisticsDashboard = ({
  isOpen,
  onClose,
  gameState,
  formatMoney,
  dailyChallengeStreak = 0,
  achievementCount = { unlocked: 0, total: 0 },
}: StatisticsDashboardProps) => {
  
  const statistics = useMemo(() => {
    // Problem Statistics
    const problemsByDifficulty = gameState.solvedProblems.reduce((acc, problemId) => {
      const problem = LEETCODE_PROBLEMS.find(p => p.id === problemId);
      if (problem) {
        acc[problem.difficulty] = (acc[problem.difficulty] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Domain Statistics
    const problemsByDomain = gameState.solvedProblems.reduce((acc, problemId) => {
      const problem = LEETCODE_PROBLEMS.find(p => p.id === problemId);
      if (problem && problem.domain) {
        acc[problem.domain] = (acc[problem.domain] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Business Statistics
    const totalBusinessesOwned = gameState.businesses.reduce((sum, b) => sum + b.owned, 0);
    const automatedBusinesses = gameState.businesses.filter(b => b.isAutomatic && b.owned > 0).length;
    const managersHired = gameState.managers.filter(m => m.isHired).length;

    // Revenue Statistics
    const averageRevenuePerBusiness = totalBusinessesOwned > 0 
      ? gameState.totalEarned / totalBusinessesOwned 
      : 0;
    
    // Problem Completion Rate
    const totalProblems = LEETCODE_PROBLEMS.length;
    const completionRate = (gameState.solvedProblems.length / totalProblems) * 100;

    // XP per Level
    const xpPerLevel = gameState.level > 0 ? gameState.xp / gameState.level : 0;

    // Perfect Solutions Rate
    const perfectRate = gameState.perfectSolutions && gameState.solvedProblems.length > 0
      ? (gameState.perfectSolutions / gameState.solvedProblems.length) * 100
      : 0;

    return {
      problemsByDifficulty,
      problemsByDomain,
      totalBusinessesOwned,
      automatedBusinesses,
      managersHired,
      averageRevenuePerBusiness,
      completionRate,
      xpPerLevel,
      perfectRate,
    };
  }, [gameState]);

  const getTopDomain = () => {
    const domains = Object.entries(statistics.problemsByDomain);
    if (domains.length === 0) return 'None';
    return domains.reduce((a, b) => a[1] > b[1] ? a : b)[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            Statistics Dashboard
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {/* Core Stats */}
          <Card className="glass-dark border-green-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                Financial Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Current Balance</span>
                <span className="font-bold text-green-400">{formatMoney(gameState.money)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Total Earned</span>
                <span className="font-bold">{formatMoney(gameState.totalEarned)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Avg Revenue/Business</span>
                <span className="font-bold">{formatMoney(statistics.averageRevenuePerBusiness)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-dark border-blue-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-400" />
                Problem Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Problems Solved</span>
                <span className="font-bold text-blue-400">{gameState.solvedProblems.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Completion Rate</span>
                <span className="font-bold">{statistics.completionRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Perfect Solutions</span>
                <span className="font-bold">{statistics.perfectRate.toFixed(0)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-dark border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                Progress Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Level</span>
                <span className="font-bold text-purple-400">Level {gameState.level}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Total XP</span>
                <span className="font-bold">{gameState.xp}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">XP per Level</span>
                <span className="font-bold">{Math.floor(statistics.xpPerLevel)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-dark border-yellow-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-yellow-400" />
                Business Empire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Total Businesses</span>
                <span className="font-bold text-yellow-400">{statistics.totalBusinessesOwned}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Automated</span>
                <span className="font-bold">{statistics.automatedBusinesses}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Managers Hired</span>
                <span className="font-bold">{statistics.managersHired}/10</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-dark border-orange-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                Streaks & Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Problem Streak</span>
                <span className="font-bold text-orange-400">{gameState.problemStreak} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Daily Challenge</span>
                <span className="font-bold">{dailyChallengeStreak} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Achievements</span>
                <span className="font-bold">{achievementCount.unlocked}/{achievementCount.total}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-dark border-cyan-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                Top Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Favorite Domain</span>
                <span className="font-bold text-cyan-400">{getTopDomain()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Global Multiplier</span>
                <span className="font-bold">{(gameState.globalMultiplier || 1).toFixed(2)}x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Prestige Level</span>
                <span className="font-bold">{gameState.prestigeLevel}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Problem Difficulty Breakdown */}
        <Card className="glass-dark border-white/10 mt-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-400" />
              Problem Difficulty Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {['Easy', 'Medium', 'Hard'].map(difficulty => {
              const count = statistics.problemsByDifficulty[difficulty] || 0;
              const total = LEETCODE_PROBLEMS.filter(p => p.difficulty === difficulty).length;
              const percentage = total > 0 ? (count / total) * 100 : 0;
              
              return (
                <div key={difficulty} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2">
                      <Badge className={
                        difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                        difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }>
                        {difficulty}
                      </Badge>
                      <span className="text-muted-foreground">{count}/{total}</span>
                    </span>
                    <span className="font-bold">{percentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Domain Progress */}
        <Card className="glass-dark border-white/10 mt-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              Domain Mastery Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(statistics.problemsByDomain)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([domain, count]) => {
                const total = LEETCODE_PROBLEMS.filter(p => p.domain === domain).length;
                const percentage = total > 0 ? (count / total) * 100 : 0;
                
                return (
                  <div key={domain} className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="capitalize font-medium">{domain}</span>
                      <span className="text-muted-foreground">{count}/{total}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};