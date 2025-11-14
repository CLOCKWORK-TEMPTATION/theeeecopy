# Cagent_RULES.md - Development Guidelines for Coding Agents

<div dir="rtl">



</div>

---

## Table of Contents

1. [Project Architecture](#project-architecture)
2. [Code Standards](#code-standards)
3. [TypeScript Guidelines](#typescript-guidelines)
4. [Git Workflow](#git-workflow)
5. [Testing Requirements](#testing-requirements)
6. [Security Rules](#security-rules)
7. [Performance Guidelines](#performance-guidelines)
8. [Documentation Standards](#documentation-standards)
9. [Error Handling](#error-handling)
10. [Code Review Checklist](#code-review-checklist)

---

## Project Architecture

### Monorepo Structure

```
theeeecopy/
├── frontend/          # Next.js 15 application
│   ├── src/
│   │   ├── app/      # App Router pages
│   │   ├── components/
│   │   ├── lib/      # Utilities and helpers
│   │   ├── hooks/    # Custom React hooks
│   │   └── types/    # TypeScript types
│   └── public/
├── backend/          # Express.js API
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── models/
│   │   └── types/
│   └── tests/
├── docs/             # Documentation
└── scripts/          # Build and utility scripts
```

### Technology Stack

**Frontend**:
- Next.js 15.4.7 (App Router)
- React 18.3.1
- TypeScript 5.7.2
- Tailwind CSS 4.1.16
- Radix UI components
- Tanstack Query 5.90.6
- Zod 3.25.76 (validation)

**Backend**:
- Node.js 20+
- Express.js 4.18.2
- TypeScript 5.0+
- Drizzle ORM 0.44.7
- PostgreSQL (Neon Serverless)
- Redis 5.9.0
- BullMQ 5.63.0
- Google Gemini AI

---

## Code Standards

### 1. General Principles

#### CRITICAL RULES ⚠️

**NEVER**:
- ❌ Use `any` type without explicit justification
- ❌ Disable TypeScript errors with `@ts-ignore` or `@ts-nocheck`
- ❌ Commit commented-out code
- ❌ Push directly to `main` or `master` branch
- ❌ Merge PRs without passing CI/CD
- ❌ Skip writing tests for new features
- ❌ Hard-code sensitive credentials
- ❌ Use `var` (use `const` or `let`)
- ❌ Mutate function parameters
- ❌ Create circular dependencies

**ALWAYS**:
- ✅ Write self-documenting code
- ✅ Follow DRY (Don't Repeat Yourself)
- ✅ Use meaningful variable names
- ✅ Add JSDoc comments for public APIs
- ✅ Handle errors explicitly
- ✅ Validate user input
- ✅ Write tests for critical paths
- ✅ Run linter before committing
- ✅ Update documentation

### 2. Naming Conventions

#### Variables and Functions

```typescript
// ✅ GOOD
const userProfile = getUserProfile();
const isAuthenticated = checkAuth();
const hasPermission = verifyPermission();

async function fetchProjectData(projectId: string): Promise<Project> {
  // Implementation
}

// ❌ BAD
const data = get();
const check = verify();
const x = doSomething();

function process(id) {
  // Implementation
}
```

#### Components (React)

```typescript
// ✅ GOOD - PascalCase for components
export function ProjectCard({ project }: ProjectCardProps) {
  return <div>...</div>;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user }) => {
  return <img src={user.avatar} alt={user.name} />;
};

// ❌ BAD
export function projectCard() { }
export const user_avatar = () => { };
```

#### Files and Directories

```
✅ GOOD:
- UserProfile.tsx (components)
- useAuth.ts (hooks)
- api-client.ts (utilities)
- project.types.ts (types)
- user.controller.ts (controllers)
- gemini.service.ts (services)

❌ BAD:
- userprofile.tsx
- UseAuth.ts
- APIClient.ts
- ProjectTypes.ts
```

#### Constants

```typescript
// ✅ GOOD - SCREAMING_SNAKE_CASE for constants
export const MAX_FILE_SIZE = 10_000_000; // 10MB
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const CACHE_TTL_SECONDS = 3600;

const TASK_CATEGORIES = {
  CHARACTER: 'character',
  THEME: 'theme',
  CONFLICT: 'conflict',
} as const;

// ❌ BAD
const maxFileSize = 10000000;
const apiUrl = '...';
```

#### Types and Interfaces

```typescript
// ✅ GOOD - PascalCase, descriptive names
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

type ProjectStatus = 'draft' | 'published' | 'archived';

interface ApiResponse<T> {
  data: T;
  error?: string;
  meta: {
    timestamp: number;
    requestId: string;
  };
}

// ❌ BAD
interface user { }
type status = string;
interface IResponse { } // Don't use "I" prefix
```

### 3. Code Formatting

**Use Prettier** with the following configuration:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
```

**ESLint Rules** (enforced):

```json
{
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-unused-vars": "error",
    "no-var": "error",
    "prefer-const": "error",
    "prefer-arrow-callback": "error",
    "no-implicit-coercion": "error",
    "eqeqeq": ["error", "always"],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "import/no-cycle": "error"
  }
}
```

### 4. Import Organization

```typescript
// ✅ GOOD - Organized imports
// 1. React and Next.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

// 3. Internal modules (absolute imports)
import { ProjectCard } from '@/components/ProjectCard';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';

// 4. Types
import type { Project, User } from '@/types';

// 5. Styles (if any)
import styles from './Component.module.css';

// ❌ BAD - Mixed and relative imports
import { ProjectCard } from '../../components/ProjectCard';
import { z } from 'zod';
import { useState } from 'react';
import type { Project } from '../../../types/project';
```

**Path Aliases** (configured in tsconfig.json):

```typescript
// Frontend
import { ... } from '@/components/...';
import { ... } from '@/lib/...';
import { ... } from '@/hooks/...';
import { ... } from '@/types/...';

// Backend
import { ... } from '@/controllers/...';
import { ... } from '@/services/...';
import { ... } from '@/middleware/...';
import { ... } from '@/types/...';
```

---

## TypeScript Guidelines

### 1. Strict Mode Configuration

**tsconfig.json** must include:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### 2. Type Definitions

#### Prefer Interfaces for Objects

```typescript
// ✅ GOOD - Use interface for object shapes
interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ GOOD - Use type for unions, primitives
type ProjectStatus = 'draft' | 'published' | 'archived';
type ID = string | number;

// ❌ BAD - Don't use type for simple objects
type Project = {
  id: string;
  title: string;
};
```

#### Explicit Return Types

```typescript
// ✅ GOOD - Explicit return type
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

async function fetchUser(userId: string): Promise<User | null> {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
}

// ❌ BAD - Implicit return type
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

#### Generic Types

```typescript
// ✅ GOOD - Well-defined generics
interface ApiResponse<T> {
  data: T;
  error?: string;
  meta: ResponseMeta;
}

function makeRequest<T>(url: string): Promise<ApiResponse<T>> {
  return fetch(url).then(res => res.json());
}

// Usage
const response = await makeRequest<Project[]>('/api/projects');

// ❌ BAD - Over-generic
function makeRequest<T>(url: string): Promise<T> {
  return fetch(url).then(res => res.json());
}
```

#### Utility Types

```typescript
// ✅ GOOD - Use built-in utility types
type PartialProject = Partial<Project>;
type RequiredProject = Required<Project>;
type ProjectPreview = Pick<Project, 'id' | 'title' | 'createdAt'>;
type ProjectWithoutId = Omit<Project, 'id'>;
type ReadonlyProject = Readonly<Project>;

// Function parameter types
type ProjectUpdateData = Partial<Omit<Project, 'id' | 'createdAt'>>;

function updateProject(
  projectId: string,
  updates: ProjectUpdateData
): Promise<Project> {
  // Implementation
}
```

### 3. Null Safety

```typescript
// ✅ GOOD - Explicit null handling
function getUserEmail(user: User | null): string | null {
  return user?.email ?? null;
}

function processProject(project: Project | undefined): void {
  if (!project) {
    console.warn('No project provided');
    return;
  }

  // Safe to use project here
  console.log(project.title);
}

// ❌ BAD - Unsafe access
function getUserEmail(user) {
  return user.email; // May throw if user is null
}

function processProject(project) {
  console.log(project.title); // May throw if undefined
}
```

### 4. Type Guards

```typescript
// ✅ GOOD - Custom type guards
function isProject(value: unknown): value is Project {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value &&
    typeof (value as Project).id === 'string' &&
    typeof (value as Project).title === 'string'
  );
}

function processData(data: unknown): void {
  if (isProject(data)) {
    // TypeScript knows data is Project here
    console.log(data.title);
  }
}

// ✅ GOOD - Discriminated unions
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function handleResult<T>(result: Result<T>): T | null {
  if (result.success) {
    return result.data;
  } else {
    console.error(result.error);
    return null;
  }
}
```

### 5. Enums vs Union Types

```typescript
// ✅ PREFERRED - Use const objects with 'as const'
export const ProjectStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

export type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus];

// ✅ ACCEPTABLE - String literal unions
export type TaskCategory = 'character' | 'theme' | 'conflict' | 'plot';

// ⚠️ USE SPARINGLY - Enums (only for backwards compatibility)
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
}
```

---

## Git Workflow

### 1. Branch Naming Convention

```bash
# Feature branches
feature/user-authentication
feature/project-export
feature/seven-stations-analysis

# Bug fixes
fix/login-redirect-issue
fix/type-error-in-shots-page
fix/redis-connection-timeout

# Hotfixes
hotfix/security-vulnerability
hotfix/critical-api-error

# Chores and maintenance
chore/update-dependencies
chore/cleanup-unused-imports
chore/refactor-gemini-service

# Documentation
docs/update-readme
docs/add-api-documentation
docs/improve-setup-guide

# CI/CD and configuration
ci/add-typescript-checks
ci/improve-test-coverage
config/update-eslint-rules
```

### 2. Commit Message Format

Follow **Conventional Commits** specification:

```bash
# Format
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no logic changes)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `build`: Build system changes
- `revert`: Revert a previous commit

**Examples**:

```bash
# ✅ GOOD
feat(auth): add JWT token refresh mechanism

Implement automatic token refresh using refresh tokens.
Tokens expire after 1 hour and are refreshed silently
in the background.

Closes #123

# ✅ GOOD
fix(api): resolve race condition in project creation

The createProject endpoint was creating duplicate entries
when called simultaneously. Added transaction locks to
prevent this issue.

# ✅ GOOD
perf(cache): implement stale-while-revalidate caching

Reduce API calls by 60% using adaptive TTL and background
refresh for stale cache entries.

# ❌ BAD
fixed stuff
updated files
changes
WIP
```

### 3. Pull Request Guidelines

#### PR Title Format

```
[Type] Brief description (max 72 characters)

Examples:
[Feature] Add user authentication with JWT
[Fix] Resolve TypeScript errors in directors-studio pages
[Refactor] Improve Gemini service error handling
[Docs] Update installation instructions
```

#### PR Description Template

```markdown
## Summary
Brief description of what this PR does (1-3 sentences).

## Changes
- List of main changes
- Another change
- And another

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Related Issues
Closes #123
Related to #456

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No TypeScript errors
- [ ] All tests passing
- [ ] No new security vulnerabilities
```

### 4. Code Review Process

**Before Requesting Review**:
1. ✅ Run `pnpm typecheck` (no errors)
2. ✅ Run `pnpm lint` (no warnings)
3. ✅ Run `pnpm test` (all passing)
4. ✅ Run `pnpm build` (successful)
5. ✅ Self-review your changes
6. ✅ Update documentation
7. ✅ Add meaningful commit messages

**Reviewers Must Check**:
1. Code quality and readability
2. TypeScript strict mode compliance
3. Test coverage
4. Security vulnerabilities
5. Performance implications
6. Breaking changes
7. Documentation accuracy

**Review Response Time**:
- Critical fixes: 4 hours
- Regular PRs: 24 hours
- Large features: 48 hours

---

## Testing Requirements

### 1. Test Coverage Targets

```
Overall Coverage: >= 80%
Critical Paths: >= 95%
Services: >= 90%
Controllers: >= 85%
Components: >= 75%
```

### 2. Testing Stack

**Frontend**:
- **Unit/Integration**: Vitest + Testing Library
- **E2E**: Playwright
- **Component**: React Testing Library

**Backend**:
- **Unit/Integration**: Vitest
- **API**: Supertest
- **Load**: Custom scripts

### 3. Test Structure

```typescript
// ✅ GOOD - AAA Pattern (Arrange, Act, Assert)
describe('ProjectService', () => {
  describe('createProject', () => {
    it('should create a project with valid data', async () => {
      // Arrange
      const projectData = {
        title: 'Test Project',
        description: 'Test Description',
      };
      const userId = 'user-123';

      // Act
      const result = await projectService.createProject(userId, projectData);

      // Assert
      expect(result).toBeDefined();
      expect(result.title).toBe('Test Project');
      expect(result.userId).toBe(userId);
    });

    it('should throw error when title is missing', async () => {
      // Arrange
      const invalidData = { description: 'No title' };

      // Act & Assert
      await expect(
        projectService.createProject('user-123', invalidData)
      ).rejects.toThrow('Title is required');
    });
  });
});

// ❌ BAD
test('test project', () => {
  const p = create({ t: 'test' });
  expect(p).toBeTruthy();
});
```

### 4. Testing Best Practices

```typescript
// ✅ GOOD - Mock external dependencies
import { vi } from 'vitest';
import { geminiService } from '@/services/gemini.service';

vi.mock('@/services/gemini.service', () => ({
  geminiService: {
    analyze: vi.fn(),
  },
}));

describe('AnalysisController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should analyze script using gemini service', async () => {
    // Arrange
    const mockResult = { characters: [], themes: [] };
    vi.mocked(geminiService.analyze).mockResolvedValue(mockResult);

    // Act
    const result = await analysisController.analyzeScript(scriptText);

    // Assert
    expect(geminiService.analyze).toHaveBeenCalledWith(scriptText);
    expect(result).toEqual(mockResult);
  });
});

// ❌ BAD - Direct external calls in tests
it('should analyze script', async () => {
  const result = await analysisController.analyzeScript(scriptText);
  // This makes real API calls!
  expect(result).toBeDefined();
});
```

### 5. Test Naming

```typescript
// ✅ GOOD - Descriptive test names
describe('UserService', () => {
  it('should create user with hashed password', async () => { });
  it('should throw error when email already exists', async () => { });
  it('should return null when user not found', async () => { });
});

// ❌ BAD
describe('UserService', () => {
  it('test 1', () => { });
  it('works', () => { });
  it('should work correctly', () => { });
});
```

### 6. E2E Testing

```typescript
// tests/e2e/project-workflow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Project Creation Workflow', () => {
  test('should create, edit, and delete project', async ({ page }) => {
    // Navigate to app
    await page.goto('http://localhost:3000');

    // Login
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Wait for dashboard
    await expect(page).toHaveURL('/directors-studio');

    // Create project
    await page.click('[data-testid="create-project-button"]');
    await page.fill('[data-testid="project-title"]', 'My Test Project');
    await page.fill('[data-testid="project-description"]', 'Test description');
    await page.click('[data-testid="submit-button"]');

    // Verify project created
    await expect(page.locator('text=My Test Project')).toBeVisible();

    // Cleanup
    await page.click('[data-testid="delete-project"]');
    await page.click('[data-testid="confirm-delete"]');
  });
});
```

---

## Security Rules

### 1. Authentication & Authorization

```typescript
// ✅ GOOD - Verify user authentication
import { verifyToken } from '@/middleware/auth.middleware';

router.get('/projects', verifyToken, async (req, res) => {
  const userId = req.user.id; // From verified JWT
  const projects = await projectService.getUserProjects(userId);
  res.json(projects);
});

// ❌ BAD - Trust client-provided user ID
router.get('/projects', async (req, res) => {
  const userId = req.query.userId; // Dangerous!
  const projects = await projectService.getUserProjects(userId);
  res.json(projects);
});
```

### 2. Input Validation

```typescript
// ✅ GOOD - Validate with Zod
import { z } from 'zod';

const createProjectSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

router.post('/projects', verifyToken, async (req, res) => {
  try {
    const validatedData = createProjectSchema.parse(req.body);
    const project = await projectService.createProject(
      req.user.id,
      validatedData
    );
    res.status(201).json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    throw error;
  }
});

// ❌ BAD - No validation
router.post('/projects', async (req, res) => {
  const project = await projectService.createProject(req.body);
  res.json(project);
});
```

### 3. SQL Injection Prevention

```typescript
// ✅ GOOD - Use parameterized queries (Drizzle ORM)
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function getProject(projectId: string) {
  const project = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  return project[0];
}

// ❌ BAD - String concatenation
async function getProject(projectId: string) {
  const query = `SELECT * FROM projects WHERE id = '${projectId}'`;
  return await db.execute(query); // SQL injection risk!
}
```

### 4. XSS Prevention

```typescript
// ✅ GOOD - Sanitize user input
import DOMPurify from 'dompurify';

function renderUserContent(content: string): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
  });
}

// ✅ GOOD - Use proper escaping in React
function ProjectCard({ project }: { project: Project }) {
  return (
    <div>
      {/* React automatically escapes */}
      <h2>{project.title}</h2>
      <p>{project.description}</p>
    </div>
  );
}

// ❌ BAD - dangerouslySetInnerHTML without sanitization
function ProjectCard({ project }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: project.description }} />
  );
}
```

### 5. Environment Variables

```typescript
// ✅ GOOD - Validate environment variables
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.string().url(),
  GEMINI_API_KEY: z.string().min(1),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
});

