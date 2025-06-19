import React, { createContext, useContext, useState, useEffect } from "react";

export interface BetSlipItem {
  id: string;
  gameType: "cricket" | "aviator" | "color" | "mini";
  betType: string;
  selection: string;
  odds: number;
  stake: number;
  match?: string;
}

interface BetSlipContextType {
  items: BetSlipItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addBet: (bet: Omit<BetSlipItem, "id" | "stake">) => void;
  removeBet: (id: string) => void;
  updateStake: (id: string, stake: number) => void;
  clearBetSlip: () => void;
  totalOdds: number;
  totalStake: number;
  potentialWin: number;
}

const BetSlipContext = createContext<BetSlipContextType | undefined>(undefined);

export function BetSlipProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BetSlipItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addBet = (bet: Omit<BetSlipItem, "id" | "stake">) => {
    const newBet: BetSlipItem = {
      ...bet,
      id: Date.now().toString(),
      stake: 0,
    };
    
    setItems(prev => {
      const exists = prev.find(item => 
        item.gameType === bet.gameType && 
        item.betType === bet.betType && 
        item.selection === bet.selection
      );
      
      if (exists) {
        return prev;
      }
      
      return [...prev, newBet];
    });
    
    setIsOpen(true);
  };

  const removeBet = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateStake = (id: string, stake: number) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, stake } : item
      )
    );
  };

  const clearBetSlip = () => {
    setItems([]);
    setIsOpen(false);
  };

  const totalOdds = items.reduce((total, item) => {
    if (item.stake > 0) {
      return total === 0 ? item.odds : total * item.odds;
    }
    return total;
  }, 0);

  const totalStake = items.reduce((total, item) => total + item.stake, 0);
  
  const potentialWin = totalStake * totalOdds;

  // Persist bet slip to localStorage
  useEffect(() => {
    localStorage.setItem("betSlip", JSON.stringify(items));
  }, [items]);

  // Load bet slip from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("betSlip");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setItems(parsed);
      } catch (error) {
        console.error("Failed to load bet slip from localStorage:", error);
      }
    }
  }, []);

  return (
    <BetSlipContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addBet,
        removeBet,
        updateStake,
        clearBetSlip,
        totalOdds,
        totalStake,
        potentialWin,
      }}
    >
      {children}
    </BetSlipContext.Provider>
  );
}

export function useBetSlip() {
  const context = useContext(BetSlipContext);
  if (context === undefined) {
    throw new Error("useBetSlip must be used within a BetSlipProvider");
  }
  return context;
}
