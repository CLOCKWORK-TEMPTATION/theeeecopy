# The Copy - Technology Stack

## Programming Languages
- **TypeScript 5.9+** - Primary language for both frontend and backend
- **JavaScript** - Legacy components and build scripts
- **Python** - Utility scripts and automation tools
- **PowerShell** - Windows-specific automation scripts

## Frontend Technology Stack

### Core Framework
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with hooks and concurrent features
- **TypeScript** - Type-safe development

### Styling & UI
- **Tailwind CSS 4.1+** - Utility-first CSS framework
- **shadcn/ui** - Component library built on Radix UI
- **Radix UI** - Accessible component primitives
- **tailwindcss-animate** - Animation utilities

### State Management & Data
- **React Hooks** - Built-in state management
- **SWR/React Query** - Server state management
- **Zod** - Runtime type validation

### Build & Development
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing framework
- **Playwright** - End-to-end testing

## Backend Technology Stack

### Runtime & Framework
- **Node.js 20+** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development

### Database & ORM
- **PostgreSQL** - Primary database (Neon Serverless)
- **Drizzle ORM** - Type-safe database toolkit
- **Redis** - Caching and session storage

### Background Processing
- **BullMQ** - Job queue system
- **WebSocket** - Real-time communication
- **Server-Sent Events (SSE)** - Live updates

### AI & External Services
- **Google Gemini API** - AI text analysis
- **Mistral AI** - Alternative AI provider

## DevOps & Infrastructure

### Package Management
- **pnpm 10.20+** - Fast, disk space efficient package manager
- **pnpm workspaces** - Monorepo management

### Containerization
- **Docker** - Application containerization
- **Docker Compose** - Multi-container orchestration

### Monitoring & Observability
- **Sentry** - Error tracking and performance monitoring
- **Prometheus** - Metrics collection
- **Grafana** - Metrics visualization and dashboards

### CI/CD
- **GitHub Actions** - Continuous integration
- **Lighthouse CI** - Performance monitoring
- **Performance Budget** - Bundle size monitoring

## Development Commands

### Root Level Commands
```bash
# Start development environment
pnpm start:dev

# Run all tests
pnpm test

# Build all packages
pnpm build

# Lint all code
pnpm lint

# Type checking
pnpm typecheck
```

### Frontend Commands
```bash
cd frontend

# Development server
pnpm dev

# Production build
pnpm build

# Run tests
pnpm test

# E2E tests
pnpm test:e2e
```

### Backend Commands
```bash
cd backend

# Development server
pnpm dev

# Database operations
pnpm db:push
pnpm db:studio

# Run tests
pnpm test
pnpm test:coverage
```

## Environment Requirements

### System Requirements
- **Node.js**: 20.0.0 or higher
- **pnpm**: 10.20.0 or higher
- **PostgreSQL**: 14+ (or Neon Serverless)
- **Redis**: 6.0+ (optional, can use Docker)

### Development Setup
1. **Clone repository**
2. **Install dependencies**: `pnpm install`
3. **Setup environment variables**: Copy `.env.example` files
4. **Initialize database**: `cd backend && pnpm db:push`
5. **Start Redis**: `pnpm start:redis`
6. **Run development servers**: `pnpm start:dev`

### Production Deployment
- **Frontend**: Vercel (recommended) or custom hosting
- **Backend**: Custom server with PM2 or Docker
- **Database**: Neon Serverless PostgreSQL
- **Cache**: Redis Cloud or self-hosted Redis