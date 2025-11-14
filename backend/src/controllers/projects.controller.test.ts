import { describe, it, expect, beforeEach, vi } from 'vitest';
import { projectsController } from './projects.controller';
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
  projects: { 
    id: 'projects.id', 
    userId: 'projects.userId',
    updatedAt: 'projects.updatedAt'
  },
}));

vi.mock('@/services/analysis.service', () => ({
  AnalysisService: class {
    runFullPipeline = vi.fn();
  },
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

describe('ProjectsController', () => {
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

  describe('getProjects', () => {
    it('should return projects for authorized user', async () => {
      const mockProjects = [
        { id: 'project-1', title: 'Project 1', userId: 'user-123' },
        { id: 'project-2', title: 'Project 2', userId: 'user-123' },
      ];

      mockDb.orderBy.mockResolvedValueOnce(mockProjects);

      await projectsController.getProjects(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockProjects,
      });
    });

    it('should return 401 for unauthorized user', async () => {
      mockRequest.user = undefined;

      await projectsController.getProjects(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'غير مصرح',
      });
    });

    it('should handle database errors gracefully', async () => {
      mockDb.select.mockRejectedValueOnce(new Error('Database error'));

      await projectsController.getProjects(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'حدث خطأ أثناء جلب المشاريع',
      });
    });

    it('should order projects by updatedAt in descending order', async () => {
      const mockProjects = [
        { id: 'project-1', updatedAt: new Date('2024-01-01') },
        { id: 'project-2', updatedAt: new Date('2024-01-02') },
      ];

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce({
            orderBy: vi.fn().mockReturnValueOnce(mockProjects),
          }),
        }),
      });

      await projectsController.getProjects(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockDb.orderBy).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('getProject', () => {
    it('should return project for authorized user', async () => {
      const mockProject = { id: 'project-1', title: 'Test Project', userId: 'user-123' };

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce([mockProject]),
        }),
      });

      mockRequest.params = { id: 'project-1' };

      await projectsController.getProject(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockProject,
      });
    });

    it('should return 401 for unauthorized user', async () => {
      mockRequest.user = undefined;

      mockRequest.params = { id: 'project-1' };

      await projectsController.getProject(
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

      await projectsController.getProject(
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

      mockRequest.params = { id: 'nonexistent-project' };

      await projectsController.getProject(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'المشروع غير موجود',
      });
    });

    it('should verify project belongs to user', async () => {
      const mockProject = { id: 'project-1', title: 'Test Project', userId: 'user-123' };

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce([mockProject]),
        }),
      });

      mockRequest.params = { id: 'project-1' };

      await projectsController.getProject(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockDb.and).toHaveBeenCalled();
    });
  });

  describe('createProject', () => {
    it('should create project with valid data', async () => {
      const projectData = {
        title: 'New Project',
        scriptContent: 'Script content here',
      };

      const createdProject = { id: 'new-project', ...projectData, userId: 'user-123' };

      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockReturnValueOnce({
          returning: vi.fn().mockReturnValueOnce([createdProject]),
        }),
      });

      mockRequest.body = projectData;

      await projectsController.createProject(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'تم إنشاء المشروع بنجاح',
        data: createdProject,
      });
    });

    it('should validate project data using Zod schema', async () => {
      const invalidData = {
        title: '', // Empty title
      };

      mockRequest.body = invalidData;

      await projectsController.createProject(
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
      const projectData = {
        title: 'New Project',
        scriptContent: 'Script content here',
      };

      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockReturnValueOnce({
          returning: vi.fn().mockReturnValueOnce([]),
        }),
      });

      mockRequest.body = projectData;

      await projectsController.createProject(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'فشل إنشاء المشروع',
      });
    });

    it('should work with minimal required data', async () => {
      const projectData = {
        title: 'Minimal Project',
      };

      const createdProject = { id: 'new-project', title: 'Minimal Project', userId: 'user-123' };

      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockReturnValueOnce({
          returning: vi.fn().mockReturnValueOnce([createdProject]),
        }),
      });

      mockRequest.body = projectData;

      await projectsController.createProject(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });
  });

  describe('updateProject', () => {
    it('should update project with valid data', async () => {
      const updateData = {
        title: 'Updated Project Title',
        scriptContent: 'Updated script content',
      };

      const existingProject = { id: 'project-1', title: 'Old Title', userId: 'user-123' };
      const updatedProject = { ...existingProject, ...updateData };

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce([existingProject]),
        }),
      });

      mockDb.update.mockReturnValueOnce({
        set: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce({
            returning: vi.fn().mockReturnValueOnce([updatedProject]),
          }),
        }),
      });

      mockRequest.params = { id: 'project-1' };
      mockRequest.body = updateData;

      await projectsController.updateProject(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'تم تحديث المشروع بنجاح',
        data: updatedProject,
      });
    });

    it('should return 401 for unauthorized user', async () => {
      mockRequest.user = undefined;

      mockRequest.params = { id: 'project-1' };
      mockRequest.body = { title: 'Updated Title' };

      await projectsController.updateProject(
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
      mockRequest.body = { title: 'Updated Title' };

      await projectsController.updateProject(
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

      mockRequest.params = { id: 'nonexistent-project' };
      mockRequest.body = { title: 'Updated Title' };

      await projectsController.updateProject(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'المشروع غير موجود',
      });
    });

    it('should validate update data using Zod schema', async () => {
      const existingProject = { id: 'project-1', title: 'Old Title', userId: 'user-123' };

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce([existingProject]),
        }),
      });

      mockRequest.params = { id: 'project-1' };
      mockRequest.body = {
        title: '', // Invalid: empty title
      };

      await projectsController.updateProject(
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
      const existingProject = { id: 'project-1', title: 'Old Title', scriptContent: 'Old Content', userId: 'user-123' };
      const updateData = { title: 'New Title' }; // Only updating title

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce([existingProject]),
        }),
      });

      mockDb.update.mockReturnValueOnce({
        set: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce({
            returning: vi.fn().mockReturnValueOnce([{ ...existingProject, ...updateData }]),
          }),
        }),
      });

      mockRequest.params = { id: 'project-1' };
      mockRequest.body = updateData;

      await projectsController.updateProject(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockDb.update).toHaveBeenCalled();
    });
  });

  describe('deleteProject', () => {
    it('should delete project successfully', async () => {
      const existingProject = { id: 'project-1', title: 'Test Project', userId: 'user-123' };

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce([existingProject]),
        }),
      });

      mockDb.delete.mockReturnValueOnce({
        where: vi.fn().mockReturnValueOnce(undefined),
      });

      mockRequest.params = { id: 'project-1' };

      await projectsController.deleteProject(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'تم حذف المشروع بنجاح',
      });
    });

    it('should return 401 for unauthorized user', async () => {
      mockRequest.user = undefined;

      mockRequest.params = { id: 'project-1' };

      await projectsController.deleteProject(
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

      await projectsController.deleteProject(
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

      mockRequest.params = { id: 'nonexistent-project' };

      await projectsController.deleteProject(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'المشروع غير موجود',
      });
    });

    it('should verify project ownership before deletion', async () => {
      const existingProject = { id: 'project-1', title: 'Test Project', userId: 'user-123' };

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce([existingProject]),
        }),
      });

      mockDb.delete.mockReturnValueOnce({
        where: vi.fn().mockReturnValueOnce(undefined),
      });

      mockRequest.params = { id: 'project-1' };

      await projectsController.deleteProject(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockDb.and).toHaveBeenCalled();
    });
  });

  describe('analyzeScript', () => {
    it('should analyze script successfully', async () => {
      const mockProject = { id: 'project-1', title: 'Test Project', userId: 'user-123', scriptContent: 'Test script content' };
      const mockAnalysisResult = { analysis: 'completed', stations: [] };

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce([mockProject]),
        }),
      });

      const AnalysisService = (await import('@/services/analysis.service')).AnalysisService;
      const mockAnalysisService = new AnalysisService();
      vi.mocked(mockAnalysisService.runFullPipeline).mockResolvedValue(mockAnalysisResult);

      mockRequest.params = { id: 'project-1' };

      await projectsController.analyzeScript(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'تم تحليل السيناريو بنجاح',
        data: {
          analysis: mockAnalysisResult,
          projectId: 'project-1',
        },
      });
    });

    it('should return 401 for unauthorized user', async () => {
      mockRequest.user = undefined;

      mockRequest.params = { id: 'project-1' };

      await projectsController.analyzeScript(
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

      await projectsController.analyzeScript(
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

      mockRequest.params = { id: 'nonexistent-project' };

      await projectsController.analyzeScript(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'المشروع غير موجود',
      });
    });

    it('should return 400 when project has no script content', async () => {
      const mockProject = { id: 'project-1', title: 'Test Project', userId: 'user-123', scriptContent: null };

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce([mockProject]),
        }),
      });

      mockRequest.params = { id: 'project-1' };

      await projectsController.analyzeScript(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'لا يوجد نص سيناريو للتحليل',
      });
    });

    it('should handle analysis service errors', async () => {
      const mockProject = { id: 'project-1', title: 'Test Project', userId: 'user-123', scriptContent: 'Test script content' };

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce([mockProject]),
        }),
      });

      const AnalysisService = (await import('@/services/analysis.service')).AnalysisService;
      const mockAnalysisService = new AnalysisService();
      vi.mocked(mockAnalysisService.runFullPipeline).mockRejectedValue(new Error('Analysis failed'));

      mockRequest.params = { id: 'project-1' };

      await projectsController.analyzeScript(
        mockRequest as any,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'حدث خطأ أثناء تحليل السيناريو',
      });
    });
  });
});