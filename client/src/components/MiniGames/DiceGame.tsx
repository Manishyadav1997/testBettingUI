import { useState } from "react";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/contexts/AppContext";

interface DiceGameProps {
  onGameResult: (game: string, result: any, won: boolean, amount: number) => void;
}

export default function DiceGame({ onGameResult }: DiceGameProps) {
  const { showToast, balance, setBalance } = useApp();
  const [betAmount, setBetAmount] = useState<number>(100);
  const [selectedNumber, setSelectedNumber] = useState<number>(6);
  const [diceValue, setDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState(false);
  const [lastResult, setLastResult] = useState<{ value: number; won: boolean; amount: number } | null>(null);

  const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
  const DiceIcon = diceIcons[diceValue - 1];

  const rollDice = async () => {
    if (betAmount < 10) {
      showToast("Minimum bet is ₹10", "error");
      return;
    }

    if (betAmount > balance) {
      showToast("Insufficient balance", "error");
      return;
    }

    setIsRolling(true);
    setBalance(balance - betAmount);

    // Animate dice roll
    const rollAnimation = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
    }, 100);

    // Stop animation after 2 seconds
    setTimeout(() => {
      clearInterval(rollAnimation);
      const finalValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(finalValue);
      setIsRolling(false);

      const won = finalValue === selectedNumber;
      const winAmount = won ? betAmount * 6 : 0;

      if (won) {
        setBalance(balance - betAmount + winAmount);
        showToast(`You won ₹${winAmount}!`, "success");
      } else {
        showToast(`Dice rolled ${finalValue}. Better luck next time!`, "error");
      }

      const result = { value: finalValue, won, amount: won ? winAmount : betAmount };
      setLastResult(result);
      onGameResult("dice", { value: finalValue }, won, won ? winAmount : betAmount);
    }, 2000);
  };

  return (
    <Card className="glass-morphism">
      <CardHeader>
        <CardTitle className="text-white">Dice Roll Game</CardTitle>
        <p className="text-gray-400">Predict the dice number and win 6x your bet!</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dice Display */}
        <div className="text-center">
          <div className={`inline-block p-8 bg-secondary-dark rounded-2xl ${isRolling ? "animate-bounce" : ""}`}>
            <DiceIcon className="w-24 h-24 text-accent-green" />
          </div>
          
          {lastResult && !isRolling && (
            <div className="mt-4">
              <div className={`text-lg font-semibold ${lastResult.won ? "text-accent-green" : "text-danger-red"}`}>
                {lastResult.won ? `You Won ₹${lastResult.amount}!` : `You Lost ₹${lastResult.amount}`}
              </div>
              <div className="text-gray-400 text-sm">Dice rolled: {lastResult.value}</div>
            </div>
          )}
        </div>

        {/* Number Selection */}
        <div>
          <label className="text-sm text-gray-400 mb-3 block">Select your number (1-6):</label>
          <div className="grid grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((num) => {
              const IconComponent = diceIcons[num - 1];
              return (
                <Button
                  key={num}
                  variant={selectedNumber === num ? "default" : "outline"}
                  className={`aspect-square p-2 ${
                    selectedNumber === num 
                      ? "bg-accent-green text-primary-dark" 
                      : "border-gray-600 text-white hover:bg-secondary-dark"
                  }`}
                  onClick={() => setSelectedNumber(num)}
                  disabled={isRolling}
                >
                  <IconComponent className="w-6 h-6" />
                </Button>
              );
            })}
          </div>
        </div>

        {/* Bet Amount */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Bet Amount:</label>
          <Input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="bg-secondary-dark border-gray-600 text-white mb-3"
            min="10"
            max={balance}
            disabled={isRolling}
          />
          
          <div className="grid grid-cols-4 gap-2">
            {[50, 100, 250, 500].map((amount) => (
              <Button
                key={amount}
                size="sm"
                variant="outline"
                onClick={() => setBetAmount(amount)}
                className="border-gray-600 text-white hover:bg-secondary-dark"
                disabled={isRolling}
              >
                ₹{amount}
              </Button>
            ))}
          </div>
        </div>

        {/* Game Info */}
        <div className="bg-secondary-dark rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Selected Number:</span>
            <span className="text-white font-semibold">{selectedNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Bet Amount:</span>
            <span className="text-white font-semibold">₹{betAmount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Potential Win:</span>
            <span className="text-accent-green font-semibold">₹{betAmount * 6}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Win Odds:</span>
            <span className="text-gold font-semibold">6:1 (16.67%)</span>
          </div>
        </div>

        {/* Roll Button */}
        <Button
          onClick={rollDice}
          disabled={isRolling}
          className="w-full gradient-accent text-primary-dark font-semibold py-3 hover:opacity-90"
        >
          {isRolling ? "Rolling..." : "Roll Dice"}
        </Button>
      </CardContent>
    </Card>
  );
}
