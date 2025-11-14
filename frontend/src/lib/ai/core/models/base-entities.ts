// Base Entity Models for AI Analysis

export interface Character {
  id: string;
  name: string;
  role?: string;
  traits?: string[];
  relationships?: string[];
  arc?: string;
}

export interface Conflict {
  id?: string;
  name?: string;
  type?: string;
  subject?: string;
  strength?: number;
  scope?: string;
  involvedCharacters?: string[];
  timestamps?: Date[];
  description?: string;
  participants?: string[];
}

export interface Relationship {
  id?: string;
  source: string;
  target: string;
  type?: string;
  strength?: number;
}

export interface NetworkSnapshot {
  timestamp: Date;
  characters: Character[];
  relationships: Relationship[];
  conflicts: Conflict[];
  metrics: {
    density: number;
    centrality: Record<string, number>;
    clustering: number;
  };
}

export interface ConflictPhase {
  id: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  intensity: number;
  participants: string[];
  description: string;
}

export interface ConflictNetwork {
  characters: Map<string, Character>;
  relationships: Map<string, Relationship>;
  conflicts?: Map<string, Conflict>;
  snapshots?: NetworkSnapshot[];
  phases?: ConflictPhase[];
}

export interface Scene {
  id: string;
  title: string;
  location: string;
  timeOfDay: string;
  characters: string[];
  description?: string;
  conflicts?: string[];
}

export interface ThematicElement {
  id: string;
  name: string;
  category: 'theme' | 'motif' | 'symbol';
  description: string;
  occurrences: Array<{
    location: string;
    context: string;
    intensity: number;
  }>;
}

export interface AnalysisMetadata {
  timestamp: Date;
  version: string;
  model: string;
  confidence: number;
  processingTime: number;
}

// Factory functions
export function createCharacter(data: Partial<Character>): Character {
  return {
    id: data.id || `char_${Date.now()}`,
    name: data.name || 'Unknown Character',
    role: data.role,
    traits: data.traits || [],
    relationships: data.relationships || [],
    arc: data.arc
  };
}

export function createConflict(data: Partial<Conflict>): Conflict {
  return {
    id: data.id || `conflict_${Date.now()}`,
    name: data.name,
    type: data.type,
    subject: data.subject,
    strength: data.strength || 0,
    scope: data.scope,
    involvedCharacters: data.involvedCharacters || [],
    timestamps: data.timestamps || [],
    description: data.description,
    participants: data.participants || []
  };
}

export function createRelationship(data: Partial<Relationship>): Relationship {
  return {
    id: data.id || `rel_${Date.now()}`,
    source: data.source || '',
    target: data.target || '',
    type: data.type,
    strength: data.strength || 0
  };
}

export function createNetworkSnapshot(data: Partial<NetworkSnapshot>): NetworkSnapshot {
  return {
    timestamp: data.timestamp || new Date(),
    characters: data.characters || [],
    relationships: data.relationships || [],
    conflicts: data.conflicts || [],
    metrics: data.metrics || {
      density: 0,
      centrality: {},
      clustering: 0
    }
  };
}