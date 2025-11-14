/**
 * Type definitions for drama analysis system
 */

import { TaskType, TaskCategory, TaskStatus } from "./enums";

export type AgentId = string;

export interface ProcessedFile {
  id: string;
  name: string;
  fileName?: string; // Alias for name
  content: string;
  textContent?: string; // Text content of the file
  type: string;
  size: number;
  processedAt: Date;
}

export interface AIRequest {
  prompt: string;
  agent?: string; // Agent ID for the request
  options?: Record<string, any>; // Additional options
  context?: Record<string, any>;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  content: string;
  raw?: string; // Raw response from AI
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model?: string;
  finishReason?: string;
  metadata?: Record<string, any>;
}

export interface Task {
  id: string;
  type: TaskType;
  category: TaskCategory;
  title: string;
  description?: string;
  status: TaskStatus;
  agentId?: AgentId;
  input?: any;
  output?: any;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface Agent {
  id: AgentId;
  name: string;
  description: string;
  capabilities: string[];
  supportedTaskTypes: TaskType[];
}

export interface AnalysisResult {
  id: string;
  taskId: string;
  content: string;
  data?: Record<string, any>;
  createdAt: Date;
}
