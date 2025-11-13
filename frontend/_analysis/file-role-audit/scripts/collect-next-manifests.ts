/**
 * Collect Next.js Build Manifests
 * Copies and consolidates all relevant Next.js build manifests from .next/
 */

import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const copyFile = promisify(fs.copyFile);

const FRONTEND_ROOT = path.resolve(__dirname, '../../../');
const NEXT_DIR = path.join(FRONTEND_ROOT, '.next');
const OUTPUT_DIR = path.join(__dirname, '../evidence/manifests');

interface ManifestInfo {
  name: string;
  path: string;
  exists: boolean;
  size?: number;
}

const MANIFEST_FILES = [
  'build-manifest.json',
  'app-build-manifest.json',
  'middleware-manifest.json',
  'server-reference-manifest.json',
  'routes-manifest.json',
  'next-minimal-server.js.nft.json',
  'next-server.js.nft.json',
  'package.json',
  'required-server-files.json',
  'prerender-manifest.json',
  'images-manifest.json',
  'export-marker.json',
];

async function ensureDir(dir: string): Promise<void> {
  try {
    await fs.promises.mkdir(dir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function collectManifests() {
  console.log('📦 Collecting Next.js Build Manifests...\n');
  console.log(`Next.js build directory: ${NEXT_DIR}`);
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  // Ensure output directory exists
  await ensureDir(OUTPUT_DIR);

  // Check if .next exists
  const nextExists = await fileExists(NEXT_DIR);
  if (!nextExists) {
    console.warn('⚠️  .next directory not found. Please run "npm run build" first.\n');

    // Create placeholder report
    const report = {
      timestamp: new Date().toISOString(),
      nextDirExists: false,
      message: 'Next.js build directory not found. Build the project first.',
      manifests: [],
    };

    await writeFile(
      path.join(OUTPUT_DIR, 'manifest-collection-report.json'),
      JSON.stringify(report, null, 2),
      'utf-8'
    );

    return;
  }

  const manifestInfos: ManifestInfo[] = [];
  let copiedCount = 0;

  // Collect each manifest file
  for (const manifestName of MANIFEST_FILES) {
    const sourcePath = path.join(NEXT_DIR, manifestName);
    const exists = await fileExists(sourcePath);

    const info: ManifestInfo = {
      name: manifestName,
      path: sourcePath,
      exists,
    };

    if (exists) {
      try {
        const stats = await stat(sourcePath);
        info.size = stats.size;

        // Copy to output directory
        const destPath = path.join(OUTPUT_DIR, manifestName);
        await copyFile(sourcePath, destPath);
        copiedCount++;

        console.log(`✅ Copied: ${manifestName} (${(stats.size / 1024).toFixed(2)} KB)`);
      } catch (error) {
        console.error(`❌ Error copying ${manifestName}:`, error);
      }
    } else {
      console.log(`⚠️  Not found: ${manifestName}`);
    }

    manifestInfos.push(info);
  }

  // Look for additional manifest-like files
  console.log('\n🔍 Searching for additional manifests...');
  try {
    const serverDir = path.join(NEXT_DIR, 'server');
    if (await fileExists(serverDir)) {
      const serverFiles = await readdir(serverDir);
      for (const file of serverFiles) {
        if (file.endsWith('-manifest.json')) {
          const sourcePath = path.join(serverDir, file);
          const destPath = path.join(OUTPUT_DIR, `server-${file}`);
          await copyFile(sourcePath, destPath);
          console.log(`✅ Copied: server/${file}`);
          copiedCount++;
        }
      }
    }
  } catch (error) {
    console.error('Error searching server directory:', error);
  }

  // Parse and analyze key manifests
  console.log('\n📊 Analyzing manifests...');
  const analysis: any = {
    timestamp: new Date().toISOString(),
    nextDirExists: true,
    manifestsFound: copiedCount,
    details: {},
  };

  // Analyze build-manifest.json
  const buildManifestPath = path.join(OUTPUT_DIR, 'build-manifest.json');
  if (await fileExists(buildManifestPath)) {
    try {
      const content = await readFile(buildManifestPath, 'utf-8');
      const manifest = JSON.parse(content);

      analysis.details.buildManifest = {
        pages: Object.keys(manifest.pages || {}).length,
        devFiles: manifest.devFiles?.length || 0,
        ampDevFiles: manifest.ampDevFiles?.length || 0,
        polyfillFiles: manifest.polyfillFiles?.length || 0,
        lowPriorityFiles: manifest.lowPriorityFiles?.length || 0,
      };

      console.log(`  📄 Build Manifest: ${analysis.details.buildManifest.pages} pages`);
    } catch (error) {
      console.error('Error analyzing build-manifest.json:', error);
    }
  }

  // Analyze app-build-manifest.json
  const appManifestPath = path.join(OUTPUT_DIR, 'app-build-manifest.json');
  if (await fileExists(appManifestPath)) {
    try {
      const content = await readFile(appManifestPath, 'utf-8');
      const manifest = JSON.parse(content);

      analysis.details.appBuildManifest = {
        pages: Object.keys(manifest.pages || {}).length,
      };

      console.log(`  📱 App Build Manifest: ${analysis.details.appBuildManifest.pages} app routes`);
    } catch (error) {
      console.error('Error analyzing app-build-manifest.json:', error);
    }
  }

  // Analyze routes-manifest.json
  const routesManifestPath = path.join(OUTPUT_DIR, 'routes-manifest.json');
  if (await fileExists(routesManifestPath)) {
    try {
      const content = await readFile(routesManifestPath, 'utf-8');
      const manifest = JSON.parse(content);

      analysis.details.routesManifest = {
        version: manifest.version,
        staticRoutes: manifest.staticRoutes?.length || 0,
        dynamicRoutes: manifest.dynamicRoutes?.length || 0,
        dataRoutes: manifest.dataRoutes?.length || 0,
        i18n: !!manifest.i18n,
      };

      console.log(`  🛣️  Routes Manifest: ${analysis.details.routesManifest.staticRoutes} static routes`);
    } catch (error) {
      console.error('Error analyzing routes-manifest.json:', error);
    }
  }

  // Analyze middleware-manifest.json
  const middlewareManifestPath = path.join(OUTPUT_DIR, 'middleware-manifest.json');
  if (await fileExists(middlewareManifestPath)) {
    try {
      const content = await readFile(middlewareManifestPath, 'utf-8');
      const manifest = JSON.parse(content);

      analysis.details.middlewareManifest = {
        version: manifest.version,
        sortedMiddleware: manifest.sortedMiddleware?.length || 0,
        middleware: Object.keys(manifest.middleware || {}).length,
      };

      console.log(`  🔧 Middleware Manifest: ${analysis.details.middlewareManifest.middleware} middleware entries`);
    } catch (error) {
      console.error('Error analyzing middleware-manifest.json:', error);
    }
  }

  // Save analysis report
  const reportPath = path.join(OUTPUT_DIR, 'manifest-collection-report.json');
  await writeFile(reportPath, JSON.stringify(analysis, null, 2), 'utf-8');

  console.log(`\n✅ Manifest collection complete!`);
  console.log(`📊 Copied ${copiedCount} manifest files`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log(`📄 Report: ${reportPath}\n`);
}

// Run collection
collectManifests().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
