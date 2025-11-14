# AGENTS.md - دليل التحكم في سلوك الوكلاء الذكيين

<div dir="rtl">

## 📖 نظرة عامة

هذا الدليل يوثق كيفية التحكم في سلوك ونتائج الوكلاء الذكيين (AI Agents) في منصة "النسخة". تستخدم المنصة نظام وكلاء متعدد المستويات لتحليل النصوص الإبداعية باستخدام Google Gemini API.

</div>

---

## Table of Contents

1. [Agent Architecture](#agent-architecture)
2. [Seven Stations Pipeline](#seven-stations-pipeline)
3. [Agent Configuration](#agent-configuration)
4. [Prompt Engineering](#prompt-engineering)
5. [Response Control](#response-control)
6. [Caching Strategies](#caching-strategies)
7. [Performance Tuning](#performance-tuning)
8. [Error Handling](#error-handling)
9. [Cost Optimization](#cost-optimization)
10. [Best Practices](#best-practices)

---

## Agent Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                        │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   UI/UX     │→→│  API Client  │→→│  State Store  │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
└────────────────────────────┬────────────────────────────┘
                             │ HTTP/WebSocket
┌────────────────────────────▼────────────────────────────┐
│                    Backend Layer                         │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────┐ │
│  │ Controllers  │→→│   Services    │→→│  Gemini API  │ │
│  └──────────────┘  └───────────────┘  └──────────────┘ │
│         ↓                  ↓                             │
│  ┌──────────────┐  ┌───────────────┐                   │
│  │ Redis Cache  │  │  BullMQ Queue │                   │
│  └──────────────┘  └───────────────┘                   │
└─────────────────────────────────────────────────────────┘
```

### Agent Types

#### 1. **Analysis Agents** (المحطات السبع)
Seven specialized agents for comprehensive dramatic analysis:

- **Station 1**: Character Analysis Agent
- **Station 2**: Conceptual Analysis Agent
- **Station 3**: Conflict Network Agent
- **Station 4**: Effectiveness Metrics Agent
- **Station 5**: Dynamics & Symbolism Agent
- **Station 6**: Red Team Critic Agent
- **Station 7**: Final Report Agent

#### 2. **Utility Agents**
- **Shot Suggestion Agent**: Generates camera angles and shot recommendations
- **Chat Agent**: Interactive AI assistant for creative guidance
- **Script Analyzer**: Extracts scenes, characters, and structure

---

## Seven Stations Pipeline

<div dir="rtl">

### المحطة 1: تحليل الشخصيات

**الوظيفة**: استخراج الشخصيات وتحليل العلاقات بينها

</div>

```typescript
// Location: backend/src/services/analysis/stations/station-1.ts
interface Station1Output {
  stationNumber: 1;
  stationName: "تحليل الشخصيات";
  status: "success" | "failed";
  characters: Array<{
    name: string;
    role: "main" | "supporting" | "minor";
    description: string;
    traits: string[];
  }>;
  relationships: Array<{
    character1: string;
    character2: string;
    type: string;
    description: string;
  }>;
}
```

**Control Parameters**:
```typescript
{
  temperature: 0.7,        // Creativity level (0-1)
  maxTokens: 2000,        // Response length limit
  topP: 0.9,              // Nucleus sampling
  topK: 40                // Top-k sampling
}
```

---

<div dir="rtl">

### المحطة 2: التحليل المفاهيمي

**الوظيفة**: استخراج المواضيع والأفكار الرئيسية

</div>

```typescript
interface Station2Output {
  stationNumber: 2;
  stationName: "التحليل المفاهيمي";
  themes: string[];
  mainIdeas: string[];
  philosophicalDimensions: string[];
}
```

**Control Parameters**:
```typescript
{
  temperature: 0.8,        // Higher for conceptual thinking
  analysisDepth: "shallow" | "medium" | "deep",
  focusAreas: ["themes", "symbols", "ideas"]
}
```

---

<div dir="rtl">

### المحطة 3: شبكة الصراعات

**الوظيفة**: تحليل الصراعات والتوترات الدرامية

</div>

```typescript
interface Station3Output {
  stationNumber: 3;
  stationName: "شبكة الصراعات";
  conflicts: Array<{
    type: "internal" | "external" | "societal";
    parties: string[];
    intensity: number; // 1-10
    resolution?: string;
  }>;
}
```

---

<div dir="rtl">

### المحطة 4: مقاييس الفعالية

**الوظيفة**: قياس جودة النص الدرامي

</div>

```typescript
interface Station4Output {
  stationNumber: 4;
  stationName: "مقاييس الفعالية";
  metrics: {
    pacing: number;           // 1-10
    characterDepth: number;   // 1-10
    dialogueQuality: number;  // 1-10
    plotCoherence: number;    // 1-10
    overallScore: number;     // 1-10
  };
  recommendations: string[];
}
```

---

<div dir="rtl">

### المحطة 5: الديناميكية والرمزية

**الوظيفة**: تحليل الرموز والدوافع النفسية

</div>

```typescript
interface Station5Output {
  stationNumber: 5;
  stationName: "الديناميكية والرمزية";
  symbols: Array<{
    symbol: string;
    meaning: string;
    occurrences: number;
  }>;
  psychologicalMotifs: string[];
}
```

---

<div dir="rtl">

### المحطة 6: الفريق الأحمر

**الوظيفة**: التحليل النقدي واكتشاف نقاط الضعف

</div>

```typescript
interface Station6Output {
  stationNumber: 6;
  stationName: "الفريق الأحمر";
  critiques: Array<{
    area: string;
    severity: "low" | "medium" | "high";
    description: string;
    suggestion: string;
  }>;
}
```

**Control Parameters**:
```typescript
{
  criticismLevel: "gentle" | "moderate" | "harsh",
  focusAreas: ["plot", "characters", "dialogue", "pacing"],
  provideSolutions: boolean
}
```

---

<div dir="rtl">

### المحطة 7: التقرير النهائي

**الوظيفة**: تلخيص شامل ونتائج متكاملة

</div>

```typescript
interface Station7Output {
  stationNumber: 7;
  stationName: "التقرير النهائي";
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  overallAssessment: string;
}
```

---

## Agent Configuration

### Environment Variables

Configure agent behavior through environment variables:

```bash
# Backend .env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-1.5-pro
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=4096
GEMINI_TIMEOUT_MS=30000

# Rate Limiting
GEMINI_MAX_REQUESTS_PER_MINUTE=60
GEMINI_MAX_REQUESTS_PER_DAY=1000

# Cost Control
GEMINI_COST_WARNING_THRESHOLD=0.80
GEMINI_COST_LIMIT_DAILY=100.00

# Caching
REDIS_URL=redis://localhost:6379
CACHE_TTL_DEFAULT=3600
CACHE_TTL_ANALYSIS=7200
CACHE_TTL_SHOTS=1800
```

### Service Configuration

```typescript
// backend/src/config/gemini.config.ts
export const geminiConfig = {
  model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',

  defaultParams: {
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 4096,
  },

  stationParams: {
    1: { temperature: 0.7, maxTokens: 2000 },  // Character Analysis
    2: { temperature: 0.8, maxTokens: 2500 },  // Conceptual
    3: { temperature: 0.7, maxTokens: 2000 },  // Conflicts
    4: { temperature: 0.6, maxTokens: 1500 },  // Metrics
    5: { temperature: 0.8, maxTokens: 2000 },  // Symbolism
    6: { temperature: 0.7, maxTokens: 2500 },  // Red Team
    7: { temperature: 0.7, maxTokens: 3000 },  // Final Report
  },

  timeouts: {
    default: 30000,
    analysis: 60000,
    longRunning: 120000,
  },

  retryPolicy: {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  },
};
```

---

## Prompt Engineering

### Prompt Structure

All prompts follow a consistent structure:

```typescript
interface PromptTemplate {
  systemInstruction: string;  // Agent role and behavior
  context: string;            // Task context
  input: string;              // User input/script
  constraints: string[];      // Output constraints
  examples?: string;          // Few-shot examples
  format: string;             // Expected output format
}
```

### Customizing Prompts

#### Location
```
backend/src/services/gemini/prompts/
├── analysis/
│   ├── station-1-characters.prompt.ts
│   ├── station-2-concepts.prompt.ts
│   ├── station-3-conflicts.prompt.ts
│   ├── station-4-metrics.prompt.ts
│   ├── station-5-symbolism.prompt.ts
│   ├── station-6-redteam.prompt.ts
│   └── station-7-summary.prompt.ts
├── shots/
│   └── shot-suggestion.prompt.ts
└── chat/
    └── creative-assistant.prompt.ts
```

#### Example: Customizing Station 1 Prompt

```typescript
// backend/src/services/gemini/prompts/analysis/station-1-characters.prompt.ts

export const buildStation1Prompt = (scriptText: string, options?: {
  focusLevel?: 'main' | 'all';
  includeSubtext?: boolean;
  language?: 'ar' | 'en';
}) => {
  const focusInstruction = options?.focusLevel === 'main'
    ? 'ركز على الشخصيات الرئيسية فقط'
    : 'قم بتحليل جميع الشخصيات بما فيها الثانوية';

  const subtextInstruction = options?.includeSubtext
    ? 'قم بتحليل النص الضمني والدوافع الخفية'
    : '';

  return `
أنت محلل درامي متخصص في تحليل الشخصيات.

**المهمة**: تحليل الشخصيات في النص التالي واستخراج:
1. أسماء الشخصيات وأدوارها
2. الصفات المميزة لكل شخصية
3. العلاقات بين الشخصيات
4. التطور الدرامي للشخصيات

**التعليمات**:
- ${focusInstruction}
- ${subtextInstruction}
- استخدم اللغة العربية الفصحى
- كن دقيقاً ومحدداً في التحليل

**النص المطلوب تحليله**:
${scriptText}

**التنسيق المطلوب**: JSON
`;
};
```

---

## Response Control

### Output Formatting

Control response format through structured prompts:

```typescript
// Structured JSON Output
export const enforceJSONOutput = (prompt: string) => {
  return `${prompt}

**مهم جداً**: يجب أن يكون الناتج بصيغة JSON صالحة فقط، بدون أي نص إضافي قبل أو بعد JSON.

مثال للتنسيق المطلوب:
{
  "characters": [...],
  "relationships": [...]
}
`;
};

// Markdown Output
export const enforceMarkdownOutput = (prompt: string) => {
  return `${prompt}

**التنسيق المطلوب**: استخدم Markdown مع:
- عناوين واضحة (##، ###)
- قوائم نقطية (-)
- جداول عند الحاجة
- تنسيق غامق للنقاط المهمة (**نص**)
`;
};
```

### Response Validation

```typescript
// backend/src/services/gemini/validators/response.validator.ts
import { z } from 'zod';

export const validateStation1Response = z.object({
  characters: z.array(z.object({
    name: z.string(),
    role: z.enum(['main', 'supporting', 'minor']),
    description: z.string(),
    traits: z.array(z.string()),
  })),
  relationships: z.array(z.object({
    character1: z.string(),
    character2: z.string(),
    type: z.string(),
    description: z.string(),
  })),
});

// Usage
const validateAndParse = (response: string) => {
  try {
    const parsed = JSON.parse(response);
    return validateStation1Response.parse(parsed);
  } catch (error) {
    throw new Error('Invalid response format from Gemini');
  }
};
```

### Fallback Strategies

```typescript
// backend/src/services/gemini/fallback.strategy.ts

export class FallbackStrategy {
  async executeWithFallback<T>(
    primaryFn: () => Promise<T>,
    fallbackFn?: () => Promise<T>,
    defaultValue?: T
  ): Promise<T> {
    try {
      return await primaryFn();
    } catch (error) {
      console.warn('Primary execution failed, trying fallback', error);

      if (fallbackFn) {
        try {
          return await fallbackFn();
        } catch (fallbackError) {
          console.error('Fallback also failed', fallbackError);
        }
      }

      if (defaultValue !== undefined) {
        return defaultValue;
      }

      throw error;
    }
  }
}

// Usage
const result = await fallbackStrategy.executeWithFallback(
  () => geminiService.analyze(text, { station: 1 }),
  () => geminiService.analyze(text, { station: 1, temperature: 0.5 }),
  { characters: [], relationships: [] }
);
```

---

## Caching Strategies

### Cache Architecture

```typescript
// backend/src/services/cache/cache.strategy.ts

export class CacheStrategy {
  constructor(
    private redis: RedisClient,
    private config: CacheConfig
  ) {}

  // Adaptive TTL based on content type
  getTTL(type: CacheType): number {
    const ttls = {
      'analysis': 7200,      // 2 hours
      'shot-suggestion': 1800, // 30 minutes
      'chat': 600,           // 10 minutes
      'characters': 3600,    // 1 hour
    };
    return ttls[type] || this.config.defaultTTL;
  }

  // Generate cache key
  generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${JSON.stringify(params[key])}`)
      .join('|');

    return `${prefix}:${hashString(sortedParams)}`;
  }

  // Stale-while-revalidate pattern
  async getWithRevalidation<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number
  ): Promise<T> {
    const cached = await this.redis.get(key);

    if (cached) {
      const { value, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;

      // If stale, trigger background refresh
      if (age > ttl * 0.8) {
        this.refreshInBackground(key, fetchFn, ttl);
      }

      return value;
    }

    // No cache, fetch and store
    const value = await fetchFn();
    await this.set(key, value, ttl);
    return value;
  }

  private async refreshInBackground<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number
  ): Promise<void> {
    try {
      const value = await fetchFn();
      await this.set(key, value, ttl);
    } catch (error) {
      console.error('Background refresh failed', error);
    }
  }
}
```

### Cache Invalidation

```typescript
// backend/src/services/cache/invalidation.strategy.ts

export class CacheInvalidation {
  // Invalidate specific patterns
  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  // Invalidate related caches
  async invalidateRelated(entity: string, id: string): Promise<void> {
    const patterns = [
      `analysis:${entity}:${id}:*`,
      `shot-suggestion:${entity}:${id}:*`,
      `characters:${entity}:${id}:*`,
    ];

    await Promise.all(
      patterns.map(pattern => this.invalidatePattern(pattern))
    );
  }

  // Time-based invalidation
  async invalidateOlderThan(seconds: number): Promise<void> {
    const cutoff = Date.now() - (seconds * 1000);
    const keys = await this.redis.keys('*');

    for (const key of keys) {
      const cached = await this.redis.get(key);
      if (cached) {
        const { timestamp } = JSON.parse(cached);
        if (timestamp < cutoff) {
          await this.redis.del(key);
        }
      }
    }
  }
}
```

---

## Performance Tuning

### Request Batching

```typescript
// backend/src/services/gemini/batch.processor.ts

export class BatchProcessor {
  private queue: Array<{
    id: string;
    prompt: string;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  private batchSize = 5;
  private batchTimeout = 1000; // ms

  async process(prompt: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        id: generateId(),
        prompt,
        resolve,
        reject,
      });

      if (this.queue.length >= this.batchSize) {
        this.flush();
      } else {
        this.scheduleFlush();
      }
    });
  }

  private async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const batch = this.queue.splice(0, this.batchSize);

    try {
      const results = await Promise.all(
        batch.map(item =>
          this.geminiService.generate(item.prompt)
        )
      );

      batch.forEach((item, index) => {
        item.resolve(results[index]);
      });
    } catch (error) {
      batch.forEach(item => item.reject(error));
    }
  }

  private scheduleFlush(): void {
    setTimeout(() => this.flush(), this.batchTimeout);
  }
}
```

### Async Processing with BullMQ

```typescript
// backend/src/queues/analysis.queue.ts

import { Queue, Worker } from 'bullmq';

export class AnalysisQueue {
  private queue: Queue;
  private worker: Worker;

  constructor(redis: RedisOptions) {
    this.queue = new Queue('analysis', { connection: redis });

    this.worker = new Worker(
      'analysis',
      async (job) => {
        const { scriptId, scriptText } = job.data;

        // Update progress
        await job.updateProgress(0);

        const results = [];
        for (let station = 1; station <= 7; station++) {
          const result = await this.analysisService.runStation(
            station,
            scriptText
          );
          results.push(result);

          // Update progress
          await job.updateProgress((station / 7) * 100);
        }

        return { scriptId, results };
      },
      { connection: redis }
    );
  }

  async enqueue(scriptId: string, scriptText: string): Promise<string> {
    const job = await this.queue.add(
      'analyze-script',
      { scriptId, scriptText },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      }
    );

    return job.id;
  }

  async getStatus(jobId: string) {
    const job = await this.queue.getJob(jobId);
    if (!job) return null;

    const state = await job.getState();
    const progress = job.progress;

    return { state, progress };
  }
}
```

### Streaming Responses

```typescript
// backend/src/services/gemini/streaming.service.ts

export class StreamingService {
  async streamAnalysis(
    scriptText: string,
    onChunk: (chunk: PartialAnalysisResult) => void
  ): Promise<void> {
    const stream = await this.geminiService.generateContentStream({
      prompt: this.buildPrompt(scriptText),
    });

    for await (const chunk of stream) {
      const partialResult = this.parsePartialResponse(chunk);
      onChunk(partialResult);
    }
  }
}

// Usage in Controller
export class AnalysisController {
  async streamAnalysis(req: Request, res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const { scriptText } = req.body;

    await this.streamingService.streamAnalysis(
      scriptText,
      (chunk) => {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
    );

    res.end();
  }
}
```

---

## Error Handling

### Error Types

```typescript
// backend/src/errors/gemini.errors.ts

export class GeminiError extends Error {
  constructor(
    message: string,
    public code: string,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'GeminiError';
  }
}

export class RateLimitError extends GeminiError {
  constructor(retryAfter?: number) {
    super(
      `Rate limit exceeded${retryAfter ? `, retry after ${retryAfter}s` : ''}`,
      'RATE_LIMIT_EXCEEDED',
      true
    );
    this.retryAfter = retryAfter;
  }

  retryAfter?: number;
}

export class InvalidResponseError extends GeminiError {
  constructor(response: string) {
    super('Invalid response format from Gemini', 'INVALID_RESPONSE', false);
    this.response = response;
  }

  response: string;
}

export class TimeoutError extends GeminiError {
  constructor(timeoutMs: number) {
    super(`Request timed out after ${timeoutMs}ms`, 'TIMEOUT', true);
  }
}
```

### Error Recovery

```typescript
// backend/src/services/gemini/error-recovery.service.ts

export class ErrorRecoveryService {
  async executeWithRetry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const {
      maxRetries = 3,
      initialDelay = 1000,
      maxDelay = 10000,
      backoffMultiplier = 2,
    } = options;

    let lastError: Error;
    let delay = initialDelay;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        // Don't retry non-retryable errors
        if (error instanceof GeminiError && !error.retryable) {
          throw error;
        }

        // Last attempt, throw error
        if (attempt === maxRetries) {
          throw error;
        }

        // Wait before retry
        await this.sleep(Math.min(delay, maxDelay));
        delay *= backoffMultiplier;

        console.warn(`Retry attempt ${attempt + 1}/${maxRetries}`, error);
      }
    }

    throw lastError!;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### Circuit Breaker

```typescript
// backend/src/services/gemini/circuit-breaker.ts

export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime?: number;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000 // 1 minute
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime! > this.timeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.threshold) {
      this.state = 'open';
      console.error('Circuit breaker opened due to multiple failures');
    }
  }
}
```

---

## Cost Optimization

### Token Counting

```typescript
// backend/src/services/gemini/token-counter.ts

export class TokenCounter {
  // Approximate token count (1 token ≈ 4 characters for English, 2-3 for Arabic)
  estimateTokens(text: string, language: 'ar' | 'en' = 'ar'): number {
    const charsPerToken = language === 'ar' ? 2.5 : 4;
    return Math.ceil(text.length / charsPerToken);
  }

  // Calculate cost
  calculateCost(inputTokens: number, outputTokens: number): number {
    // Gemini pricing (example)
    const inputCostPer1k = 0.00025;  // $0.00025 per 1k input tokens
    const outputCostPer1k = 0.0005;   // $0.0005 per 1k output tokens

    const inputCost = (inputTokens / 1000) * inputCostPer1k;
    const outputCost = (outputTokens / 1000) * outputCostPer1k;

    return inputCost + outputCost;
  }
}
```

### Cost Monitoring

```typescript
// backend/src/services/monitoring/cost-monitor.ts

export class CostMonitor {
  private dailyCost = 0;
  private dailyLimit: number;
  private warningThreshold: number;

  constructor() {
    this.dailyLimit = parseFloat(process.env.GEMINI_COST_LIMIT_DAILY || '100');
    this.warningThreshold = parseFloat(process.env.GEMINI_COST_WARNING_THRESHOLD || '0.8');
  }

  async trackRequest(
    inputTokens: number,
    outputTokens: number
  ): Promise<void> {
    const cost = this.tokenCounter.calculateCost(inputTokens, outputTokens);
    this.dailyCost += cost;

    // Store in Redis for persistence
    await this.redis.incrByFloat('gemini:daily-cost', cost);

    // Check thresholds
    if (this.dailyCost >= this.dailyLimit) {
      throw new Error('Daily cost limit exceeded');
    }

    if (this.dailyCost >= this.dailyLimit * this.warningThreshold) {
      console.warn(`Cost warning: ${this.dailyCost}/${this.dailyLimit}`);
      this.sendCostAlert('warning');
    }

    // Log metrics
    await this.metricsService.recordMetric('gemini_cost', cost, {
      type: 'incremental',
      timestamp: Date.now(),
    });
  }

  async resetDailyCost(): Promise<void> {
    this.dailyCost = 0;
    await this.redis.set('gemini:daily-cost', 0);
  }

  // Run this daily via cron
  async getDailyReport(): Promise<CostReport> {
    const totalCost = await this.redis.get('gemini:daily-cost');
    const requestCount = await this.redis.get('gemini:daily-requests');

    return {
      date: new Date().toISOString().split('T')[0],
      totalCost: parseFloat(totalCost || '0'),
      requestCount: parseInt(requestCount || '0'),
      averageCostPerRequest: parseFloat(totalCost || '0') / parseInt(requestCount || '1'),
    };
  }
}
```

### Smart Prompt Optimization

```typescript
// backend/src/services/gemini/prompt-optimizer.ts

export class PromptOptimizer {
  // Reduce prompt size while maintaining quality
  optimizePrompt(prompt: string, maxTokens: number): string {
    const currentTokens = this.tokenCounter.estimateTokens(prompt);

    if (currentTokens <= maxTokens) {
      return prompt;
    }

    // Remove examples if needed
    let optimized = this.removeExamples(prompt);

    if (this.tokenCounter.estimateTokens(optimized) <= maxTokens) {
      return optimized;
    }

    // Shorten instructions
    optimized = this.shortenInstructions(optimized);

    if (this.tokenCounter.estimateTokens(optimized) <= maxTokens) {
      return optimized;
    }

    // Truncate input text (last resort)
    return this.truncateInput(optimized, maxTokens);
  }

  private removeExamples(prompt: string): string {
    return prompt.replace(/\*\*أمثلة\*\*:[\s\S]*?(?=\*\*|$)/g, '');
  }

  private shortenInstructions(prompt: string): string {
    // Implement instruction shortening logic
    return prompt;
  }

  private truncateInput(prompt: string, maxTokens: number): string {
    const sections = this.splitPrompt(prompt);
    const targetLength = Math.floor(maxTokens * 2.5); // Convert tokens to chars

    sections.input = sections.input.substring(0, targetLength);

    return this.joinPromptSections(sections);
  }
}
```

---

## Best Practices

### 1. **Prompt Design**

✅ **DO**:
- Use clear, specific instructions in Arabic
- Provide examples for complex tasks
- Specify output format explicitly (JSON/Markdown)
- Include constraints (length, style, tone)
- Use system instructions to define agent personality

❌ **DON'T**:
- Use ambiguous or vague instructions
- Mix multiple unrelated tasks in one prompt
- Assume the model knows your specific domain
- Forget to specify the language (Arabic/English)

### 2. **Performance**

✅ **DO**:
- Cache frequent requests
- Use async processing for long tasks
- Implement request batching
- Stream responses for better UX
- Monitor token usage and costs

❌ **DON'T**:
- Make synchronous calls for long analyses
- Ignore cache invalidation
- Process all stations sequentially if parallel is possible
- Forget timeout handling

### 3. **Error Handling**

✅ **DO**:
- Implement retry logic with exponential backoff
- Use circuit breakers for external services
- Provide fallback responses
- Log errors with context
- Validate responses before returning

❌ **DON'T**:
- Retry non-retryable errors
- Expose internal errors to users
- Ignore rate limits
- Skip response validation

### 4. **Cost Management**

✅ **DO**:
- Set daily/monthly budgets
- Monitor costs in real-time
- Optimize prompts for token efficiency
- Use appropriate model sizes
- Implement rate limiting

❌ **DON'T**:
- Allow unlimited API calls
- Ignore token counts
- Use expensive models for simple tasks
- Skip cost alerts

### 5. **Testing**

✅ **DO**:
- Test prompts with various inputs
- Validate response formats
- Mock Gemini responses in tests
- Test error scenarios
- Monitor response quality

❌ **DON'T**:
- Skip integration tests
- Ignore edge cases
- Test only happy paths
- Forget to test timeouts

---

## Configuration Examples

### Development Environment

```bash
# backend/.env.development
GEMINI_MODEL=gemini-1.5-flash
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=2048
GEMINI_TIMEOUT_MS=15000
CACHE_TTL_DEFAULT=300
CACHE_ENABLED=true
QUEUE_ENABLED=false
```

### Production Environment

```bash
# backend/.env.production
GEMINI_MODEL=gemini-1.5-pro
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=4096
GEMINI_TIMEOUT_MS=30000
CACHE_TTL_DEFAULT=3600
CACHE_ENABLED=true
QUEUE_ENABLED=true
GEMINI_MAX_REQUESTS_PER_MINUTE=60
GEMINI_COST_LIMIT_DAILY=100.00
RATE_LIMIT_ENABLED=true
```

### Testing Environment

```bash
# backend/.env.test
GEMINI_MODEL=gemini-1.5-flash
GEMINI_MOCK_ENABLED=true
CACHE_ENABLED=false
QUEUE_ENABLED=false
RATE_LIMIT_ENABLED=false
```

---

## Monitoring & Metrics

### Key Metrics to Track

```typescript
// backend/src/services/monitoring/metrics.service.ts

export class MetricsService {
  async recordMetrics(operation: string, data: {
    duration: number;
    inputTokens: number;
    outputTokens: number;
    cacheHit: boolean;
    cost: number;
  }) {
    // Prometheus metrics
    this.prometheus.histogram('gemini_request_duration', data.duration, {
      operation,
    });

    this.prometheus.counter('gemini_tokens_total', data.inputTokens + data.outputTokens, {
      type: 'total',
      operation,
    });

    this.prometheus.counter('gemini_cache_hits', data.cacheHit ? 1 : 0, {
      operation,
    });

    this.prometheus.gauge('gemini_daily_cost', data.cost);

    // Sentry performance tracking
    Sentry.startSpan({
      op: 'gemini.request',
      name: operation,
    }, async () => {
      // Request tracking
    });
  }
}
```

### Dashboard Queries

```promql
# Average response time
rate(gemini_request_duration_sum[5m]) / rate(gemini_request_duration_count[5m])

# Cache hit rate
rate(gemini_cache_hits[5m]) / rate(gemini_requests_total[5m])

# Daily cost
sum(increase(gemini_daily_cost[1d]))

# Error rate
rate(gemini_errors_total[5m]) / rate(gemini_requests_total[5m])
```

---

## Troubleshooting

### Common Issues

#### 1. Rate Limiting

**Symptom**: `429 Too Many Requests` errors

**Solution**:
```typescript
// Implement exponential backoff
await this.errorRecovery.executeWithRetry(
  () => geminiService.generate(prompt),
  {
    maxRetries: 5,
    initialDelay: 2000,
    maxDelay: 30000,
  }
);
```

#### 2. Timeout Errors

**Symptom**: Requests hanging or timing out

**Solution**:
```typescript
// Use queue for long-running tasks
const jobId = await this.analysisQueue.enqueue(scriptId, scriptText);

// Return job ID immediately, poll for results
return { jobId, status: 'processing' };
```

#### 3. Invalid Response Format

**Symptom**: JSON parsing errors

**Solution**:
```typescript
// Add response validation and cleanup
const cleanResponse = response
  .replace(/```json\n/g, '')
  .replace(/```\n/g, '')
  .trim();

const validated = validateStation1Response.parse(JSON.parse(cleanResponse));
```

#### 4. High Costs

**Symptom**: Unexpected high API costs

**Solution**:
- Enable aggressive caching
- Reduce max_tokens
- Use flash model for non-critical tasks
- Implement request quotas per user

---

## Resources

### Documentation
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Backend Documentation](./backend/BACKEND_DOCUMENTATION.md)
- [Performance Optimization](./docs/performance-optimization/README.md)

### Code Locations
- **Services**: `backend/src/services/gemini/`
- **Controllers**: `backend/src/controllers/`
- **Types**: `backend/src/types/gemini.types.ts`
- **Config**: `backend/src/config/gemini.config.ts`

### Support
- GitHub Issues: [Report a bug](https://github.com/your-username/the-copy/issues)
- Documentation: [/docs](/docs)

---

<div dir="rtl">

## الخلاصة

هذا الدليل يوفر إطاراً شاملاً للتحكم في سلوك ونتائج الوكلاء الذكيين في منصة "النسخة". باتباع أفضل الممارسات المذكورة، يمكنك:

- ✅ تحسين جودة التحليلات الدرامية
- ✅ تقليل التكاليف التشغيلية
- ✅ تحسين الأداء والاستجابة
- ✅ ضمان الموثوقية والاستقرار
- ✅ توفير تجربة مستخدم متميزة

للمزيد من المعلومات أو المساعدة، راجع الوثائق التقنية أو تواصل مع فريق التطوير.

</div>

---

**Version**: 1.0.0
**Last Updated**: 2025-11-14
**Maintainer**: The Copy Team
