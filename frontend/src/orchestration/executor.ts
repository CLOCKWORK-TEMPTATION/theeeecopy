// Pipeline Orchestration Executor
// Manages execution of AI analysis pipelines with proper error handling and progress tracking

import { geminiService, type GeminiConfig } from '@/ai/gemini-service';
import { cachedGeminiCall, generateGeminiCacheKey } from '@/lib/redis';
import type { AnalysisType } from '@/types/enums';

export interface PipelineStep {
  id: string;
  name: string;
  description: string;
  type: AnalysisType;
  config: GeminiConfig;
  dependencies?: string[]; // IDs of steps this depends on
  timeout?: number; // in milliseconds
  retries?: number;
}

export interface PipelineResult {
  stepId: string;
  success: boolean;
  data?: any;
  error?: string;
  duration: number;
  cached: boolean;
}

export interface PipelineExecution {
  id: string;
  steps: PipelineStep[];
  results: Map<string, PipelineResult>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  endTime?: Date;
}

// Orchestrator class
export class PipelineOrchestrator {
  private activeExecutions = new Map<string, PipelineExecution>();

  // Execute a pipeline with dependency management
  async executePipeline(
    pipelineId: string,
    steps: PipelineStep[],
    inputData: Record<string, any>
  ): Promise<PipelineExecution> {
    const execution: PipelineExecution = {
      id: pipelineId,
      steps,
      results: new Map(),
      status: 'running',
      progress: 0,
      startTime: new Date()
    };

    this.activeExecutions.set(pipelineId, execution);

    try {
      // Build dependency graph
      const dependencyGraph = this.buildDependencyGraph(steps);

      // Execute steps in order
      const executedSteps = new Set<string>();

      for (const step of steps) {
        if (this.canExecuteStep(step, executedSteps)) {
          const result = await this.executeStep(step, inputData);
          execution.results.set(step.id, result);
          executedSteps.add(step.id);

          // Update progress
          execution.progress = (executedSteps.size / steps.length) * 100;
        } else {
          // Wait for dependencies
          await this.waitForDependencies(step, execution);
          const result = await this.executeStep(step, inputData);
          execution.results.set(step.id, result);
          executedSteps.add(step.id);
          execution.progress = (executedSteps.size / steps.length) * 100;
        }
      }

      execution.status = 'completed';
      execution.endTime = new Date();

    } catch (error) {
      execution.status = 'failed';
      execution.endTime = new Date();
      console.error('Pipeline execution failed:', error);
    }

    return execution;
  }

  // Execute individual step with caching and error handling
  private async executeStep(
    step: PipelineStep,
    inputData: Record<string, any>
  ): Promise<PipelineResult> {
    const startTime = Date.now();

    try {
      const cacheKey = generateGeminiCacheKey('analysis', {
        entityId: step.id,
        analysisType: step.type,
        options: step.config
      });

      const result = await cachedGeminiCall(
        cacheKey,
        1800, // 30 minutes TTL
        async () => {
          const model = geminiService.getModel('gemini-1.5-flash', 'analysis');

          // Build prompt based on step type and input data
          const prompt = this.buildStepPrompt(step, inputData);

          const response = await model.generateContent(prompt);
          return response.response.text();
        },
        {
          staleWhileRevalidate: true,
          staleTTL: 3600 // 1 hour stale TTL
        }
      );

      return {
        stepId: step.id,
        success: true,
        data: result,
        duration: Date.now() - startTime,
        cached: false // This would need to be determined from cache layer
      };

    } catch (error) {
      return {
        stepId: step.id,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        cached: false
      };
    }
  }

  // Build dependency graph
  private buildDependencyGraph(steps: PipelineStep[]): Map<string, string[]> {
    const graph = new Map<string, string[]>();

    for (const step of steps) {
      graph.set(step.id, step.dependencies || []);
    }

    return graph;
  }

  // Check if step can be executed
  private canExecuteStep(step: PipelineStep, executedSteps: Set<string>): boolean {
    const dependencies = step.dependencies || [];
    return dependencies.every(dep => executedSteps.has(dep));
  }

  // Wait for dependencies to complete
  private async waitForDependencies(
    step: PipelineStep,
    execution: PipelineExecution
  ): Promise<void> {
    const dependencies = step.dependencies || [];
    const checkInterval = 100; // ms
    const maxWait = 30000; // 30 seconds
    let waited = 0;

    while (waited < maxWait) {
      const allDepsCompleted = dependencies.every(dep =>
        execution.results.has(dep)
      );

      if (allDepsCompleted) {
        return;
      }

      await new Promise(resolve => setTimeout(resolve, checkInterval));
      waited += checkInterval;
    }

    throw new Error(`Dependencies not satisfied for step ${step.id}`);
  }

  // Build prompt for step execution
  private buildStepPrompt(step: PipelineStep, inputData: Record<string, any>): string {
    const basePrompts = {
      characters: 'Analyze the characters in this screenplay. Identify main characters, their traits, relationships, and character arcs.',
      themes: 'Extract and analyze the main themes and motifs in this screenplay.',
      structure: 'Analyze the dramatic structure, acts, and plot points in this screenplay.',
      screenplay: 'Review this screenplay for technical writing quality, formatting, and dramatic effectiveness.',
      quick: 'Provide a quick summary and initial impressions of this screenplay.',
      detailed: 'Provide a comprehensive analysis covering all aspects of this screenplay.',
      full: 'Perform complete analysis including characters, themes, structure, and recommendations.'
    };

    const prompt = basePrompts[step.type] || 'Analyze this content:';

    return `${prompt}\n\nContent: ${JSON.stringify(inputData)}\n\nProvide detailed analysis in Arabic.`;
  }

  // Get execution status
  getExecution(pipelineId: string): PipelineExecution | undefined {
    return this.activeExecutions.get(pipelineId);
  }

  // Cancel execution
  cancelExecution(pipelineId: string): boolean {
    const execution = this.activeExecutions.get(pipelineId);
    if (execution && execution.status === 'running') {
      execution.status = 'failed';
      execution.endTime = new Date();
      return true;
    }
    return false;
  }
}

// Export singleton instance
export const pipelineExecutor = new PipelineOrchestrator();
