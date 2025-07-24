# FlowTernity Sports AI Assistant

## Overview

This is a full-stack web application that serves as an AI-powered assistant for FlowTernity Sports, a multi-sport facility in Bengaluru. The application provides an intelligent chat interface that can answer questions about the facility's services, pricing, amenities, and booking information using Google's Gemini AI.

## User Preferences

Preferred communication style: Simple, everyday language.
UI/UX preferences: Modern gradient design, user-friendly interface, enhanced contact information display.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with CSS variables for theming

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API endpoints
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (via Neon Database)
- **AI Integration**: Google Gemini AI for chat responses

## Key Components

### Chat System
- Real-time chat interface with message history
- Session-based conversation tracking
- Error handling with fallback responses
- Integration with Gemini AI for intelligent responses

### Data Management
- Facility information storage and retrieval
- Web scraping capabilities for data collection from multiple sources (Playo, Instagram, Google Maps)
- Conversation logging for analytics and improvement
- Scraping status monitoring

### UI Components
- Modern, responsive design with shadcn/ui components
- Chat interface with message bubbles and typing indicators
- Facility information sidebar with real-time data
- Knowledge base status dashboard
- Mobile-first responsive design

## Data Flow

1. **User Interaction**: Users interact through the chat interface
2. **API Processing**: Express server receives chat requests and validates input
3. **Context Building**: Server fetches current facility data to provide context
4. **AI Processing**: Gemini AI generates responses using facility context
5. **Data Storage**: Conversations are logged to PostgreSQL database
6. **Response Delivery**: AI responses are sent back to the client

### Data Scraping Flow
1. **Scheduled Scraping**: Background processes collect data from external sources
2. **Data Processing**: Scraped data is cleaned and structured
3. **Database Storage**: Processed data is stored with source tracking
4. **Status Updates**: Scraping status is monitored and reported

## External Dependencies

### AI Services
- **Google Gemini AI**: Primary AI service for generating chat responses
- Requires `GEMINI_API_KEY` environment variable

### Database
- **Neon Database**: PostgreSQL hosting service
- Requires `DATABASE_URL` environment variable
- Connection pooling via `@neondatabase/serverless`

### Web Scraping
- **Cheerio**: HTML parsing for web scraping
- **Node Fetch**: HTTP requests for data collection
- Multiple data sources: Playo venue pages, Instagram profiles, Google Maps.

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management
- **React Hook Form**: Form state management with Zod validation

## Deployment Strategy

### Development
- Vite dev server for frontend with HMR
- Express server with TypeScript compilation via `tsx`
- Database migrations via Drizzle Kit
- Environment variable management for API keys

### Production Build
- Vite builds static assets to `dist/public`
- ESBuild bundles server code to `dist/index.js`
- Single production command serves both static files and API

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `GEMINI_API_KEY`: Google Gemini AI API key
- `NODE_ENV`: Environment specification

### Database Management
- Drizzle migrations in `./migrations` directory
- Schema definitions in `shared/schema.ts`
- Push-based deployment with `npm run db:push`

The application is designed to be deployed on platforms like Replit, Vercel, or similar services that support Node.js applications with PostgreSQL databases.