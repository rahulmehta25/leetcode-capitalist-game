import { useState } from 'react';
import { DailyChallenge, DailyChallengeProgress } from '../types/dailyChallenge';
import { CodingProblem } from '../types/leetcode';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Calendar, Clock, Trophy, Zap, Star, Flame, Target, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface DailyChallengeCardProps {
  challenge: DailyChallenge | null;
  progress: DailyChallengeProgress | null;
  problems: CodingProblem[];
  timeRemaining: number | null;
  streak: number;
  onStart: () => void;
  onSelectProblem: (problem: CodingProblem) => void;
  formatTime: (seconds: number) => string;
}

export const DailyChallengeCard = ({
  challenge,
  progress,
  problems,
  timeRemaining,
  streak,
  onStart,
  onSelectProblem,
  formatTime,
}: DailyChallengeCardProps) => {
  if (!challenge) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'mixed': return 'bg-gradient-to-r from-green-500/20 via-yellow-500/20 to-red-500/20 text-white border-white/30';
      default: return '';
    }
  };

  const progressPercentage = progress 
    ? (progress.problemsCompleted.length / challenge.problemIds.length) * 100
    : 0;

  const isTimeExpired = timeRemaining !== null && timeRemaining === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-dark border-2 border-purple-500/30 hover:border-purple-500/50 transition-all overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-pink-900/10 opacity-50" />
        
        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Calendar className="w-6 h-6 text-purple-400" />
                Daily Challenge
                {streak > 0 && (
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 animate-pulse">
                    <Flame className="w-3 h-3 mr-1" />
                    {streak} Day Streak
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-2">
                {new Date(challenge.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
                {challenge.theme && (
                  <Badge variant="outline" className="ml-2">
                    {challenge.theme}
                  </Badge>
                )}
              </CardDescription>
            </div>
            <Badge className={`${getDifficultyColor(challenge.difficulty)} font-bold uppercase`}>
              {challenge.difficulty}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-4">
          {/* Rewards Section */}
          <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-white/10">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-xs text-muted-foreground">XP Reward</p>
                <p className="font-bold text-yellow-400">{challenge.rewards.xp}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-xs text-muted-foreground">Money Reward</p>
                <p className="font-bold text-green-400">${challenge.rewards.money}</p>
              </div>
            </div>
            {challenge.perfectBonus > 0 && (
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-xs text-muted-foreground">Perfect Bonus</p>
                  <p className="font-bold text-purple-400">+{challenge.perfectBonus} XP</p>
                </div>
              </div>
            )}
          </div>

          {/* Progress Section */}
          {progress && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  {progress.problemsCompleted.length}/{challenge.problemIds.length} Completed
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              
              {timeRemaining !== null && !challenge.isCompleted && (
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${isTimeExpired ? 'text-red-400' : 'text-blue-400'}`} />
                  <span className={`text-sm font-medium ${isTimeExpired ? 'text-red-400' : ''}`}>
                    {isTimeExpired ? 'Time Expired!' : `Time Remaining: ${formatTime(timeRemaining)}`}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Problems List */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground">Today's Problems:</h4>
            <div className="grid gap-2">
              {problems.map((problem, index) => {
                const isCompleted = progress?.problemsCompleted.includes(problem.id);
                const isLocked = progress && index > 0 && !progress.problemsCompleted.includes(problems[index - 1].id);
                
                return (
                  <div
                    key={problem.id}
                    className={`p-3 rounded-lg border transition-all ${
                      isCompleted 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : isLocked
                        ? 'bg-muted/20 border-muted/30 opacity-50'
                        : 'bg-muted/50 border-muted hover:bg-muted/70 cursor-pointer'
                    }`}
                    onClick={() => !isLocked && !isCompleted && progress && onSelectProblem(problem)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background/50 font-bold">
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{problem.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {problem.difficulty}
                            </Badge>
                            {problem.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          {problem.xpReward} XP
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          {!challenge.isCompleted && (
            <div className="pt-4">
              {!progress ? (
                <Button
                  onClick={onStart}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  size="lg"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Start Daily Challenge
                </Button>
              ) : progressPercentage === 100 ? (
                <Button
                  disabled
                  className="w-full"
                  size="lg"
                  variant="outline"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  Challenge Complete!
                </Button>
              ) : isTimeExpired ? (
                <Button
                  disabled
                  className="w-full"
                  size="lg"
                  variant="destructive"
                >
                  <Clock className="w-5 h-5 mr-2" />
                  Time's Up!
                </Button>
              ) : (
                <div className="text-center text-sm text-muted-foreground">
                  Complete problems in order to progress
                </div>
              )}
            </div>
          )}

          {challenge.isCompleted && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
              <Trophy className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="font-bold text-green-400">Challenge Completed!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Come back tomorrow for a new challenge
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};