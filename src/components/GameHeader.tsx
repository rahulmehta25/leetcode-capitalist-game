import { GameState } from '../types/game';

interface GameHeaderProps {
  gameState: GameState;
  formatMoney: (amount: number) => string;
}

export const GameHeader = ({ gameState, formatMoney }: GameHeaderProps) => {
  return (
    <header className="sticky top-0 z-10 bg-gradient-card border-b border-border p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Code Capital Academy 💻
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Developer Level</div>
              <div className="text-lg font-semibold text-accent">
                {gameState.level}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Experience (XP)</div>
              <div className="text-lg font-semibold text-accent">
                {gameState.xp}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-money p-4 rounded-lg">
            <div className="text-sm text-secondary-foreground opacity-90">Current Money</div>
            <div className="text-2xl font-bold text-secondary-foreground money-counter">
              {formatMoney(gameState.money)}
            </div>
          </div>
          
          <div className="bg-gradient-primary p-4 rounded-lg">
            <div className="text-sm text-primary-foreground opacity-90">Total Earned</div>
            <div className="text-2xl font-bold text-primary-foreground">
              {formatMoney(gameState.totalEarned)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};