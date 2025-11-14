/**
 * Core types for Drama Analyst AI Agent System
 */

/**
 * Result type for operations that can succeed or fail
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * AI Agent capabilities configuration
 */
export interface AIAgentCapabilities {
  supportsStreaming?: boolean;
  supportsMultiModal?: boolean;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
}

/**
 * AI Agent configuration
 */
export interface AIAgentConfig {
  id: string;
  name: string;
  description: string;
  modelName: string;
  capabilities?: AIAgentCapabilities;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
}
