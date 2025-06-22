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
  id: number;
  color: "red" | "green" | "violet";
  amount: number;
}

export default function ColorTrading() {
  const { colorGameState } = useRealTimeUpdates();
  const { showToast, balance, updateBalance } = useApp();
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
      setActiveBets(prev => [...prev, { color, amount: betAmount, id: Date.now() }]);
    }

    updateBalance(-betAmount);
    // addBet({
    //   gameType: "color",
    //   betType: "color",
    //   selection: color.charAt(0).toUpperCase() + color.slice(1),
    //   odds: colorOdds[color],
    // });
    
    showToast(`₹${betAmount} bet placed on ${color}`, "success");
  };

  const handleRemoveBet = (betId: number) => {
    const betToRemove = activeBets.find(bet => bet.id === betId);
    if (betToRemove) {
      setActiveBets(prev => prev.filter(bet => bet.id !== betId));
      updateBalance(betToRemove.amount);
      showToast(`Bet of ₹${betToRemove.amount} removed`, "info");
    }
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
                  <Clock className={`w-6 h-6 ${colorGameState.isDrawing ? 'text-yellow-500' : 'text-accent-green'}`} />
                  <span className="text-lg text-gray-400">Round #{colorGameState.currentRound}</span>
                </div>
                
                {colorGameState.isDrawing ? (
                  <div className="space-y-4">
                    <div className="text-4xl font-bold text-yellow-500 mb-2 py-2">
                      The winner is...
                    </div>
                    {colorGameState.currentResult && (
                      <div className={`text-5xl font-extrabold ${
                        colorGameState.currentResult === 'red' ? 'text-red-500' :
                        colorGameState.currentResult === 'green' ? 'text-green-500' : 'text-purple-500'
                      }`}>
                        {colorGameState.currentResult.toUpperCase()}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="text-6xl font-bold text-accent-green mb-2">
                      {colorGameState.countdown.toString().padStart(2, "0")}
                    </div>
                    <div className="text-gray-400">
                      {colorGameState.countdown > 10 ? "Place your bets" : "Betting closed"}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Color Betting Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(colorOdds).map(([color, multiplier]) => {
                const activeBet = activeBets.find(bet => bet.color === color)?.amount || 0;
                const colorClasses = {
                  red: 'bg-red-500 hover:bg-red-600',
                  green: 'bg-green-500 hover:bg-green-600',
                  violet: 'bg-purple-500 hover:bg-purple-600'
                };
                
                return (
                  <div
                    key={color}
                    className={`${colorClasses[color as keyof typeof colorClasses]} rounded-xl p-6 cursor-pointer transform transition-all duration-200 hover:scale-105 ${
                      colorGameState.countdown < 10 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl'
                    }`}
                    onClick={() => colorGameState.countdown >= 10 && handleColorBet(color as "red" | "green" | "violet")}
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-2 capitalize">{color}</div>
                      <div className="text-lg mb-2">{multiplier}x</div>
                      {activeBet > 0 && (
                        <div className="bg-white/20 rounded-lg p-2 mt-3">
                          <div className="text-sm">Your Bet</div>
                          <div className="font-bold">₹{activeBet.toLocaleString()}</div>
                          <div className="text-xs">Win: ₹{(activeBet * multiplier).toLocaleString()}</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
  {/* Active Bets Summary */}
  {activeBets.length > 0 && (
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle className="text-white">Your Bets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeBets.map((bet) => (
                  <div key={bet.id} className="group relative flex justify-between items-center p-2 bg-secondary-dark rounded-lg hover:bg-secondary-dark/80 transition-colors">
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full ${getColorClass(bet.color)}`}></div>
                      <span className="text-white capitalize">{bet.color}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-white font-semibold">₹{bet.amount}</div>
                        <div className="text-accent-green text-sm">
                          Win: ₹{(bet.amount * colorOdds[bet.color]).toFixed(2)}
                        </div>
                      </div>
                      <button 
                          onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveBet(bet.id);
                        }}
                        className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-red-500/20 transition-colors"
                        title="Remove bet"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a1 1 0 001-1V5a1 1 0 00-1-1h-3.382a1 1 0 00-.894-.553h-2.448a1 1 0 00-.894.553H7a1 1 0 00-1 1v1a1 1 0 001 1z" />
                        </svg>
                      </button>

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
          {/* Tips */}
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-xl p-6">
            <h3 className="text-yellow-400 font-semibold mb-3">💡 Pro Tips</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>• Violet has higher payout (4.5x) but lower probability</li>
              <li>• Red and Green have 2x payout with better odds</li>
              <li>• Manage your bankroll wisely</li>
              <li>• Study the pattern in recent results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
