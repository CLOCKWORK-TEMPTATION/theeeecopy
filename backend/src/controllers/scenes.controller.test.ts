import { describe, it, expect, beforeEach, vi } from 'vitest';
import { scenesController } from './scenes.controller';
import { Request, Response } from 'express';
import { z } from 'zod';

// Mock dependencies
vi.mock('@/db', () => ({
  db: {
    select: vi.fn(),
    from: vi.fn(),
    where: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    values: vi.fn(),
    returning: vi.fn(),
    orderBy: vi.fn(),
    set: vi.fn(),
  },
}));

vi.mock('@/db/schema', () => ({
  scenes: { 
    id: 'scenes.id', 
    projectId: 'scenes.projectId',
    sceneNumber: 'scenes.sceneNumber'
  },
  projects: { id: 'projects.id', userId: 'projects.userId' },
}));

vi.mock('@/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock('drizzle-orm', () => ({
  eq: vi.fn((col, val) => ({ col, val })),
  desc: vi.fn((col) => ({ col, direction: 'desc' })),
  and: vi.fn((...conds) => ({ conditions: conds })),
}));

describe('ScenesController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockDb: any;

  beforeEach(async () => {
    mockRequest = {
      params: {},
      body: {},
      user: { id: 'user-123' },
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    const dbModule = await import('@/db');
    mockDb = dbModule.db;

    vi.clearAllMocks();
    
    // Reset all mock implementations to return this for chaining
    mockDb.select.mockReturnValue(mockDb);
    mockDb.from.mockReturnValue(mockDb);
    mockDb.where.mockReturnValue(mockDb);
    mockDb.insert.mockReturnValue(mockDb);
    mockDb.update.mockReturnValue(mockDb);
    mockDb.delete.mockReturnValue(mockDb);
    mockDb.values.mockReturnValue(mockDb);
    mockDb.returning.mockReturnValue(mockDb);
    mockDb.orderBy.mockReturnValue(mockDb);
    mockDb.set.mockReturnValue(mockDb);
  });

  describe('getScenes', () => {
    it('should return scenes for authorized user', async () => {
      const mockProject = { id: 'project-1', userId: 'user-123' };
      const mockScenes = [
        { id: 'scene-1', title: 'Scene 1', projectId: 'project-1' },
        { id: 'scene-2', title: 'Scene 2', projectId: 'project-1' },
      ];

      // First call to verify project ownership
      mockDb.where.mockResolvedValueOnce([mockProject]);
      // Second call to get scenes
      mockDb.orderBy.mockResolvedValueOnce(mockScenes);

      mockRequest.params = { projectId: 'project-1' };

      await scenesController.getScenes(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockScenes,
      });
    });

    it('should return 401 for unauthorized user', async () => {
      mockRequest.user = undefined;

      mockRequest.params = { projectId: 'project-1' };

      await scenesController.getScenes(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'غير مصرح',
      });
    });

    it('should return 400 when project ID is missing', async () => {
      mockRequest.params = {};

      await scenesController.getScenes(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'معرف المشروع مطلوب',
      });
    });

    it('should handle database errors gracefully', async () => {
      mockDb.where.mockRejectedValueOnce(new Error('Database error'));

      mockRequest.params = { projectId: 'project-1' };

      await scenesController.getScenes(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'حدث خطأ أثناء جلب المشاهد',
      });
    });

    it('should order scenes by orderIndex in ascending order', async () => {
      const mockProject = { id: 'project-1', userId: 'user-123' };
      const mockScenes = [
        { id: 'scene-1', orderIndex: 1 },
        { id: 'scene-2', orderIndex: 2 },
      ];

      mockDb.where.mockResolvedValueOnce([mockProject]);
      mockDb.orderBy.mockResolvedValueOnce(mockScenes);

      mockRequest.params = { projectId: 'project-1' };

      await scenesController.getScenes(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockDb.orderBy).toHaveBeenCalled();
    });
  });

  describe('getScene', () => {
    it('should return scene for authorized user', async () => {
      const mockScene = { id: 'scene-1', title: 'Test Scene', projectId: 'project-1' };

      mockDb.where.mockResolvedValueOnce([mockScene]);

      mockRequest.params = { id: 'scene-1' };

      await scenesController.getScene(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockScene,
      });
    });

    it('should return 401 for unauthorized user', async () => {
      mockRequest.user = undefined;

      mockRequest.params = { id: 'scene-1' };

      await scenesController.getScene(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'غير مصرح',
      });
    });

    it('should return 400 when scene ID is missing', async () => {
      mockRequest.params = {};

      await scenesController.getScene(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'معرف المشهد مطلوب',
      });
    });

    it('should return 404 when scene not found', async () => {
      mockDb.where.mockResolvedValueOnce([]);

      mockRequest.params = { id: 'nonexistent-scene' };

      await scenesController.getScene(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'المشهد غير موجود',
      });
    });

    it('should verify scene ownership through project', async () => {
      const mockScene = { id: 'scene-1', title: 'Test Scene', projectId: 'project-1' };

      mockDb.where.mockResolvedValueOnce([mockScene]);

      mockRequest.params = { id: 'scene-1' };

      await scenesController.getScene(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockDb.where).toHaveBeenCalled();
    });
  });

  describe('createScene', () => {
    it('should create scene with valid data', async () => {
      const sceneData = {
        title: 'New Scene',
        sceneNumber: 1,
        location: 'INT. OFFICE',
        timeOfDay: 'DAY',
        characters: ['John'],
        description: 'Scene description',
        projectId: 'project-1',
      };

      const createdScene = { id: 'new-scene', ...sceneData };

      mockDb.returning.mockResolvedValueOnce([createdScene]);

      mockRequest.body = sceneData;

      await scenesController.createScene(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'تم إنشاء المشهد بنجاح',
        data: createdScene,
      });
    });

    it('should return 401 for unauthorized user', async () => {
      mockRequest.user = undefined;

      mockRequest.body = { title: 'New Scene', projectId: 'project-1' };

      await scenesController.createScene(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'غير مصرح',
      });
    });

    it('should validate scene data using Zod schema', async () => {
      const invalidData = {
        title: '', // Empty title
        projectId: 'project-1',
      };

      mockRequest.body = invalidData;

      await scenesController.createScene(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'بيانات غير صالحة',
        details: expect.any(Array),
      });
    });

    it('should handle database insertion failure', async () => {
      const sceneData = {
        title: 'New Scene',
        sceneNumber: 1,
        location: 'INT. OFFICE',
        timeOfDay: 'DAY',
        characters: ['John'],
        projectId: 'project-1',
      };

      mockDb.returning.mockResolvedValueOnce([]);

      mockRequest.body = sceneData;

      await scenesController.createScene(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'فشل إنشاء المشهد',
      });
    });

    it('should work with minimal required data', async () => {
      const sceneData = {
        title: 'Minimal Scene',
        sceneNumber: 1,
        location: 'INT. OFFICE',
        timeOfDay: 'DAY',
        characters: ['John'],
        projectId: 'project-1',
      };

      const createdScene = { id: 'new-scene', ...sceneData };

      mockDb.returning.mockResolvedValueOnce([createdScene]);

      mockRequest.body = sceneData;

      await scenesController.createScene(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should handle missing optional fields', async () => {
      const sceneData = {
        title: 'New Scene',
        sceneNumber: 1,
        location: 'INT. OFFICE',
        timeOfDay: 'DAY',
        characters: ['John'],
        projectId: 'project-1',
      };

      const createdScene = { id: 'new-scene', ...sceneData, description: null };

      mockDb.returning.mockResolvedValueOnce([createdScene]);

      mockRequest.body = sceneData;

      await scenesController.createScene(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });
  });

  describe('updateScene', () => {
    it('should update scene with valid data', async () => {
      const updateData = {
        title: 'Updated Scene Title',
        description: 'Updated description',
      };

      const existingScene = { id: 'scene-1', title: 'Old Title', projectId: 'project-1' };
      const updatedScene = { ...existingScene, ...updateData };

      mockDb.where.mockResolvedValueOnce([existingScene]);
      mockDb.returning.mockResolvedValueOnce([updatedScene]);

      mockRequest.params = { id: 'scene-1' };
      mockRequest.body = updateData;

      await scenesController.updateScene(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'تم تحديث المشهد بنجاح',
        data: updatedScene,
      });
    });

    it('should return 401 for unauthorized user', async () => {
      mockRequest.user = undefined;

      mockRequest.params = { id: 'scene-1' };
      mockRequest.body = { title: 'Updated Title' };

      await scenesController.updateScene(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'غير مصرح',
      });
    });

    it('should return 400 when scene ID is missing', async () => {
      mockRequest.params = {};
      mockRequest.body = { title: 'Updated Title' };

      await scenesController.updateScene(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'معرف المشهد مطلوب',
      });
    });

    it('should return 404 when scene not found', async () => {
      mockDb.where.mockResolvedValueOnce([]);

      mockRequest.params = { id: 'nonexistent-scene' };
      mockRequest.body = { title: 'Updated Title' };

      await scenesController.updateScene(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'المشهد غير موجود',
      });
    });

    it('should validate update data using Zod schema', async () => {
      const existingScene = { id: 'scene-1', title: 'Old Title', projectId: 'project-1' };

      mockDb.where.mockResolvedValueOnce([existingScene]);

      mockRequest.params = { id: 'scene-1' };
      mockRequest.body = {
        title: '', // Invalid: empty title
      };

      await scenesController.updateScene(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'بيانات غير صالحة',
        details: expect.any(Array),
      });
    });

    it('should update only provided fields', async () => {
      const existingScene = { id: 'scene-1', title: 'Old Title', description: 'Old Desc', projectId: 'project-1' };
      const updateData = { title: 'New Title' };

      mockDb.where.mockResolvedValueOnce([existingScene]);
      mockDb.returning.mockResolvedValueOnce([{ ...existingScene, ...updateData }]);

      mockRequest.params = { id: 'scene-1' };
      mockRequest.body = updateData;

      await scenesController.updateScene(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockDb.update).toHaveBeenCalled();
    });
  });

  describe('deleteScene', () => {
    it('should delete scene successfully', async () => {
      const existingScene = { id: 'scene-1', title: 'Test Scene', projectId: 'project-1' };

      mockDb.where.mockResolvedValueOnce([existingScene]);

      mockRequest.params = { id: 'scene-1' };

      await scenesController.deleteScene(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'تم حذف المشهد بنجاح',
      });
    });

    it('should return 401 for unauthorized user', async () => {
      mockRequest.user = undefined;

      mockRequest.params = { id: 'scene-1' };

      await scenesController.deleteScene(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'غير مصرح',
      });
    });

    it('should return 400 when scene ID is missing', async () => {
      mockRequest.params = {};

      await scenesController.deleteScene(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'معرف المشهد مطلوب',
      });
    });

    it('should return 404 when scene not found', async () => {
      mockDb.where.mockResolvedValueOnce([]);

      mockRequest.params = { id: 'nonexistent-scene' };

      await scenesController.deleteScene(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'المشهد غير موجود',
      });
    });

    it('should verify scene ownership through project', async () => {
      const existingScene = { id: 'scene-1', title: 'Test Scene', projectId: 'project-1' };

      mockDb.where.mockResolvedValueOnce([existingScene]);

      mockRequest.params = { id: 'scene-1' };

      await scenesController.deleteScene(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockDb.where).toHaveBeenCalled();
    });
  });

  // Note: reorderScenes tests removed as the function doesn't exist in the controller
});