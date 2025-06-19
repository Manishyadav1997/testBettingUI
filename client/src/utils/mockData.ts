import { LiveMatch, Winner, Notification } from "@/types";

export const mockMatches: LiveMatch[] = [
  {
    id: "1",
    team1: "Mumbai Indians",
    team2: "Chennai Super Kings",
    status: "live",
    score: {
      team1Score: "178/4",
      team2Score: "0/0",
      overs: "18.4",
      currentOver: "6 4 1 0 W 4",
    },
    odds: {
      team1Win: 1.85,
      team2Win: 2.10,
    },
    startTime: "2024-01-15T14:30:00Z",
  },
  {
    id: "2",
    team1: "Royal Challengers Bangalore",
    team2: "Delhi Capitals",
    status: "live",
    score: {
      team1Score: "98/2",
      team2Score: "0/0",
      overs: "12.2",
      currentOver: "1 2 0 4 1 6",
    },
    odds: {
      team1Win: 1.92,
      team2Win: 1.98,
    },
    startTime: "2024-01-15T18:00:00Z",
  },
  {
    id: "3",
    team1: "India",
    team2: "Australia",
    status: "upcoming",
    score: {
      team1Score: "",
      team2Score: "",
      overs: "",
      currentOver: "",
    },
    odds: {
      team1Win: 2.25,
      team2Win: 1.65,
    },
    startTime: "2024-01-16T09:30:00Z",
  },
];

export const mockWinners: Winner[] = [
  {
    rank: 1,
    username: "RajeshK***",
    game: "Aviator",
    amount: 45670,
    timestamp: Date.now() - 300000,
  },
  {
    rank: 2,
    username: "PriyaM***",
    game: "Color Trading",
    amount: 23450,
    timestamp: Date.now() - 600000,
  },
  {
    rank: 3,
    username: "ArunS***",
    game: "Cricket",
    amount: 18230,
    timestamp: Date.now() - 900000,
  },
  {
    rank: 4,
    username: "SnehaR***",
    game: "Mini Games",
    amount: 15670,
    timestamp: Date.now() - 1200000,
  },
  {
    rank: 5,
    username: "VikasT***",
    game: "Aviator",
    amount: 12890,
    timestamp: Date.now() - 1500000,
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Bet Won!",
    message: "Your bet on MI vs CSK has won ₹2,450",
    timestamp: Date.now() - 300000,
    read: false,
  },
  {
    id: "2",
    type: "info",
    title: "New Match Available",
    message: "India vs Australia match is now live for betting",
    timestamp: Date.now() - 600000,
    read: false,
  },
  {
    id: "3",
    type: "warning",
    title: "Account Verification",
    message: "Please complete your KYC verification",
    timestamp: Date.now() - 900000,
    read: true,
  },
];

export const mockColorGameHistory = [
  { result: "green" as const, timestamp: Date.now() - 60000, round: 1234 },
  { result: "red" as const, timestamp: Date.now() - 120000, round: 1233 },
  { result: "violet" as const, timestamp: Date.now() - 180000, round: 1232 },
  { result: "green" as const, timestamp: Date.now() - 240000, round: 1231 },
  { result: "red" as const, timestamp: Date.now() - 300000, round: 1230 },
];

export const mockPromotions = [
  {
    id: "1",
    title: "Welcome Bonus",
    description: "Get 100% bonus up to ₹10,000 on your first deposit",
    type: "welcome",
    amount: 10000,
    validUntil: "2024-12-31",
  },
  {
    id: "2",
    title: "Daily Cashback",
    description: "Get 5% cashback on all losses every day",
    type: "cashback",
    percentage: 5,
    validUntil: "2024-12-31",
  },
  {
    id: "3",
    title: "Refer & Earn",
    description: "Earn ₹500 for every friend you refer",
    type: "referral",
    amount: 500,
    validUntil: "2024-12-31",
  },
];
