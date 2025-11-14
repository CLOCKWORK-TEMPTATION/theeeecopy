require('dotenv').config();
const { z } = require('zod');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001').transform(Number).pipe(z.number().positive()),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  MONGODB_URI: z.string().optional(),
  GOOGLE_GENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  REDIS_URL: z.string().optional(),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  CORS_ORIGIN: z.string().min(1),
  RATE_LIMIT_WINDOW_MS: z.string().optional(),
  RATE_LIMIT_MAX_REQUESTS: z.string().optional(),
}).refine(
  (data) => {
    const hasGoogleKey = data.GOOGLE_GENAI_API_KEY && 
                        data.GOOGLE_GENAI_API_KEY !== 'your_google_genai_api_key_here';
    const hasGeminiKey = data.GEMINI_API_KEY && 
                        data.GEMINI_API_KEY !== 'your_gemini_api_key_here';
    return hasGoogleKey || hasGeminiKey;
  },
  {
    message: 'Either GOOGLE_GENAI_API_KEY or GEMINI_API_KEY must be provided',
    path: ['GOOGLE_GENAI_API_KEY'],
  }
);

console.log('🧪 Testing environment validation...\n');

try {
  const env = envSchema.parse(process.env);
  console.log('✅ Validation passed!\n');
  console.log('📋 Validated environment:');
  console.log(`  NODE_ENV: ${env.NODE_ENV}`);
  console.log(`  PORT: ${env.PORT}`);
  console.log(`  DATABASE_URL: ${env.DATABASE_URL}`);
  console.log(`  GEMINI_API_KEY: ${env.GEMINI_API_KEY ? '✓ Set' : '✗ Missing'}`);
  console.log(`  GOOGLE_GENAI_API_KEY: ${env.GOOGLE_GENAI_API_KEY ? '✓ Set' : '✗ Missing'}`);
  console.log(`  JWT_SECRET: ${env.JWT_SECRET.length} chars`);
  console.log(`  CORS_ORIGIN: ${env.CORS_ORIGIN}`);
} catch (error) {
  console.error('❌ Validation failed!');
  if (error instanceof z.ZodError) {
    error.errors.forEach(err => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
  }
  process.exit(1);
}
