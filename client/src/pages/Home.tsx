import { useEffect } from "react";
import { Link } from "wouter";
import { Flame, Radio, Gift, Trophy, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRealTimeUpdates } from "@/hooks/useRealTimeUpdates";
import { useApp } from "@/contexts/AppContext";
import { useBetSlip } from "@/contexts/BetSlipContext";
import { mockWinners, mockPromotions } from "@/utils/mockData";

export default function Home() {
  const { matches, aviatorState } = useRealTimeUpdates();
  const { showToast } = useApp();
  const { addBet } = useBetSlip();

  const handleAddBet = (gameType: any, betType: string, selection: string, odds: number, match?: string) => {
    addBet({ gameType, betType, selection, odds, match });
    showToast("Added to bet slip", "success");
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      {/* Hero Banner */}
      <section className="mb-8">
        <div 
          className="relative h-64 rounded-2xl overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Win Big Today</h1>
              <p className="text-xl text-gray-200 mb-6">Premium betting experience with live odds</p>
              <Link href="/cricket">
                <Button className="gradient-accent text-primary-dark px-8 py-3 text-lg font-semibold hover:opacity-90">
                  Start Betting <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Flame className="text-danger-red mr-3 w-6 h-6" />
          Featured Games
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cricket Betting Card */}
          <Card className="glass-morphism bet-card cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Cricket Betting</h3>
                <Badge className="bg-danger-red text-white live-pulse">LIVE</Badge>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" 
                alt="Cricket match" 
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>India vs Australia</span>
                  <span className="text-accent-green">Live</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Over 15.3</span>
                  <span>145/3</span>
                </div>
              </div>
              <Link href="/cricket">
                <Button className="w-full gradient-accent text-primary-dark mt-4 font-medium hover:opacity-90">
                  Place Bet
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Aviator Game Card */}
          <Card className="glass-morphism bet-card cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Aviator</h3>
                <div className="text-2xl animate-fly">✈️</div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1596838132731-3301c3fd4317?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" 
                alt="Casino gaming" 
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              <div className="text-center">
                <div className="text-3xl font-bold multiplier-display mb-2">
                  {aviatorState.multiplier.toFixed(2)}x
                </div>
                <div className="text-sm text-gray-300 mb-4">Current Multiplier</div>
                <div className="flex space-x-2">
                  <Link href="/aviator" className="flex-1">
                    <Button className="w-full gradient-accent text-primary-dark font-medium">
                      Play
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Trading Card */}
          <Card className="glass-morphism bet-card cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Color Trading</h3>
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                </div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" 
                alt="Trading charts" 
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-green mb-2">00:45</div>
                <div className="text-sm text-gray-300 mb-4">Next Round</div>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    onClick={() => handleAddBet("color", "color", "Red", 2.0)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium"
                  >
                    Red
                  </Button>
                  <Button 
                    onClick={() => handleAddBet("color", "color", "Green", 2.0)}
                    className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium"
                  >
                    Green
                  </Button>
                  <Button 
                    onClick={() => handleAddBet("color", "color", "Violet", 4.5)}
                    className="bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium"
                  >
                    Violet
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Live Matches */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Radio className="text-accent-green mr-3 w-6 h-6" />
          Live Matches
        </h2>
        <div className="space-y-4">
          {matches.filter(match => match.status === "live").map((match) => (
            <Card key={match.id} className="glass-morphism">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <img 
                      src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=60" 
                      alt="Cricket stadium" 
                      className="w-16 h-10 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold">{match.team1} vs {match.team2}</h3>
                      <p className="text-sm text-gray-300">
                        Over {match.score.overs} • {match.team1.split(" ")[0]} {match.score.team1Score}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="secondary"
                      className="bg-secondary-dark hover:bg-gray-600 text-sm flex-1 min-w-[120px]"
                      onClick={() => handleAddBet("cricket", "match_winner", `${match.team1} Win`, match.odds.team1Win, `${match.team1} vs ${match.team2}`)}
                    >
                      {match.team1.split(" ")[0]} Win <span className="text-accent-green ml-1">{match.odds.team1Win.toFixed(2)}</span>
                    </Button>
                    <Button 
                      variant="secondary"
                      className="bg-secondary-dark hover:bg-gray-600 text-sm flex-1 min-w-[120px]"
                      onClick={() => handleAddBet("cricket", "match_winner", `${match.team2} Win`, match.odds.team2Win, `${match.team1} vs ${match.team2}`)}
                    >
                      {match.team2.split(" ")[0]} Win <span className="text-accent-green ml-1">{match.odds.team2Win.toFixed(2)}</span>
                    </Button>
                    <Link 
                      href="/cricket" 
                      className="flex-1 min-w-[120px]"
                    >
                      <Button className="gradient-accent text-primary-dark text-sm font-medium hover:opacity-90 w-full">
                        More Bets
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Mini Games */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className="text-gold mr-3">🎮</span>
          Mini Games
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { emoji: "🎲", name: "Dice Roll", link: "/mini-games" },
            { emoji: "🎯", name: "Spin Wheel", link: "/mini-games", animate: "animate-spin-slow" },
            { emoji: "🪙", name: "Coin Toss", link: "/mini-games", animate: "animate-bounce-slow" },
            { emoji: "🃏", name: "Card Draw", link: "/mini-games" },
          ].map((game) => (
            <Card key={game.name} className="glass-morphism bet-card cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className={`text-3xl mb-2 ${game.animate || ""}`}>{game.emoji}</div>
                <h3 className="font-semibold mb-2">{game.name}</h3>
                <Link href={game.link}>
                  <Button className="w-full gradient-accent text-primary-dark text-sm font-medium">
                    Play
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Today's Winners */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Trophy className="text-gold mr-3 w-6 h-6" />
          Today's Winners
        </h2>
        <Card className="glass-morphism">
          <CardContent className="p-6">
            <div className="space-y-4">
              {mockWinners.map((winner) => (
                <div key={winner.rank} className="flex items-center justify-between py-2 border-b border-gray-600 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-primary-dark font-bold text-sm ${
                      winner.rank === 1 ? "bg-gold" : winner.rank === 2 ? "bg-gray-400" : "bg-amber-600"
                    }`}>
                      {winner.rank}
                    </div>
                    <div>
                      <p className="font-semibold">{winner.username}</p>
                      <p className="text-sm text-gray-300">{winner.game}</p>
                    </div>
                  </div>
                  <div className="text-accent-green font-semibold">
                    ₹{winner.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Promotions */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Gift className="text-gold mr-3 w-6 h-6" />
          Active Promotions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockPromotions.slice(0, 2).map((promo) => (
            <Card key={promo.id} className={`${promo.type === "welcome" ? "gradient-gold" : "gradient-accent"} text-primary-dark`}>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{promo.title}</h3>
                <p className="mb-4">{promo.description}</p>
                <Button 
                  className="bg-primary-dark text-white hover:bg-gray-800 font-medium"
                  onClick={() => showToast("Promotion claimed!", "success")}
                >
                  {promo.type === "welcome" ? "Claim Now" : "Learn More"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
