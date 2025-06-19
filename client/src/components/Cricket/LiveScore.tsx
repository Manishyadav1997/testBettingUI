import { Activity, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LiveMatch } from "@/types";

interface LiveScoreProps {
  match: LiveMatch;
}

export default function LiveScore({ match }: LiveScoreProps) {
  if (match.status !== "live") {
    return (
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Match Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Start Time:</span>
              <span className="text-white">
                {new Date(match.startTime).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Status:</span>
              <Badge className="bg-blue-500 text-white">Upcoming</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-morphism">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Activity className="w-5 h-5 mr-2 text-accent-green" />
          Live Score
          <Badge className="ml-auto bg-danger-red text-white live-pulse">LIVE</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-secondary-dark rounded-lg">
            <div>
              <div className="font-semibold text-white">{match.team1}</div>
              <div className="text-sm text-gray-400">Batting</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-accent-green">
                {match.score.team1Score}
              </div>
              <div className="text-sm text-gray-400">
                ({match.score.overs} overs)
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 bg-primary-dark rounded-lg">
            <div>
              <div className="font-semibold text-white">{match.team2}</div>
              <div className="text-sm text-gray-400">Bowling</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-white">
                {match.score.team2Score}
              </div>
              <div className="text-sm text-gray-400">Yet to bat</div>
            </div>
          </div>

          <div className="bg-secondary-dark rounded-lg p-3">
            <div className="text-sm text-gray-400 mb-1">Current Over:</div>
            <div className="text-white font-mono">{match.score.currentOver}</div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Required Rate:</span>
            <span className="text-white">8.5 per over</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
