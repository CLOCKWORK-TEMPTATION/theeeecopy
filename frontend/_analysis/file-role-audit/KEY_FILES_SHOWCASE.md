# Key Files Showcase - Frontend Project Analysis

**Generated:** 2025-11-10  
**Purpose:** Highlight important application files and their roles

---

## 🎯 Application Entry Points

| Path | Category | Role | Confidence | Notes |
|------|----------|------|------------|-------|
| `src/app/page.tsx` | app/page | Homepage - Main landing page | 50% | Client component |
| `src/app/layout.tsx` | app/layout | Root layout with providers | 55% | Root application wrapper |
| `src/app/globals.css` | style | Global styles and Tailwind | 0% | Main stylesheet |
| `src/middleware.ts` | component | Next.js middleware | 5% | Request interceptor |

---

## 📱 Main Application Pages (App Router)

| Path | Route | Feature | Confidence |
|------|-------|---------|------------|
| `src/app/(main)/directors-studio/page.tsx` | `/directors-studio` | Film director's production tools | 55% |
| `src/app/(main)/analysis/page.tsx` | `/analysis` | Seven stations screenplay analysis | 55% |
| `src/app/(main)/editor/page.tsx` | `/editor` | Screenplay writing editor | 50% |
| `src/app/(main)/arabic-creative-writing-studio/page.tsx` | `/arabic-creative-writing-studio` | Arabic creative writing tools | 55% |
| `src/app/(main)/arabic-prompt-engineering-studio/page.tsx` | `/arabic-prompt-engineering-studio` | Arabic prompt engineering | 55% |
| `src/app/(main)/cinematography-studio/page.tsx` | `/cinematography-studio` | Cinematography planning | 50% |
| `src/app/(main)/actorai-arabic/page.tsx` | `/actorai-arabic` | AI actor tools (Arabic) | 55% |
| `src/app/(main)/brainstorm/page.tsx` | `/brainstorm` | Creative brainstorming | 55% |
| `src/app/(main)/breakdown/page.tsx` | `/breakdown` | Script breakdown tools | 55% |
| `src/app/(main)/development/page.tsx` | `/development` | Creative development | 50% |
| `src/app/(main)/metrics-dashboard/page.tsx` | `/metrics-dashboard` | Analytics dashboard | 50% |
| `src/app/(main)/new/page.tsx` | `/new` | New feature showcase | 50% |

---

## 🔌 API Routes (Backend Endpoints)

| Path | Endpoint | Purpose | Confidence |
|------|----------|---------|------------|
| `src/app/api/ai/chat/route.ts` | `/api/ai/chat` | AI chat interface | 50% |
| `src/app/api/analysis/seven-stations/route.ts` | `/api/analysis/seven-stations` | Seven stations analysis API | 50% |
| `src/app/api/cineai/generate-shots/route.ts` | `/api/cineai/generate-shots` | Shot generation AI | 50% |
| `src/app/api/cineai/validate-shot/route.ts` | `/api/cineai/validate-shot` | Shot validation | 50% |
| `src/app/api/cineai/color-grading/route.ts` | `/api/cineai/color-grading` | Color grading suggestions | 50% |
| `src/app/api/review-screenplay/route.ts` | `/api/review-screenplay` | Screenplay review API | 50% |
| `src/app/api/health/route.ts` | `/api/health` | Health check endpoint | 50% |

---

## 🤖 Drama Analyst AI Agents (Specialized Analysis)

