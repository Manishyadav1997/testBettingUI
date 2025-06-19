import { useState } from "react";
import { Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/contexts/AppContext";

interface CoinTossProps {
  onGameResult: (game: string, result: any, won: boolean, amount: number) => void;
}

export default function CoinToss({ onGameResult }: CoinTossProps) {
  const { showToast, balance, setBalance } = useApp();
  const [betAmount, setBetAmount] = useState<number>(100);
  const [selectedSide, setSelectedSide] = useState<"heads" | "tails">("heads");
  const [coinSide, setCoinSide] = useState<"heads" | "tails">("heads");
  const [isFlipping, setIsFlipping] = useState(false);
  const [lastResult, setLastResult] = useState<{ side: string; won: boolean; amount: number } | null>(null);

  const flipCoin = async () => {
    if (betAmount < 10) {
      showToast("Minimum bet is ₹10", "error");
      return;
    }

    if (betAmount > balance) {
      showToast("Insufficient balance", "error");
      return;
    }

    setIsFlipping(true);
    setBalance(balance - betAmount);

    // Animate coin flip
    let flips = 0;
    const flipAnimation = setInterval(() => {
      setCoinSide(flips % 2 === 0 ? "heads" : "tails");
      flips++;
    }, 150);

    // Stop animation after 2 seconds
    setTimeout(() => {
      clearInterval(flipAnimation);
      const finalSide: "heads" | "tails" = Math.random() < 0.5 ? "heads" : "tails";
      setCoinSide(finalSide);
      setIsFlipping(false);

      const won = finalSide === selectedSide;
      const winAmount = won ? betAmount * 2 : 0;

      if (won) {
        setBalance(balance - betAmount + winAmount);
        showToast(`${finalSide.toUpperCase()}! You won ₹${winAmount}!`, "success");
      } else {
        showToast(`${finalSide.toUpperCase()}! Better luck next time!`, "error");
      }

      const result = { side: finalSide, won, amount: won ? winAmount : betAmount };
      setLastResult(result);
      onGameResult("coin", { side: finalSide }, won, won ? winAmount : betAmount);
    }, 2000);
  };

  return (
    <Card className="glass-morphism">
      <CardHeader>
        <CardTitle className="text-white">Coin Toss</CardTitle>
        <p className="text-gray-400">Choose heads or tails and double your money!</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Coin Display */}
        <div className="text-center">
          <div className={`inline-block ${isFlipping ? "animate-bounce" : ""}`}>
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-4 border-yellow-700 flex items-center justify-center text-4xl font-bold text-yellow-900 shadow-lg">
              {coinSide === "heads" ? "H" : "T"}
            </div>
          </div>
          
          <div className="mt-2 text-lg font-semibold text-accent-green capitalize">
            {coinSide}
          </div>
          
          {lastResult && !isFlipping && (
            <div className="mt-4">
              <div className={`text-lg font-semibold ${lastResult.won ? "text-accent-green" : "text-danger-red"}`}>
                {lastResult.won ? `You Won ₹${lastResult.amount}!` : `You Lost ₹${lastResult.amount}`}
              </div>
              <div className="text-gray-400 text-sm capitalize">Result: {lastResult.side}</div>
            </div>
          )}
        </div>

        {/* Side Selection */}
        <div>
          <label className="text-sm text-gray-400 mb-3 block">Choose your side:</label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={selectedSide === "heads" ? "default" : "outline"}
              className={`py-3 ${
                selectedSide === "heads" 
                  ? "bg-accent-green text-primary-dark" 
                  : "border-gray-600 text-white hover:bg-secondary-dark"
              }`}
              onClick={() => setSelectedSide("heads")}
              disabled={isFlipping}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">H</div>
                <div className="text-sm">Heads</div>
              </div>
            </Button>
            
            <Button
              variant={selectedSide === "tails" ? "default" : "outline"}
              className={`py-3 ${
                selectedSide === "tails" 
                  ? "bg-accent-green text-primary-dark" 
                  : "border-gray-600 text-white hover:bg-secondary-dark"
              }`}
              onClick={() => setSelectedSide("tails")}
              disabled={isFlipping}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">T</div>
                <div className="text-sm">Tails</div>
              </div>
            </Button>
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
            disabled={isFlipping}
          />
          
          <div className="grid grid-cols-4 gap-2">
            {[50, 100, 250, 500].map((amount) => (
              <Button
                key={amount}
                size="sm"
                variant="outline"
                onClick={() => setBetAmount(amount)}
                className="border-gray-600 text-white hover:bg-secondary-dark"
                disabled={isFlipping}
              >
                ₹{amount}
              </Button>
            ))}
          </div>
        </div>

        {/* Game Info */}
        <div className="bg-secondary-dark rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Selected Side:</span>
            <span className="text-white font-semibold capitalize">{selectedSide}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Bet Amount:</span>
            <span className="text-white font-semibold">₹{betAmount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Potential Win:</span>
            <span className="text-accent-green font-semibold">₹{betAmount * 2}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Win Odds:</span>
            <span className="text-gold font-semibold">2:1 (50%)</span>
          </div>
        </div>

        {/* Flip Button */}
        <Button
          onClick={flipCoin}
          disabled={isFlipping}
          className="w-full gradient-accent text-primary-dark font-semibold py-3 hover:opacity-90"
        >
          <Coins className="w-4 h-4 mr-2" />
          {isFlipping ? "Flipping..." : "Flip Coin"}
        </Button>
      </CardContent>
    </Card>
  );
}
