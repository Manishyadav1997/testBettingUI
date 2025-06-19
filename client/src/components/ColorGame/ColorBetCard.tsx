import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ColorBetCardProps {
  color: "red" | "green" | "violet";
  odds: number;
  onBet: () => void;
  betAmount: number;
  activeBet: number;
  disabled: boolean;
}

export default function ColorBetCard({ color, odds, onBet, betAmount, activeBet, disabled }: ColorBetCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case "red":
        return {
          bg: "bg-red-500",
          hover: "hover:bg-red-600",
          gradient: "bg-gradient-to-br from-red-500 to-red-600",
        };
      case "green":
        return {
          bg: "bg-green-500",
          hover: "hover:bg-green-600",
          gradient: "bg-gradient-to-br from-green-500 to-green-600",
        };
      case "violet":
        return {
          bg: "bg-purple-500",
          hover: "hover:bg-purple-600",
          gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <Card className={`glass-morphism transition-all duration-200 ${activeBet > 0 ? "ring-2 ring-accent-green" : ""}`}>
      <CardContent className="p-4">
        <div className="text-center space-y-4">
          {/* Color Circle */}
          <div className={`w-16 h-16 rounded-full ${colorClasses.gradient} mx-auto flex items-center justify-center shadow-lg`}>
            <span className="text-white font-bold text-xl capitalize">{color.charAt(0)}</span>
          </div>

          {/* Color Name */}
          <h3 className="text-xl font-semibold text-white capitalize">{color}</h3>

          {/* Odds */}
          <div className="space-y-1">
            <div className="text-2xl font-bold text-accent-green">{odds}x</div>
            <div className="text-sm text-gray-400">Multiplier</div>
          </div>

          {/* Active Bet Display */}
          {activeBet > 0 && (
            <div className="bg-secondary-dark rounded-lg p-2">
              <div className="text-sm text-gray-400">Your Bet</div>
              <div className="text-white font-semibold">₹{activeBet}</div>
              <div className="text-accent-green text-sm">
                Win: ₹{(activeBet * odds).toFixed(2)}
              </div>
            </div>
          )}

          {/* Bet Button */}
          <Button
            onClick={onBet}
            disabled={disabled}
            className={`w-full ${colorClasses.bg} ${colorClasses.hover} text-white font-semibold transition-colors ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {disabled ? "Betting Closed" : `Bet ₹${betAmount}`}
          </Button>

          {/* Potential Win */}
          <div className="text-sm text-gray-400">
            Potential win: <span className="text-white font-semibold">₹{(betAmount * odds).toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
