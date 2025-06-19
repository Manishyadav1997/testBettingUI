# BetPro - Online Betting Platform

## Overview

BetPro is a full-stack online betting platform built with React, Express.js, and PostgreSQL. The application provides a comprehensive betting experience featuring cricket betting, aviator games, color trading, mini-games, and real-time updates through WebSocket connections. The platform is designed as a mobile-first progressive web application with a modern dark theme.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context API for global state
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for fast development and optimized builds
- **Query Management**: TanStack React Query for server state management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Real-time Communication**: WebSocket server for live updates
- **API Design**: RESTful API endpoints with proper error handling
- **Development**: TSX for TypeScript execution in development

### Database Architecture
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Definition**: Type-safe schema definitions in shared directory
- **Migrations**: Drizzle Kit for database migrations
- **Connection**: Neon Database serverless connection
- **Validation**: Zod schemas for type validation

## Key Components

### Authentication System
- User registration and login functionality
- Password reset capabilities
- Form validation with React Hook Form
- Session management (ready for implementation)

### Betting Features
- **Cricket Betting**: Live match odds with real-time updates
- **Aviator Game**: Multiplier-based crash game with live gameplay
- **Color Trading**: Simple red/green/violet betting system
- **Mini Games**: Dice, coin toss, and wheel games

### Real-time Features
- WebSocket connection for live odds updates
- Real-time game state synchronization
- Live player activity tracking
- Instant bet slip updates

### User Interface
- Responsive design with mobile-first approach
- Dark theme with custom color scheme
- Glass morphism effects and modern styling
- Toast notifications for user feedback
- Progressive Web App capabilities

## Data Flow

### Client-Side Data Flow
1. User interactions trigger context updates
2. React Query manages server state caching
3. WebSocket receives real-time updates
4. Components re-render based on state changes
5. Bet slip maintains persistent betting state

### Server-Side Data Flow
1. Express routes handle API requests
2. WebSocket broadcasts real-time updates
3. Mock data storage (ready for database integration)
4. Error handling and response formatting

### Database Schema
- **Users**: Authentication and profile data
- **Bets**: Betting history and active bets
- **Matches**: Sports event data and odds
- **Transactions**: Financial transaction records

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Router alternative (Wouter)
- **UI Components**: Radix UI primitives, Lucide React icons
- **Styling**: Tailwind CSS, Class Variance Authority
- **Backend**: Express.js, WebSocket support
- **Database**: Drizzle ORM, Neon Database connector
- **Development**: Vite, TypeScript, ESBuild

### Third-party Services
- **Database Hosting**: Neon Database (PostgreSQL)
- **Real-time Updates**: Native WebSocket implementation
- **Development Environment**: Replit with Node.js 20

## Deployment Strategy

### Development Environment
- Replit-based development with hot reload
- Vite development server with middleware integration
- TypeScript compilation with incremental builds
- WebSocket support in development mode

### Production Build
- Vite builds optimized client bundle
- ESBuild compiles server code
- Static file serving from Express
- Environment-based configuration

### Database Management
- Drizzle migrations for schema changes
- Environment variable configuration
- Connection pooling with serverless architecture

## Changelog

- June 19, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.