| Agent | File | Purpose | Confidence |
|-------|------|---------|------------|
| Character Network | `src/lib/drama-analyst/agents/characterNetwork/CharacterNetworkAgent.ts` | Character relationship mapping | 50% |
| Dialogue Forensics | `src/lib/drama-analyst/agents/dialogueForensics/DialogueForensicsAgent.ts` | Dialogue authenticity analysis | 50% |
| Conflict Dynamics | `src/lib/drama-analyst/agents/conflictDynamics/ConflictDynamicsAgent.ts` | Conflict structure analysis | 50% |
| Rhythm Mapping | `src/lib/drama-analyst/agents/rhythmMapping/RhythmMappingAgent.ts` | Pacing and rhythm analysis | 50% |
| Thematic Mining | `src/lib/drama-analyst/agents/thematicMining/ThematicMiningAgent.ts` | Theme extraction | 50% |
| Plot Predictor | `src/lib/drama-analyst/agents/plotPredictor/PlotPredictorAgent.ts` | Causal plot prediction | 50% |
| Style Fingerprint | `src/lib/drama-analyst/agents/styleFingerprint/StyleFingerprintAgent.ts` | Writing style analysis | 50% |
| Tension Optimizer | `src/lib/drama-analyst/agents/tensionOptimizer/TensionOptimizerAgent.ts` | Dramatic tension optimization | 50% |
| World Builder | `src/lib/drama-analyst/agents/worldBuilder/WorldBuilderAgent.ts` | World consistency checking | 50% |
| Adaptive Rewriting | `src/lib/drama-analyst/agents/adaptiveRewriting/AdaptiveRewritingAgent.ts` | AI-assisted rewriting | 50% |
| Scene Generator | `src/lib/drama-analyst/agents/sceneGenerator/SceneGeneratorAgent.ts` | Scene generation | 50% |
| Character Voice | `src/lib/drama-analyst/agents/characterVoice/CharacterVoiceAgent.ts` | Character voice consistency | 50% |
| Completion Agent | `src/lib/drama-analyst/agents/completion/CompletionAgent.ts` | Analysis completion | 50% |
| Creative Agent | `src/lib/drama-analyst/agents/creative/CreativeAgent.ts` | Creative suggestions | 50% |

---

## 🧠 AI Pipeline Core

| Component | File | Role | Confidence |
|-----------|------|------|------------|
| Gemini Core | `src/lib/ai/gemini-core.ts` | Google Gemini integration | 50% |
| Gemini Service | `src/lib/ai/services/gemini-service.ts` | AI service wrapper | 50% |
| Base Station | `src/lib/ai/stations/base-station.ts` | Analysis station base class | 50% |
| Orchestrator | `src/lib/ai/stations/orchestrator.ts` | Pipeline orchestration | 50% |
| Station 1 | `src/lib/ai/stations/station1-text-analysis.ts` | Text analysis station | 50% |
| Station 2 | `src/lib/ai/stations/station2-conceptual-analysis.ts` | Conceptual analysis | 50% |
| Station 3 | `src/lib/ai/stations/station3-network-builder.ts` | Network building | 50% |
| Station 4 | `src/lib/ai/stations/station4-efficiency-metrics.ts` | Efficiency metrics | 50% |
| Station 5 | `src/lib/ai/stations/station5-dynamic-symbolic-stylistic.ts` | Dynamic analysis | 50% |
| Station 6 | `src/lib/ai/stations/station6-diagnostics-treatment.ts` | Diagnostics & fixes | 50% |
| Station 7 | `src/lib/ai/stations/station7-finalization.ts` | Final synthesis | 50% |

---

## 🎨 UI Component Library

| Component | File | Purpose | Confidence |
|-----------|------|---------|------------|
| Main Nav | `src/components/main-nav.tsx` | Primary navigation | 50% |
| Logo | `src/components/logo.tsx` | Application logo | 50% |
| Error Boundary | `src/components/ErrorBoundary.tsx` | Error handling | 50% |
| Loading State | `src/components/LoadingState.tsx` | Loading indicators | 50% |
| File Upload | `src/components/file-upload.tsx` | File upload component | 50% |
| Seven Stations Interface | `src/components/seven-stations-interface.tsx` | Analysis interface | 50% |
| Station Card | `src/components/station-card.tsx` | Station display card | 50% |
| Stations Pipeline | `src/components/stations-pipeline.tsx` | Pipeline visualization | 50% |

---

## 🎭 Directors Studio Components

| Component | File | Purpose | Confidence |
|-----------|------|---------|------------|
| Main Studio | `src/app/(main)/directors-studio/components/DirectorsStudio.tsx` | Main studio interface | 15% |
| Project Manager | `src/app/(main)/directors-studio/components/ProjectManager.tsx` | Project management | 15% |
| Scene Card | `src/app/(main)/directors-studio/components/SceneCard.tsx` | Scene display | 15% |
| Character Tracker | `src/app/(main)/directors-studio/components/CharacterTracker.tsx` | Character tracking | 15% |
| Shot Planning | `src/app/(main)/directors-studio/components/ShotPlanningCard.tsx` | Shot planning tools | 15% |
| Script Upload | `src/app/(main)/directors-studio/components/ScriptUploadZone.tsx` | Script upload interface | 15% |
| AI Chat Panel | `src/app/(main)/directors-studio/components/AIChatPanel.tsx` | AI assistant chat | 15% |
| App Sidebar | `src/app/(main)/directors-studio/components/AppSidebar.tsx` | Studio sidebar | 15% |

