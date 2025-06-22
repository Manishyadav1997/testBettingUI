import { useState, useEffect, useCallback, useRef } from "react";
import { LiveMatch, AviatorGameState, ColorGameState } from "@/types";
import { mockMatches } from "@/utils/mockData";

export function useRealTimeUpdates() {
  const [matches, setMatches] = useState<LiveMatch[]>(mockMatches);
  const [aviatorState, setAviatorState] = useState<AviatorGameState>({
    isActive: false,
    multiplier: 1.0,
    timeElapsed: 0,
    crashed: false,
    nextRoundIn: 90, // Initial countdown set to 90 seconds
    crashPoint: 2.0, // Default value
    startTime: Date.now(),
    speed: 1.0,
    activePlayers: [],
  });
  const [colorGameState, setColorGameState] = useState<ColorGameState>({
    countdown: 60, // Start with a full 60-second countdown
    isActive: true,
    currentRound: 1235,
    history: [],
    isDrawing: false,
    currentResult: null,
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
    setAviatorState((prev: AviatorGameState) => {
      // Handle countdown between rounds
      if (!prev.isActive && prev.nextRoundIn > 0) {
        return { ...prev, nextRoundIn: prev.nextRoundIn - 1 };
      }
  
      // Start new round
      if (!prev.isActive && prev.nextRoundIn <= 0) {
        const crashPoint = generateCrashPoint();
        const startTime = Date.now();
        const speed = Math.random() * 0.3 + 0.7; // Variable speed between 0.7-1.0
        
        return {
          ...prev,
          isActive: true,
          multiplier: 1.0,
          timeElapsed: 0,
          crashed: false,
          nextRoundIn: 0,
          crashPoint,
          startTime,
          speed,
          finalMultiplier: undefined,
        };
      }
  
      // Game is running
      if (prev.isActive && !prev.crashed && prev.startTime !== undefined && prev.speed !== undefined && prev.crashPoint !== undefined) {
        const currentTime = Date.now();
        const actualTimeElapsed = (currentTime - prev.startTime) / 1000;
        
        const baseGrowth = 0.1 * prev.speed;
        const accelerationFactor = Math.pow(actualTimeElapsed / 5, 1.2);
        const newMultiplier = 1.0 + (actualTimeElapsed * baseGrowth * (1 + accelerationFactor));
        
        if (newMultiplier >= prev.crashPoint) {
          return {
            ...prev,
            multiplier: prev.crashPoint,
            crashed: true,
            isActive: false,
            nextRoundIn: 90, // Set consistent 90-second countdown for next round
            finalMultiplier: prev.crashPoint,
            timeElapsed: actualTimeElapsed,
          };
        }
  
        return {
          ...prev,
          multiplier: Math.min(newMultiplier, prev.crashPoint - 0.01),
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

  // Track the last update time for the drawing phase
  const lastUpdateTime = useRef<number>(Date.now());

  // Update color game countdown
  const updateColorGame = useCallback(() => {
    setColorGameState(prev => {
      const now = Date.now();
      
      // If we're in drawing state, start a new round after 4 seconds
      if (prev.isDrawing) {
        if (now - lastUpdateTime.current >= 4000) {
          lastUpdateTime.current = now;
          return {
            ...prev,
            countdown: 60,
            isDrawing: false,
            currentResult: null,
            currentRound: prev.currentRound + 1,
            history: [
              { result: prev.currentResult || 'red', timestamp: now, round: prev.currentRound },
              ...prev.history.slice(0, 9), // Keep last 10 results
            ],
          };
        }
        return prev;
      }
      
      // If countdown reaches 0, switch to drawing state
      if (prev.countdown <= 0 && !prev.isDrawing) {
        const results = ["red", "green", "violet"] as const;
        const result = results[Math.floor(Math.random() * 3)];
        lastUpdateTime.current = now;
        
        return {
          ...prev,
          countdown: 0,
          isDrawing: true,
          currentResult: result,
        };
      }
      
      // Normal countdown
      return { ...prev, countdown: prev.countdown - 1 };
    });
  }, []);

  useEffect(() => {
    const cricketInterval = setInterval(updateCricketOdds, 3000);
    const aviatorInterval = setInterval(updateAviator, 100);
    const colorGameInterval = setInterval(updateColorGame, 1000);
    
    // Initial call to ensure smooth start
    updateColorGame();

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
