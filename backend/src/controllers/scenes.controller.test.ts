import { describe, it, expect, beforeEach, vi } from 'vitest';
import { scenesController } from './scenes.controller';
import { Request, Response } from 'express';
import { z } from 'zod';

// Mock dependencies
vi.mock('@/db', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    and: vi.fn().mockReturnValue([]),
  },
}));

vi.mock('@/db/schema', () => ({
  scenes: { id: 'scenes.id', projectId: 'scenes.projectId' },
  projects: { id: 'projects.id', userId: 'projects.userId' },
}));

vi.mock('@/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
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
  });

  describe('getScenes', () => {
    it('should return scenes for authorized user', async () => {
      const mockScenes = [
        { id: 'scene-1', title: 'Scene 1', projectId: 'project-1' },
        { id: 'scene-2', title: 'Scene 2', projectId: 'project-1' },
      ];

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce({
            orderBy: vi.fn().mockReturnValueOnce(mockScenes),
          }),
        }),
      });

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
      mockDb.select.mockRejectedValueOnce(new Error('Database error'));

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
      const mockScenes = [
        { id: 'scene-1', orderIndex: 1 },
        { id: 'scene-2', orderIndex: 2 },
      ];

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce({
            orderBy: vi.fn().mockReturnValueOnce(mockScenes),
          }),
        }),
      });

      mockRequest.params = { projectId: 'project-1' };

      await scenesController.getScenes(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockDb.orderBy).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('getScene', () => {
    it('should return scene for authorized user', async () => {
      const mockScene = { id: 'scene-1', title: 'Test Scene', projectId: 'project-1' };

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce([mockScene]),
        }),
      });

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
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce([]),
        }),
      });

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

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce([mockScene]),
        }),
      });

      mockRequest.params = { id: 'scene-1' };

      await scenesController.getScene(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockDb.and).toHaveBeenCalled();
    });
  });

  describe('createScene', () => {
    it('should create scene with valid data', async () => {
      const sceneData = {
        title: 'New Scene',
        description: 'Scene description',
        projectId: 'project-1',
        orderIndex: 1,
      };

      const createdScene = { id: 'new-scene', ...sceneData };

      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockReturnValueOnce({
          returning: vi.fn().mockReturnValueOnce([createdScene]),
        }),
      });

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
        projectId: 'project-1',
      };

      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockReturnValueOnce({
          returning: vi.fn().mockReturnValueOnce([]),
        }),
      });

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
        projectId: 'project-1',
      };

      const createdScene = { id: 'new-scene', ...sceneData };

      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockReturnValueOnce({
          returning: vi.fn().mockReturnValueOnce([createdScene]),
        }),
      });

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
        projectId: 'project-1',
        // description and orderIndex are optional
      };

      const createdScene = { id: 'new-scene', ...sceneData, description: null, orderIndex: 1 };

      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockReturnValueOnce({
          returning: vi.fn().mockReturnValueOnce([createdScene]),
        }),
      });

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

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce([existingScene]),
        }),
      });

      mockDb.update.mockReturnValueOnce({
        set: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce({
            returning: vi.fn().mockReturnValueOnce([updatedScene]),
          }),
        }),
      });

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
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce([]),
        }),
      });

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

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce([existingScene]),
        }),
      });

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
      const updateData = { title: 'New Title' }; // Only updating title

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce([existingScene]),
        }),
      });

      mockDb.update.mockReturnValueOnce({
        set: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce({
            returning: vi.fn().mockReturnValueOnce([{ ...existingScene, ...updateData }]),
          }),
        }),
      });

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

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce([existingScene]),
        }),
      });

      mockDb.delete.mockReturnValueOnce({
        where: vi.fn().mockReturnValueOnce(undefined),
      });

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
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce([]),
        }),
      });

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

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce([existingScene]),
        }),
      });

      mockDb.delete.mockReturnValueOnce({
        where: vi.fn().mockReturnValueOnce(undefined),
      });

      mockRequest.params = { id: 'scene-1' };

      await scenesController.deleteScene(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockDb.and).toHaveBeenCalled();
    });
  });

  describe('reorderScenes', () => {
    it('should reorder scenes successfully', async () => {
      const reorderData = [
        { id: 'scene-1', orderIndex: 2 },
        { id: 'scene-2', orderIndex: 1 },
      ];

      const mockProject = { id: 'project-1', userId: 'user-123' };

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce([mockProject]),
        }),
      });

      mockDb.update.mockReturnValueOnce({
        set: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce(undefined),
        }),
      });

      mockRequest.params = { projectId: 'project-1' };
      mockRequest.body = { scenes: reorderData };

      await scenesController.reorderScenes(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'تم إعادة ترتيب المشاهد بنجاح',
      });
    });

    it('should return 401 for unauthorized user', async () => {
      mockRequest.user = undefined;

      mockRequest.params = { projectId: 'project-1' };
      mockRequest.body = { scenes: [] };

      await scenesController.reorderScenes(
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
      mockRequest.body = { scenes: [] };

      await scenesController.reorderScenes(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'معرف المشروع مطلوب',
      });
    });

    it('should return 404 when project not found', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce([]),
        }),
      });

      mockRequest.params = { projectId: 'nonexistent-project' };
      mockRequest.body = { scenes: [] };

      await scenesController.reorderScenes(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'المشروع غير موجود',
      });
    });

    it('should validate reorder data using Zod schema', async () => {
      const mockProject = { id: 'project-1', userId: 'user-123' };

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce([mockProject]),
        }),
      });

      mockRequest.params = { projectId: 'project-1' };
      mockRequest.body = {
        scenes: [
          { id: '', orderIndex: 1 }, // Invalid: empty id
        ],
      };

      await scenesController.reorderScenes(
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

    it('should handle empty scenes array', async () => {
      const mockProject = { id: 'project-1', userId: 'user-123' };

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce([mockProject]),
        }),
      });

      mockRequest.params = { projectId: 'project-1' };
      mockRequest.body = { scenes: [] };

      await scenesController.reorderScenes(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'تم إعادة ترتيب المشاهد بنجاح',
      });
    });
  });
});