export const env = envSchema.parse(process.env);

// ❌ BAD - Direct access without validation
const apiKey = process.env.GEMINI_API_KEY;
const dbUrl = process.env.DATABASE_URL;
```

### 6. Secrets Management

```bash
# ✅ GOOD - Use .env files (never commit!)
# .env.local
GEMINI_API_KEY=your_api_key_here
DATABASE_URL=postgresql://...
JWT_SECRET=your_very_long_random_secret_here

# .env.example (commit this)
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=generate_a_secure_random_string_at_least_32_chars

# ❌ BAD - Hard-coded secrets
const apiKey = 'AIzaSyDxxxxxxxxxxxxxxxxxxxxxxx';
const dbPassword = 'mypassword123';
```

### 7. Rate Limiting

```typescript
// ✅ GOOD - Implement rate limiting
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // More strict for auth endpoints
  message: 'Too many login attempts',
});

app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);
```

---

## Performance Guidelines

### 1. Database Optimization

```typescript
// ✅ GOOD - Use indexes and JOIN queries
import { db } from '@/db';
import { projects, scenes, characters } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function getProjectWithDetails(projectId: string) {
  const result = await db
    .select({
      project: projects,
      scenes: scenes,
      characters: characters,
    })
    .from(projects)
    .leftJoin(scenes, eq(scenes.projectId, projects.id))
    .leftJoin(characters, eq(characters.projectId, projects.id))
    .where(eq(projects.id, projectId));

  return result;
}

