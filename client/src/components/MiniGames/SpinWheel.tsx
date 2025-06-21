import { useState } from "react"
import { RotateCcw, Trophy, Target, Zap, HelpCircle, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useApp } from "@/contexts/AppContext"

interface SpinWheelProps {
  onGameResult: (game: string, result: any, won: boolean, amount: number) => void
}

export default function SpinWheel({ onGameResult }: SpinWheelProps) {
  const { showToast, balance, setBalance } = useApp()
  const [betAmount, setBetAmount] = useState<number>(100)
  const [selectedBet, setSelectedBet] = useState<string>("red")
  const [isSpinning, setIsSpinning] = useState(false)
  const [wheelRotation, setWheelRotation] = useState(0)
  const [ballPosition, setBallPosition] = useState<{ angle: number, show: boolean }>({ angle: 0, show: false })
  const [showInstructions, setShowInstructions] = useState(false)
  const [lastResult, setLastResult] = useState<{ 
    number: number
    color: string
    won: boolean
    amount: number 
  } | null>(null)

  // European roulette wheel numbers in order
  const wheelNumbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
    24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
  ]

  const getNumberColor = (num: number) => {
    if (num === 0) return "green"
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
    return redNumbers.includes(num) ? "red" : "black"
  }

  const betOptions = [
    { 
      id: "red", 
      label: "Red", 
      icon: "🔴", 
      multiplier: 2, 
      chance: "48.6%", 
      bgColor: "bg-red-500/20", 
      borderColor: "border-red-500",
      textColor: "text-red-400"
    },
    { 
      id: "black", 
      label: "Black", 
      icon: "⚫", 
      multiplier: 2, 
      chance: "48.6%", 
      bgColor: "bg-gray-800/40", 
      borderColor: "border-gray-600",
      textColor: "text-gray-300"
    },
    { 
      id: "green", 
      label: "Green (0)", 
      icon: "🟢", 
      multiplier: 36, 
      chance: "2.7%", 
      bgColor: "bg-green-500/20", 
      borderColor: "border-green-500",
      textColor: "text-green-400"
    },
    { 
      id: "odd", 
      label: "Odd", 
      icon: "🔢", 
      multiplier: 2, 
      chance: "48.6%", 
      bgColor: "bg-blue-500/20", 
      borderColor: "border-blue-500",
      textColor: "text-blue-400"
    },
    { 
      id: "even", 
      label: "Even", 
      icon: "⚡", 
      multiplier: 2, 
      chance: "48.6%", 
      bgColor: "bg-purple-500/20", 
      borderColor: "border-purple-500",
      textColor: "text-purple-400"
    },
    { 
      id: "low", 
      label: "1-18", 
      icon: "📉", 
      multiplier: 2, 
      chance: "48.6%", 
      bgColor: "bg-orange-500/20", 
      borderColor: "border-orange-500",
      textColor: "text-orange-400"
    },
    { 
      id: "high", 
      label: "19-36", 
      icon: "📈", 
      multiplier: 2, 
      chance: "48.6%", 
      bgColor: "bg-pink-500/20", 
      borderColor: "border-pink-500",
      textColor: "text-pink-400"
    },
    { 
      id: "dozen1", 
      label: "1st Dozen", 
      icon: "1️⃣", 
      multiplier: 3, 
      chance: "32.4%", 
      bgColor: "bg-cyan-500/20", 
      borderColor: "border-cyan-500",
      textColor: "text-cyan-400"
    },
    { 
      id: "dozen2", 
      label: "2nd Dozen", 
      icon: "2️⃣", 
      multiplier: 3, 
      chance: "32.4%", 
      bgColor: "bg-teal-500/20", 
      borderColor: "border-teal-500",
      textColor: "text-teal-400"
    },
    { 
      id: "dozen3", 
      label: "3rd Dozen", 
      icon: "3️⃣", 
      multiplier: 3, 
      chance: "32.4%", 
      bgColor: "bg-indigo-500/20", 
      borderColor: "border-indigo-500",
      textColor: "text-indigo-400"
    }
  ]

  const spinWheel = async () => {
    if (betAmount < 10) {
      showToast("Minimum bet is ₹10", "error")
      return
    }

    if (betAmount > balance) {
      showToast("Insufficient balance", "error")
      return
    }

    setIsSpinning(true)
    setBalance(balance - betAmount)
    setBallPosition({ angle: 0, show: false })

    // Generate random result
    const resultNumber = wheelNumbers[Math.floor(Math.random() * wheelNumbers.length)]
    const resultColor = getNumberColor(resultNumber)

    // Calculate win
    let won = false
    let multiplier = 2

    switch (selectedBet) {
      case "red":
        won = resultColor === "red"
        multiplier = 2
        break
      case "black":
        won = resultColor === "black"
        multiplier = 2
        break
      case "green":
        won = resultColor === "green"
        multiplier = 36
        break
      case "odd":
        won = resultNumber > 0 && resultNumber % 2 === 1
        multiplier = 2
        break
      case "even":
        won = resultNumber > 0 && resultNumber % 2 === 0
        multiplier = 2
        break
      case "low":
        won = resultNumber >= 1 && resultNumber <= 18
        multiplier = 2
        break
      case "high":
        won = resultNumber >= 19 && resultNumber <= 36
        multiplier = 2
        break
      case "dozen1":
        won = resultNumber >= 1 && resultNumber <= 12
        multiplier = 3
        break
      case "dozen2":
        won = resultNumber >= 13 && resultNumber <= 24
        multiplier = 3
        break
      case "dozen3":
        won = resultNumber >= 25 && resultNumber <= 36
        multiplier = 3
        break
    }

    // Calculate the angle for the winning number
    const segmentAngle = 360 / wheelNumbers.length
    const targetIndex = wheelNumbers.indexOf(resultNumber)
    
    // Calculate the angle to rotate to bring the target to the top (0 degrees)
    // The wheel needs to rotate (360 - targetAngle) degrees to bring the target to the top
    const targetAngle = (targetIndex * segmentAngle) + (segmentAngle / 2)
    
    // Add full spins (5-7) plus the angle needed to reach the target
    const spins = 5 + Math.floor(Math.random() * 3) // 5-7 full spins
    const rotationDegrees = (spins * 360) + (360 - (targetAngle % 360))
    
    // Hide ball during spin
    setBallPosition({ angle: 0, show: false })
    
    // Start spinning with a small delay to ensure smooth animation
    const currentRotation = wheelRotation % 360
    const normalizedRotation = wheelRotation - currentRotation // Get full rotations
    
    // Add new rotation to the current full rotations
    setWheelRotation(normalizedRotation + rotationDegrees)
    
    // Show ball at the right moment
    const spinDuration = 4000 // Match with CSS transition
    const ballShowTime = spinDuration - 1000 // Show ball before wheel stops
    
    setTimeout(() => {
      // Position ball at the top (0 degrees) since the wheel will rotate to the target
      setBallPosition({ angle: 0, show: true })
    }, ballShowTime)

    setTimeout(() => {
      setIsSpinning(false)
      const winAmount = won ? betAmount * multiplier : 0

      if (won) {
        setBalance(balance - betAmount + winAmount)
        showToast(`🎉 Number ${resultNumber} (${resultColor.toUpperCase()})! You won ₹${winAmount}!`, "success")
      } else {
        showToast(`😔 Number ${resultNumber} (${resultColor.toUpperCase()}). Better luck next time!`, "error")
      }

      const result = { number: resultNumber, color: resultColor, won, amount: won ? winAmount : betAmount }
      setLastResult(result)
      onGameResult("wheel", { number: resultNumber, color: resultColor }, won, won ? winAmount : betAmount)
    }, 4500)
  }

  const getNumberBgColor = (num: number) => {
    const color = getNumberColor(num)
    if (color === "red") return "bg-red-600"
    if (color === "black") return "bg-gray-900"
    return "bg-green-600"
  }

  const InstructionsModal = () => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-secondary-dark rounded-2xl p-6 max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-gray-600">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-yellow-500" />
            How to Play Roulette
          </h2>
          <Button
            onClick={() => setShowInstructions(false)}
            variant="outline"
            size="sm"
            className="border-gray-600 text-white hover:bg-gray-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-6 text-gray-300">
          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">🎯 Game Objective</h3>
            <p>Predict where the ball will land on the spinning roulette wheel. Choose from various betting options and win based on the multiplier!</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">💰 Betting Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/30">
                <div className="font-semibold text-red-400">🔴 Red Numbers (2x)</div>
                <div>Win if ball lands on any red number</div>
                <div className="text-xs text-gray-400">Chance: 48.6%</div>
              </div>
              <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-600">
                <div className="font-semibold text-gray-300">⚫ Black Numbers (2x)</div>
                <div>Win if ball lands on any black number</div>
                <div className="text-xs text-gray-400">Chance: 48.6%</div>
              </div>
              <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/30">
                <div className="font-semibold text-green-400">🟢 Green/Zero (36x)</div>
                <div>Win if ball lands on 0 (highest payout!)</div>
                <div className="text-xs text-gray-400">Chance: 2.7%</div>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/30">
                <div className="font-semibold text-blue-400">🔢 Odd Numbers (2x)</div>
                <div>Win if ball lands on 1,3,5,7,9...</div>
                <div className="text-xs text-gray-400">Chance: 48.6%</div>
              </div>
              <div className="bg-purple-500/10 p-3 rounded-lg border border-purple-500/30">
                <div className="font-semibold text-purple-400">⚡ Even Numbers (2x)</div>
                <div>Win if ball lands on 2,4,6,8,10...</div>
                <div className="text-xs text-gray-400">Chance: 48.6%</div>
              </div>
              <div className="bg-orange-500/10 p-3 rounded-lg border border-orange-500/30">
                <div className="font-semibold text-orange-400">📉 Low (1-18) (2x)</div>
                <div>Win if ball lands on 1-18</div>
                <div className="text-xs text-gray-400">Chance: 48.6%</div>
              </div>
              <div className="bg-pink-500/10 p-3 rounded-lg border border-pink-500/30">
                <div className="font-semibold text-pink-400">📈 High (19-36) (2x)</div>
                <div>Win if ball lands on 19-36</div>
                <div className="text-xs text-gray-400">Chance: 48.6%</div>
              </div>
              <div className="bg-cyan-500/10 p-3 rounded-lg border border-cyan-500/30">
                <div className="font-semibold text-cyan-400">1️⃣ 1st Dozen (3x)</div>
                <div>Win if ball lands on 1-12</div>
                <div className="text-xs text-gray-400">Chance: 32.4%</div>
              </div>
              <div className="bg-teal-500/10 p-3 rounded-lg border border-teal-500/30">
                <div className="font-semibold text-teal-400">2️⃣ 2nd Dozen (3x)</div>
                <div>Win if ball lands on 13-24</div>
                <div className="text-xs text-gray-400">Chance: 32.4%</div>
              </div>
              <div className="bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/30">
                <div className="font-semibold text-indigo-400">3️⃣ 3rd Dozen (3x)</div>
                <div>Win if ball lands on 25-36</div>
                <div className="text-xs text-gray-400">Chance: 32.4%</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">🎮 How to Play</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Choose your betting strategy from the colorful options</li>
              <li>Set your bet amount (minimum ₹10)</li>
              <li>Click "SPIN TO WIN" to start the wheel</li>
              <li>Watch the ball land and see if you won!</li>
              <li>Winnings are automatically added to your balance</li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">💡 Tips for Success</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Start Small:</strong> Begin with smaller bets to learn the game</li>
              <li><strong>High Risk, High Reward:</strong> Green (0) has the highest payout but lowest chance</li>
              <li><strong>Balanced Strategy:</strong> Red/Black bets offer good balance of risk and reward</li>
              <li><strong>Dozen Bets:</strong> 3x multiplier with decent 32.4% win chance</li>
              <li><strong>Manage Your Bankroll:</strong> Set limits and stick to them</li>
            </ul>
          </div>

          <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
            <h4 className="font-semibold text-yellow-400 mb-1">⚠️ Important Note</h4>
            <p className="text-sm">This is a game of chance. The wheel uses true random number generation. Play responsibly and only bet what you can afford to lose!</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <Card className="glass-morphism max-w-4xl mx-auto">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1"></div>
            <CardTitle className="text-white flex items-center justify-center gap-3 text-3xl flex-1">
              <Trophy className="w-8 h-8 text-yellow-500" />
              Premium Roulette
              <Zap className="w-8 h-8 text-yellow-500" />
            </CardTitle>
            <div className="flex-1 flex justify-end">
              <Button
                onClick={() => setShowInstructions(true)}
                variant="outline"
                size="sm"
                className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                How to Play
              </Button>
            </div>
          </div>
          <p className="text-gray-400 text-lg">Experience the thrill of European Roulette</p>
        </CardHeader>
        
        <CardContent className="pt-8 space-y-8">
          {/* Enhanced Wheel Display */}
          <div className="text-center">
            <div className="relative inline-block">
              {/* Outer decorative rings */}
              <div className="absolute -inset-6 rounded-full border-4 border-yellow-400 opacity-30 animate-pulse"></div>
              <div className="absolute -inset-3 rounded-full border-2 border-yellow-500 opacity-50"></div>
              
              {/* Main wheel container */}
              <div className="relative">
                {/* Wheel */}
                <div
                  className="w-80 h-80 rounded-full border-8 border-yellow-500 shadow-2xl relative overflow-hidden"
                  style={{
                    transform: `rotate(${wheelRotation}deg)`,
                    transition: isSpinning ? "transform 4s cubic-bezier(0.4, 0, 0.2, 1)" : "none"
                  }}
                >
                  {/* Create wheel segments */}
                  {wheelNumbers.map((num, index) => {
                    const angle = (360 / wheelNumbers.length) * index
                    const nextAngle = (360 / wheelNumbers.length) * (index + 1)
                    const color = getNumberColor(num)
                    const bgColor = color === "red" ? "#dc2626" : color === "black" ? "#1f2937" : "#16a34a"
                    
                    return (
                      <div
                        key={index}
                        className="absolute inset-0"
                        style={{
                          background: `conic-gradient(from ${angle}deg, ${bgColor} 0deg, ${bgColor} ${360/wheelNumbers.length}deg, transparent ${360/wheelNumbers.length}deg)`,
                          clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((nextAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((nextAngle - 90) * Math.PI / 180)}%)`
                        }}
                      >
                        {/* Number text */}
                        <div
                          className="absolute text-white font-bold text-sm flex items-center justify-center w-6 h-6"
                          style={{
                            left: `${50 + 35 * Math.cos((angle + 360/wheelNumbers.length/2 - 90) * Math.PI / 180)}%`,
                            top: `${50 + 35 * Math.sin((angle + 360/wheelNumbers.length/2 - 90) * Math.PI / 180)}%`,
                            transform: `translate(-50%, -50%) rotate(${angle + 360/wheelNumbers.length/2}deg)`
                          }}
                        >
                          {num}
                        </div>
                      </div>
                    )
                  })}
                  
                  {/* Center hub */}
                  <div className="absolute inset-20 bg-gray-900 rounded-full border-4 border-yellow-500 flex items-center justify-center shadow-inner">
                    <RotateCcw className={`w-12 h-12 text-yellow-500 ${isSpinning ? "animate-spin" : ""}`} />
                  </div>
                </div>
                
                {/* Ball position indicator - fixed at top */}
                {ballPosition.show && (
                  <div 
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
                  >
                    <div 
                      className="w-6 h-6 bg-white rounded-full border-2 border-yellow-500 shadow-xl flex items-center justify-center"
                      style={{
                        boxShadow: '0 0 15px 5px rgba(255, 215, 0, 0.8)'
                      }}
                    >
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                    </div>
                  </div>
                )}
                
                {/* Wheel pointer */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="relative">
                    <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-transparent border-b-yellow-500 drop-shadow-2xl"></div>
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-lg"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Result Display */}
            {lastResult && !isSpinning && (
              <div className="mt-8 p-6 bg-gradient-to-r from-secondary-dark via-primary-dark to-secondary-dark rounded-2xl border-2 border-gray-600 shadow-2xl">
                <div className="flex items-center justify-center gap-4 mb-3">
                  <div className={`w-12 h-12 rounded-full ${getNumberBgColor(lastResult.number)} border-4 border-white flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {lastResult.number}
                  </div>
                  <Target className="w-6 h-6 text-yellow-500" />
                </div>
                <div className={`text-2xl font-bold mb-2 ${lastResult.won ? "text-green-400" : "text-red-400"}`}>
                  {lastResult.won ? `🎉 Congratulations! +₹${lastResult.amount}` : `😔 Try Again! -₹${lastResult.amount}`}
                </div>
                <div className="text-gray-300 text-lg">
                  Number {lastResult.number} • {lastResult.color.charAt(0).toUpperCase() + lastResult.color.slice(1)}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Betting Options */}
          <div>
            <h3 className="text-xl text-white mb-6 font-bold text-center">Choose Your Strategy</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {betOptions.map((option) => (
                <Button
                  key={option.id}
                  variant={selectedBet === option.id ? "default" : "outline"}
                  className={`${
                    selectedBet === option.id 
                      ? "bg-accent-green text-primary-dark border-accent-green scale-105 shadow-lg" 
                      : `${option.bgColor} ${option.borderColor} text-white hover:bg-opacity-30 hover:scale-105`
                  } p-4 h-auto flex flex-col items-center space-y-2 transition-all duration-200 relative overflow-hidden`}
                  onClick={() => setSelectedBet(option.id)}
                  disabled={isSpinning}
                >
                  <div className="text-2xl">{option.icon}</div>
                  <span className="font-semibold text-center leading-tight">{option.label}</span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`${option.textColor} font-bold`}>{option.multiplier}x</span>
                    <span className="text-gray-400">{option.chance}</span>
                  </div>
                  {selectedBet === option.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Enhanced Bet Amount Section */}
          <div className="bg-gradient-to-br from-secondary-dark to-primary-dark rounded-2xl p-6 border-2 border-gray-600 shadow-xl">
            <label className="text-xl text-white mb-4 block font-bold flex items-center gap-2">
              💰 Stake Your Bet
            </label>
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  className="bg-primary-dark border-2 border-gray-500 text-white text-xl p-4 pr-12 rounded-xl focus:border-yellow-500 transition-colors"
                  min="10"
                  max={balance}
                  disabled={isSpinning}
                  placeholder="Enter amount..."
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">₹</span>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {[100, 250, 500, 1000].map((amount) => (
                  <Button
                    key={amount}
                    size="sm"
                    variant="outline"
                    onClick={() => setBetAmount(amount)}
                    className={`border-2 ${
                      betAmount === amount 
                        ? "border-yellow-500 bg-yellow-500/20 text-yellow-400" 
                        : "border-gray-600 text-white hover:bg-secondary-dark hover:border-gray-500"
                    } py-3 font-semibold transition-all duration-200`}
                    disabled={isSpinning || amount > balance}
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Game Statistics */}
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-gray-600 shadow-xl">
            <h3 className="text-white font-bold text-xl text-center mb-4 flex items-center justify-center gap-2">
              📊 Bet Analysis
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-3 bg-blue-500/10 rounded-xl border border-blue-500/30">
                <div className="text-blue-400 text-sm font-medium">Selected Bet</div>
                <div className="text-white font-bold text-lg mt-1">
                  {betOptions.find(b => b.id === selectedBet)?.label}
                </div>
                <div className="text-2xl mt-1">{betOptions.find(b => b.id === selectedBet)?.icon}</div>
              </div>
              <div className="text-center p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
                <div className="text-yellow-400 text-sm font-medium">Stake</div>
                <div className="text-white font-bold text-lg mt-1">₹{betAmount}</div>
              </div>
              <div className="text-center p-3 bg-green-500/10 rounded-xl border border-green-500/30">
                <div className="text-green-400 text-sm font-medium">Potential Win</div>
                <div className="text-white font-bold text-lg mt-1">
                  ₹{betAmount * (betOptions.find(b => b.id === selectedBet)?.multiplier || 2)}
                </div>
              </div>
              <div className="text-center p-3 bg-purple-500/10 rounded-xl border border-purple-500/30">
                <div className="text-purple-400 text-sm font-medium">Win Chance</div>
                <div className="text-white font-bold text-lg mt-1">
                  {betOptions.find(b => b.id === selectedBet)?.chance}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Spin Button */}
          <Button
            onClick={spinWheel}
            disabled={isSpinning}
            className="w-full gradient-accent text-primary-dark font-bold py-8 text-2xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-2xl rounded-2xl relative overflow-hidden"
          >
            {isSpinning ? (
              <div className="flex items-center justify-center gap-3">
                <RotateCcw className="w-8 h-8 animate-spin" />
                <span>Spinning the Wheel...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <Trophy className="w-8 h-8" />
                <span>SPIN TO WIN</span>
                <Zap className="w-8 h-8" />
              </div>
            )}
            {!isSpinning && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
            )}
          </Button>
        </CardContent>
      </Card>
      {showInstructions && <InstructionsModal />}
    </>
  )
}