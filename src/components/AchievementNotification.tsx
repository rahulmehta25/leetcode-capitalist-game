import { useEffect, useState } from 'react';
import { Achievement } from '../types/achievements';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap } from 'lucide-react';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementNotification = ({ achievement, onClose }: AchievementNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 500);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'shadow-gray-400/50';
      case 'rare': return 'shadow-blue-400/50';
      case 'epic': return 'shadow-purple-400/50';
      case 'legendary': return 'shadow-yellow-400/50';
      default: return 'shadow-gray-400/50';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100]"
        >
          <div className={`relative glass-dark p-6 rounded-2xl border-2 border-white/20 shadow-2xl ${getRarityGlow(achievement.rarity)}`}>
            <div className="absolute inset-0 rounded-2xl animate-pulse-glow opacity-50" />
            
            <div className="relative flex items-center gap-4">
              <div className={`relative p-4 rounded-full bg-gradient-to-br ${getRarityColor(achievement.rarity)} animate-float`}>
                <div className="absolute inset-0 rounded-full blur-xl opacity-50" />
                <div className="relative text-4xl">{achievement.icon}</div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-xl font-bold gradient-text">Achievement Unlocked!</h3>
                </div>
                <h4 className={`text-lg font-bold bg-gradient-to-r ${getRarityColor(achievement.rarity)} bg-clip-text text-transparent`}>
                  {achievement.name}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                
                {(achievement.reward.xp || achievement.reward.money || achievement.reward.title) && (
                  <div className="flex items-center gap-3 mt-3">
                    {achievement.reward.xp && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 font-semibold">+{achievement.reward.xp} XP</span>
                      </div>
                    )}
                    {achievement.reward.money && (
                      <div className="flex items-center gap-1 text-sm">
                        <Zap className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-semibold">+${achievement.reward.money}</span>
                      </div>
                    )}
                    {achievement.reward.title && (
                      <div className="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-xs font-semibold">
                        Title: {achievement.reward.title}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="absolute -top-2 -right-2">
              <div className={`px-2 py-1 rounded-full text-xs font-bold uppercase bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white animate-pulse`}>
                {achievement.rarity}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};