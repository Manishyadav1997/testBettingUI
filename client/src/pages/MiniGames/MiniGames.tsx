import { useState } from "react";
import { Dice1, Target, Coins, Spade } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiceGame from "@/components/MiniGames/DiceGame";
import SpinWheel from "@/components/MiniGames/SpinWheel";
import CoinToss from "@/components/MiniGames/CoinToss";
import { CardDraw } from '@/components/MiniGames/CardDraw';

export default function MiniGames() {
  const [gameHistory, setGameHistory] = useState([
    { game: "dice", result: { value: 6 }, won: true, amount: 500, timestamp: Date.now() - 60000 },
    { game: "coin", result: { side: "heads" }, won: false, amount: 200, timestamp: Date.now() - 120000 },
    { game: "wheel", result: { value: "red" }, won: true, amount: 1000, timestamp: Date.now() - 180000 },
    { game: "dice", result: { value: 3 }, won: false, amount: 300, timestamp: Date.now() - 240000 },
    { game: "coin", result: { side: "tails" }, won: true, amount: 400, timestamp: Date.now() - 300000 },
  ]);

  const addGameResult = (
    game: string | { game: string; result: any; won: boolean; amount: number },
    result?: any,
    won?: boolean,
    amount?: number
  ) => {
    if (typeof game === 'object') {
      // Handle object parameter (from CardDraw)
      setGameHistory(prev => [
        { ...game, timestamp: Date.now() },
        ...prev.slice(0, 9)
      ]);
    } else if (typeof won === 'boolean' && amount !== undefined) {
      // Handle individual parameters (from other games)
      setGameHistory(prev => [
        { game, result, won, amount, timestamp: Date.now() },
        ...prev.slice(0, 9)
      ]);
    }
  };

  const gameStats = {
    totalGames: gameHistory.length,
    wins: gameHistory.filter(g => g.won).length,
    totalProfit: gameHistory.reduce((sum, g) => sum + (g.won ? g.amount : -g.amount), 0),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Mini Games</h1>
        <p className="text-gray-400">Quick games for instant wins</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Games Section */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="dice" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-secondary-dark">
              <TabsTrigger value="dice" className="data-[state=active]:bg-accent-green data-[state=active]:text-primary-dark">
                <Dice1 className="w-4 h-4 mr-2" />
                Dice
              </TabsTrigger>
              <TabsTrigger value="wheel" className="data-[state=active]:bg-accent-green data-[state=active]:text-primary-dark">
                <Target className="w-4 h-4 mr-2" />
                Wheel
              </TabsTrigger>
              <TabsTrigger value="coin" className="data-[state=active]:bg-accent-green data-[state=active]:text-primary-dark">
                <Coins className="w-4 h-4 mr-2" />
                Coin
              </TabsTrigger>
              <TabsTrigger value="card" className="data-[state=active]:bg-accent-green data-[state=active]:text-primary-dark">
                <Spade className="w-4 h-4 mr-2" />
                Card
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dice" className="mt-6">
              <DiceGame onGameResult={addGameResult} />
            </TabsContent>

            <TabsContent value="wheel" className="mt-6">
              <SpinWheel onGameResult={addGameResult} />
            </TabsContent>

            <TabsContent value="coin" className="mt-6">
              <CoinToss onGameResult={addGameResult} />
            </TabsContent>

            <TabsContent value="card" className="mt-6">
              <CardDraw onGameResult={addGameResult} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Stats and History Section */}
        <div className="space-y-6">
          {/* Game Statistics */}
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="text-white">Your Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Games Played:</span>
                <span className="text-white font-semibold">{gameStats.totalGames}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Games Won:</span>
                <span className="text-accent-green font-semibold">{gameStats.wins}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Win Rate:</span>
                <span className="text-white font-semibold">
                  {gameStats.totalGames > 0 ? Math.round((gameStats.wins / gameStats.totalGames) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total P&L:</span>
                <span className={`font-semibold ${gameStats.totalProfit >= 0 ? "text-accent-green" : "text-danger-red"}`}>
                  {gameStats.totalProfit >= 0 ? "+" : ""}₹{gameStats.totalProfit}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Game History */}
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="text-white">Recent Games</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {gameHistory.map((game, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-secondary-dark rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-dark rounded-full flex items-center justify-center">
                        {game.game === "dice" && <Dice1 className="w-4 h-4 text-white" />}
                        {game.game === "wheel" && <Target className="w-4 h-4 text-white" />}
                        {game.game === "coin" && <Coins className="w-4 h-4 text-white" />}
                        {game.game === "card" && <Spade className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium capitalize">
                          {game.game}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {new Date(game.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${game.won ? "text-accent-green" : "text-danger-red"}`}>
                        {game.won ? "+" : "-"}₹{game.amount}
                      </div>
                      <div className="text-xs text-gray-400">
                        {game.won ? "Won" : "Lost"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats by Game */}
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="text-white">Game Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {["dice", "wheel", "coin"].map((gameType) => {
                const gameResults = gameHistory.filter(g => g.game === gameType);
                const wins = gameResults.filter(g => g.won).length;
                const total = gameResults.length;
                const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

                return (
                  <div key={gameType} className="flex justify-between items-center">
                    <span className="text-gray-400 capitalize">{gameType}:</span>
                    <div className="text-right">
                      <div className="text-white text-sm">{wins}/{total}</div>
                      <div className="text-accent-green text-xs">{winRate}%</div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
