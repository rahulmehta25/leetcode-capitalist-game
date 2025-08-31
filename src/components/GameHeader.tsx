import { GameState } from '../types/game';

interface GameHeaderProps {
  gameState: GameState;
  formatMoney: (amount: number) => string;
}

export const GameHeader = ({ gameState, formatMoney }: GameHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 glass-dark border-b border-white/10 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-float">💻</span>
            <h1 className="text-2xl font-black gradient-text">
              Code Capital Academy
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="glass p-2 rounded-lg">
              <div className="flex items-center gap-2">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Level</div>
                  <div className="text-xl font-bold text-yellow-400 neon-text">
                    {gameState.level}
                  </div>
                </div>
              </div>
            </div>
            <div className="glass p-2 rounded-lg">
              <div className="flex items-center gap-2">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">XP</div>
                  <div className="text-xl font-bold text-blue-400 neon-text">
                    {gameState.xp}
                  </div>
                </div>
              </div>
            </div>
            <div className="glass p-2 rounded-lg">
              <div className="flex items-center gap-2">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Solved</div>
                  <div className="text-xl font-bold text-purple-400 neon-text">
                    {gameState.solvedProblems.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};