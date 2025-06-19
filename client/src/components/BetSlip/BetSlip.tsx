import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useBetSlip } from "@/contexts/BetSlipContext";
import { useApp } from "@/contexts/AppContext";
import BetSlipItem from "./BetSlipItem";

export default function BetSlip() {
  const { items, isOpen, setIsOpen, clearBetSlip, totalOdds, totalStake, potentialWin } = useBetSlip();
  const { showToast, balance, setBalance } = useApp();

  const handlePlaceBet = () => {
    if (items.length === 0) {
      showToast("Add bets to your slip first", "error");
      return;
    }

    if (totalStake === 0) {
      showToast("Enter stake amounts for your bets", "error");
      return;
    }

    if (totalStake > balance) {
      showToast("Insufficient balance", "error");
      return;
    }

    // Place the bet
    setBalance(balance - totalStake);
    showToast(`Bet placed successfully! Potential win: ₹${potentialWin.toFixed(2)}`, "success");
    clearBetSlip();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 right-4 w-80 max-w-sm z-40">
      <Card className="glass-morphism p-4 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Bet Slip</h3>
          <div className="flex space-x-2">
            {items.length > 0 && (
              <button
                onClick={clearBetSlip}
                className="text-gray-400 hover:text-danger-red transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>Your bet slip is empty</p>
            <p className="text-sm mt-2">Add bets by clicking odds</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <BetSlipItem key={item.id} item={item} />
              ))}
            </div>

            <div className="border-t border-gray-600 pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span>Total Odds:</span>
                <span className="text-accent-green font-semibold">
                  {totalOdds > 0 ? totalOdds.toFixed(2) : "0.00"}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Total Stake:</span>
                <span className="text-white font-semibold">
                  ₹{totalStake.toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Potential Win:</span>
                <span className="text-gold font-semibold">
                  ₹{potentialWin.toFixed(2)}
                </span>
              </div>

              <Button
                onClick={handlePlaceBet}
                className="w-full gradient-accent text-primary-dark font-semibold hover:opacity-90"
                disabled={totalStake === 0}
              >
                Place Bet
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
