import { useState, useEffect } from 'react';
import { Business, Manager } from '../types/game';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface BusinessCardProps {
  business: Business;
  manager?: Manager;
  formatMoney: (amount: number) => string;
  calculateCost: (business: Business) => number;
  calculateRevenue: (business: Business) => number;
  onPurchase: (businessId: string) => void;
  onManualCollect: (business: Business, x: number, y: number) => void;
  onHireManager: (managerId: string) => void;
  canAfford: boolean;
  canAffordManager: boolean;
}

export const BusinessCard = ({
  business,
  manager,
  formatMoney,
  calculateCost,
  calculateRevenue,
  onPurchase,
  onManualCollect,
  onHireManager,
  canAfford,
  canAffordManager,
}: BusinessCardProps) => {
  const [productionProgress, setProductionProgress] = useState(0);
  const [isCollecting, setIsCollecting] = useState(false);

  // Update progress for automated businesses
  useEffect(() => {
    if (business.isAutomatic && business.owned > 0) {
      const interval = setInterval(() => {
        const now = Date.now();
        const timeSinceLastProduction = now - business.lastProduction;
        const progress = Math.min((timeSinceLastProduction / business.productionTime) * 100, 100);
        setProductionProgress(progress);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [business.isAutomatic, business.owned, business.lastProduction, business.productionTime]);

  const handleCollectClick = (e: React.MouseEvent) => {
    if (isCollecting) return;
    
    setIsCollecting(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onManualCollect(business, x, y);
    
    setTimeout(() => setIsCollecting(false), 200);
  };

  const revenue = calculateRevenue(business);
  const cost = calculateCost(business);

  if (!business.isUnlocked) {
    return (
      <div className="glass p-6 rounded-xl opacity-60 border-2 border-dashed border-muted">
        <div className="flex items-center space-x-4">
          <div className="text-5xl opacity-30 grayscale">{business.icon}</div>
          <div className="flex-1">
            <h3 className="font-bold text-xl text-muted-foreground">???</h3>
            <p className="text-sm text-muted-foreground mt-1">
              🔒 Unlock at {formatMoney(business.unlockCondition)} total earned
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-3d glass-dark p-6 rounded-xl hover-lift border border-white/10 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="text-5xl animate-float" style={{ animationDelay: `${Math.random() * 2}s` }}>
            {business.icon}
          </div>
          <div>
            <h3 className="font-bold text-xl gradient-text">{business.name}</h3>
            <p className="text-sm text-muted-foreground">{business.description}</p>
            <div className="flex items-center space-x-3 mt-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Owned:</span>
              <span className="text-lg font-bold text-green-400 neon-text">
                {business.owned}
              </span>
              {business.isAutomatic && (
                <span className="text-xs bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 rounded-full font-bold animate-pulse">
                  AUTO
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right glass p-3 rounded-lg">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Revenue</div>
          <div className="text-2xl font-bold holographic">
            {formatMoney(revenue)}
          </div>
          <div className="text-xs text-muted-foreground">/cycle</div>
        </div>
      </div>

      {business.owned > 0 && !business.isAutomatic && (
        <div className="mb-4">
          <Button
            onClick={handleCollectClick}
            variant="collect"
            size="xl"
            className={`w-full glow-button bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg py-6 ${isCollecting ? 'animate-tap-effect success-animation' : ''}`}
            disabled={isCollecting}
          >
            <span className="flex items-center justify-center gap-2">
              <span className="text-2xl">💰</span>
              <span>Collect {formatMoney(revenue)}</span>
            </span>
          </Button>
        </div>
      )}

      {business.owned > 0 && business.isAutomatic && (
        <div className="mb-4">
          <div className="bg-muted/50 rounded-lg p-4 border border-secondary/20">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Auto-collecting...</span>
              </div>
              <span className="text-sm font-medium text-secondary">
                {formatMoney(revenue)}/cycle
              </span>
            </div>
            <div className="relative w-full h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-money rounded-full transition-all duration-300" 
                style={{ width: `${productionProgress}%` }} 
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1 text-center">
              Next collection in {Math.max(0, Math.ceil((business.productionTime - (Date.now() - business.lastProduction)) / 1000))}s
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={() => onPurchase(business.id)}
          disabled={!canAfford}
          variant={canAfford ? "purchase" : "disabled"}
          size="lg"
          className="flex-1"
        >
          🏪 Buy - {formatMoney(cost)}
        </Button>

        {manager && !manager.isHired && business.owned > 0 && (
          <Button
            onClick={() => onHireManager(manager.id)}
            disabled={!canAffordManager}
            variant={canAffordManager ? "manager" : "disabled"}
            size="lg"
            className="flex-shrink-0"
          >
            👨‍💼 Hire {manager.name.split(' ')[0]} - {formatMoney(manager.cost)}
          </Button>
        )}
      </div>

      {manager && manager.isHired && (
        <div className="mt-3 p-3 bg-gradient-premium rounded-lg border border-accent/30">
          <div className="flex items-center space-x-2">
            <span className="text-lg">👨‍💼</span>
            <div>
              <span className="text-accent-foreground font-medium">{manager.name}</span>
              <div className="text-xs text-accent-foreground/80">
                Managing automatically • {manager.multiplier}x revenue boost
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};