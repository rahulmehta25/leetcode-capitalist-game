import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Achievement, AchievementProgress } from '../types/achievements';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Trophy, Lock, Star, Zap, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  progress: AchievementProgress[];
}

export const AchievementsModal = ({ isOpen, onClose, achievements, progress }: AchievementsModalProps) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-400/10';
      case 'rare': return 'border-blue-400 bg-blue-400/10';
      case 'epic': return 'border-purple-400 bg-purple-400/10';
      case 'legendary': return 'border-yellow-400 bg-yellow-400/10';
      default: return 'border-gray-400 bg-gray-400/10';
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const categories = ['all', 'problems', 'money', 'businesses', 'streak', 'special'];
  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;

  const getFilteredAchievements = (category: string) => {
    if (category === 'all') return achievements;
    return achievements.filter(a => a.category === category);
  };

  const getProgressForAchievement = (achievementId: string) => {
    return progress.find(p => p.achievementId === achievementId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Achievements
            </DialogTitle>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Progress: {unlockedCount}/{totalCount}
              </div>
              <Progress value={(unlockedCount / totalCount) * 100} className="w-32 h-2" />
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="all" className="mt-4">
          <TabsList className="grid grid-cols-6 w-full">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category === 'all' ? 'All' : category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category} value={category} className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getFilteredAchievements(category).map(achievement => {
                  const prog = getProgressForAchievement(achievement.id);
                  return (
                    <div
                      key={achievement.id}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        achievement.isUnlocked
                          ? getRarityColor(achievement.rarity)
                          : 'border-muted bg-muted/20 opacity-75'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`text-3xl ${achievement.isUnlocked ? '' : 'grayscale opacity-50'}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-bold ${achievement.isUnlocked ? '' : 'text-muted-foreground'}`}>
                              {achievement.name}
                            </h3>
                            {achievement.isUnlocked ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <Lock className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                          
                          {!achievement.isUnlocked && prog && (
                            <div className="mb-2">
                              <Progress value={prog.percentage} className="h-1.5" />
                              <p className="text-xs text-muted-foreground mt-1">
                                {prog.currentValue}/{prog.targetValue}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={`text-xs ${getRarityBadgeColor(achievement.rarity)} text-white`}>
                              {achievement.rarity}
                            </Badge>
                            {achievement.reward.xp && (
                              <Badge variant="outline" className="text-xs">
                                <Star className="w-3 h-3 mr-1" />
                                {achievement.reward.xp} XP
                              </Badge>
                            )}
                            {achievement.reward.money && (
                              <Badge variant="outline" className="text-xs">
                                <Zap className="w-3 h-3 mr-1" />
                                ${achievement.reward.money}
                              </Badge>
                            )}
                            {achievement.reward.title && (
                              <Badge variant="secondary" className="text-xs">
                                {achievement.reward.title}
                              </Badge>
                            )}
                          </div>
                          
                          {achievement.isUnlocked && achievement.unlockedAt && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};