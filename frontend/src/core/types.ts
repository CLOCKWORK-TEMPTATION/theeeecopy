// Core Types for AI Agent System

export interface AIAgentConfig {
  id: string;
  name: string;
  description: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
  capabilities: string[];
  dependencies?: string[];
}

export interface AIAgentCapabilities {
  canAnalyze: boolean;
  canGenerate: boolean;
  canCritique: boolean;
  canDebate: boolean;
  supportedLanguages: string[];
  maxInputLength: number;
}

export interface StandardAgentOptions {
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
  retries?: number;
  enableCaching?: boolean;
  enableLogging?: boolean;
}

export interface StandardAgentInput {
  text: string;
  context?: Record<string, unknown>;
  options?: StandardAgentOptions;
}

export interface StandardAgentOutput {
  text: string;
  confidence: number;
  notes: any;
  metadata: {
    ragUsed?: boolean;
    critiqueIterations?: number;
    constitutionalViolations?: number;
    uncertaintyScore?: number;
    hallucinationDetected?: boolean;
    debateRounds?: number;
  };
}

export interface Result<T, E = Error> {
  success: boolean;
  data?: T;
  error?: E;
}

export enum TaskCategory {
  CORE = 'core',
  PREDICTIVE = 'predictive',
  ADVANCED_MODULES = 'advanced_modules'
}

export enum TaskType {
  CHARACTER = 'character',
  SCENE = 'scene', 
  SCRIPT = 'script',
  GENERAL = 'general',
  ANALYSIS = 'analysis',
  CREATIVE = 'creative',
  INTEGRATED = 'integrated',
  COMPLETION = 'completion',
  AUDIENCE_RESONANCE = 'audience_resonance',
  PLATFORM_ADAPTER = 'platform_adapter',
  CREATIVE_DEVELOPMENT = 'creative_development'
}

export interface AgentConfigMapping {
  path: string;
  configName: string;
}

// Utility functions
export function createResult<T>(data: T): Result<T> {
  return { success: true, data };
}

export function createError<E>(error: E): Result<never, E> {
  return { success: false, error };
}

export function isSuccess<T, E>(result: Result<T, E>): result is Result<T, E> & { success: true; data: T } {
  return result.success;
}

export function isError<T, E>(result: Result<T, E>): result is Result<T, E> & { success: false; error: E } {
  return !result.success;
}