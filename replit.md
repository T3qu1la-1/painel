# Overview

This is an OSINT (Open Source Intelligence) panel application built with React and Express. The application provides various intelligence gathering tools including email lookup, domain analysis, IP geolocation, phone number lookup, and social media investigation. It features a modern dashboard interface with search capabilities, bookmark management, and comprehensive result visualization.

The application is designed as a full-stack TypeScript solution with a React frontend using shadcn/ui components and an Express backend with PostgreSQL database integration through Drizzle ORM.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database interactions
- **Database**: PostgreSQL (configured for Neon Database)
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error handling middleware
- **Development**: Hot reload with Vite middleware integration

## Data Storage Solutions
- **Primary Database**: PostgreSQL with three main tables:
  - `searches`: Stores search queries, types, results, and status
  - `bookmarks`: User-saved searches with notes and titles
  - `stats`: Dashboard statistics and metrics
- **In-Memory Storage**: Fallback memory storage implementation for development
- **Schema Validation**: Zod schemas for runtime type checking and validation

## Authentication and Authorization
- No authentication system currently implemented
- Application appears to be designed for single-user or internal use
- Session management infrastructure present but not actively used

## Search and Analysis Engine
- **Multi-type Search Support**: Email, domain, IP, phone, and social media lookups
- **Modular Search Architecture**: Separate handlers for each search type
- **Result Processing**: JSON storage of search results with flexible schema
- **Status Tracking**: Pending, completed, and failed search states
- **Bookmark System**: Save and organize important search results

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management and caching
- **@hookform/resolvers**: Form validation integration
- **wouter**: Lightweight client-side routing

### UI Component Libraries
- **@radix-ui/react-***: Comprehensive set of unstyled, accessible UI primitives
- **class-variance-authority**: Utility for managing CSS class variants
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **eslint & prettier**: Code formatting and linting
- **drizzle-kit**: Database migration and schema management

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **zod**: Runtime type validation
- **clsx**: Conditional CSS class utility

### Potential External Services
The application architecture suggests integration with external OSINT APIs:
- HaveIBeenPwned API for breach checking
- Hunter.io for email verification
- WHOIS APIs for domain analysis
- IP geolocation services
- Social media platform APIs