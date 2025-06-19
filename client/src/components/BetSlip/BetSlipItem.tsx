import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useBetSlip, BetSlipItem as BetSlipItemType } from "@/contexts/BetSlipContext";

interface BetSlipItemProps {
  item: BetSlipItemType;
}

export default function BetSlipItem({ item }: BetSlipItemProps) {
  const { removeBet, updateStake } = useBetSlip();

  return (
    <div className="bg-secondary-dark rounded-lg p-3">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{item.selection}</span>
            <span className="text-accent-green font-semibold">{item.odds.toFixed(2)}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {item.match && <div>{item.match}</div>}
            <div className="capitalize">{item.gameType} • {item.betType}</div>
          </div>
        </div>
        <button
          onClick={() => removeBet(item.id)}
          className="text-gray-400 hover:text-danger-red ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <Input
        type="number"
        placeholder="Stake amount"
        value={item.stake || ""}
        onChange={(e) => updateStake(item.id, parseFloat(e.target.value) || 0)}
        className="bg-primary-dark border-gray-600 text-white text-sm"
        min="1"
        step="1"
      />
      
      {item.stake > 0 && (
        <div className="text-xs text-gray-400 mt-1">
          To win: ₹{(item.stake * item.odds).toFixed(2)}
        </div>
      )}
    </div>
  );
}
