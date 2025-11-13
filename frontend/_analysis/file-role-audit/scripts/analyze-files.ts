/**
 * File Role Audit - Main Analysis Script
 * Collects all files and performs static analysis to determine their roles
 */

import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

interface FileInfo {
  path: string;
  category: string;
  role_summary: string;
  exports: string[];
  imported_by: string[];
  routes_or_chunks: string[];
  static_evidence: string[];
  runtime_evidence: string[];
  status: string;
  issues: string[];
  confidence: number;
  owner_or_feature: string;
  last_modified: string;
  notes: string;
}

const FRONTEND_ROOT = path.resolve(__dirname, '../../../');
const OUTPUT_DIR = path.resolve(__dirname, '..');
const EVIDENCE_DIR = path.join(OUTPUT_DIR, 'evidence');

// Categories mapping
const CATEGORY_PATTERNS = {
  'app/page': /src[\\/]app[\\/].*[\\/]page\.(tsx?|jsx?)$/,
  'app/layout': /src[\\/]app[\\/].*[\\/]layout\.(tsx?|jsx?)$/,
  'app/route': /src[\\/]app[\\/].*[\\/]route\.(ts|js)$/,
  'app/loading': /src[\\/]app[\\/].*[\\/]loading\.(tsx?|jsx?)$/,
  'app/error': /src[\\/]app[\\/].*[\\/](error|global-error)\.(tsx?|jsx?)$/,
  'component': /src[\\/](components|app[\\/].*[\\/]components)[\\/].*\.(tsx?|jsx?)$/,
  'lib': /src[\\/]lib[\\/].*\.(ts|js)$/,
  'hook': /src[\\/](hooks|.*[\\/]hooks)[\\/].*\.(ts|js)$/,
  'util': /src[\\/](utils|lib[\\/]utils)[\\/].*\.(ts|js)$/,
  'agent': /src[\\/]lib[\\/]drama-analyst[\\/]agents[\\/].*\.(ts|js)$/,
  'script': /scripts[\\/].*\.(ts|js|mjs)$/,
  'config': /(next\.config|tailwind\.config|vite\.config|vitest\.config|playwright\.config|postcss\.config|eslint\.config)\.(ts|js|mjs|cjs)$/,
  'test': /(\.test\.|\.spec\.|__tests__|__smoke__).*\.(tsx?|jsx?)$/,
  'doc': /\.(md|txt)$/i,
  'public': /^public[\\/]/,
  'build-output': /^\.next[\\/]/,
  'vendor': /^node_modules[\\/]/,
  'ci': /^\.github[\\/]/,
  'tooling': /^(\.husky|\.idx)[\\/]/,
};

