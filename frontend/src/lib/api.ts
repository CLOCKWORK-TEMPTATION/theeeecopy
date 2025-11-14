/**
 * API functions for AI services
 */

export async function analyzeScript(projectId: string, script: string): Promise<any> {
  const response = await fetch("/api/cineai/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectId, script }),
  });

  if (!response.ok) {
    throw new Error(`Analysis failed: ${response.statusText}`);
  }

  return response.json();
}

export async function getShotSuggestion(
  projectId: string,
  sceneId: string,
  sceneDescription: string
): Promise<any> {
  const response = await fetch("/api/cineai/generate-shots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectId, sceneId, sceneDescription }),
  });

  if (!response.ok) {
    throw new Error(`Shot suggestion failed: ${response.statusText}`);
  }

  return response.json();
}

export async function chatWithAI(message: string, projectId?: string, context?: any): Promise<any> {
  const response = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, projectId, context }),
  });

  if (!response.ok) {
    throw new Error(`Chat failed: ${response.statusText}`);
  }

  return response.json();
}

// Project API functions
export async function getProjects(): Promise<any> {
  const response = await fetch("/api/projects");
  if (!response.ok) throw new Error("Failed to fetch projects");
  return response.json();
}

export async function getProject(id: string): Promise<any> {
  const response = await fetch(`/api/projects/${id}`);
  if (!response.ok) throw new Error("Failed to fetch project");
  return response.json();
}

export async function createProject(data: any): Promise<any> {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create project");
  return response.json();
}

export async function updateProject(id: string, data: any): Promise<any> {
  const response = await fetch(`/api/projects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update project");
  return response.json();
}

export async function deleteProject(id: string): Promise<any> {
  const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete project");
  return response.json();
}

// Scene API functions
export async function getProjectScenes(projectId: string): Promise<any> {
  const response = await fetch(`/api/projects/${projectId}/scenes`);
  if (!response.ok) throw new Error("Failed to fetch scenes");
  return response.json();
}

export async function createScene(projectId: string, data: any): Promise<any> {
  const response = await fetch(`/api/projects/${projectId}/scenes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create scene");
  return response.json();
}

export async function updateScene(projectId: string, sceneId: string, data: any): Promise<any> {
  const response = await fetch(`/api/projects/${projectId}/scenes/${sceneId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update scene");
  return response.json();
}

export async function deleteScene(projectId: string, sceneId: string): Promise<any> {
  const response = await fetch(`/api/projects/${projectId}/scenes/${sceneId}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete scene");
  return response.json();
}

// Character API functions
export async function getProjectCharacters(projectId: string): Promise<any> {
  const response = await fetch(`/api/projects/${projectId}/characters`);
  if (!response.ok) throw new Error("Failed to fetch characters");
  return response.json();
}

export async function createCharacter(projectId: string, data: any): Promise<any> {
  const response = await fetch(`/api/projects/${projectId}/characters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create character");
  return response.json();
}

export async function updateCharacter(projectId: string, characterId: string, data: any): Promise<any> {
  const response = await fetch(`/api/projects/${projectId}/characters/${characterId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update character");
  return response.json();
}

export async function deleteCharacter(projectId: string, characterId: string): Promise<any> {
  const response = await fetch(`/api/projects/${projectId}/characters/${characterId}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete character");
  return response.json();
}

// Shot API functions
export async function getSceneShots(projectId: string, sceneId: string): Promise<any> {
  const response = await fetch(`/api/projects/${projectId}/scenes/${sceneId}/shots`);
  if (!response.ok) throw new Error("Failed to fetch shots");
  return response.json();
}

export async function createShot(projectId: string, sceneId: string, data: any): Promise<any> {
  const response = await fetch(`/api/projects/${projectId}/scenes/${sceneId}/shots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create shot");
  return response.json();
}

export async function updateShot(projectId: string, sceneId: string, shotId: string, data: any): Promise<any> {
  const response = await fetch(`/api/projects/${projectId}/scenes/${sceneId}/shots/${shotId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update shot");
  return response.json();
}

export async function deleteShot(projectId: string, sceneId: string, shotId: string): Promise<any> {
  const response = await fetch(`/api/projects/${projectId}/scenes/${sceneId}/shots/${shotId}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete shot");
  return response.json();
}

// Export all functions as a namespace for wildcard imports
export default {
  analyzeScript,
  getShotSuggestion,
  chatWithAI,
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectScenes,
  createScene,
  updateScene,
  deleteScene,
  getProjectCharacters,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  getSceneShots,
  createShot,
  updateShot,
  deleteShot,
};
