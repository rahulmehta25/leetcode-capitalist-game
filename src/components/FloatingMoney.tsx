import { FloatingMoney as FloatingMoneyType } from '../types/game';

interface FloatingMoneyProps {
  floatingMoney: FloatingMoneyType[];
  formatMoney: (amount: number) => string;
}

export const FloatingMoney = ({ floatingMoney, formatMoney }: FloatingMoneyProps) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {floatingMoney.map((money) => (
        <div
          key={money.id}
          className="absolute text-secondary font-bold text-lg money-float"
          style={{
            left: money.x,
            top: money.y,
          }}
        >
          +{formatMoney(money.amount)}
        </div>
      ))}
    </div>
  );
};