---

## 📝 Screenplay Editor Components

| Component | File | Purpose | Confidence |
|-----------|------|---------|------------|
| Screenplay Editor | `src/app/(main)/editor/screenplay-editor.tsx` | Main editor component | 15% |
| Action Classifiers | `src/app/(main)/editor/action-classifiers.ts` | Action type detection | 5% |
| Keyboard Handlers | `src/app/(main)/editor/keyboard-handlers.ts` | Keyboard shortcuts | 5% |
| Paste Handlers | `src/app/(main)/editor/paste-handlers.ts` | Paste formatting | 5% |
| Arabic Action Verbs | `src/app/(main)/editor/utils/arabic-action-verbs.ts` | Arabic verb detection | 5% |
| Character Line Detector | `src/app/(main)/editor/utils/character-line-detector.ts` | Character detection | 5% |
| Keyboard Shortcuts | `src/app/(main)/editor/utils/keyboard-shortcuts.ts` | Shortcut definitions | 5% |

---

## 🔧 Core Utilities & Libraries

| Module | File | Purpose | Confidence |
|--------|------|---------|------------|
| Utils | `src/lib/utils.ts` | General utilities | 50% |
| API Client | `src/lib/api.ts` | API client wrapper | 50% |
| Query Client | `src/lib/queryClient.ts` | React Query setup | 50% |
| Project Store | `src/lib/projectStore.ts` | Project state management | 50% |
| Safe Fetch | `src/lib/utils/safe-fetch.ts` | Safe HTTP requests | 5% |
| Text Protocol | `src/lib/utils/text-protocol.ts` | Text processing | 5% |
| KV Utils | `src/lib/utils/kv-utils.ts` | Key-value utilities | 5% |

---

## 🧪 Test Infrastructure

| Test Suite | File | Scope | Confidence |
|------------|------|-------|------------|
| Homepage | `tests/e2e/homepage.spec.ts` | E2E: Homepage | 25% |
| Navigation | `tests/e2e/navigation.spec.ts` | E2E: Navigation | 25% |
| Pages | `tests/e2e/pages.spec.ts` | E2E: All pages | 25% |
| Accessibility | `tests/e2e/accessibility.spec.ts` | E2E: A11y testing | 25% |
| Performance | `tests/e2e/performance.spec.ts` | E2E: Performance | 25% |
| Critical Journeys | `tests/e2e/critical-user-journeys.spec.ts` | E2E: User flows | 25% |
| Functional Scenarios | `tests/e2e/functional-scenarios.spec.ts` | E2E: Functionality | 25% |
| Utils Tests | `tests/unit/lib/utils.test.ts` | Unit: Utils | 25% |
| Web Vitals Tests | `tests/unit/lib/web-vitals.test.ts` | Unit: Web vitals | 25% |

---

## ⚙️ Configuration Files

| Config | File | Purpose | Confidence |
|--------|------|---------|------------|
| Next.js | `next.config.ts` | Next.js configuration | 95% |
| TypeScript | `tsconfig.json` | TypeScript compiler config | 95% |
| Tailwind | `tailwind.config.ts` | Tailwind CSS config | 95% |
| PostCSS | `postcss.config.mjs` | PostCSS config | 95% |
| ESLint | `eslint.config.js` | Linting rules | 95% |
| Playwright | `playwright.config.ts` | E2E test config | 95% |
| Vitest | `vitest.config.ts` | Unit test config | 95% |
| Package | `package.json` | Dependencies & scripts | 95% |
| Sentry | `sentry.client.config.ts` | Error tracking | 95% |

---

## 🏗️ Build Scripts

