import { useState, useEffect, useCallback } from "react";
import { LiveMatch, AviatorGameState, ColorGameState } from "@/types";
import { mockMatches } from "@/utils/mockData";

export function useRealTimeUpdates() {
  const [matches, setMatches] = useState<LiveMatch[]>(mockMatches);
  const [aviatorState, setAviatorState] = useState<AviatorGameState>({
    isActive: false,
    multiplier: 1.0,
    timeElapsed: 0,
    crashed: false,
    nextRoundIn: 15,
    activePlayers: [],
  });
  const [colorGameState, setColorGameState] = useState<ColorGameState>({
    countdown: 45,
    isActive: true,
    currentRound: 1235,
    history: [],
  });

  // Update cricket odds
  const updateCricketOdds = useCallback(() => {
    setMatches(prev => 
      prev.map(match => ({
        ...match,
        odds: {
          team1Win: Math.max(1.1, match.odds.team1Win + (Math.random() - 0.5) * 0.1),
          team2Win: Math.max(1.1, match.odds.team2Win + (Math.random() - 0.5) * 0.1),
        },
      }))
    );
  }, []);

  // Update aviator multiplier
  const updateAviator = useCallback(() => {
    setAviatorState(prev => {
      if (!prev.isActive && prev.nextRoundIn > 0) {
        return { ...prev, nextRoundIn: prev.nextRoundIn - 1 };
      }
      
      if (!prev.isActive && prev.nextRoundIn <= 0) {
        return {
          ...prev,
          isActive: true,
          multiplier: 1.0,
          timeElapsed: 0,
          crashed: false,
          nextRoundIn: 0,
        };
      }
      
      if (prev.isActive && !prev.crashed) {
        const newTimeElapsed = prev.timeElapsed + 0.1;
        const newMultiplier = 1.0 + Math.pow(newTimeElapsed / 10, 1.5);
        const crashChance = Math.min(0.05, newTimeElapsed / 100);
        
        if (Math.random() < crashChance || newMultiplier > 50) {
          return {
            ...prev,
            crashed: true,
            isActive: false,
            nextRoundIn: 15,
          };
        }
        
        return {
          ...prev,
          multiplier: newMultiplier,
          timeElapsed: newTimeElapsed,
        };
      }
      
      return prev;
    });
  }, []);

  // Update color game countdown
  const updateColorGame = useCallback(() => {
    setColorGameState(prev => {
      if (prev.countdown > 0) {
        return { ...prev, countdown: prev.countdown - 1 };
      }
      
      // New round starts
      const results = ["red", "green", "violet"] as const;
      const result = results[Math.floor(Math.random() * 3)];
      
      return {
        ...prev,
        countdown: 60,
        currentRound: prev.currentRound + 1,
        history: [
          { result, timestamp: Date.now(), round: prev.currentRound },
          ...prev.history.slice(0, 9), // Keep last 10 results
        ],
      };
    });
  }, []);

  useEffect(() => {
    const cricketInterval = setInterval(updateCricketOdds, 3000);
    const aviatorInterval = setInterval(updateAviator, 100);
    const colorGameInterval = setInterval(updateColorGame, 1000);

    return () => {
      clearInterval(cricketInterval);
      clearInterval(aviatorInterval);
      clearInterval(colorGameInterval);
    };
  }, [updateCricketOdds, updateAviator, updateColorGame]);

  return {
    matches,
    aviatorState,
    colorGameState,
  };
}
