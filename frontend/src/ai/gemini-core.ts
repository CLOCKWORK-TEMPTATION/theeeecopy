// Gemini AI Core Integration for Frontend
// Routes all Gemini calls through Backend API for security and caching

import { analyzeScript, getShotSuggestion, chatWithAI } from '@/lib/api';

// Core Gemini functions that call Backend API
export const geminiCore = {
  // Analyze screenplay content via Backend
  async analyzeScreenplay(content: string, analysisType: string = 'structure', projectId?: string) {
    if (!projectId) {
      throw new Error('projectId is required for screenplay analysis');
    }

    try {
      const response = await analyzeScript(projectId, content);
      return response.data;
    } catch (error) {
      console.error('Failed to analyze screenplay:', error);
      throw error;
    }
  },

  // Generate shot suggestions via Backend
  async generateShotSuggestion(sceneDescription: string, projectId?: string, sceneId?: string) {
    if (!projectId || !sceneId) {
      throw new Error('projectId and sceneId are required for shot suggestions');
    }

    try {
      const response = await getShotSuggestion(projectId, sceneId, sceneDescription);
      return response.data;
    } catch (error) {
      console.error('Failed to generate shot suggestion:', error);
      throw error;
    }
  },

  // Chat with AI via Backend
  async chatWithAI(message: string, context?: Record<string, unknown>) {
    try {
      const response = await chatWithAI(message, context);
      return response.data;
    } catch (error) {
      console.error('Failed to chat with AI:', error);
      throw error;
    }
  }
};

// Stream response for real-time updates (via Backend)
export async function streamFlash(
  prompt: string,
  onChunk?: (chunk: string) => void
): Promise<string> {
  // For now, use regular chat - streaming can be implemented later
  const response = await geminiCore.chatWithAI(prompt);

  if (onChunk) {
    onChunk(response.message || response.content || response);
  }

  return response.message || response.content || response;
}

/**
 * Convert AI response to text
 */
export function toText(response: any): string {
  if (typeof response === 'string') {
    return response;
  }
  if (response && typeof response === 'object') {
    return response.content || response.message || response.text || JSON.stringify(response);
  }
  return String(response);
}

export default geminiCore;
