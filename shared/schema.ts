import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define types for better type inference
type UserInsert = typeof users.$inferInsert;
type BetInsert = typeof bets.$inferInsert;
type MatchInsert = typeof matches.$inferInsert;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
  balance: decimal("balance", { precision: 10, scale: 2 }).default("0.00"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bets = pgTable("bets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  gameType: text("game_type").notNull(), // cricket, aviator, color, mini
  betType: text("bet_type").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  odds: decimal("odds", { precision: 5, scale: 2 }),
  status: text("status").default("pending"), // pending, won, lost
  result: jsonb("result"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  team1: text("team1").notNull(),
  team2: text("team2").notNull(),
  status: text("status").default("upcoming"), // upcoming, live, completed
  score: jsonb("score"),
  odds: jsonb("odds"),
  startTime: timestamp("start_time"),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // deposit, withdrawal, bet, win
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define schemas with explicit types
export const insertUserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional().nullable(),
});

export const insertBetSchema = z.object({
  gameType: z.string(),
  betType: z.string(),
  amount: z.string(),
  odds: z.string().optional().nullable(),
});

export const insertMatchSchema = z.object({
  team1: z.string(),
  team2: z.string(),
  startTime: z.string().nullable(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBet = z.infer<typeof insertBetSchema>;
export type Bet = typeof bets.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