// ❌ BAD - N+1 queries
async function getProjectWithDetails(projectId: string) {
  const project = await db.select().from(projects).where(eq(projects.id, projectId));

  // N+1 problem: separate query for each relationship
  const scenes = await db.select().from(scenes).where(eq(scenes.projectId, projectId));
  const characters = await db.select().from(characters).where(eq(characters.projectId, projectId));

  return { project, scenes, characters };
}
```

### 2. Caching Strategy

```typescript
// ✅ GOOD - Cache expensive operations
import { redis } from '@/lib/redis';

async function getProjectAnalysis(projectId: string): Promise<Analysis> {
  const cacheKey = `analysis:project:${projectId}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Compute if not cached
  const analysis = await analysisService.analyzeProject(projectId);

  // Store in cache (1 hour TTL)
  await redis.setex(cacheKey, 3600, JSON.stringify(analysis));

  return analysis;
}

// Invalidate cache when project changes
async function updateProject(projectId: string, updates: Partial<Project>) {
  const updated = await db
    .update(projects)
    .set(updates)
    .where(eq(projects.id, projectId));

  // Invalidate related caches
  await redis.del(`analysis:project:${projectId}`);
  await redis.del(`project:${projectId}`);

  return updated;
}
```

### 3. React Performance

```typescript
// ✅ GOOD - Memoize expensive computations
import { useMemo, useCallback } from 'react';

function ProjectDashboard({ projects }: { projects: Project[] }) {
  // Memoize expensive calculations
  const statistics = useMemo(() => {
    return {
      total: projects.length,
      published: projects.filter(p => p.status === 'published').length,
      draft: projects.filter(p => p.status === 'draft').length,
    };
  }, [projects]);

  // Memoize callbacks
  const handleProjectClick = useCallback((projectId: string) => {
    router.push(`/projects/${projectId}`);
  }, [router]);

  return (
    <div>
      <Stats data={statistics} />
      <ProjectList projects={projects} onProjectClick={handleProjectClick} />
    </div>
  );
}

// ✅ GOOD - Use React.memo for expensive components
import { memo } from 'react';

export const ProjectCard = memo(function ProjectCard({ project }: Props) {
  return <div>...</div>;
});
```

### 4. Code Splitting

```typescript
// ✅ GOOD - Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const ParticleBackground = dynamic(
  () => import('@/components/ParticleBackground'),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  }
);

const AnalysisReport = dynamic(
  () => import('@/components/AnalysisReport'),
  {
    loading: () => <Skeleton />,
  }
);
```

### 5. Image Optimization

```typescript
// ✅ GOOD - Use Next.js Image component
import Image from 'next/image';

function UserAvatar({ user }: { user: User }) {
  return (
    <Image
      src={user.avatar}
      alt={user.name}
      width={48}
      height={48}
      priority={false}
      placeholder="blur"
      blurDataURL="/placeholder.jpg"
    />
  );
}

// ❌ BAD - Regular img tag
function UserAvatar({ user }) {
  return <img src={user.avatar} alt={user.name} />;
}
```

### 6. Bundle Size Optimization

```typescript
// ✅ GOOD - Import only what you need
import { formatDistance } from 'date-fns';
import { debounce } from 'lodash-es';

// ❌ BAD - Import entire library
import _ from 'lodash';
import * as dateFns from 'date-fns';
```

---

## Documentation Standards

### 1. Code Comments

```typescript
// ✅ GOOD - JSDoc for public APIs
/**
 * Analyzes a script using the Seven Stations pipeline
 *
 * @param scriptText - The script text to analyze
 * @param options - Analysis options
 * @param options.stations - Specific stations to run (default: all)
 * @param options.async - Run analysis asynchronously via queue
 * @returns Analysis results or job ID if async
 *
 * @example
 * ```typescript
 * const result = await analyzeScript('Script text here', {
 *   stations: [1, 2, 3],
 *   async: false
 * });
 * ```
 *
 * @throws {ValidationError} If script text is empty
 * @throws {RateLimitError} If API rate limit exceeded
 */
export async function analyzeScript(
  scriptText: string,
  options?: AnalysisOptions
): Promise<AnalysisResult | { jobId: string }> {
  // Implementation
}

// ✅ GOOD - Inline comments for complex logic
function calculateDramaScore(analysis: Analysis): number {
  // Weight factors based on narrative impact research
  const weights = {
    characterDepth: 0.3,    // 30% - Character development is crucial
    plotCoherence: 0.25,    // 25% - Story structure matters
    dialogueQuality: 0.2,   // 20% - Dialogue drives scenes
    pacing: 0.15,           // 15% - Rhythm and flow
    themes: 0.1,            // 10% - Thematic depth
  };

  // Normalize scores to 0-10 range
  const normalized = normalizeScores(analysis.metrics);

  // Calculate weighted average
  return Object.entries(weights).reduce((score, [key, weight]) => {
    return score + (normalized[key] * weight);
  }, 0);
}

// ❌ BAD - Obvious or redundant comments
// Increment counter by 1
counter++;

// Get user
const user = getUser();

// Loop through projects
for (const project of projects) {
  // ...
}
```

### 2. README Files

Each major module should have a README:

```markdown
# Module Name

Brief description of what this module does.

## Usage

\`\`\`typescript
import { functionName } from '@/module';

const result = functionName(params);
\`\`\`

## API Reference

### `functionName(param: Type): ReturnType`

Description of what the function does.

**Parameters:**
- `param` (Type): Description

**Returns:** Description of return value

**Example:**
\`\`\`typescript
const result = functionName('example');
\`\`\`

## Architecture

Explain the design decisions and architecture.

## Testing

How to run tests for this module.

\`\`\`bash
pnpm test src/module
\`\`\`

## Contributing

Guidelines for contributing to this module.
```

### 3. API Documentation

```typescript
// Use OpenAPI/Swagger comments
/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/projects', verifyToken, createProject);
```

---

## Error Handling

### 1. Error Types

```typescript
// Define custom error classes
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR',
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, 404, 'NOT_FOUND');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}
```

### 2. Error Handling Patterns

```typescript
// ✅ GOOD - Explicit error handling
async function getProject(projectId: string): Promise<Project> {
  try {
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!project[0]) {
      throw new NotFoundError('Project', projectId);
    }

    return project[0];
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    // Log unexpected errors
    console.error('Unexpected error in getProject:', error);
    Sentry.captureException(error);

    throw new AppError('Failed to retrieve project');
  }
}

// ❌ BAD - Silent failures
async function getProject(projectId: string) {
  try {
    const project = await db.select()...;
    return project[0] || null; // Silent failure
  } catch (error) {
    return null; // Swallowing errors
  }
}
```

### 3. Global Error Handler (Express)

```typescript
// backend/src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/errors';
import * as Sentry from '@sentry/node';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log error
  console.error('Error:', error);

  // Send to Sentry
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error);
  }

  // Handle known errors
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.code,
        ...(process.env.NODE_ENV === 'development' && {
          details: error.details,
          stack: error.stack,
        }),
      },
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV === 'development' && {
        details: error.message,
        stack: error.stack,
      }),
    },
  });
}
```

### 4. React Error Boundaries

```typescript
// frontend/src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
    Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## Code Review Checklist

### Before Submitting PR

- [ ] Code compiles without errors (`pnpm typecheck`)
- [ ] No linting warnings (`pnpm lint`)
- [ ] All tests pass (`pnpm test`)
- [ ] Build succeeds (`pnpm build`)
- [ ] No console.log statements (use proper logging)
- [ ] No commented-out code
- [ ] No hardcoded secrets or credentials
- [ ] Environment variables documented in .env.example
- [ ] README updated if needed
- [ ] Migration scripts added if DB schema changed
- [ ] Self-review completed

### Reviewer Checklist

#### Code Quality
- [ ] Code is readable and self-documenting
- [ ] Functions are small and single-purpose
- [ ] No code duplication (DRY principle)
- [ ] Naming is clear and consistent
- [ ] Comments explain "why", not "what"

#### TypeScript
- [ ] No use of `any` without justification
- [ ] No `@ts-ignore` or `@ts-nocheck`
- [ ] Proper types for all function parameters and returns
- [ ] Interfaces used appropriately
- [ ] No type assertions unless necessary

#### Testing
- [ ] New features have tests
- [ ] Bug fixes have regression tests
- [ ] Test coverage meets requirements
- [ ] Tests are meaningful (not just for coverage)
- [ ] Mock external dependencies

#### Security
- [ ] User input is validated
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (proper escaping)
- [ ] Authentication/authorization checks
- [ ] No sensitive data in logs
- [ ] Rate limiting implemented where needed

#### Performance
- [ ] No N+1 query problems
- [ ] Expensive operations are cached
- [ ] Large components use code splitting
- [ ] Images are optimized
- [ ] No unnecessary re-renders

#### Documentation
- [ ] Public APIs have JSDoc comments
- [ ] Complex logic is explained
- [ ] README updated if needed
- [ ] Breaking changes documented
- [ ] Migration guide for breaking changes

---

## Quick Reference

### Essential Commands

```bash
# Frontend
cd frontend
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm typecheck        # Check TypeScript
pnpm lint             # Run linter
pnpm test             # Run tests
pnpm test:e2e         # Run E2E tests

# Backend
cd backend
pnpm dev              # Start dev server
pnpm build            # Build TypeScript
pnpm typecheck        # Check types
pnpm lint             # Run linter
pnpm test             # Run tests
pnpm db:push          # Push schema to DB
pnpm db:studio        # Open Drizzle Studio

# Root
pnpm lint             # Lint entire project
pnpm typecheck        # Typecheck all packages
pnpm test             # Run all tests
pnpm ci               # Full CI pipeline
```

### Common Patterns

```typescript
// API call with error handling
async function fetchData<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// React hook with TypeScript
function useProject(projectId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => apiClient.getProject(projectId),
    staleTime: 60000,
  });

  return { project: data, isLoading, error };
}

// Zod schema validation
const projectSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(['draft', 'published', 'archived']),
});

type Project = z.infer<typeof projectSchema>;
```

---

## Resources

### Documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Drizzle ORM Documentation](https://orm.drizzle.team)

### Tools
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)

### Project Docs
- [README](./README.md)
- [AGENTS.md](./AGENTS.md) - AI Agent behavior
- [Backend Documentation](./backend/BACKEND_DOCUMENTATION.md)
- [Performance Optimization](./docs/performance-optimization/README.md)

---

<div dir="rtl">

## الخلاصة

هذا الدليل يوفر إطاراً شاملاً لتطوير تطبيق "النسخة" بجودة عالية. الالتزام بهذه القواعد يضمن:

- ✅ كود نظيف وقابل للصيانة
- ✅ أمان قوي
- ✅ أداء محسّن
- ✅ اختبارات شاملة
- ✅ توثيق واضح
- ✅ تعاون فعّال بين الفريق

للأسئلة أو الاقتراحات، افتح issue على GitHub أو راجع الوثائق التقنية.

</div>
