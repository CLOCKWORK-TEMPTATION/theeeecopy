# The Copy - Project Structure

## Monorepo Architecture
This is a pnpm workspace monorepo with multiple packages and applications organized for scalability and maintainability.

## Root Directory Structure

### Core Applications
- **`frontend/`** - Next.js 14 application (main user interface)
- **`backend/`** - Express.js API server with TypeScript
- **`slidingcarousel/`** - Standalone Next.js component library/demo

### Infrastructure & DevOps
- **`redis/`** - Local Redis server binaries and configuration
- **`monitoring/`** - Grafana dashboards and Prometheus configuration
- **`scripts/`** - Build, deployment, and maintenance scripts
- **`.github/`** - GitHub Actions workflows and CI/CD

### Documentation & Guides
- **`docs/`** - Comprehensive project documentation
  - `performance-optimization/` - Performance improvement guides
  - `testing/` - Testing strategies and guides
  - `typescript-fix-plan/` - TypeScript migration documentation
- **`.amazonq/rules/`** - AI assistant rules and memory bank
- **`.windsurf/`** - Windsurf IDE configuration

## Frontend Structure (`frontend/`)
```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (main)/            # Main application routes
│   │   └── api/               # API routes
│   ├── components/            # Reusable UI components
│   ├── lib/                   # Utility libraries
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript type definitions
│   └── ai/                    # AI integration modules
├── public/                    # Static assets
├── tests/                     # Test files (unit & e2e)
└── scripts/                   # Frontend-specific scripts
```

## Backend Structure (`backend/`)
```
backend/
├── src/
│   ├── controllers/           # API route handlers
│   ├── services/              # Business logic services
│   ├── db/                    # Database schema and migrations
│   ├── middleware/            # Express middleware
│   ├── queues/                # BullMQ job processors
│   ├── utils/                 # Utility functions
│   └── types/                 # TypeScript definitions
├── db-performance-analysis/   # Database optimization tools
├── migrations/                # Database migration files
└── docs/                      # Backend-specific documentation
```

## Key Configuration Files

### Package Management
- **`pnpm-workspace.yaml`** - Workspace configuration
- **`package.json`** - Root package with workspace scripts
- **`frontend/package.json`** - Frontend dependencies
- **`backend/package.json`** - Backend dependencies

### Development Tools
- **`tsconfig.json`** - Root TypeScript configuration
- **`.eslintrc.js`** - Code linting rules
- **`.prettierrc`** - Code formatting rules
- **`docker-compose.yml`** - Container orchestration

### Environment & Security
- **`.env.example`** - Environment variable templates
- **`sentry.*.config.ts`** - Error monitoring configuration
- **`.github/workflows/`** - CI/CD pipeline definitions

## Architectural Patterns

### Monorepo Benefits
- **Shared Dependencies**: Common packages across frontend/backend
- **Unified Tooling**: Consistent linting, testing, and build processes
- **Cross-Package Development**: Easy integration between components

### Separation of Concerns
- **Frontend**: User interface, client-side logic, static assets
- **Backend**: API services, database operations, background jobs
- **Shared**: Type definitions, utilities, configuration

### Performance Infrastructure
- **Caching Layer**: Redis for session and data caching
- **Queue System**: BullMQ for background job processing
- **Database Optimization**: Indexed queries and connection pooling
- **Monitoring**: Sentry + Prometheus for observability