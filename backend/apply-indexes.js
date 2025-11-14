const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_V8Zzg7PGoNBR@ep-ancient-mountain-a42qhkol-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function applyIndexes() {
  const sql = neon(DATABASE_URL);
  
  try {
    console.log('Applying performance indexes...');
    
    await sql`CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_projects_user_created ON projects(user_id, created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_projects_id_user ON projects(id, user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at DESC)`;
    
    await sql`CREATE INDEX IF NOT EXISTS idx_scenes_project_id ON scenes(project_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_scenes_project_number ON scenes(project_id, scene_number)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_scenes_id_project ON scenes(id, project_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_scenes_project_status ON scenes(project_id, status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_scenes_scene_number ON scenes(scene_number)`;
    
    await sql`CREATE INDEX IF NOT EXISTS idx_characters_project_id ON characters(project_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_characters_id_project ON characters(id, project_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_characters_project_name ON characters(project_id, name)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_characters_project_consistency ON characters(project_id, consistency_status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_characters_appearances ON characters(appearances DESC)`;
    
    await sql`CREATE INDEX IF NOT EXISTS idx_shots_scene_id ON shots(scene_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_shots_scene_number ON shots(scene_id, shot_number)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_shots_id_scene ON shots(id, scene_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_shots_scene_type ON shots(scene_id, shot_type)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_shots_shot_number ON shots(shot_number)`;
    
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email_lower ON users(LOWER(email))`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC)`;
    
    await sql`ANALYZE projects`;
    await sql`ANALYZE scenes`;
    await sql`ANALYZE characters`;
    await sql`ANALYZE shots`;
    await sql`ANALYZE users`;
    await sql`ANALYZE sessions`;
    
    console.log('✅ Performance indexes applied successfully!');
  } catch (error) {
    console.error('❌ Error applying indexes:', error.message);
    process.exit(1);
  }
}

applyIndexes();
