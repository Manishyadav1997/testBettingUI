import { useState, useCallback } from "react"
import { Trophy, Zap, HelpCircle, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useApp } from "@/contexts/AppContext"

interface SpinWheelProps {
  onGameResult: (game: string, result: any, won: boolean, amount: number) => void
}

type BetOption = {
  id: string
  label: string
  icon: string
  multiplier: number
  chance: string
  bgColor: string
  borderColor: string
  textColor: string
}

type GameResult = {
  number: number
  color: string
  won: boolean
  amount: number
}

export default function SpinWheel({ onGameResult }: SpinWheelProps) {
  const { showToast, balance, setBalance } = useApp()
  const [betAmount, setBetAmount] = useState<number>(100)
  const [selectedBet, setSelectedBet] = useState<string>("red")
  const [isSpinning, setIsSpinning] = useState(false)
  const [wheelRotation, setWheelRotation] = useState(0)
  const [ballPosition, setBallPosition] = useState<{ show: boolean }>({ show: false })
  const [showInstructions, setShowInstructions] = useState(false)
  const [lastResult, setLastResult] = useState<GameResult | null>(null)

  // European roulette wheel numbers in order
  const wheelNumbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
    24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
  ]

  const getNumberColor = useCallback((num: number): string => {
    if (num === 0) return "green"
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
    return redNumbers.includes(num) ? "red" : "black"
  }, [])

  const betOptions: BetOption[] = [
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
    setBallPosition({ show: false })

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
    const targetAngle = (targetIndex * segmentAngle) + (segmentAngle / 2)
    const spins = 5 + Math.floor(Math.random() * 3)
    const rotationDegrees = (spins * 360) + (360 - (targetAngle % 360))
    
    setBallPosition({ show: false })
    const currentRotation = wheelRotation % 360
    const normalizedRotation = wheelRotation - currentRotation
    setWheelRotation(normalizedRotation + rotationDegrees)
    
    const spinDuration = 4000
    const ballShowTime = spinDuration - 1000
    
    setTimeout(() => {
      setBallPosition({ show: true })
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
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">💰 Betting Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {betOptions.map((option) => (
                <div key={option.id} className={`p-3 rounded-lg border ${option.bgColor} ${option.borderColor}`}>
                  <div className="font-semibold flex items-center gap-2">
                    <span>{option.icon}</span>
                    <span className={option.textColor}>
                      {option.label} ({option.multiplier}x)
                    </span>
                  </div>
                  <div className="text-sm mt-1">Win: {option.chance} chance</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
      <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 w-full">
        <CardHeader className="text-center pb-2 sm:pb-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="w-full sm:w-auto flex justify-between items-center">
              <CardTitle className="text-white flex items-center justify-center gap-2 text-2xl sm:text-3xl">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
                Premium Roulette
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
              </CardTitle>
              <Button
                onClick={() => setShowInstructions(true)}
                variant="outline"
                size="sm"
                className="sm:hidden border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 h-8 w-8 p-0"
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={() => setShowInstructions(true)}
              variant="outline"
              size="sm"
              className="hidden sm:flex border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              How to Play
            </Button>
          </div>
          <p className="text-gray-400 text-sm sm:text-lg mt-2">
            Experience the thrill of European Roulette
          </p>
        </CardHeader>
        
        <CardContent className="pt-2 sm:pt-4 md:pt-6 space-y-6 px-2">
          {/* Wheel Display */}
          <div className="relative mx-auto w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96">
            {/* Wheel */}
            <div 
              className="w-full h-full rounded-full border-4 border-yellow-500 overflow-hidden relative"
              style={{
                transform: `rotate(${wheelRotation}deg)`,
                transition: isSpinning ? 'transform 4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
              }}
            >
              {/* Wheel segments */}
              {wheelNumbers.map((num, index) => {
                const angle = (360 / wheelNumbers.length) * index
                const color = getNumberColor(num)
                const bgColor = color === 'red' ? 'bg-red-600' : color === 'black' ? 'bg-gray-900' : 'bg-green-600'
                
                return (
                  <div 
                    key={index}
                    className={`absolute w-1/2 h-1/2 origin-bottom-right ${bgColor} flex items-center justify-center`}
                    style={{
                      transform: `rotate(${angle}deg) skewY(-60deg)`,
                      left: '50%',
                      top: '50%',
                      transformOrigin: '0 0',
                    }}
                  >
                    <span 
                      className="text-white text-xs font-bold transform -rotate-90 -translate-y-6"
                      style={{ transform: 'rotate(-60deg) translateY(0.5rem)' }}
                    >
                      {num}
                    </span>
                  </div>
                )
              })}
              
              {/* Center of the wheel */}
              <div className="absolute inset-8 rounded-full bg-gray-800 border-2 border-yellow-500 flex items-center justify-center">
                <div className="w-1/2 h-1/2 bg-yellow-600 rounded-full border border-yellow-300"></div>
              </div>
            </div>
            
            {/* Ball indicator */}
            <div 
              className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 border-yellow-500 shadow-lg transition-opacity duration-300 ${
                ballPosition.show ? 'opacity-100' : 'opacity-0'
              }`}
            ></div>
            
            {/* Arrow pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-yellow-500"></div>
          </div>
          
          {/* Betting Controls */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <div className="text-sm text-gray-400 mb-1">Bet Amount</div>
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                min={10}
                max={balance}
                disabled={isSpinning}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="flex flex-col justify-end">
              <Button
                onClick={spinWheel}
                disabled={isSpinning || betAmount <= 0 || betAmount > balance}
                className={`w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-6 text-lg ${
                  isSpinning ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSpinning ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
                ) : (
                  'SPIN'
                )}
              </Button>
            </div>
          </div>
          
          {/* Bet Options */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {betOptions.map((option) => (
              <Button
                key={option.id}
                onClick={() => setSelectedBet(option.id)}
                disabled={isSpinning}
                className={`h-16 text-lg font-medium transition-all ${
                  selectedBet === option.id 
                    ? `ring-2 ring-offset-2 ring-yellow-500 ${option.bgColor} ${option.borderColor} ${option.textColor}`
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                  <span className="text-xs opacity-70">{option.multiplier}x</span>
                </div>
              </Button>
            ))}
          </div>
          
          {/* Last Result */}
          {lastResult && (
            <div className={`mt-4 p-3 rounded-lg ${
              lastResult.won ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
            }`}>
              <div className="text-center">
                <p className="text-sm text-gray-300">Last result:</p>
                <p className="text-lg font-semibold">
                  Number: <span className={lastResult.color === 'red' ? 'text-red-400' : lastResult.color === 'black' ? 'text-black' : 'text-green-500'}>
                    {lastResult.number} ({lastResult.color})
                  </span>
                </p>
                {lastResult.won ? (
                  <p className="text-green-400 font-bold">You won {lastResult.amount} coins!</p>
                ) : (
                  <p className="text-red-400">Better luck next time!</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {showInstructions && <InstructionsModal />}
    </div>
  )
}
