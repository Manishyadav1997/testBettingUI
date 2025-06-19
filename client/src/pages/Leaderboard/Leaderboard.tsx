import { useState } from "react";
import { Trophy, Medal, Crown, TrendingUp, Users, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { mockWinners } from "@/utils/mockData";

interface LeaderboardEntry {
  rank: number;
  username: string;
  game: string;
  amount: number;
  timestamp: number;
  avatar?: string;
  level?: number;
  gamesPlayed?: number;
  winRate?: number;
}

export default function Leaderboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month" | "all">("today");
  const [selectedGame, setSelectedGame] = useState<"all" | "cricket" | "aviator" | "color" | "mini">("all");

  // Extended leaderboard data with more entries
  const leaderboardData: LeaderboardEntry[] = [
    ...mockWinners.map(winner => ({
      ...winner,
      level: Math.floor(Math.random() * 20) + 10,
      gamesPlayed: Math.floor(Math.random() * 500) + 100,
      winRate: Math.floor(Math.random() * 40) + 60,
    })),
    { rank: 6, username: "KrishnaD***", game: "Cricket", amount: 11250, timestamp: Date.now() - 1800000, level: 15, gamesPlayed: 234, winRate: 72 },
    { rank: 7, username: "AnujaP***", game: "Color Trading", amount: 9870, timestamp: Date.now() - 2100000, level: 18, gamesPlayed: 445, winRate: 68 },
    { rank: 8, username: "RohitS***", game: "Aviator", amount: 8750, timestamp: Date.now() - 2400000, level: 22, gamesPlayed: 356, winRate: 74 },
    { rank: 9, username: "DeepikaN***", game: "Mini Games", amount: 7650, timestamp: Date.now() - 2700000, level: 12, gamesPlayed: 198, winRate: 65 },
    { rank: 10, username: "AmitK***", game: "Cricket", amount: 6890, timestamp: Date.now() - 3000000, level: 16, gamesPlayed: 287, winRate: 69 },
  ];

  const gameStats = {
    cricket: { players: 1247, totalWinnings: 2450000, avgBet: 850 },
    aviator: { players: 2156, totalWinnings: 3890000, avgBet: 450 },
    color: { players: 3421, totalWinnings: 1890000, avgBet: 250 },
    mini: { players: 987, totalWinnings: 890000, avgBet: 150 },
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-gold" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gold text-primary-dark";
      case 2:
        return "bg-gray-400 text-primary-dark";
      case 3:
        return "bg-amber-600 text-primary-dark";
      default:
        return "bg-secondary-dark text-white";
    }
  };

  const getGameIcon = (game: string) => {
    switch (game.toLowerCase()) {
      case "cricket":
        return "🏏";
      case "aviator":
        return "✈️";
      case "color trading":
      case "color game":
        return "🎨";
      case "mini games":
        return "🎮";
      default:
        return "🎯";
    }
  };

  const filteredData = leaderboardData.filter(entry => {
    if (selectedGame === "all") return true;
    return entry.game.toLowerCase().includes(selectedGame);
  });

  const formatTimeAgo = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
        <p className="text-gray-400">Top performers across all games</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Leaderboard Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Period and Game Filters */}
          <Card className="glass-morphism">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm text-gray-400 mb-2 block">Time Period</label>
                  <div className="flex space-x-2">
                    {[
                      { key: "today", label: "Today" },
                      { key: "week", label: "This Week" },
                      { key: "month", label: "This Month" },
                      { key: "all", label: "All Time" },
                    ].map((period) => (
                      <Button
                        key={period.key}
                        size="sm"
                        variant={selectedPeriod === period.key ? "default" : "outline"}
                        onClick={() => setSelectedPeriod(period.key as any)}
                        className={
                          selectedPeriod === period.key
                            ? "bg-accent-green text-primary-dark"
                            : "border-gray-600 text-white hover:bg-secondary-dark"
                        }
                      >
                        {period.label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex-1">
                  <label className="text-sm text-gray-400 mb-2 block">Game Category</label>
                  <div className="flex space-x-2">
                    {[
                      { key: "all", label: "All Games" },
                      { key: "cricket", label: "Cricket" },
                      { key: "aviator", label: "Aviator" },
                      { key: "color", label: "Color" },
                      { key: "mini", label: "Mini" },
                    ].map((game) => (
                      <Button
                        key={game.key}
                        size="sm"
                        variant={selectedGame === game.key ? "default" : "outline"}
                        onClick={() => setSelectedGame(game.key as any)}
                        className={
                          selectedGame === game.key
                            ? "bg-accent-green text-primary-dark"
                            : "border-gray-600 text-white hover:bg-secondary-dark"
                        }
                      >
                        {game.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top 3 Podium */}
          <Card className="glass-morphism">
            <CardContent className="p-6">
              <div className="flex justify-center items-end space-x-8 mb-6">
                {/* Second Place */}
                {filteredData[1] && (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mb-3 mx-auto">
                      <Medal className="w-10 h-10 text-white" />
                    </div>
                    <div className="bg-secondary-dark rounded-lg p-3 min-w-[120px]">
                      <p className="text-white font-semibold text-sm">{filteredData[1].username}</p>
                      <p className="text-gray-400 text-xs">{filteredData[1].game}</p>
                      <p className="text-accent-green font-bold">₹{filteredData[1].amount.toLocaleString()}</p>
                    </div>
                  </div>
                )}

                {/* First Place */}
                {filteredData[0] && (
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center mb-3 mx-auto">
                      <Crown className="w-12 h-12 text-primary-dark" />
                    </div>
                    <div className="bg-secondary-dark rounded-lg p-4 min-w-[140px]">
                      <p className="text-white font-semibold">{filteredData[0].username}</p>
                      <p className="text-gray-400 text-sm">{filteredData[0].game}</p>
                      <p className="text-gold font-bold text-lg">₹{filteredData[0].amount.toLocaleString()}</p>
                    </div>
                  </div>
                )}

                {/* Third Place */}
                {filteredData[2] && (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center mb-3 mx-auto">
                      <Medal className="w-10 h-10 text-white" />
                    </div>
                    <div className="bg-secondary-dark rounded-lg p-3 min-w-[120px]">
                      <p className="text-white font-semibold text-sm">{filteredData[2].username}</p>
                      <p className="text-gray-400 text-xs">{filteredData[2].game}</p>
                      <p className="text-accent-green font-bold">₹{filteredData[2].amount.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Full Leaderboard */}
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Full Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredData.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                      entry.rank <= 3
                        ? "bg-gradient-to-r from-secondary-dark to-accent-green bg-opacity-10"
                        : "bg-secondary-dark hover:bg-opacity-80"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12">
                        {getRankIcon(entry.rank)}
                      </div>
                      
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-accent-green text-primary-dark font-semibold">
                          {entry.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <p className="text-white font-semibold">{entry.username}</p>
                        <div className="flex items-center space-x-3 text-sm text-gray-400">
                          <span className="flex items-center">
                            <span className="mr-1">{getGameIcon(entry.game)}</span>
                            {entry.game}
                          </span>
                          {entry.level && (
                            <Badge className="bg-primary-dark text-accent-green text-xs">
                              Level {entry.level}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-accent-green">
                        ₹{entry.amount.toLocaleString()}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        {entry.winRate && (
                          <span>{entry.winRate}% win rate</span>
                        )}
                        <span>•</span>
                        <span>{formatTimeAgo(entry.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Live Stats */}
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Live Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-green mb-1">2,847</div>
                <div className="text-sm text-gray-400">Players Online</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gold mb-1">₹45,67,890</div>
                <div className="text-sm text-gray-400">Total Winnings Today</div>
              </div>
              
              <div className="text-center">
                <div className="text-xl font-bold text-white mb-1">1,234</div>
                <div className="text-sm text-gray-400">Games Played (Last Hour)</div>
              </div>
            </CardContent>
          </Card>

          {/* Game Statistics */}
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Game Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(gameStats).map(([game, stats]) => (
                <div key={game} className="p-3 bg-secondary-dark rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium capitalize flex items-center">
                      <span className="mr-2">{getGameIcon(game)}</span>
                      {game === "color" ? "Color Trading" : game}
                    </span>
                    <Badge className="bg-accent-green text-primary-dark text-xs">
                      {stats.players} players
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Winnings:</span>
                      <span className="text-accent-green font-semibold">
                        ₹{(stats.totalWinnings / 100000).toFixed(1)}L
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Avg Bet:</span>
                      <span className="text-white">₹{stats.avgBet}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Big Wins */}
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Recent Big Wins
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredData.slice(0, 5).map((entry) => (
                <div key={entry.rank} className="flex items-center justify-between p-2 bg-secondary-dark rounded-lg">
                  <div>
                    <p className="text-white text-sm font-medium">{entry.username}</p>
                    <p className="text-gray-400 text-xs">{entry.game}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-accent-green font-semibold text-sm">
                      ₹{entry.amount.toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-xs">{formatTimeAgo(entry.timestamp)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