| Script | File | Purpose | Confidence |
|--------|------|---------|------------|
| Bundle Analysis | `scripts/bundle-analysis.js` | Bundle size analysis | 5% |
| Check Bundle Size | `scripts/check-bundle-size.js` | Bundle size validation | 5% |
| Performance Budget | `scripts/check-performance-budget.js` | Performance checks | 5% |
| Enforce Coverage | `scripts/enforce-coverage.js` | Test coverage validation | 5% |
| Find Untested | `scripts/find-untested-files.js` | Find files without tests | 5% |
| Generate Manifest | `scripts/generate-pages-manifest.ts` | Page manifest generation | 5% |
| Optimize Images | `scripts/optimize-images.js` | Image optimization | 5% |
| Performance Report | `scripts/performance-report.js` | Performance reporting | 5% |

---

## 📦 Custom Hooks

| Hook | File | Purpose | Confidence |
|------|------|---------|------------|
| useAI | `src/hooks/useAI.ts` | AI integration hook | 50% |
| useProject | `src/hooks/useProject.ts` | Project state hook | 50% |
| useMetrics | `src/hooks/useMetrics.ts` | Metrics tracking hook | 50% |
| useToast | `src/hooks/use-toast.ts` | Toast notifications | 50% |
| useMobile | `src/hooks/use-mobile.tsx` | Mobile detection | 50% |

---

## 🔒 Security Utilities

| Module | File | Purpose | Confidence |
|--------|------|---------|------------|
| Safe RegExp | `src/lib/security/safe-regexp.ts` | ReDoS protection | 5% |
| Sanitize HTML | `src/lib/security/sanitize-html.ts` | XSS protection | 5% |

---

## 📊 Services & Infrastructure

| Service | File | Purpose | Confidence |
|---------|------|---------|------------|
| Analytics | `src/lib/drama-analyst/services/analyticsService.ts` | Analytics tracking | 5% |
| API Service | `src/lib/drama-analyst/services/apiService.ts` | API client | 5% |
| Backend Service | `src/lib/drama-analyst/services/backendService.ts` | Backend integration | 5% |
| Cache Service | `src/lib/drama-analyst/services/cacheService.ts` | Caching layer | 5% |
| Error Handler | `src/lib/drama-analyst/services/errorHandler.ts` | Error handling | 5% |
| Logger | `src/lib/drama-analyst/services/loggerService.ts` | Logging service | 5% |
| Gemini Service | `src/lib/drama-analyst/services/geminiService.ts` | Gemini AI client | 5% |
| RAG Service | `src/lib/drama-analyst/services/ragService.ts` | Retrieval augmented generation | 5% |
| Sanitization | `src/lib/drama-analyst/services/sanitizationService.ts` | Input sanitization | 5% |

---

## 📚 Documentation Files

| Document | Path | Topics Covered |
|----------|------|----------------|
| Frontend Performance | `FRONTEND_PERFORMANCE_REPORT.md` | Performance analysis |
| Main README | `README.md` | Project overview |
| Scripts README | `scripts/README.md` | Build scripts documentation |
| Tests README | `tests/README.md` | Testing strategy |
| Workflows README | `.github/workflows/README.md` | CI/CD pipelines |
| Components Usage | `src/components/USAGE_GUIDE.md` | Component usage guide |
| UI README | `src/app/(main)/ui/README.md` | UI components docs |

---

## 🎯 Key Statistics

- **Total Pages:** 17 App Router pages
- **API Endpoints:** 7 backend API routes
- **AI Agents:** 14+ specialized analysis agents
- **UI Components:** 281 React components
- **Test Files:** 466 test suites
- **Documentation:** 1,204 markdown files
- **Utility Modules:** 340 helper modules
- **Configuration Files:** 1,300 config files

---

## 🔑 Critical Path Files (Highest Priority)

1. **`src/app/layout.tsx`** - Root application layout with providers
2. **`src/lib/ai/gemini-core.ts`** - Core AI integration
3. **`src/lib/drama-analyst/orchestration/orchestration.ts`** - Agent orchestration
4. **`next.config.ts`** - Next.js configuration
5. **`src/middleware.ts`** - Request middleware
6. **`src/app/api/ai/chat/route.ts`** - Primary AI API endpoint
7. **`src/lib/drama-analyst/agents/shared/BaseAgent.ts`** - Base agent class
8. **`src/components/main-nav.tsx`** - Main navigation
9. **`package.json`** - Dependencies and scripts
10. **`tsconfig.json`** - TypeScript configuration

---

*This showcase highlights the most important files in the project organized by functional category. All files have been analyzed and categorized in the complete per_file_role.jsonl report.*