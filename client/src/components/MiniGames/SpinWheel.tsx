import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/contexts/AppContext";

interface SpinWheelProps {
  onGameResult: (game: string, result: any, won: boolean, amount: number) => void;
}

export default function SpinWheel({ onGameResult }: SpinWheelProps) {
  const { showToast, balance, setBalance } = useApp();
  const [betAmount, setBetAmount] = useState<number>(100);
  const [selectedColor, setSelectedColor] = useState<"red" | "black" | "green">("red");
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [lastResult, setLastResult] = useState<{ color: string; won: boolean; amount: number } | null>(null);

  const wheelSegments = [
    { color: "red", count: 18, multiplier: 2 },
    { color: "black", count: 18, multiplier: 2 },
    { color: "green", count: 1, multiplier: 36 },
  ];

  const spinWheel = async () => {
    if (betAmount < 10) {
      showToast("Minimum bet is ₹10", "error");
      return;
    }

    if (betAmount > balance) {
      showToast("Insufficient balance", "error");
      return;
    }

    setIsSpinning(true);
    setBalance(balance - betAmount);

    // Calculate random result
    const random = Math.random();
    let resultColor: "red" | "black" | "green";
    
    if (random < 18/37) {
      resultColor = "red";
    } else if (random < 36/37) {
      resultColor = "black";
    } else {
      resultColor = "green";
    }

    // Animate wheel spin
    const spins = 5 + Math.random() * 3; // 5-8 full rotations
    const finalRotation = wheelRotation + (spins * 360);
    setWheelRotation(finalRotation);

    // Stop animation after 3 seconds
    setTimeout(() => {
      setIsSpinning(false);

      const won = resultColor === selectedColor;
      const multiplier = wheelSegments.find(s => s.color === selectedColor)?.multiplier || 2;
      const winAmount = won ? betAmount * multiplier : 0;

      if (won) {
        setBalance(prev => prev + winAmount);
        showToast(`${resultColor.toUpperCase()} wins! You won ₹${winAmount}!`, "success");
      } else {
        showToast(`${resultColor.toUpperCase()} wins. Better luck next time!`, "error");
      }

      const result = { color: resultColor, won, amount: won ? winAmount : betAmount };
      setLastResult(result);
      onGameResult("wheel", { value: resultColor }, won, won ? winAmount : betAmount);
    }, 3000);
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case "red": return "bg-red-500";
      case "black": return "bg-gray-900";
      case "green": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card className="glass-morphism">
      <CardHeader>
        <CardTitle className="text-white">Spin Wheel</CardTitle>
        <p className="text-gray-400">Bet on Red/Black (2x) or Green (36x)!</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Wheel Display */}
        <div className="text-center">
          <div className="relative inline-block">
            <div
              className={`w-48 h-48 rounded-full border-4 border-white transition-transform duration-3000 ease-out ${
                isSpinning ? "animate-spin-slow" : ""
              }`}
              style={{
                transform: `rotate(${wheelRotation}deg)`,
                background: `conic-gradient(
                  red 0deg 174.6deg,
                  black 174.6deg 349.2deg,
                  green 349.2deg 360deg
                )`
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <RotateCcw className="w-8 h-8 text-white" />
              </div>
            </div>
            
            {/* Wheel pointer */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-white"></div>
            </div>
          </div>
          
          {lastResult && !isSpinning && (
            <div className="mt-4">
              <div className={`text-lg font-semibold ${lastResult.won ? "text-accent-green" : "text-danger-red"}`}>
                {lastResult.won ? `You Won ₹${lastResult.amount}!` : `You Lost ₹${lastResult.amount}`}
              </div>
              <div className="text-gray-400 text-sm capitalize">Result: {lastResult.color}</div>
            </div>
          )}
        </div>

        {/* Color Selection */}
        <div>
          <label className="text-sm text-gray-400 mb-3 block">Select your color:</label>
          <div className="grid grid-cols-3 gap-3">
            {wheelSegments.map((segment) => (
              <Button
                key={segment.color}
                variant={selectedColor === segment.color ? "default" : "outline"}
                className={`${
                  selectedColor === segment.color 
                    ? "bg-accent-green text-primary-dark" 
                    : "border-gray-600 text-white hover:bg-secondary-dark"
                }`}
                onClick={() => setSelectedColor(segment.color as "red" | "black" | "green")}
                disabled={isSpinning}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full ${getColorClass(segment.color)}`}></div>
                  <span className="capitalize">{segment.color}</span>
                  <span className="text-xs">({segment.multiplier}x)</span>
                </div>
              </Button>
            ))}
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
            disabled={isSpinning}
          />
          
          <div className="grid grid-cols-4 gap-2">
            {[50, 100, 250, 500].map((amount) => (
              <Button
                key={amount}
                size="sm"
                variant="outline"
                onClick={() => setBetAmount(amount)}
                className="border-gray-600 text-white hover:bg-secondary-dark"
                disabled={isSpinning}
              >
                ₹{amount}
              </Button>
            ))}
          </div>
        </div>

        {/* Game Info */}
        <div className="bg-secondary-dark rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Selected Color:</span>
            <span className="text-white font-semibold capitalize">{selectedColor}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Bet Amount:</span>
            <span className="text-white font-semibold">₹{betAmount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Potential Win:</span>
            <span className="text-accent-green font-semibold">
              ₹{betAmount * (wheelSegments.find(s => s.color === selectedColor)?.multiplier || 2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Win Chance:</span>
            <span className="text-gold font-semibold">
              {selectedColor === "green" ? "2.7%" : "48.6%"}
            </span>
          </div>
        </div>

        {/* Spin Button */}
        <Button
          onClick={spinWheel}
          disabled={isSpinning}
          className="w-full gradient-accent text-primary-dark font-semibold py-3 hover:opacity-90"
        >
          {isSpinning ? "Spinning..." : "Spin Wheel"}
        </Button>
      </CardContent>
    </Card>
  );
}
