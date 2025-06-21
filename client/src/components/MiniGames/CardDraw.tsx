import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Shuffle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  value: string;
  symbol: string;
  color: 'red' | 'black';
}

type GameResult = {
  game: string;
  result: string | { card: string; winAmount?: number; betAmount?: number };
  won: boolean;
  amount: number;
};

export function CardDraw({ onGameResult }: { onGameResult: (result: { game: string; result: string; won: boolean; amount: number }) => void }) {
  const { balance, updateBalance } = useApp();
  const [deck, setDeck] = useState<Card[]>([]);
  const [drawnCards, setDrawnCards] = useState<Card[]>([]);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [gameMessage, setGameMessage] = useState<string>('Place your bet and draw a card!');
  const [winAmount, setWinAmount] = useState<number>(0);
  
  // Format the card result for display
  const formatCardResult = (card: Card) => {
    return `${card.value}${card.symbol}`;
  };

  // Initialize a new deck of cards
  const initializeDeck = (): Card[] => {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const symbols = {
      hearts: '♥',
      diamonds: '♦',
      clubs: '♣',
      spades: '♠'
    };

    const newDeck: Card[] = [];
    
    suits.forEach(suit => {
      values.forEach(value => {
        newDeck.push({
          suit,
          value,
          symbol: symbols[suit],
          color: (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black'
        });
      });
    });

    return shuffleDeck([...newDeck]);
  };

  // Shuffle the deck
  const shuffleDeck = (deckToShuffle: Card[]): Card[] => {
    const newDeck = [...deckToShuffle];
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    return newDeck;
  };

  // Handle drawing a card
  const drawCard = () => {
    if (deck.length === 0) {
      setGameMessage('No more cards! Click New Game to start over.');
      return;
    }

    if (betAmount > balance) {
      setGameMessage('Insufficient balance!');
      return;
    }

    setIsDrawing(true);
    updateBalance(-betAmount);

    // Simulate drawing animation
    setTimeout(() => {
      const newDeck = [...deck];
      const drawnCard = newDeck.pop()!;
      
      setDeck(newDeck);
      setDrawnCards(prev => [drawnCard, ...prev].slice(0, 3));
      
      // Determine win/loss (simplified: win on red card)
      const isWin = drawnCard.color === 'red';
      const winMultiplier = 1.8; // Payout multiplier
      const winAmount = isWin ? Math.floor(betAmount * winMultiplier) : 0;
      
      if (isWin) {
        updateBalance(winAmount);
        setGameMessage(`You won ₹${winAmount}!`);
        setWinAmount(winAmount);
        
        // Format the result as a string for consistency with other games
        onGameResult({
          game: 'Card Draw',
          result: `Won ₹${winAmount} on ${formatCardResult(drawnCard)}`,
          won: true,
          amount: winAmount - betAmount
        });
      } else {
        setGameMessage('Better luck next time!');
        setWinAmount(0);
        
        // Format the result as a string for consistency with other games
        onGameResult({
          game: 'Card Draw',
          result: `Lost ₹${betAmount} on ${formatCardResult(drawnCard)}`,
          won: false,
          amount: -betAmount
        });
      }
      
      setIsDrawing(false);
    }, 1000);
  };

  // Start a new game
  const newGame = () => {
    setDeck(initializeDeck());
    setDrawnCards([]);
    setGameMessage('Place your bet and draw a card!');
    setWinAmount(0);
  };

  // Initialize game on mount
  useEffect(() => {
    newGame();
  }, []);

  // Get card color class
  const getCardColor = (color: string) => {
    return color === 'red' ? 'text-red-500' : 'text-black';
  };

  // Get card background class
  const getCardBg = (suit: string) => {
    return suit === 'hearts' ? 'bg-gradient-to-br from-red-50 to-pink-50' :
           suit === 'diamonds' ? 'bg-gradient-to-br from-pink-50 to-red-50' :
           suit === 'clubs' ? 'bg-gradient-to-br from-green-50 to-emerald-50' :
           'bg-gradient-to-br from-blue-50 to-cyan-50';
  };

  return (
    <div className="space-y-6">
      {/* Game Controls */}
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle className="text-center text-white">Card Draw</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Bet Amount (₹)</label>
              <div className="relative">
                <input
                  type="number"
                  min="10"
                  max={balance}
                  value={betAmount}
                  onChange={(e) => setBetAmount(Math.max(10, Math.min(balance, Number(e.target.value) || 10)))}
                  className="w-full bg-secondary-dark border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-accent-green focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400 text-sm">₹</span>
                </div>
              </div>
              <div className="flex justify-between mt-1">
                {[10, 50, 100, 500].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setBetAmount(amount)}
                    className={`text-xs px-2 py-1 rounded ${betAmount === amount ? 'bg-accent-green text-primary-dark' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-3 mt-4 sm:mt-6">
              <Button
                onClick={newGame}
                variant="outline"
                className="bg-secondary-dark border-gray-600 text-white hover:bg-gray-700"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                New Game
              </Button>
              <Button
                onClick={drawCard}
                disabled={isDrawing || deck.length === 0}
                className="gradient-accent text-primary-dark hover:opacity-90 min-w-[120px]"
              >
                {isDrawing ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Drawing...
                  </div>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Draw Card
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Game Message */}
          <div className={`text-center py-3 px-4 rounded-md mb-6 ${
            gameMessage.includes('won') ? 'bg-green-900/30 text-green-400' :
            gameMessage.includes('lost') ? 'bg-red-900/30 text-red-400' :
            'bg-secondary-dark/50 text-gray-300'
          }`}>
            {gameMessage}
            {winAmount > 0 && (
              <div className="text-xl font-bold text-accent-green mt-1">+₹{winAmount}</div>
            )}
          </div>
          
          {/* Deck and Discard Pile */}
          <div className="flex justify-center items-center space-x-6 mb-6">
            {/* Deck */}
            <div className="relative">
              <div className="w-20 h-28 md:w-24 md:h-32 bg-secondary-dark rounded-lg border-2 border-gray-600 flex items-center justify-center">
                <span className="text-gray-600 text-sm">{deck.length}</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-24 md:w-20 md:h-28 bg-gradient-to-br from-primary-dark/90 to-secondary-dark/90 rounded-md border border-gray-500 transform rotate-12"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-24 md:w-20 md:h-28 bg-gradient-to-br from-primary-dark to-secondary-dark rounded-md border border-gray-500 transform -rotate-6"></div>
              </div>
            </div>
            
            {/* Drawn Cards */}
            <div className="relative w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-32">
              <AnimatePresence>
                {drawnCards.length > 0 && (
                  <motion.div
                    key={drawnCards[0].value + drawnCards[0].suit}
                    initial={{ opacity: 0, x: -40, rotate: -8 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    exit={{ opacity: 0, x: 40, rotate: 8 }}
                    className={`relative w-full h-full ${getCardBg(drawnCards[0].suit)} rounded-lg border-2 ${
                      drawnCards[0].color === 'red' ? 'border-red-200' : 'border-gray-200'
                    } shadow-lg p-1`}
                  >
                    {/* Top-left number */}
                    <div className={`absolute top-1 left-1 text-sm sm:text-base font-bold ${getCardColor(drawnCards[0].color)}`}>
                      {drawnCards[0].value}
                    </div>
                    
                    {/* Center symbol */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`text-4xl sm:text-5xl font-bold ${getCardColor(drawnCards[0].color)}`}>
                        {drawnCards[0].symbol}
                      </div>
                    </div>
                    
                    {/* Bottom-right number */}
                    <div className={`absolute bottom-1 right-1 text-sm sm:text-base font-bold ${getCardColor(drawnCards[0].color)}`}>
                      {drawnCards[0].value}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Game Rules */}
          <div className="mt-8 p-4 bg-secondary-dark/50 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">How to Play</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Place your bet amount</li>
              <li>• Click "Draw Card" to draw a card from the deck</li>
              <li>• Win 1.8x your bet on a red card (♥ or ♦)</li>
              <li>• Lose your bet on a black card (♣ or ♠)</li>
              <li>• Click "New Game" to reshuffle the deck</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      {/* Previous Cards */}
      {drawnCards.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Previous Cards</h3>
          <div className="flex flex-wrap gap-3">
            {drawnCards.slice(1, 6).map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`w-14 h-20 md:w-16 md:h-24 ${getCardBg(card.suit)} rounded-md border ${
                  card.color === 'red' ? 'border-red-200' : 'border-gray-200'
                } shadow-md flex flex-col justify-between p-1`}
              >
                <div className={`text-xs font-bold ${getCardColor(card.color)}`}>
                  {card.value}
                  <div className="text-sm">{card.symbol}</div>
                </div>
                <div className={`text-xs font-bold ${getCardColor(card.color)} transform rotate-180`}>
                  {card.value}
                  <div className="text-sm">{card.symbol}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
