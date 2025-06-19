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
    nextRoundIn: 45,
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
      // Handle countdown between rounds
      if (!prev.isActive && prev.nextRoundIn > 0) {
        return { ...prev, nextRoundIn: prev.nextRoundIn - 1 };
      }
  
      // Start new round
      if (!prev.isActive && prev.nextRoundIn <= 0) {
        // Generate crash point using realistic distribution
        // Most crashes happen between 1.0x - 5.0x, with rare high multipliers
        const crashPoint = generateCrashPoint();
        
        return {
          ...prev,
          isActive: true,
          multiplier: 1.0,
          timeElapsed: 0,
          crashed: false,
          nextRoundIn: 0,
          crashPoint, // Store the predetermined crash point
          startTime: Date.now(),
          speed: Math.random() * 0.3 + 0.7, // Variable speed between 0.7-1.0
        };
      }
  
      // Game is running
      if (prev.isActive && !prev.crashed) {
        const currentTime = Date.now();
        const actualTimeElapsed = (currentTime - prev.startTime) / 1000; // Convert to seconds
        
        // Calculate multiplier with realistic growth curve
        // Uses exponential growth that accelerates over time
        const baseGrowth = 0.1 * prev.speed; // Base growth rate affected by speed
        const accelerationFactor = Math.pow(actualTimeElapsed / 5, 1.2); // Acceleration over time
        const newMultiplier = 1.0 + (actualTimeElapsed * baseGrowth * (1 + accelerationFactor));
        
        // Check if we've reached the crash point
        if (newMultiplier >= prev.crashPoint) {
          return {
            ...prev,
            multiplier: prev.crashPoint,
            crashed: true,
            isActive: false,
            nextRoundIn: Math.floor(Math.random() * 20) + 30, // 3-5 second wait
            finalMultiplier: prev.crashPoint,
          };
        }
  
        return {
          ...prev,
          multiplier: Math.min(newMultiplier, prev.crashPoint - 0.01), // Never exceed crash point
          timeElapsed: actualTimeElapsed,
        };
      }
  
      return prev;
    });
  }, []);

  function generateCrashPoint() {
    const random = Math.random();
    
    // TOUGH probability distribution - favors the house heavily:
    // 35% chance: 1.00x - 1.20x (instant crashes - brutal!)
    // 35% chance: 1.20x - 2.00x (very early crashes)
    // 20% chance: 2.00x - 4.00x (early crashes)
    // 7% chance: 4.00x - 10.00x (medium crashes)
    // 2.5% chance: 10.00x - 30.00x (high crashes)
    // 0.5% chance: 30.00x+ (extremely rare)
    
    if (random < 0.35) {
      // 35% chance of INSTANT crash (1.00x - 1.20x) - very brutal
      return 1.0 + Math.random() * 0.2;
    } else if (random < 0.70) {
      // 35% chance of very early crash (1.20x - 2.00x)
      return 1.2 + Math.random() * 0.8;
    } else if (random < 0.90) {
      // 20% chance of early crash (2.00x - 4.00x)
      return 2.0 + Math.random() * 2.0;
    } else if (random < 0.975) {
      // 7.5% chance of medium crash (4.00x - 8.00x) - reduced range and max
      return 4.0 + Math.random() * 4.0;
    } else if (random < 0.998) {
      // 2.3% chance of high crash (8.00x - 15.00x) - much lower ceiling
      return 8.0 + Math.random() * 7.0;
    } else {
      // 0.2% chance of rare crash (15.00x - 25.00x) - drastically reduced
      return 15.0 + Math.random() * 10.0;
    }
  }

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
