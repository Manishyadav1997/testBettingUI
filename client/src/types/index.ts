export interface LiveMatch {
  id: string;
  team1: string;
  team2: string;
  status: "live" | "upcoming" | "completed";
  score: {
    team1Score: string;
    team2Score: string;
    overs: string;
    currentOver: string;
  };
  odds: {
    team1Win: number;
    team2Win: number;
    draw?: number;
  };
  startTime: string;
}

export interface AviatorGameState {
  isActive: boolean;
  multiplier: number;
  timeElapsed: number;
  crashed: boolean;
  nextRoundIn: number;
  crashPoint?: number;
  startTime?: number;
  speed?: number;
  finalMultiplier?: number;
  activePlayers: {
    username: string;
    bet: number;
    cashedOut?: boolean;
    multiplier?: number;
  }[];
}

export interface ColorGameResult {
  result: "red" | "green" | "violet";
  timestamp: number;
  round: number;
}

export interface ColorGameState {
  countdown: number;
  isActive: boolean;
  currentRound: number;
  history: ColorGameResult[];
}

export interface MiniGameResult {
  game: "dice" | "coin" | "wheel" | "card";
  result: any;
  timestamp: number;
  won: boolean;
}

export interface Winner {
  rank: number;
  username: string;
  game: string;
  amount: number;
  timestamp: number;
}

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}
