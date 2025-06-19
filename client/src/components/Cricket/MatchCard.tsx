import { Clock, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LiveMatch } from "@/types";

interface MatchCardProps {
  match: LiveMatch;
  onSelect: (match: LiveMatch) => void;
  isSelected: boolean;
}

export default function MatchCard({ match, onSelect, isSelected }: MatchCardProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card 
      className={`glass-morphism cursor-pointer transition-all duration-200 ${
        isSelected ? "ring-2 ring-accent-green" : "hover:bg-opacity-80"
      }`}
      onClick={() => onSelect(match)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Badge 
              className={`${
                match.status === "live" 
                  ? "bg-danger-red text-white live-pulse" 
                  : "bg-blue-500 text-white"
              }`}
            >
              {match.status === "live" ? "LIVE" : "UPCOMING"}
            </Badge>
            {match.status === "upcoming" && (
              <div className="flex items-center text-sm text-gray-400">
                <Clock className="w-4 h-4 mr-1" />
                {formatTime(match.startTime)}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent-green rounded-full flex items-center justify-center text-primary-dark font-bold text-sm">
                {match.team1.charAt(0)}
              </div>
              <span className="font-semibold text-white">{match.team1}</span>
            </div>
            {match.status === "live" && (
              <span className="text-accent-green font-semibold">
                {match.score.team1Score}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-primary-dark font-bold text-sm">
                {match.team2.charAt(0)}
              </div>
              <span className="font-semibold text-white">{match.team2}</span>
            </div>
            {match.status === "live" && (
              <span className="text-accent-green font-semibold">
                {match.score.team2Score}
              </span>
            )}
          </div>
        </div>

        {match.status === "live" && (
          <div className="text-sm text-gray-400 mb-4">
            Over {match.score.overs} • {match.score.currentOver}
          </div>
        )}

        <div className="flex space-x-2">
          <Button 
            size="sm"
            variant="secondary"
            className="flex-1 bg-secondary-dark hover:bg-gray-600 text-white"
          >
            {match.team1.split(" ")[0]} {match.odds.team1Win.toFixed(2)}
          </Button>
          <Button 
            size="sm"
            variant="secondary"
            className="flex-1 bg-secondary-dark hover:bg-gray-600 text-white"
          >
            {match.team2.split(" ")[0]} {match.odds.team2Win.toFixed(2)}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
