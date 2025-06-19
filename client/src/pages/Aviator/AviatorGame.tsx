import { useState, useEffect } from "react";
import { Plane, Users, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRealTimeUpdates } from "@/hooks/useRealTimeUpdates";
import { useApp } from "@/contexts/AppContext";
import AviatorDisplay from "@/components/Aviator/AviatorDisplay";

interface Player {
  username: string;
  bet: number;
  cashedOut: boolean;
  multiplier?: number;
  winAmount?: number;
}

export default function AviatorGame() {
  const { aviatorState } = useRealTimeUpdates();
  const { showToast, balance, setBalance } = useApp();
  const [betAmount, setBetAmount] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlacedBet, setHasPlacedBet] = useState(false);
  const [cashOutAt, setCashOutAt] = useState<number>(2.0);
  const [autoCashOut, setAutoCashOut] = useState(false);
  const [players, setPlayers] = useState<Player[]>([
    { username: "RajeshK***", bet: 500, cashedOut: false },
    { username: "PriyaM***", bet: 250, cashedOut: true, multiplier: 2.45, winAmount: 612.5 },
    { username: "ArunS***", bet: 1000, cashedOut: false },
    { username: "SnehaR***", bet: 150, cashedOut: true, multiplier: 1.85, winAmount: 277.5 },
    { username: "VikasT***", bet: 750, cashedOut: false },
  ]);

  const handlePlaceBet = () => {
    if (betAmount < 10) {
      showToast("Minimum bet is ₹10", "error");
      return;
    }
    
    if (betAmount > balance) {
      showToast("Insufficient balance", "error");
      return;
    }

    if (aviatorState.isActive) {
      showToast("Cannot place bet during active round", "error");
      return;
    }

    setBalance(balance - betAmount);
    setHasPlacedBet(true);
    setIsPlaying(true);
    showToast(`Bet placed: ₹${betAmount}`, "success");
  };

  const handleCashOut = () => {
    if (!isPlaying || !aviatorState.isActive) {
      showToast("No active bet to cash out", "error");
      return;
    }

    const winAmount = betAmount * aviatorState.multiplier;
    setBalance(balance + winAmount);
    setIsPlaying(false);
    setHasPlacedBet(false);
    showToast(`Cashed out at ${aviatorState.multiplier.toFixed(2)}x! Won ₹${winAmount.toFixed(2)}`, "success");
  };

  // Auto cash out functionality
  useEffect(() => {
    if (autoCashOut && isPlaying && aviatorState.isActive && aviatorState.multiplier >= cashOutAt) {
      handleCashOut();
    }
  }, [aviatorState.multiplier, autoCashOut, isPlaying, aviatorState.isActive, cashOutAt]);

  // Reset bet when round ends
  useEffect(() => {
    if (aviatorState.crashed && isPlaying) {
      setIsPlaying(false);
      setHasPlacedBet(false);
      showToast("Plane crashed! Better luck next time.", "error");
    }
  }, [aviatorState.crashed]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Aviator Game</h1>
        <p className="text-gray-400">Cash out before the plane flies away!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Display */}
        <div className="lg:col-span-2">
          <AviatorDisplay
            multiplier={aviatorState.multiplier}
            isActive={aviatorState.isActive}
            crashed={aviatorState.crashed}
            nextRoundIn={aviatorState.nextRoundIn}
          />

          {/* Game Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <Card className="glass-morphism">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-accent-green mb-1">
                  {aviatorState.multiplier.toFixed(2)}x
                </div>
                <div className="text-sm text-gray-400">Current Multiplier</div>
              </CardContent>
            </Card>

            <Card className="glass-morphism">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {players.length}
                </div>
                <div className="text-sm text-gray-400">Active Players</div>
              </CardContent>
            </Card>

            <Card className="glass-morphism">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gold mb-1">
                  {aviatorState.nextRoundIn > 0 ? aviatorState.nextRoundIn : "0"}s
                </div>
                <div className="text-sm text-gray-400">Next Round</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Betting Panel */}
        <div className="space-y-6">
          {/* Bet Controls */}
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="text-white">Place Your Bet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Bet Amount</label>
                <Input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  className="bg-secondary-dark border-gray-600 text-white"
                  min="10"
                  max={balance}
                  disabled={isPlaying || aviatorState.isActive}
                />
              </div>

              <div className="flex space-x-2">
                {[50, 100, 250, 500].map((amount) => (
                  <Button
                    key={amount}
                    size="sm"
                    variant="outline"
                    onClick={() => setBetAmount(amount)}
                    className="border-gray-600 text-white hover:bg-secondary-dark"
                    disabled={isPlaying || aviatorState.isActive}
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoCashOut"
                  checked={autoCashOut}
                  onChange={(e) => setAutoCashOut(e.target.checked)}
                  className="rounded border-gray-600"
                />
                <label htmlFor="autoCashOut" className="text-sm text-gray-400">
                  Auto Cash Out at
                </label>
                <Input
                  type="number"
                  value={cashOutAt}
                  onChange={(e) => setCashOutAt(Number(e.target.value))}
                  className="w-20 bg-secondary-dark border-gray-600 text-white text-sm"
                  min="1.1"
                  max="100"
                  step="0.1"
                />
                <span className="text-sm text-gray-400">x</span>
              </div>

              {!isPlaying ? (
                <Button
                  onClick={handlePlaceBet}
                  className="w-full gradient-accent text-primary-dark font-semibold hover:opacity-90"
                  disabled={aviatorState.isActive}
                >
                  <Plane className="w-4 h-4 mr-2" />
                  Place Bet ₹{betAmount}
                </Button>
              ) : (
                <Button
                  onClick={handleCashOut}
                  className="w-full gradient-danger text-white font-semibold hover:opacity-90"
                  disabled={!aviatorState.isActive}
                >
                  Cash Out ₹{(betAmount * aviatorState.multiplier).toFixed(2)}
                </Button>
              )}

              {isPlaying && (
                <div className="text-center text-sm">
                  <div className="text-gray-400">Current Win:</div>
                  <div className="text-accent-green font-semibold text-lg">
                    ₹{(betAmount * aviatorState.multiplier).toFixed(2)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Players */}
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Active Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {players.map((player, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-secondary-dark rounded-lg"
                  >
                    <div>
                      <div className="text-white text-sm font-medium">
                        {player.username}
                      </div>
                      <div className="text-gray-400 text-xs">
                        Bet: ₹{player.bet}
                      </div>
                    </div>
                    <div className="text-right">
                      {player.cashedOut ? (
                        <div>
                          <Badge className="bg-accent-green text-primary-dark text-xs">
                            {player.multiplier}x
                          </Badge>
                          <div className="text-accent-green text-xs">
                            ₹{player.winAmount}
                          </div>
                        </div>
                      ) : (
                        <Badge className="bg-gray-600 text-white text-xs">
                          Playing
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Game History */}
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Recent Multipliers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {[2.45, 1.85, 8.32, 1.23, 3.67, 1.45, 2.78, 1.92, 4.23, 1.67].map((mult, index) => (
                  <div
                    key={index}
                    className={`text-center p-2 rounded text-xs font-semibold ${
                      mult >= 2.0 ? "bg-accent-green text-primary-dark" : "bg-danger-red text-white"
                    }`}
                  >
                    {mult.toFixed(2)}x
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
