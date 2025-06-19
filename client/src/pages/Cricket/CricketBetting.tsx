import { useState } from "react";
import { Calendar, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRealTimeUpdates } from "@/hooks/useRealTimeUpdates";
import { useBetSlip } from "@/contexts/BetSlipContext";
import { useApp } from "@/contexts/AppContext";
import MatchCard from "@/components/Cricket/MatchCard";
import LiveScore from "@/components/Cricket/LiveScore";

export default function CricketBetting() {
  const { matches } = useRealTimeUpdates();
  const { addBet } = useBetSlip();
  const { showToast } = useApp();
  const [selectedMatch, setSelectedMatch] = useState(matches[0]);

  const handleAddBet = (betType: string, selection: string, odds: number) => {
    addBet({
      gameType: "cricket",
      betType,
      selection,
      odds,
      match: `${selectedMatch.team1} vs ${selectedMatch.team2}`,
    });
    showToast("Added to bet slip", "success");
  };

  const liveMatches = matches.filter(m => m.status === "live");
  const upcomingMatches = matches.filter(m => m.status === "upcoming");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Cricket Betting</h1>
        <p className="text-gray-400">Live matches with real-time odds</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Matches List */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="live" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-secondary-dark">
              <TabsTrigger value="live" className="data-[state=active]:bg-accent-green data-[state=active]:text-primary-dark">
                Live Matches ({liveMatches.length})
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-accent-green data-[state=active]:text-primary-dark">
                Upcoming ({upcomingMatches.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="live" className="space-y-4">
              {liveMatches.map((match) => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  onSelect={setSelectedMatch}
                  isSelected={selectedMatch?.id === match.id}
                />
              ))}
            </TabsContent>
            
            <TabsContent value="upcoming" className="space-y-4">
              {upcomingMatches.map((match) => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  onSelect={setSelectedMatch}
                  isSelected={selectedMatch?.id === match.id}
                />
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Betting Panel */}
        <div className="space-y-6">
          {selectedMatch && (
            <>
              <LiveScore match={selectedMatch} />
              
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle className="text-white">Match Winner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => handleAddBet("match_winner", `${selectedMatch.team1} Win`, selectedMatch.odds.team1Win)}
                    className="w-full flex justify-between bg-secondary-dark hover:bg-gray-600 text-white"
                  >
                    <span>{selectedMatch.team1}</span>
                    <span className="text-accent-green font-semibold">
                      {selectedMatch.odds.team1Win.toFixed(2)}
                    </span>
                  </Button>
                  
                  <Button
                    onClick={() => handleAddBet("match_winner", `${selectedMatch.team2} Win`, selectedMatch.odds.team2Win)}
                    className="w-full flex justify-between bg-secondary-dark hover:bg-gray-600 text-white"
                  >
                    <span>{selectedMatch.team2}</span>
                    <span className="text-accent-green font-semibold">
                      {selectedMatch.odds.team2Win.toFixed(2)}
                    </span>
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle className="text-white">Toss Winner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => handleAddBet("toss", `${selectedMatch.team1} Toss`, 1.95)}
                    className="w-full flex justify-between bg-secondary-dark hover:bg-gray-600 text-white"
                  >
                    <span>{selectedMatch.team1}</span>
                    <span className="text-accent-green font-semibold">1.95</span>
                  </Button>
                  
                  <Button
                    onClick={() => handleAddBet("toss", `${selectedMatch.team2} Toss`, 1.95)}
                    className="w-full flex justify-between bg-secondary-dark hover:bg-gray-600 text-white"
                  >
                    <span>{selectedMatch.team2}</span>
                    <span className="text-accent-green font-semibold">1.95</span>
                  </Button>
                </CardContent>
              </Card>

              {selectedMatch.status === "live" && (
                <Card className="glass-morphism">
                  <CardHeader>
                    <CardTitle className="text-white">Next Over Runs</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((runs) => (
                      <Button
                        key={runs}
                        onClick={() => handleAddBet("next_over", `${runs} Runs`, runs === 6 ? 4.5 : runs < 6 ? 2.1 : 8.0)}
                        className="bg-secondary-dark hover:bg-gray-600 text-white text-sm"
                      >
                        {runs}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              )}

              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle className="text-white">Total Runs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => handleAddBet("total_runs", "Over 300.5", 1.85)}
                    className="w-full flex justify-between bg-secondary-dark hover:bg-gray-600 text-white"
                  >
                    <span>Over 300.5</span>
                    <span className="text-accent-green font-semibold">1.85</span>
                  </Button>
                  
                  <Button
                    onClick={() => handleAddBet("total_runs", "Under 300.5", 1.95)}
                    className="w-full flex justify-between bg-secondary-dark hover:bg-gray-600 text-white"
                  >
                    <span>Under 300.5</span>
                    <span className="text-accent-green font-semibold">1.95</span>
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
