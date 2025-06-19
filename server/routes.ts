import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');

    // Send initial data
    ws.send(JSON.stringify({
      type: 'welcome',
      message: 'Connected to BetPro real-time updates'
    }));

    // Mock real-time data updates
    const intervals = [
      // Cricket odds updates
      setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'cricket_odds_update',
            data: {
              matchId: '1',
              odds: {
                team1Win: 1.85 + (Math.random() - 0.5) * 0.1,
                team2Win: 2.10 + (Math.random() - 0.5) * 0.1,
              }
            }
          }));
        }
      }, 3000),

      // Aviator multiplier updates
      setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          const multiplier = 1.0 + Math.random() * 10;
          ws.send(JSON.stringify({
            type: 'aviator_update',
            data: {
              multiplier: multiplier.toFixed(2),
              crashed: multiplier > 8,
            }
          }));
        }
      }, 100),

      // Color game countdown
      setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          const countdown = Math.floor(Math.random() * 60);
          ws.send(JSON.stringify({
            type: 'color_game_update',
            data: {
              countdown,
              round: 1235 + Math.floor(Date.now() / 60000),
            }
          }));
        }
      }, 1000),
    ];

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);
        
        // Handle different message types
        switch (data.type) {
          case 'place_bet':
            // Mock bet placement
            ws.send(JSON.stringify({
              type: 'bet_placed',
              data: {
                betId: Date.now().toString(),
                status: 'success',
                message: 'Bet placed successfully'
              }
            }));
            break;
          case 'cash_out':
            // Mock cash out
            ws.send(JSON.stringify({
              type: 'cash_out_success',
              data: {
                amount: data.amount,
                multiplier: data.multiplier,
              }
            }));
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
      intervals.forEach(interval => clearInterval(interval));
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      intervals.forEach(interval => clearInterval(interval));
    });
  });

  // API Routes
  app.get('/api/matches', async (req, res) => {
    // Mock matches data
    const matches = [
      {
        id: '1',
        team1: 'Mumbai Indians',
        team2: 'Chennai Super Kings',
        status: 'live',
        score: { team1Score: '178/4', team2Score: '0/0', overs: '18.4' },
        odds: { team1Win: 1.85, team2Win: 2.10 },
        startTime: new Date().toISOString(),
      },
      {
        id: '2',
        team1: 'Royal Challengers Bangalore',
        team2: 'Delhi Capitals',
        status: 'live',
        score: { team1Score: '98/2', team2Score: '0/0', overs: '12.2' },
        odds: { team1Win: 1.92, team2Win: 1.98 },
        startTime: new Date().toISOString(),
      },
    ];
    res.json(matches);
  });

  app.post('/api/bets', async (req, res) => {
    try {
      const { gameType, betType, amount, odds } = req.body;
      
      // Mock bet creation
      const bet = {
        id: Date.now().toString(),
        gameType,
        betType,
        amount,
        odds,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      
      res.json({ success: true, bet });
    } catch (error) {
      res.status(400).json({ error: 'Failed to place bet' });
    }
  });

  app.get('/api/user/balance', async (req, res) => {
    res.json({ balance: 12450.00 });
  });

  app.post('/api/user/deposit', async (req, res) => {
    try {
      const { amount } = req.body;
      
      // Mock deposit
      res.json({ 
        success: true, 
        newBalance: 12450.00 + amount,
        transactionId: Date.now().toString(),
      });
    } catch (error) {
      res.status(400).json({ error: 'Deposit failed' });
    }
  });

  app.get('/api/leaderboard', async (req, res) => {
    const winners = [
      { rank: 1, username: 'RajeshK***', game: 'Aviator', amount: 45670 },
      { rank: 2, username: 'PriyaM***', game: 'Color Trading', amount: 23450 },
      { rank: 3, username: 'ArunS***', game: 'Cricket', amount: 18230 },
      { rank: 4, username: 'SnehaR***', game: 'Mini Games', amount: 15670 },
      { rank: 5, username: 'VikasT***', game: 'Aviator', amount: 12890 },
    ];
    res.json(winners);
  });

  return httpServer;
}