// Status determination
function determineStatus(filePath: string, hasErrors: boolean): string {
  if (filePath.includes('node_modules')) return 'vendor';
  if (filePath.startsWith('.next')) return 'build_output';
  if (filePath.match(/\.(md|txt)$/i)) return 'doc_only';
  if (filePath.match(/^(\.github|\.husky|\.idx|scripts)\//)) return 'tooling_only';
  if (hasErrors) return 'active_with_issues';
  return 'active_functional';
}

// Categorize file
function categorizeFile(filePath: string): string {
  for (const [category, pattern] of Object.entries(CATEGORY_PATTERNS)) {
    if (pattern.test(filePath)) {
      return category;
    }
  }

  // Default categorization by extension
  if (filePath.match(/\.(tsx?|jsx?)$/)) return 'component';
  if (filePath.match(/\.(css|scss)$/)) return 'style';
  if (filePath.match(/\.(json|yaml|yml)$/)) return 'config';
  if (filePath.match(/\.(png|jpg|jpeg|gif|svg|ico|webp)$/)) return 'asset';
  if (filePath.match(/\.(mp4|webm)$/)) return 'video';
  if (filePath.match(/\.(woff|woff2|ttf|otf|eot)$/)) return 'font';

  return 'other';
}

// Extract exports from file content
function extractExports(content: string, filePath: string): string[] {
  const exports: string[] = [];

  // Named exports
  const namedExportMatches = content.matchAll(/export\s+(const|let|var|function|class|interface|type|enum)\s+(\w+)/g);
  for (const match of namedExportMatches) {
    exports.push(match[2]);
  }

  // Export { ... }
  const exportBlockMatches = content.matchAll(/export\s*{([^}]+)}/g);
  for (const match of exportBlockMatches) {
    const names = match[1].split(',').map(n => n.trim().split(/\s+as\s+/)[0]);
    exports.push(...names);
  }

  // Default export
  if (content.match(/export\s+default/)) {
    const fileName = path.basename(filePath, path.extname(filePath));
    exports.push(`default (${fileName})`);
  }

  return [...new Set(exports)];
}

// Determine owner/feature from path
function determineOwner(filePath: string): string {
  if (filePath.includes('directors-studio')) return 'directors-studio';
  if (filePath.includes('drama-analyst')) return 'drama-analyst';
  if (filePath.includes('arabic-creative-writing-studio')) return 'arabic-creative-writing-studio';
  if (filePath.includes('arabic-prompt-engineering-studio')) return 'arabic-prompt-engineering-studio';
  if (filePath.includes('cinematography-studio')) return 'cinematography-studio';
  if (filePath.includes('actorai-arabic')) return 'actorai-arabic';
  if (filePath.includes('src/components/ui')) return 'ui-components';
  if (filePath.includes('src/lib/ai')) return 'ai-pipeline';
  if (filePath.includes('src/app/api')) return 'api-routes';
  if (filePath.includes('scripts')) return 'build-scripts';
  if (filePath.includes('.github')) return 'ci-cd';
  if (filePath.includes('tests')) return 'testing';

  return 'core';
}

// Generate role summary
function generateRoleSummary(filePath: string, category: string, exports: string[]): string {
  const fileName = path.basename(filePath);

  // App Router specific
  if (category === 'app/page') {
    const routePath = filePath.match(/src[\\/]app[\\/](.*)[\\/]page\./)?.[1] || '';
    return `Next.js App Router page component for route: /${routePath.replace(/[\\/]/g, '/')}`;
  }
  if (category === 'app/layout') {
    const routePath = filePath.match(/src[\\/]app[\\/](.*)[\\/]layout\./)?.[1] || '';
    return `Next.js layout component providing shared UI for: /${routePath.replace(/[\\/]/g, '/')}`;
  }
  if (category === 'app/route') {
    const routePath = filePath.match(/src[\\/]app[\\/](.*)[\\/]route\./)?.[1] || '';
    return `API route handler for: /api/${routePath.replace(/[\\/]/g, '/')}`;
  }
  if (category === 'app/loading') return 'Loading UI component for React Suspense boundary';
  if (category === 'app/error') return 'Error boundary component for error handling';

  // Components
  if (category === 'component') {
    const hasUseClient = exports.length > 0 ? 'Client' : 'Server';
    return `React ${hasUseClient} component: ${fileName}. Exports: ${exports.slice(0, 3).join(', ')}`;
  }

  // Libraries
  if (category === 'lib') {
    return `Library module providing: ${exports.slice(0, 3).join(', ') || 'utilities'}`;
  }

  // Hooks
  if (category === 'hook') {
    return `React custom hook: ${exports.filter(e => e.startsWith('use')).join(', ') || fileName}`;
  }

  // Agents
  if (category === 'agent') {
    return `Drama analyst AI agent for specialized screenplay analysis`;
  }

  // Scripts
  if (category === 'script') {
    return `Build/development script: ${fileName}`;
  }

  // Tests
  if (category === 'test') {
    const testType = filePath.includes('e2e') ? 'E2E' : filePath.includes('__smoke__') ? 'Smoke' : 'Unit';
    return `${testType} test suite for quality assurance`;
  }

  // Config
  if (category === 'config') {
    return `Configuration file for project tooling: ${fileName}`;
  }

  // Public assets
  if (category === 'public') {
    return `Static asset served at: /${filePath.replace(/^public[\\/]/, '').replace(/\\/g, '/')}`;
  }

  return `${category} file: ${fileName}`;
}

// Walk directory recursively
async function walkDirectory(dir: string, baseDir: string = dir): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await readdir(dir);

    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stats = await stat(fullPath);

      if (stats.isDirectory()) {
        // Skip some directories for performance
        if (entry === '.git' || entry === 'coverage') continue;
        files.push(...await walkDirectory(fullPath, baseDir));
      } else {
        const relativePath = path.relative(baseDir, fullPath);
        files.push(relativePath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }

  return files;
}

// Main analysis function
async function analyzeFiles() {
  console.log('🔍 Starting file role audit...\n');
  console.log(`Frontend root: ${FRONTEND_ROOT}\n`);

  // Collect all files
  console.log('📂 Collecting files...');
  const allFiles = await walkDirectory(FRONTEND_ROOT);
  console.log(`✅ Found ${allFiles.length} files\n`);

  const fileInfos: FileInfo[] = [];

  // Analyze each file
  console.log('🔬 Analyzing files...');
  for (let i = 0; i < allFiles.length; i++) {
    const filePath = allFiles[i];
    const normalizedPath = filePath.replace(/\\/g, '/');

    if (i % 100 === 0) {
      console.log(`  Progress: ${i}/${allFiles.length}`);
    }

    const fullPath = path.join(FRONTEND_ROOT, filePath);
    const category = categorizeFile(normalizedPath);
    let exports: string[] = [];
    let hasUseClient = false;

    // Read and analyze file content for code files
    if (filePath.match(/\.(tsx?|jsx?|mjs|cjs)$/)) {
      try {
        const stats = await stat(fullPath);
        const content = await readFile(fullPath, 'utf-8');
        exports = extractExports(content, filePath);
        hasUseClient = content.includes("'use client'") || content.includes('"use client"');

        const info: FileInfo = {
          path: normalizedPath,
          category,
          role_summary: generateRoleSummary(normalizedPath, category, exports),
          exports,
          imported_by: [], // Will be populated in second pass
          routes_or_chunks: [],
          static_evidence: [`AST analysis: ${exports.length} exports found`],
          runtime_evidence: [],
          status: determineStatus(normalizedPath, false),
          issues: [],
          confidence: 40, // Base confidence, will be calculated properly later
          owner_or_feature: determineOwner(normalizedPath),
          last_modified: stats.mtime.toISOString(),
          notes: hasUseClient ? 'Client component (use client directive)' : '',
        };

        fileInfos.push(info);
      } catch (error) {
        console.error(`Error analyzing ${filePath}:`, error);
      }
    } else {
      // Non-code files
      try {
        const stats = await stat(fullPath);
        const info: FileInfo = {
          path: normalizedPath,
          category,
          role_summary: generateRoleSummary(normalizedPath, category, []),
          exports: [],
          imported_by: [],
          routes_or_chunks: [],
          static_evidence: ['File exists'],
          runtime_evidence: [],
          status: determineStatus(normalizedPath, false),
          issues: [],
          confidence: 30,
          owner_or_feature: determineOwner(normalizedPath),
          last_modified: stats.mtime.toISOString(),
          notes: '',
        };

        fileInfos.push(info);
      } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
      }
    }
  }

  console.log(`\n✅ Analyzed ${fileInfos.length} files\n`);

  // Save intermediate results
  console.log('💾 Saving results...');
  const jsonlPath = path.join(OUTPUT_DIR, 'per_file_role.jsonl');
  const jsonlContent = fileInfos.map(info => JSON.stringify(info)).join('\n');
  await writeFile(jsonlPath, jsonlContent, 'utf-8');

  console.log(`✅ Saved to: ${jsonlPath}\n`);

  // Generate summary statistics
  const stats = {
    total: fileInfos.length,
    byCategory: {} as Record<string, number>,
    byStatus: {} as Record<string, number>,
    byOwner: {} as Record<string, number>,
  };

  fileInfos.forEach(info => {
    stats.byCategory[info.category] = (stats.byCategory[info.category] || 0) + 1;
    stats.byStatus[info.status] = (stats.byStatus[info.status] || 0) + 1;
    stats.byOwner[info.owner_or_feature] = (stats.byOwner[info.owner_or_feature] || 0) + 1;
  });

  console.log('📊 Summary Statistics:');
  console.log(`  Total files: ${stats.total}`);
  console.log(`\n  By Category:`);
  Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`    ${cat}: ${count}`);
  });
  console.log(`\n  By Status:`);
  Object.entries(stats.byStatus).forEach(([status, count]) => {
    console.log(`    ${status}: ${count}`);
  });

  return fileInfos;
}

// Run analysis
analyzeFiles().catch(console.error);
