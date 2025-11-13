# File Role Audit Report

**Generated:** 2025-11-10T22:31:39.473Z

**Total Files:** 78941


## Executive Summary

1. **Total files analyzed:** 78941 files across the entire frontend project
2. **Active functional files:** 2760 files actively used in the application
3. **Files with issues:** 0 files require attention
4. **Test coverage:** 466 test files providing quality assurance
5. **Build outputs:** 37 generated files from Next.js build
6. **Vendor dependencies:** 74888 third-party packages
7. **Documentation:** 1204 documentation files
8. **Confidence distribution:** 2548 high, 74916 medium, 1477 low


## Methodology

This audit was performed using a multi-stage analysis approach:

1. **Static Analysis:** AST parsing to extract exports, imports, and component types
2. **Manifest Analysis:** Examination of Next.js build manifests to map files to routes and chunks
3. **File System Traversal:** Complete directory walk to ensure 100% coverage
4. **Confidence Scoring:** Algorithmic scoring based on multiple evidence sources


## Statistics by Category

| Category | Count | Percentage |
|----------|-------|------------|
| vendor | 74888 | 94.9% |
| config | 1300 | 1.6% |
| doc | 1204 | 1.5% |
| test | 466 | 0.6% |
| util | 340 | 0.4% |
| component | 281 | 0.4% |
| lib | 235 | 0.3% |
| other | 58 | 0.1% |
| script | 45 | 0.1% |
| build-output | 37 | 0.0% |
| hook | 23 | 0.0% |
| app/page | 17 | 0.0% |
| style | 16 | 0.0% |
| public | 12 | 0.0% |
| app/route | 7 | 0.0% |
| tooling | 5 | 0.0% |
| app/layout | 3 | 0.0% |
| ci | 2 | 0.0% |
| app/loading | 1 | 0.0% |
| asset | 1 | 0.0% |


## Statistics by Status

| Status | Count |
|--------|-------|
| active_functional | 2760 |
| tooling_only | 52 |
| doc_only | 1204 |
| build_output | 37 |
| vendor | 74888 |


## Statistics by Feature/Owner

| Feature | Count |
|---------|-------|
| core | 78083 |
| testing | 411 |
| drama-analyst | 134 |
| ai-pipeline | 83 |
| build-scripts | 74 |
| ui-components | 44 |
| directors-studio | 39 |
| ci-cd | 28 |
| arabic-creative-writing-studio | 16 |
| actorai-arabic | 8 |
| arabic-prompt-engineering-studio | 7 |
| cinematography-studio | 7 |
| api-routes | 7 |


## File Details (First 50 Files)


### .env

- **Category:** other
- **Role:** other file: .env
- **Status:** active_functional
- **Confidence:** 0%
- **Owner:** core

### .env.example

- **Category:** other
- **Role:** other file: .env.example
- **Status:** active_functional
- **Confidence:** 0%
- **Owner:** core

### .env.local

- **Category:** other
- **Role:** other file: .env.local
- **Status:** active_functional
- **Confidence:** 0%
- **Owner:** core

### .firebaserc

- **Category:** other
- **Role:** other file: .firebaserc
- **Status:** active_functional
- **Confidence:** 0%
- **Owner:** core

### .github/workflows/ci-cd.yml

- **Category:** ci
- **Role:** CI/CD configuration
- **Status:** tooling_only
- **Confidence:** 95%
- **Owner:** ci-cd

### .github/workflows/ci.yml

- **Category:** ci
- **Role:** CI/CD configuration
- **Status:** tooling_only
- **Confidence:** 95%
- **Owner:** ci-cd

### .github/workflows/README.md

- **Category:** doc
- **Role:** Documentation file
- **Status:** doc_only
- **Confidence:** 100%
- **Owner:** ci-cd

### .gitignore

- **Category:** other
- **Role:** other file: .gitignore
- **Status:** active_functional
- **Confidence:** 0%
- **Owner:** core

### .husky/pre-commit

- **Category:** tooling
- **Role:** Development tooling
- **Status:** tooling_only
- **Confidence:** 95%
- **Owner:** core

### .husky/pre-push

- **Category:** tooling
- **Role:** Development tooling
- **Status:** tooling_only
- **Confidence:** 95%
- **Owner:** core

### .idx/dev.nix

- **Category:** tooling
- **Role:** Development tooling
- **Status:** tooling_only
- **Confidence:** 95%
- **Owner:** core

### .idx/icon.png

- **Category:** tooling
- **Role:** Development tooling
- **Status:** tooling_only
- **Confidence:** 95%
- **Owner:** core

### .idx/integrations.json

- **Category:** tooling
- **Role:** Development tooling
- **Status:** tooling_only
- **Confidence:** 95%
- **Owner:** core

### .next/app-build-manifest.json

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/build-manifest.json

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/cache/.rscinfo

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/fallback-build-manifest.json

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/package.json

- **Category:** config
- **Role:** Configuration for project tooling
- **Status:** active_functional
- **Confidence:** 90%
- **Owner:** core

### .next/prerender-manifest.json

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/routes-manifest.json

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/server/app-paths-manifest.json

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/server/chunks/[turbopack]_runtime.js

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/server/chunks/[turbopack]_runtime.js.map

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/server/chunks/frontend_src_instrumentation_ts_9377e4d9._.js

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/server/chunks/frontend_src_instrumentation_ts_9377e4d9._.js.map

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/server/edge/chunks/_19094521._.js

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core
- **Exports:** middleware

### .next/server/edge/chunks/_19094521._.js.map

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/server/edge/chunks/[root-of-the-server]__90aa66a3._.js

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/server/edge/chunks/[root-of-the-server]__90aa66a3._.js.map

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/server/edge/chunks/frontend_3be7a097._.js

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/server/edge/chunks/frontend_3be7a097._.js.map

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/server/edge/chunks/frontend_edge-wrapper_362f0cce.js

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/server/edge/chunks/frontend_edge-wrapper_362f0cce.js.map

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/server/edge/chunks/frontend_edge-wrapper_c835a6b1.js

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/server/edge/chunks/frontend_edge-wrapper_c835a6b1.js.map

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/server/instrumentation.js

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/server/instrumentation.js.map

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/server/instrumentation/middleware-manifest.json

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/server/interception-route-rewrite-manifest.js

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/server/middleware-build-manifest.js

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/server/middleware-manifest.json

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/server/middleware/middleware-manifest.json

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/server/next-font-manifest.js

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/server/next-font-manifest.json

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/server/pages-manifest.json

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/server/server-reference-manifest.js

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/server/server-reference-manifest.json

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/static/development/_buildManifest.js

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/static/development/_clientMiddlewareManifest.json

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core

### .next/static/development/_ssgManifest.js

- **Category:** build-output
- **Role:** Next.js build output
- **Status:** build_output
- **Confidence:** 100%
- **Owner:** core


_Full details for all 78941 files available in per_file_role.jsonl_
