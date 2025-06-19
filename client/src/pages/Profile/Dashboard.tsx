import { useState } from "react";
import { User, Wallet, TrendingUp, Trophy, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";

export default function Dashboard() {
  const { user, balance } = useApp();
  const [activeTab, setActiveTab] = useState("overview");

  const betHistory = [
    { id: 1, game: "Cricket", type: "Match Winner", selection: "India Win", amount: 500, odds: 1.85, status: "won", result: 925, date: "2024-01-15T10:30:00Z" },
    { id: 2, game: "Aviator", type: "Cash Out", selection: "2.45x", amount: 250, odds: 2.45, status: "won", result: 612.5, date: "2024-01-15T09:15:00Z" },
    { id: 3, game: "Color Game", type: "Color", selection: "Green", amount: 100, odds: 2.0, status: "lost", result: 0, date: "2024-01-15T08:45:00Z" },
    { id: 4, game: "Mini Games", type: "Dice", selection: "6", amount: 200, odds: 6.0, status: "lost", result: 0, date: "2024-01-14T18:20:00Z" },
    { id: 5, game: "Cricket", type: "Total Runs", selection: "Over 300.5", amount: 300, odds: 1.95, status: "won", result: 585, date: "2024-01-14T16:00:00Z" },
  ];

  const transactions = [
    { id: 1, type: "deposit", amount: 5000, status: "completed", date: "2024-01-15T08:00:00Z", method: "UPI" },
    { id: 2, type: "win", amount: 925, status: "completed", date: "2024-01-15T10:30:00Z", method: "Bet Win" },
    { id: 3, type: "bet", amount: -500, status: "completed", date: "2024-01-15T10:30:00Z", method: "Cricket Bet" },
    { id: 4, type: "win", amount: 612.5, status: "completed", date: "2024-01-15T09:15:00Z", method: "Aviator Win" },
    { id: 5, type: "withdrawal", amount: -2000, status: "pending", date: "2024-01-14T20:00:00Z", method: "Bank Transfer" },
  ];

  const stats = {
    totalBets: betHistory.length,
    wonBets: betHistory.filter(bet => bet.status === "won").length,
    totalWagered: betHistory.reduce((sum, bet) => sum + bet.amount, 0),
    totalWinnings: betHistory.filter(bet => bet.status === "won").reduce((sum, bet) => sum + bet.result, 0),
    biggestWin: Math.max(...betHistory.filter(bet => bet.status === "won").map(bet => bet.result)),
    winRate: (betHistory.filter(bet => bet.status === "won").length / betHistory.length) * 100,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "won": return "text-accent-green";
      case "lost": return "text-danger-red";
      case "pending": return "text-yellow-500";
      case "completed": return "text-accent-green";
      default: return "text-gray-400";
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit": return "↓";
      case "withdrawal": return "↑";
      case "win": return "💰";
      case "bet": return "🎯";
      default: return "💸";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back, {user?.username}!</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-secondary-dark mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-accent-green data-[state=active]:text-primary-dark">
            Overview
          </TabsTrigger>
          <TabsTrigger value="bets" className="data-[state=active]:bg-accent-green data-[state=active]:text-primary-dark">
            Bet History
          </TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-accent-green data-[state=active]:text-primary-dark">
            Transactions
          </TabsTrigger>
          <TabsTrigger value="profile" className="data-[state=active]:bg-accent-green data-[state=active]:text-primary-dark">
            Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Balance Card */}
          <Card className="glass-morphism">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Current Balance</p>
                  <p className="text-3xl font-bold text-accent-green">₹{balance.toLocaleString()}</p>
                </div>
                <div className="w-16 h-16 bg-accent-green rounded-full flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-primary-dark" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="glass-morphism">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-accent-green mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{stats.totalBets}</p>
                <p className="text-sm text-gray-400">Total Bets</p>
              </CardContent>
            </Card>

            <Card className="glass-morphism">
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 text-gold mx-auto mb-2" />
                <p className="text-2xl font-bold text-accent-green">{stats.wonBets}</p>
                <p className="text-sm text-gray-400">Wins</p>
              </CardContent>
            </Card>

            <Card className="glass-morphism">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white">{stats.winRate.toFixed(1)}%</div>
                <p className="text-sm text-gray-400">Win Rate</p>
              </CardContent>
            </Card>

            <Card className="glass-morphism">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gold">₹{stats.biggestWin.toLocaleString()}</div>
                <p className="text-sm text-gray-400">Biggest Win</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {betHistory.slice(0, 5).map((bet) => (
                  <div key={bet.id} className="flex items-center justify-between p-3 bg-secondary-dark rounded-lg">
                    <div>
                      <p className="text-white font-medium">{bet.game} - {bet.type}</p>
                      <p className="text-gray-400 text-sm">{bet.selection}</p>
                      <p className="text-gray-500 text-xs">{formatDate(bet.date)}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={`${bet.status === "won" ? "bg-accent-green text-primary-dark" : "bg-danger-red text-white"}`}>
                        {bet.status}
                      </Badge>
                      <p className={`text-sm font-semibold ${getStatusColor(bet.status)}`}>
                        {bet.status === "won" ? `+₹${bet.result}` : `-₹${bet.amount}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bets" className="space-y-4">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="text-white">Betting History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {betHistory.map((bet) => (
                  <div key={bet.id} className="flex items-center justify-between p-4 bg-secondary-dark rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="text-white font-medium">{bet.game}</p>
                          <p className="text-gray-400 text-sm">{bet.type} - {bet.selection}</p>
                          <p className="text-gray-500 text-xs flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDate(bet.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center mx-4">
                      <p className="text-gray-400 text-sm">Stake</p>
                      <p className="text-white font-semibold">₹{bet.amount}</p>
                    </div>
                    
                    <div className="text-center mx-4">
                      <p className="text-gray-400 text-sm">Odds</p>
                      <p className="text-accent-green font-semibold">{bet.odds}x</p>
                    </div>
                    
                    <div className="text-right">
                      <Badge className={`${bet.status === "won" ? "bg-accent-green text-primary-dark" : "bg-danger-red text-white"} mb-1`}>
                        {bet.status}
                      </Badge>
                      <p className={`font-semibold ${getStatusColor(bet.status)}`}>
                        {bet.status === "won" ? `+₹${bet.result}` : `-₹${bet.amount}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="text-white">Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-secondary-dark rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getTransactionIcon(transaction.type)}</div>
                      <div>
                        <p className="text-white font-medium capitalize">{transaction.type}</p>
                        <p className="text-gray-400 text-sm">{transaction.method}</p>
                        <p className="text-gray-500 text-xs flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge className={`${transaction.status === "completed" ? "bg-accent-green text-primary-dark" : "bg-yellow-500 text-primary-dark"} mb-1`}>
                        {transaction.status}
                      </Badge>
                      <p className={`font-semibold ${
                        transaction.amount > 0 ? "text-accent-green" : "text-danger-red"
                      }`}>
                        {transaction.amount > 0 ? "+" : ""}₹{Math.abs(transaction.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="text-white">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-accent-green rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary-dark" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-white">{user?.username}</p>
                  <p className="text-gray-400">{user?.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Email</label>
                  <p className="text-white">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Phone</label>
                  <p className="text-white">{user?.phone || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Account Status</label>
                  <Badge className="bg-accent-green text-primary-dark">
                    {user?.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Member Since</label>
                  <p className="text-white">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
              
              <div className="pt-4">
                <Button className="gradient-accent text-primary-dark hover:opacity-90">
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
