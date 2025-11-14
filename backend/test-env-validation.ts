import { validateEnvironment } from './src/config/validate-env';

console.log('🧪 Testing environment validation...\n');

try {
  const env = validateEnvironment();
  console.log('\n✅ Validation passed!');
  console.log('\n📋 Validated environment:');
  console.log(`  NODE_ENV: ${env.NODE_ENV}`);
  console.log(`  PORT: ${env.PORT}`);
  console.log(`  DATABASE_URL: ${env.DATABASE_URL}`);
  console.log(`  GEMINI_API_KEY: ${env.GEMINI_API_KEY ? '✓ Set' : '✗ Missing'}`);
  console.log(`  GOOGLE_GENAI_API_KEY: ${env.GOOGLE_GENAI_API_KEY ? '✓ Set' : '✗ Missing'}`);
  console.log(`  JWT_SECRET: ${env.JWT_SECRET.length} chars`);
  console.log(`  CORS_ORIGIN: ${env.CORS_ORIGIN}`);
} catch (error) {
  console.error('\n❌ Validation failed!');
  process.exit(1);
}
