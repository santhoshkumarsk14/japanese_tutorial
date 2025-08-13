# Overview

JLearner is a comprehensive Japanese learning web application designed for JLPT N5 and N4 level students. The application provides an interactive learning platform with gamified features including character charts, flashcards, quizzes, vocabulary practice, kanji learning, grammar lessons, and reading comprehension exercises. All learning content is hardcoded in JSON format, eliminating dependencies on external APIs for core functionality while maintaining the flexibility to integrate additional services like text-to-speech.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript for type safety and component-based architecture
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library built on Radix UI primitives for consistent design
- **Styling**: Tailwind CSS with custom Japanese learning theme variables and responsive design
- **State Management**: React hooks with localStorage for progress persistence
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Server**: Express.js with TypeScript
- **API Structure**: RESTful endpoints under `/api` prefix with CRUD operations interface
- **Storage**: In-memory storage implementation with extensible interface for future database integration
- **Session Management**: Express sessions with PostgreSQL session store capability
- **Development**: Hot module replacement and error overlay for enhanced developer experience

## Data Architecture
- **Content Structure**: Hardcoded JSON files for learning materials organized by category
  - Hiragana/Katakana character data with romaji mappings
  - Vocabulary items with readings, meanings, and example sentences
  - Kanji with onyomi/kunyomi readings and usage examples
  - Grammar points with explanations and example sentences
  - Reading passages with comprehension questions
- **Progress Tracking**: Client-side localStorage with XP system, streaks, and completion tracking
- **Gamification**: Level progression, XP rewards, and achievement badges

## Component Design Patterns
- **Reusable Learning Components**: Flashcard, Quiz, and CharacterChart components
- **Progress Visualization**: ProgressRing component for completion tracking
- **Audio Integration**: SpeakerButton component using Web Speech API
- **Responsive Layout**: Collapsible sidebar with mobile-first design approach

## Type Safety
- Comprehensive TypeScript interfaces for all learning data structures
- Zod schemas for data validation with Drizzle integration
- Type-safe API client with React Query for future backend integration

# External Dependencies

## UI and Styling
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Shadcn/ui**: Pre-built component library for consistent interface design
- **Lucide React**: Icon library for interface elements

## Development and Build Tools
- **Vite**: Modern build tool with HMR and optimized bundling
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for server-side code

## Runtime Libraries
- **React Query**: Data fetching and caching library (prepared for future API integration)
- **Wouter**: Lightweight routing library for single-page application navigation
- **Class Variance Authority**: Utility for creating variant-based component APIs

## Database and ORM (Prepared)
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect
- **Neon Database**: Serverless PostgreSQL database service
- **Connect PG Simple**: PostgreSQL session store for Express sessions

## Potential External APIs
- **Web Speech API**: Browser-native text-to-speech for pronunciation features
- **Font APIs**: Google Fonts for Japanese typography (Noto Sans JP)

## Development Environment
- **Replit Integration**: Development environment with live preview and collaboration features
- **Runtime Error Overlay**: Enhanced error reporting during development