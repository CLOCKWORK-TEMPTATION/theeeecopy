// Gemini Service Configuration and Utilities
// Provides centralized access to Gemini AI capabilities

import { GoogleGenerativeAI } from '@google/generative-ai';

// Model configurations
export interface GeminiModel {
  name: string;
  version: string;
  maxTokens: number;
  capabilities: string[];
}

export interface GeminiConfig {
  temperature: number;
  topK: number;
  topP: number;
  maxOutputTokens: number;
}

// Available Gemini models
export const GEMINI_MODELS: Record<string, GeminiModel> = {
  'gemini-1.5-flash': {
    name: 'Gemini 1.5 Flash',
    version: '1.5-flash',
    maxTokens: 1048576,
    capabilities: ['text', 'vision', 'multimodal', 'streaming']
  },
  'gemini-1.5-pro': {
    name: 'Gemini 1.5 Pro',
    version: '1.5-pro',
    maxTokens: 2097152,
    capabilities: ['text', 'vision', 'multimodal', 'streaming', 'long-context']
  },
  'gemini-pro': {
    name: 'Gemini Pro',
    version: 'pro',
    maxTokens: 32768,
    capabilities: ['text', 'multimodal']
  }
};

// Default configurations for different use cases
export const GEMINI_CONFIGS: Record<string, GeminiConfig> = {
  analysis: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048
  },
  creative: {
    temperature: 0.9,
    topK: 50,
    topP: 0.98,
    maxOutputTokens: 1024
  },
  chat: {
    temperature: 0.8,
    topK: 40,
    topP: 0.9,
    maxOutputTokens: 512
  },
  summary: {
    temperature: 0.3,
    topK: 20,
    topP: 0.8,
    maxOutputTokens: 256
  }
};

// Service class for Gemini operations
export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor(apiKey?: string) {
    if (apiKey || typeof window === 'undefined') {
      // Server-side or with explicit API key
      const key = apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
      if (key) {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        this.genAI = new GoogleGenerativeAI(key);
      }
    }
  }

  // Get model with configuration
  getModel(modelName: string = 'gemini-1.5-flash', configName: string = 'analysis') {
    if (!this.genAI) {
      throw new Error('Gemini AI not initialized');
    }

    const model = GEMINI_MODELS[modelName];
    if (!model) {
      throw new Error(`Unknown model: ${modelName}`);
    }

    const config = GEMINI_CONFIGS[configName] || GEMINI_CONFIGS.analysis;

    return this.genAI.getGenerativeModel({
      model: model.version,
      generationConfig: config
    });
  }

  // Check if service is available
  isAvailable(): boolean {
    return this.genAI !== null;
  }

  // Get available models
  getAvailableModels(): string[] {
    return Object.keys(GEMINI_MODELS);
  }

  // Get model capabilities
  getModelCapabilities(modelName: string): string[] {
    const model = GEMINI_MODELS[modelName];
    return model?.capabilities || [];
  }
}

// Export singleton instance
export const geminiService = new GeminiService();

// Utility functions
export function isGeminiAvailable(): boolean {
  return geminiService.isAvailable();
}

export function getGeminiModels(): string[] {
  return geminiService.getAvailableModels();
}

export function getModelCapabilities(modelName: string): string[] {
  return geminiService.getModelCapabilities(modelName);
}
