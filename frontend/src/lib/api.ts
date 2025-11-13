/**
 * API Client for Backend Communication
 * Handles all HTTP requests to the backend API
 */

import {
  ApiResponse,
  ScriptAnalysis,
  ShotSuggestionsResponse,
  ChatResponse,
  Project,
  Scene,
  Character,
  Shot,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateSceneRequest,
  UpdateSceneRequest,
  CreateCharacterRequest,
  UpdateCharacterRequest,
  CreateShotRequest,
  UpdateShotRequest,
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Analyze a script
 */
export async function analyzeScript(
  projectId: string,
  scriptContent: string
): Promise<ApiResponse<ScriptAnalysis>> {
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ projectId, scriptContent }),
  });

  if (!response.ok) {
    throw new Error(`Failed to analyze script: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get shot suggestions for a scene
 */
export async function getShotSuggestion(
  projectId: string,
  sceneId: string,
  sceneDescription: string
): Promise<ApiResponse<ShotSuggestionsResponse>> {
  const response = await fetch(`${API_BASE_URL}/api/shots/suggest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ projectId, sceneId, sceneDescription }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get shot suggestions: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Chat with AI assistant
 */
export async function chatWithAI(
  message: string,
  context?: Record<string, unknown>
): Promise<ApiResponse<ChatResponse>> {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, context }),
  });

  if (!response.ok) {
    throw new Error(`Failed to chat with AI: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Generic API request helper
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

// ============================================================================
// Projects API
// ============================================================================

export async function getProjects(): Promise<ApiResponse<Project[]>> {
  return apiRequest<Project[]>('/api/projects');
}

export async function getProject(id: string): Promise<ApiResponse<Project>> {
  return apiRequest<Project>(`/api/projects/${id}`);
}

export async function createProject(data: CreateProjectRequest): Promise<ApiResponse<Project>> {
  return apiRequest<Project>('/api/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProject(
  id: string,
  data: UpdateProjectRequest
): Promise<ApiResponse<Project>> {
  return apiRequest<Project>(`/api/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteProject(id: string): Promise<ApiResponse<void>> {
  return apiRequest<void>(`/api/projects/${id}`, {
    method: 'DELETE',
  });
}

// ============================================================================
// Scenes API
// ============================================================================

export async function getProjectScenes(projectId: string): Promise<ApiResponse<Scene[]>> {
  return apiRequest<Scene[]>(`/api/projects/${projectId}/scenes`);
}

export async function getScene(sceneId: string): Promise<ApiResponse<Scene>> {
  return apiRequest<Scene>(`/api/scenes/${sceneId}`);
}

export async function createScene(data: CreateSceneRequest): Promise<ApiResponse<Scene>> {
  return apiRequest<Scene>('/api/scenes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateScene(id: string, data: UpdateSceneRequest): Promise<ApiResponse<Scene>> {
  return apiRequest<Scene>(`/api/scenes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteScene(id: string): Promise<ApiResponse<void>> {
  return apiRequest<void>(`/api/scenes/${id}`, {
    method: 'DELETE',
  });
}

// ============================================================================
// Characters API
// ============================================================================

export async function getProjectCharacters(projectId: string): Promise<ApiResponse<Character[]>> {
  return apiRequest<Character[]>(`/api/projects/${projectId}/characters`);
}

export async function getCharacter(characterId: string): Promise<ApiResponse<Character>> {
  return apiRequest<Character>(`/api/characters/${characterId}`);
}

export async function createCharacter(data: CreateCharacterRequest): Promise<ApiResponse<Character>> {
  return apiRequest<Character>('/api/characters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCharacter(
  id: string,
  data: UpdateCharacterRequest
): Promise<ApiResponse<Character>> {
  return apiRequest<Character>(`/api/characters/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCharacter(id: string): Promise<ApiResponse<void>> {
  return apiRequest<void>(`/api/characters/${id}`, {
    method: 'DELETE',
  });
}

// ============================================================================
// Shots API
// ============================================================================

export async function getSceneShots(sceneId: string): Promise<ApiResponse<Shot[]>> {
  return apiRequest<Shot[]>(`/api/scenes/${sceneId}/shots`);
}

export async function getShot(shotId: string): Promise<ApiResponse<Shot>> {
  return apiRequest<Shot>(`/api/shots/${shotId}`);
}

export async function createShot(data: CreateShotRequest): Promise<ApiResponse<Shot>> {
  return apiRequest<Shot>('/api/shots', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateShot(id: string, data: UpdateShotRequest): Promise<ApiResponse<Shot>> {
  return apiRequest<Shot>(`/api/shots/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteShot(id: string): Promise<ApiResponse<void>> {
  return apiRequest<void>(`/api/shots/${id}`, {
    method: 'DELETE',
  });
}
