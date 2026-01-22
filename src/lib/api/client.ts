/**
 * APT API Client - Stubbed for frontend development
 * 
 * This client is designed for easy replacement with actual Cloudflare Workers endpoints.
 * When migrating to CF Workers:
 * 1. Update API_BASE_URL to your worker endpoint
 * 2. Remove mock implementations
 * 3. Keep the same function signatures
 */

import type {
  Exercise,
  CreateExerciseInput,
  WorkoutTemplate,
  CreateTemplateInput,
  Program,
  CreateProgramInput,
  ScheduledSession,
  CreateSessionInput,
  WorkoutLog,
  DexaScan,
  DexaComparison,
  ImportPreview,
  ImportJob,
  ImportType,
  PaginatedResponse,
  TrainingDayStats,
  ExerciseWeeklyStats,
  TemplateBlock,
} from './types';
import { mockExercises, mockTemplates, mockPrograms, mockSessions, mockDexaScans, mockImportJobs } from './mock-data';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============ Exercise API ============

export const exerciseApi = {
  async list(cursor?: string): Promise<PaginatedResponse<Exercise>> {
    await delay(200);
    const startIndex = cursor ? parseInt(cursor) : 0;
    const pageSize = 20;
    const items = mockExercises.slice(startIndex, startIndex + pageSize);
    return {
      items,
      nextCursor: startIndex + pageSize < mockExercises.length 
        ? String(startIndex + pageSize) 
        : undefined,
    };
  },

  async get(id: string): Promise<Exercise | null> {
    await delay(100);
    return mockExercises.find(e => e.id === id) || null;
  },

  async create(input: CreateExerciseInput): Promise<Exercise> {
    await delay(300);
    const newExercise: Exercise = {
      id: `ex_${Date.now()}`,
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockExercises.push(newExercise);
    return newExercise;
  },

  async update(id: string, input: Partial<CreateExerciseInput>): Promise<Exercise> {
    await delay(300);
    const index = mockExercises.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Exercise not found');
    mockExercises[index] = {
      ...mockExercises[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    return mockExercises[index];
  },

  async delete(id: string): Promise<void> {
    await delay(200);
    const index = mockExercises.findIndex(e => e.id === id);
    if (index !== -1) mockExercises.splice(index, 1);
  },
};

// ============ Template API ============

export const templateApi = {
  async list(cursor?: string): Promise<PaginatedResponse<WorkoutTemplate>> {
    await delay(200);
    const startIndex = cursor ? parseInt(cursor) : 0;
    const pageSize = 20;
    const items = mockTemplates.slice(startIndex, startIndex + pageSize);
    return {
      items,
      nextCursor: startIndex + pageSize < mockTemplates.length 
        ? String(startIndex + pageSize) 
        : undefined,
    };
  },

  async get(id: string): Promise<WorkoutTemplate | null> {
    await delay(100);
    return mockTemplates.find(t => t.id === id) || null;
  },

  async create(input: CreateTemplateInput): Promise<WorkoutTemplate> {
    await delay(300);
    const blocks: TemplateBlock[] = input.blocks.map((b, i) => ({
      ...b,
      id: `blk_${Date.now()}_${i}`,
      items: b.items.map((item, j) => ({ ...item, id: `item_${Date.now()}_${i}_${j}` })),
    }));
    const newTemplate: WorkoutTemplate = {
      id: `tmpl_${Date.now()}`,
      ...input,
      blocks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTemplates.push(newTemplate);
    return newTemplate;
  },

  async update(id: string, input: Partial<CreateTemplateInput>): Promise<WorkoutTemplate> {
    await delay(300);
    const index = mockTemplates.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Template not found');
    const existing = mockTemplates[index];
    const updatedBlocks = input.blocks 
      ? input.blocks.map((b, i) => ({
          ...b,
          id: `blk_${Date.now()}_${i}`,
          items: b.items.map((item, j) => ({ ...item, id: `item_${Date.now()}_${i}_${j}` })),
        }))
      : existing.blocks;
    mockTemplates[index] = {
      ...existing,
      ...input,
      blocks: updatedBlocks,
      updatedAt: new Date().toISOString(),
    };
    return mockTemplates[index];
  },

  async delete(id: string): Promise<void> {
    await delay(200);
    const index = mockTemplates.findIndex(t => t.id === id);
    if (index !== -1) mockTemplates.splice(index, 1);
  },
};

// ============ Program API ============

export const programApi = {
  async list(cursor?: string): Promise<PaginatedResponse<Program>> {
    await delay(200);
    const startIndex = cursor ? parseInt(cursor) : 0;
    const pageSize = 20;
    const items = mockPrograms.slice(startIndex, startIndex + pageSize);
    return {
      items,
      nextCursor: startIndex + pageSize < mockPrograms.length 
        ? String(startIndex + pageSize) 
        : undefined,
    };
  },

  async get(id: string): Promise<Program | null> {
    await delay(100);
    return mockPrograms.find(p => p.id === id) || null;
  },

  async create(input: CreateProgramInput): Promise<Program> {
    await delay(300);
    const newProgram: Program = {
      id: `prog_${Date.now()}`,
      ...input,
      weeks: input.weeks.map((w, i) => ({ 
        ...w, 
        id: `wk_${Date.now()}_${i}`,
        days: w.days.map((d, j) => ({ ...d, id: `day_${Date.now()}_${i}_${j}` })),
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPrograms.push(newProgram);
    return newProgram;
  },

  async generateSchedule(programId: string, startDate: string, endDate: string): Promise<ScheduledSession[]> {
    await delay(500);
    // Generate scheduled sessions based on program
    const program = mockPrograms.find(p => p.id === programId);
    if (!program) throw new Error('Program not found');
    
    const sessions: ScheduledSession[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    let current = new Date(start);
    let weekIndex = 0;

    while (current <= end) {
      const week = program.weeks[weekIndex % program.weeks.length];
      const dayOfWeek = current.getDay();
      const day = week.days.find(d => d.dayOfWeek === dayOfWeek);
      
      if (day && !day.isRestDay && day.templateId) {
        sessions.push({
          id: `sess_${Date.now()}_${sessions.length}`,
          templateId: day.templateId,
          programId,
          scheduledDate: current.toISOString().split('T')[0],
          status: 'scheduled',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      
      current.setDate(current.getDate() + 1);
      if (dayOfWeek === 6) weekIndex++;
    }

    mockSessions.push(...sessions);
    return sessions;
  },
};

// ============ Session API ============

export const sessionApi = {
  async list(startDate?: string, endDate?: string): Promise<ScheduledSession[]> {
    await delay(200);
    let filtered = [...mockSessions];
    if (startDate) {
      filtered = filtered.filter(s => s.scheduledDate >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(s => s.scheduledDate <= endDate);
    }
    return filtered.sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));
  },

  async get(id: string): Promise<ScheduledSession | null> {
    await delay(100);
    return mockSessions.find(s => s.id === id) || null;
  },

  async create(input: CreateSessionInput): Promise<ScheduledSession> {
    await delay(300);
    const newSession: ScheduledSession = {
      id: `sess_${Date.now()}`,
      ...input,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockSessions.push(newSession);
    return newSession;
  },

  async update(id: string, input: Partial<CreateSessionInput & { status: ScheduledSession['status'] }>): Promise<ScheduledSession> {
    await delay(300);
    const index = mockSessions.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Session not found');
    mockSessions[index] = {
      ...mockSessions[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    return mockSessions[index];
  },

  async delete(id: string): Promise<void> {
    await delay(200);
    const index = mockSessions.findIndex(s => s.id === id);
    if (index !== -1) mockSessions.splice(index, 1);
  },

  async start(id: string): Promise<WorkoutLog> {
    await delay(300);
    const session = mockSessions.find(s => s.id === id);
    if (!session) throw new Error('Session not found');
    
    session.status = 'in_progress';
    session.updatedAt = new Date().toISOString();
    
    return {
      id: `log_${Date.now()}`,
      sessionId: id,
      session,
      startedAt: new Date().toISOString(),
      status: 'in_progress',
      exercises: [],
    };
  },
};

// ============ DEXA API ============

export const dexaApi = {
  async list(): Promise<DexaScan[]> {
    await delay(200);
    return [...mockDexaScans].sort((a, b) => b.scanDate.localeCompare(a.scanDate));
  },

  async get(id: string): Promise<DexaScan | null> {
    await delay(100);
    return mockDexaScans.find(d => d.id === id) || null;
  },

  async getLatest(): Promise<DexaScan | null> {
    await delay(100);
    const sorted = [...mockDexaScans].sort((a, b) => b.scanDate.localeCompare(a.scanDate));
    return sorted[0] || null;
  },

  async create(scan: Omit<DexaScan, 'id' | 'createdAt'>): Promise<DexaScan> {
    await delay(300);
    const newScan: DexaScan = {
      id: `dexa_${Date.now()}`,
      ...scan,
      createdAt: new Date().toISOString(),
    };
    mockDexaScans.push(newScan);
    return newScan;
  },

  async compare(currentId: string, previousId: string | 'last'): Promise<DexaComparison> {
    await delay(300);
    const current = mockDexaScans.find(d => d.id === currentId);
    if (!current) throw new Error('Current scan not found');

    let previous: DexaScan | undefined;
    if (previousId === 'last') {
      const sorted = mockDexaScans
        .filter(d => d.id !== currentId && d.scanDate < current.scanDate)
        .sort((a, b) => b.scanDate.localeCompare(a.scanDate));
      previous = sorted[0];
    } else {
      previous = mockDexaScans.find(d => d.id === previousId);
    }

    if (!previous) throw new Error('Previous scan not found');

    const currentBody = current.bodyComposition;
    const prevBody = previous.bodyComposition;

    return {
      currentScan: current,
      previousScan: previous,
      changes: {
        totalMass: {
          value: currentBody.totalMass - prevBody.totalMass,
          percentage: ((currentBody.totalMass - prevBody.totalMass) / prevBody.totalMass) * 100,
        },
        fatMass: {
          value: currentBody.fatMass - prevBody.fatMass,
          percentage: ((currentBody.fatMass - prevBody.fatMass) / prevBody.fatMass) * 100,
        },
        leanMass: {
          value: currentBody.leanMass - prevBody.leanMass,
          percentage: ((currentBody.leanMass - prevBody.leanMass) / prevBody.leanMass) * 100,
        },
        bodyFatPercentage: {
          value: currentBody.bodyFatPercentage - prevBody.bodyFatPercentage,
          percentage: ((currentBody.bodyFatPercentage - prevBody.bodyFatPercentage) / prevBody.bodyFatPercentage) * 100,
        },
        regionalChanges: current.regionalData.map(region => {
          const prevRegion = previous!.regionalData.find(r => r.region === region.region);
          return {
            region: region.region,
            fatChange: prevRegion ? region.fatMass - prevRegion.fatMass : 0,
            leanChange: prevRegion ? region.leanMass - prevRegion.leanMass : 0,
          };
        }),
      },
      timeSpan: Math.floor((new Date(current.scanDate).getTime() - new Date(previous.scanDate).getTime()) / (1000 * 60 * 60 * 24)),
    };
  },
};

// ============ Import API ============

export const importApi = {
  async preview(type: ImportType, data: unknown): Promise<ImportPreview> {
    await delay(500);
    // Validate and preview import data
    const items = Array.isArray(data) ? data : [data];
    const previewItems = items.map((item, index) => ({
      index,
      action: 'add' as const,
      name: item.name || `Item ${index + 1}`,
      data: item,
    }));

    return {
      type,
      schemaVersion: '1.0',
      totalItems: items.length,
      adds: items.length,
      updates: 0,
      skips: 0,
      errors: 0,
      items: previewItems,
      isValid: true,
    };
  },

  async commit(type: ImportType, data: unknown): Promise<ImportJob> {
    await delay(800);
    const items = Array.isArray(data) ? data : [data];
    const job: ImportJob = {
      id: `import_${Date.now()}`,
      type,
      status: 'completed',
      totalItems: items.length,
      processedItems: items.length,
      successItems: items.length,
      failedItems: 0,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
    mockImportJobs.push(job);
    return job;
  },

  async list(): Promise<ImportJob[]> {
    await delay(200);
    return [...mockImportJobs].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async get(id: string): Promise<ImportJob | null> {
    await delay(100);
    return mockImportJobs.find(j => j.id === id) || null;
  },
};

// ============ Stats API ============

export const statsApi = {
  async getTrainingDaily(startDate: string, endDate: string): Promise<TrainingDayStats[]> {
    await delay(200);
    const stats: TrainingDayStats[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const current = new Date(start);

    while (current <= end) {
      const hasWorkout = Math.random() > 0.4;
      if (hasWorkout) {
        stats.push({
          date: current.toISOString().split('T')[0],
          workoutsCompleted: 1,
          totalDuration: 45 + Math.floor(Math.random() * 30),
          totalVolume: 5000 + Math.floor(Math.random() * 10000),
          exercisesPerformed: 5 + Math.floor(Math.random() * 5),
          muscleGroupsWorked: ['chest', 'shoulders', 'triceps'].slice(0, 1 + Math.floor(Math.random() * 3)),
        });
      }
      current.setDate(current.getDate() + 1);
    }

    return stats;
  },

  async getExerciseWeekly(_startDate: string, _endDate: string, _exerciseId?: string): Promise<ExerciseWeeklyStats[]> {
    await delay(200);
    // Return mock weekly exercise stats
    return [];
  },
};

// ============ AI API (SSE) ============
// Note: AI endpoints will use Server-Sent Events (SSE) in production
// These are stubbed to return mock responses

export const aiApi = {
  async analyzeDexa(_scanId: string, _compareTo?: string): Promise<string[]> {
    // In production, this would connect to SSE endpoint
    await delay(500);
    return [
      'Analyzing your DEXA scan results...',
      'Your body composition shows positive trends.',
      'Fat Loss Progress: You\'ve lost 2.3% body fat since your last scan.',
    ];
  },

  async getWeeklySummary(_weekStartDate: string): Promise<{ workouts: number; volume: number; prs: number }> {
    await delay(400);
    return { workouts: 5, volume: 45000, prs: 2 };
  },

  async getProgression(_dateRange: { start: string; end: string }, _exerciseId?: string): Promise<{ trend: string; recommendation: string }> {
    await delay(300);
    return { trend: 'improving', recommendation: 'Increase weight by 5lbs next session' };
  },

  async getPlanSuggestions(_dateRange: { start: string; end: string }, _constraints?: Record<string, unknown>): Promise<{ suggestions: { day: string; focus: string; template: string }[] }> {
    await delay(300);
    return { suggestions: [{ day: 'Monday', focus: 'Upper Body', template: 'Push Day' }] };
  },
};
