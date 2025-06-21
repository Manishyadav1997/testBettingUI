

import { useState } from "react"
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Crown, Trophy, Target, Zap, RefreshCw, TrendingUp } from "lucide-react"
import { useApp } from "@/contexts/AppContext"

interface DiceGameProps {
  onGameResult: (game: string, result: any, won: boolean, amount: number) => void
}

export default function DiceGame({ onGameResult }: DiceGameProps) {
  // Mock useApp context for demonstration
  const { showToast, balance, setBalance } = useApp()
  const [betAmount, setBetAmount] = useState(100)
  const [selectedNumber, setSelectedNumber] = useState(6)
  const [diceValue, setDiceValue] = useState(1)
  const [isRolling, setIsRolling] = useState(false)
  const [lastResult, setLastResult] = useState<{ value: number, won: boolean, amount: number } | null>(null)
  const [gameMode, setGameMode] = useState("single")
  const [streak, setStreak] = useState(0)
  const [totalGames, setTotalGames] = useState(0)
  const [totalWins, setTotalWins] = useState(0)
  const [gameHistory, setGameHistory] = useState<any[]>([])
  const [autoPlay, setAutoPlay] = useState(false)
  const [autoPlayCount, setAutoPlayCount] = useState(5)
  const [currentAutoPlay, setCurrentAutoPlay] = useState(0)

  const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6]
  const DiceIcon = diceIcons[diceValue - 1]

  const gameModes = [
    { id: "single", name: "Single Number", multiplier: 6, icon: Target },
    { id: "high", name: "High (4-6)", multiplier: 2, icon: TrendingUp },
    { id: "low", name: "Low (1-3)", multiplier: 2, icon: Crown },
    { id: "even", name: "Even", multiplier: 2, icon: Trophy },
    { id: "odd", name: "Odd", multiplier: 2, icon: Zap }
  ]

  const checkWin = (value: number, mode: string, selected: number) => {
    switch (mode) {
      case "single":
        return value === selected
      case "high":
        return value >= 4
      case "low":
        return value <= 3
      case "even":
        return value % 2 === 0
      case "odd":
        return value % 2 === 1
      default:
        return false
    }
  }

  const rollDice = (e?: React.MouseEvent | boolean) => {
    // Handle both click events and programmatic calls
    const isAutoPlayRoll = typeof e === 'boolean' ? e : false;
    
    // Skip if already rolling or in auto-play mode but not an auto-play roll
    if (isRolling || (autoPlay && !isAutoPlayRoll)) return;
    
    if (betAmount < 10) {
      showToast("Minimum bet is ₹10", "error");
      if (autoPlay) stopAutoPlay();
      return;
    }

    if (betAmount > balance) {
      showToast("Insufficient balance", "error");
      if (autoPlay) stopAutoPlay();
      return;
    }

    setIsRolling(true);
    // Store current balance for this roll to avoid closure issues
    const currentBalance = balance;
    
    // Deduct bet amount
    setBalance(currentBalance - betAmount);

    // Animate dice roll
    const rollAnimation = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
    }, 100);

    // Stop animation after 1 second
    setTimeout(() => {
      clearInterval(rollAnimation);
      const finalValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(finalValue);
      
      const currentMode = gameModes.find(m => m.id === gameMode);
      const won = checkWin(finalValue, gameMode, selectedNumber);
      const winAmount = won ? Math.floor(betAmount * currentMode!.multiplier) : 0;

      // Calculate new balance
      const newBalance = currentBalance - betAmount + (won ? winAmount + betAmount : 0);
      
      // Update balance with winnings if any
      if (won) {
        setBalance(newBalance);
        setStreak(prev => prev + 1);
        setTotalWins(prev => prev + 1);
        showToast(`You won ₹${winAmount}!`, "success");
      } else {
        setBalance(newBalance);
        setStreak(0);
        showToast(`Dice rolled ${finalValue}. Better luck next time!`, "error");
      }

      setTotalGames(prev => prev + 1);
      const result = { value: finalValue, won, amount: won ? winAmount : betAmount, mode: gameMode };
      setLastResult(result);
      setGameHistory(prev => [result, ...prev.slice(0, 9)]);
      
      // Call parent callback
      onGameResult("dice", { value: finalValue, mode: gameMode }, won, won ? winAmount : betAmount);
      
      // Handle auto-play continuation after a short delay
      const continueAutoPlay = () => {
        if (!autoPlay) {
          setIsRolling(false);
          return;
        }
        
        setCurrentAutoPlay(prev => {
          const nextRoll = prev + 1;
          if (nextRoll < autoPlayCount) {
            // Schedule next roll with a small delay
            setTimeout(() => rollDice(true), 500);
            return nextRoll;
          } else {
            stopAutoPlay();
            return prev;
          }
        });
        
        setIsRolling(false);
      };
      
      // Small delay before next roll or finishing
      setTimeout(continueAutoPlay, 500);
    }, 1000); // Animation duration
  }

  const startAutoPlay = () => {
    if (isRolling || autoPlay) return;
    
    if (autoPlayCount < 1) {
      showToast("Please set at least 1 round for auto-play", "error");
      return;
    }
    
    if (betAmount > balance) {
      showToast("Insufficient balance for auto-play", "error");
      return;
    }
    
    // Reset auto-play state
    setAutoPlay(true);
    setCurrentAutoPlay(0);
    
    // Start the first roll after a small delay to ensure state updates
    setTimeout(() => {
      rollDice(true);
    }, 100);
  }

  const stopAutoPlay = () => {
    if (!autoPlay) return
    setAutoPlay(false)
    setCurrentAutoPlay(0)
    showToast("Auto-play stopped", "info")
  }

  const winRate = totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(1) : 0

  return (
    <div className="min-h-screen bg-gray-900 p-4" style={{
  '--glass-bg': 'rgba(17, 24, 39, 0.8)',
  '--glass-border': 'rgba(75, 85, 99, 0.3)',
  '--accent-gradient': 'linear-gradient(135deg, #10b981, #059669)',
  '--accent-green': '#10b981',
  '--gold': '#f59e0b',
  '--danger-red': '#ef4444',
  '--primary-dark': '#111827',
  '--secondary-dark': '#1f2937',
  '--border-gray': '#4b5563'
} as React.CSSProperties}>

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Game Panel */}
          <div className="lg:col-span-3">
            <div className="glass-morphism rounded-2xl p-6">
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-2">Dice Roll Game</h3>
                <p className="text-gray-400">Predict the dice number and win big!</p>
              </div>

              {/* Game Mode Selection */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">Game Mode</span>
                  <span className="text-xs text-gray-500">Multiplier</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {gameModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setGameMode(mode.id)}
                      disabled={isRolling || autoPlay}
                      className={`relative p-1.5 rounded-lg border transition-all duration-200 flex flex-col items-center justify-center ${
                        gameMode === mode.id
                          ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/20"
                          : "bg-secondary-dark/80 text-gray-300 border-gray-700 hover:bg-gray-700/50"
                      }`}
                      title={mode.name}
                    >
                      <mode.icon className="w-3.5 h-3.5 mb-0.5" />
                      <span className="text-[10px] font-medium">{mode.name.split(' ')[0]}</span>
                      <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-[10px] text-white font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {mode.multiplier}x
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dice Display */}
              <div className="text-center mb-6">
                <div className={`inline-block p-8 bg-secondary-dark rounded-2xl ${isRolling ? "animate-bounce" : ""}`}>
                  <DiceIcon className="w-24 h-24 text-accent-green" />
                </div>
                
                {lastResult && !isRolling && (
                  <div className="mt-4">
                    <div className={`text-lg font-semibold ${lastResult.won ? "text-accent-green" : "text-danger-red"}`}>
                      {lastResult.won ? `You Won ₹${lastResult.amount}!` : `You Lost ₹${lastResult.amount}`}
                    </div>
                    <div className="text-gray-400 text-sm">Dice rolled: {lastResult.value}</div>
                    {lastResult.won && streak > 1 && (
                      <div className="text-gold text-sm mt-1">🔥 {streak} Win Streak!</div>
                    )}
                  </div>
                )}
              </div>

              {/* Number Selection (only for single mode) */}
              {gameMode === "single" && (
                <div className="mb-6">
                  <label className="text-sm text-gray-400 mb-3 block">Select your number (1-6):</label>
                  <div className="grid grid-cols-6 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((num) => {
                      const IconComponent = diceIcons[num - 1]
                      return (
                        <button
                          key={num}
                          onClick={() => setSelectedNumber(num)}
                          disabled={isRolling || autoPlay}
                          className={`aspect-square p-2 ${
                            selectedNumber === num 
                              ? "gradient-accent text-primary-dark" 
                              : "border-gray-600 text-white hover:bg-secondary-dark"
                          } border rounded-xl`}
                        >
                          <IconComponent className="w-6 h-6 mx-auto" />
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
              {/* Roll Button */}
              <button
                onClick={rollDice}
                disabled={isRolling || autoPlay}
                className="w-full gradient-accent text-primary-dark font-semibold py-3 rounded-xl hover:opacity-90 disabled:opacity-50"
              >
                {isRolling ? "Rolling..." : autoPlay ? "Auto Playing..." : "Roll Dice"}
              </button>
              {/* Bet Amount */}
              <div className="mb-6">
                <label className="text-sm text-gray-400 mb-2 block">Bet Amount:</label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  className="w-full p-3 bg-secondary-dark border border-gray-600 rounded-xl text-white mb-3"
                  min="10"
                  max={balance}
                  disabled={isRolling || autoPlay}
                />
                
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[50, 100, 250, 500].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setBetAmount(amount)}
                      disabled={isRolling || autoPlay}
                      className="p-2 bg-secondary-dark text-white rounded-lg border border-gray-600 hover:bg-gray-700"
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setBetAmount(Math.floor(balance * 0.25))}
                    disabled={isRolling || autoPlay}
                    className="p-2 bg-secondary-dark text-gold rounded-lg border border-gray-600 hover:bg-gray-700"
                  >
                    25%
                  </button>
                  <button
                    onClick={() => setBetAmount(Math.floor(balance * 0.5))}
                    disabled={isRolling || autoPlay}
                    className="p-2 bg-secondary-dark text-gold rounded-lg border border-gray-600 hover:bg-gray-700"
                  >
                    50%
                  </button>
                  <button
                    onClick={() => setBetAmount(balance)}
                    disabled={isRolling || autoPlay}
                    className="p-2 bg-secondary-dark text-danger-red rounded-lg border border-gray-600 hover:bg-gray-700"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Auto Play Controls */}
              <div className="mb-6 bg-secondary-dark rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Auto Play</h4>
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="number"
                    value={autoPlayCount}
                    onChange={(e) => setAutoPlayCount(Number(e.target.value))}
                    className="w-20 p-2 bg-primary-dark border border-gray-600 rounded-lg text-white text-center"
                    min="1"
                    max="100"
                    disabled={autoPlay}
                  />
                  <span className="text-gray-400">rounds</span>
                  {autoPlay && (
                    <span className="text-gold">
                      ({currentAutoPlay + 1}/{autoPlayCount})
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={startAutoPlay}
                    disabled={isRolling || autoPlay}
                    className="p-2 gradient-accent text-primary-dark rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
                  >
                    Start Auto
                  </button>
                  <button
                    onClick={stopAutoPlay}
                    disabled={!autoPlay}
                    className="p-2 bg-danger-red text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
                  >
                    Stop Auto
                  </button>
                </div>
              </div>

              {/* Game Info */}
              <div className="bg-secondary-dark rounded-lg p-4 space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Game Mode:</span>
                  <span className="text-white font-semibold">
                    {gameModes.find(m => m.id === gameMode)?.name}
                  </span>
                </div>
                {gameMode === "single" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Selected Number:</span>
                    <span className="text-white font-semibold">{selectedNumber}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Bet Amount:</span>
                  <span className="text-white font-semibold">₹{betAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Potential Win:</span>
                  <span className="text-accent-green font-semibold">
                    ₹{betAmount * (gameModes.find(m => m.id === gameMode)?.multiplier || 1)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Win Odds:</span>
                  <span className="text-gold font-semibold">
                    {gameModes.find(m => m.id === gameMode)?.multiplier}:1
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}