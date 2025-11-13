/**
 * Project Store - Client-side state management for current project
 */

import { Project } from '@/types/api';

const CURRENT_PROJECT_KEY = 'currentProject';

/**
 * Get the current project from localStorage
 */
export function getCurrentProject(): Project | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(CURRENT_PROJECT_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to parse current project:', error);
    return null;
  }
}

/**
 * Set the current project in localStorage
 */
export function setCurrentProject(project: Project): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(CURRENT_PROJECT_KEY, JSON.stringify(project));
}

/**
 * Clear the current project from localStorage
 */
export function clearCurrentProject(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(CURRENT_PROJECT_KEY);
}

/**
 * Check if a project is the current project
 */
export function isCurrentProject(projectId: string): boolean {
  const current = getCurrentProject();
  return current?.id === projectId;
}
