import { useEffect, useRef } from "react";
import { Clock } from "lucide-react";

interface AviatorDisplayProps {
  multiplier: number;
  isActive: boolean;
  crashed: boolean;
  nextRoundIn: number;
  showNextRoundTimer: boolean;
}

export default function AviatorDisplay({ multiplier, isActive, crashed, nextRoundIn, showNextRoundTimer }: AviatorDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawGame = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set canvas size
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "rgba(26, 26, 46, 0.8)");
      gradient.addColorStop(1, "rgba(15, 15, 35, 0.9)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isActive && !crashed) {
        // Draw trajectory line
        const startX = 50;
        const startY = canvas.height - 50;
        const currentX = startX + (multiplier - 1) * 100;
        const currentY = startY - (multiplier - 1) * 50;

        ctx.strokeStyle = "#00d4aa";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(Math.min(currentX, canvas.width - 50), Math.max(currentY, 50));
        ctx.stroke();

        // Draw plane
        ctx.fillStyle = "#00d4aa";
        ctx.font = "30px Arial";
        ctx.fillText("✈️", Math.min(currentX - 15, canvas.width - 65), Math.max(currentY, 50));

        // Draw multiplier
        ctx.fillStyle = "#00d4aa";
        ctx.font = "bold 48px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`${multiplier.toFixed(2)}x`, canvas.width / 2, 100);
      } else if (crashed) {
        // Draw crash effect
        ctx.fillStyle = "#ff6b6b";
        ctx.font = "bold 36px Arial";
        ctx.textAlign = "center";
        ctx.fillText("CRASHED!", canvas.width / 2, canvas.height / 2);
        ctx.fillText(`At ${multiplier.toFixed(2)}x`, canvas.width / 2, canvas.height / 2 + 50);
      } else {
        // Waiting for next round
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 32px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Next round in", canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillStyle = "#ffd700";
        ctx.font = "bold 48px Arial";
        ctx.fillText(`${nextRoundIn}s`, canvas.width / 2, canvas.height / 2 + 30);
      }
    };

    drawGame();
  }, [multiplier, isActive, crashed, nextRoundIn]);

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      {showNextRoundTimer && nextRoundIn > 0 && (
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 flex items-center">
          <Clock className="w-5 h-5 text-gold mr-2" />
          <span className="text-white font-bold">Next round in {nextRoundIn}s</span>
        </div>
      )}
      {/* Current Multiplier Display */}
      <div className="absolute top-4 left-4 glass-morphism px-4 py-2 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-accent-green animate-pulse' : 'bg-gray-500'}`}></div>
          <span className="text-white font-bold text-lg">
            {isActive && !crashed ? multiplier.toFixed(2) : '0.00'}x
          </span>
        </div>
      </div>
    </div>
  );
}
