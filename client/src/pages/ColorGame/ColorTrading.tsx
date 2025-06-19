import { useState, useEffect } from "react";
import { Clock, History, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRealTimeUpdates } from "@/hooks/useRealTimeUpdates";
import { useApp } from "@/contexts/AppContext";
import { useBetSlip } from "@/contexts/BetSlipContext";
import ColorBetCard from "@/components/ColorGame/ColorBetCard";

interface ColorBet {
  color: "red" | "green" | "violet";
  amount: number;
}

export default function ColorTrading() {
  const { colorGameState } = useRealTimeUpdates();
  const { showToast, balance, setBalance } = useApp();
  const { addBet } = useBetSlip();
  const [betAmount, setBetAmount] = useState<number>(100);
  const [activeBets, setActiveBets] = useState<ColorBet[]>([]);
  const [gameHistory, setGameHistory] = useState([
    { result: "green", round: 1234, timestamp: Date.now() - 60000 },
    { result: "red", round: 1233, timestamp: Date.now() - 120000 },
    { result: "violet", round: 1232, timestamp: Date.now() - 180000 },
    { result: "green", round: 1231, timestamp: Date.now() - 240000 },
    { result: "red", round: 1230, timestamp: Date.now() - 300000 },
    { result: "green", round: 1229, timestamp: Date.now() - 360000 },
    { result: "violet", round: 1228, timestamp: Date.now() - 420000 },
    { result: "red", round: 1227, timestamp: Date.now() - 480000 },
    { result: "green", round: 1226, timestamp: Date.now() - 540000 },
    { result: "red", round: 1225, timestamp: Date.now() - 600000 },
  ]);

  const colorOdds = {
    red: 2.0,
    green: 2.0,
    violet: 4.5,
  };

  const handleColorBet = (color: "red" | "green" | "violet") => {
    if (betAmount < 10) {
      showToast("Minimum bet is ₹10", "error");
      return;
    }

    if (betAmount > balance) {
      showToast("Insufficient balance", "error");
      return;
    }

    if (colorGameState.countdown < 10) {
      showToast("Betting closed for this round", "error");
      return;
    }

    const existingBet = activeBets.find(bet => bet.color === color);
    if (existingBet) {
      setActiveBets(prev => 
        prev.map(bet => 
          bet.color === color 
            ? { ...bet, amount: bet.amount + betAmount }
            : bet
        )
      );
    } else {
      setActiveBets(prev => [...prev, { color, amount: betAmount }]);
    }

    setBalance(balance - betAmount);
    addBet({
      gameType: "color",
      betType: "color",
      selection: color.charAt(0).toUpperCase() + color.slice(1),
      odds: colorOdds[color],
    });
    
    showToast(`₹${betAmount} bet placed on ${color}`, "success");
  };

  // Simulate game result when countdown reaches 0
  useEffect(() => {
    if (colorGameState.countdown === 0 && activeBets.length > 0) {
      const colors = ["red", "green", "violet"] as const;
      const result = colors[Math.floor(Math.random() * colors.length)];
      
      // Check for winning bets
      const winningBets = activeBets.filter(bet => bet.color === result);
      const totalWin = winningBets.reduce((sum, bet) => sum + (bet.amount * colorOdds[bet.color]), 0);
      
      if (totalWin > 0) {
        setBalance(balance + totalWin);
        showToast(`You won ₹${totalWin.toFixed(2)}!`, "success");
      } else {
        showToast("Better luck next time!", "error");
      }

      // Add to history
      setGameHistory(prev => [
        { result, round: colorGameState.currentRound, timestamp: Date.now() },
        ...prev.slice(0, 9)
      ]);

      // Clear active bets
      setActiveBets([]);
    }
  }, [colorGameState.countdown, activeBets, colorGameState.currentRound]);

  const getColorClass = (color: string) => {
    switch (color) {
      case "red": return "bg-red-500";
      case "green": return "bg-green-500";
      case "violet": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const getTotalBetAmount = () => {
    return activeBets.reduce((sum, bet) => sum + bet.amount, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Color Trading</h1>
        <p className="text-gray-400">Predict the winning color and multiply your money</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Display */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timer and Round Info */}
          <Card className="glass-morphism">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <Clock className="w-6 h-6 text-accent-green" />
                  <span className="text-lg text-gray-400">Round #{colorGameState.currentRound}</span>
                </div>
                
                <div className="text-6xl font-bold text-accent-green mb-2">
                  {colorGameState.countdown.toString().padStart(2, "0")}
                </div>
                
                <div className="text-gray-400">
                  {colorGameState.countdown > 10 ? "Place your bets" : "Betting closed"}
                </div>
                
                {colorGameState.countdown === 0 && (
                  <div className="mt-4">
                    <Badge className="bg-gold text-primary-dark text-lg px-4 py-2">
                      Drawing Result...
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Color Betting Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ColorBetCard
              color="red"
              odds={colorOdds.red}
              onBet={() => handleColorBet("red")}
              betAmount={betAmount}
              activeBet={activeBets.find(bet => bet.color === "red")?.amount || 0}
              disabled={colorGameState.countdown < 10}
            />
            
            <ColorBetCard
              color="green"
              odds={colorOdds.green}
              onBet={() => handleColorBet("green")}
              betAmount={betAmount}
              activeBet={activeBets.find(bet => bet.color === "green")?.amount || 0}
              disabled={colorGameState.countdown < 10}
            />
            
            <ColorBetCard
              color="violet"
              odds={colorOdds.violet}
              onBet={() => handleColorBet("violet")}
              betAmount={betAmount}
              activeBet={activeBets.find(bet => bet.color === "violet")?.amount || 0}
              disabled={colorGameState.countdown < 10}
            />
          </div>

          {/* Game History */}
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <History className="w-5 h-5 mr-2" />
                Recent Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {gameHistory.map((game, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-10 h-10 rounded-full ${getColorClass(game.result)} flex items-center justify-center text-white font-bold text-sm`}
                    title={`Round ${game.round}: ${game.result}`}
                  >
                    {game.round % 100}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-red-500">
                    {gameHistory.filter(g => g.result === "red").length}
                  </div>
                  <div className="text-sm text-gray-400">Red wins</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-500">
                    {gameHistory.filter(g => g.result === "green").length}
                  </div>
                  <div className="text-sm text-gray-400">Green wins</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-500">
                    {gameHistory.filter(g => g.result === "violet").length}
                  </div>
                  <div className="text-sm text-gray-400">Violet wins</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Betting Panel */}
        <div className="space-y-6">
          {/* Bet Amount Control */}
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="text-white">Bet Amount</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="bg-secondary-dark border-gray-600 text-white"
                min="10"
                max={balance}
              />
              
              <div className="grid grid-cols-2 gap-2">
                {[50, 100, 250, 500, 1000, 2500].map((amount) => (
                  <Button
                    key={amount}
                    size="sm"
                    variant="outline"
                    onClick={() => setBetAmount(amount)}
                    className="border-gray-600 text-white hover:bg-secondary-dark"
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Bets Summary */}
          {activeBets.length > 0 && (
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle className="text-white">Your Bets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeBets.map((bet) => (
                  <div key={bet.color} className="flex justify-between items-center p-2 bg-secondary-dark rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full ${getColorClass(bet.color)}`}></div>
                      <span className="text-white capitalize">{bet.color}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">₹{bet.amount}</div>
                      <div className="text-accent-green text-sm">
                        Win: ₹{(bet.amount * colorOdds[bet.color]).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="border-t border-gray-600 pt-3 flex justify-between">
                  <span className="text-gray-400">Total Bet:</span>
                  <span className="text-white font-semibold">₹{getTotalBetAmount()}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Statistics */}
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Today's Games:</span>
                <span className="text-white">147</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Your Wins:</span>
                <span className="text-accent-green">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Win Rate:</span>
                <span className="text-white">68%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Profit:</span>
                <span className="text-gold">₹12,450</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
