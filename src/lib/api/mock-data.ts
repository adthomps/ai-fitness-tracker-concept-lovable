/**
 * Mock data for frontend development
 * This file will be removed when connecting to real Cloudflare Workers backend
 */

import type {
  Exercise,
  WorkoutTemplate,
  Program,
  ScheduledSession,
  DexaScan,
  ImportJob,
} from './types';

export const mockExercises: Exercise[] = [
  {
    id: 'ex_1',
    name: 'Barbell Bench Press',
    category: 'compound',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    equipment: ['barbell', 'bench'],
    difficulty: 'intermediate',
    description: 'Classic chest builder targeting the pectorals, front delts, and triceps.',
    instructions: [
      'Lie flat on the bench with feet firmly on the ground',
      'Grip the bar slightly wider than shoulder width',
      'Lower the bar to mid-chest with control',
      'Press back up to full lockout',
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ex_2',
    name: 'Barbell Squat',
    category: 'compound',
    muscleGroups: ['quadriceps', 'glutes', 'hamstrings', 'core'],
    equipment: ['barbell', 'squat rack'],
    difficulty: 'intermediate',
    description: 'The king of lower body exercises.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ex_3',
    name: 'Deadlift',
    category: 'compound',
    muscleGroups: ['back', 'glutes', 'hamstrings', 'core'],
    equipment: ['barbell'],
    difficulty: 'advanced',
    description: 'Full body posterior chain exercise.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ex_4',
    name: 'Pull-ups',
    category: 'compound',
    muscleGroups: ['lats', 'biceps', 'rear delts'],
    equipment: ['pull-up bar'],
    difficulty: 'intermediate',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ex_5',
    name: 'Dumbbell Lateral Raise',
    category: 'isolation',
    muscleGroups: ['shoulders'],
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ex_6',
    name: 'Leg Press',
    category: 'compound',
    muscleGroups: ['quadriceps', 'glutes'],
    equipment: ['leg press machine'],
    difficulty: 'beginner',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ex_7',
    name: 'Bicep Curl',
    category: 'isolation',
    muscleGroups: ['biceps'],
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ex_8',
    name: 'Tricep Pushdown',
    category: 'isolation',
    muscleGroups: ['triceps'],
    equipment: ['cable machine'],
    difficulty: 'beginner',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const mockTemplates: WorkoutTemplate[] = [
  {
    id: 'tmpl_1',
    name: 'Push Day A',
    description: 'Chest and shoulder focused push workout',
    category: 'Push',
    difficulty: 'intermediate',
    estimatedDuration: 60,
    blocks: [
      {
        id: 'blk_1',
        name: 'Main Lifts',
        type: 'main',
        order: 0,
        items: [
          {
            id: 'item_1',
            exerciseId: 'ex_1',
            sets: 4,
            repsMin: 6,
            repsMax: 8,
            restSeconds: 180,
            rpeTarget: 8,
            order: 0,
          },
        ],
      },
    ],
    tags: ['push', 'chest', 'strength'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tmpl_2',
    name: 'Pull Day A',
    description: 'Back and bicep focused pull workout',
    category: 'Pull',
    difficulty: 'intermediate',
    estimatedDuration: 55,
    blocks: [
      {
        id: 'blk_2',
        name: 'Main Lifts',
        type: 'main',
        order: 0,
        items: [
          {
            id: 'item_2',
            exerciseId: 'ex_3',
            sets: 4,
            repsMin: 5,
            repsMax: 5,
            restSeconds: 240,
            rpeTarget: 8,
            order: 0,
          },
        ],
      },
    ],
    tags: ['pull', 'back', 'strength'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tmpl_3',
    name: 'Leg Day',
    description: 'Complete lower body workout',
    category: 'Legs',
    difficulty: 'intermediate',
    estimatedDuration: 70,
    blocks: [
      {
        id: 'blk_3',
        name: 'Main Lifts',
        type: 'main',
        order: 0,
        items: [
          {
            id: 'item_3',
            exerciseId: 'ex_2',
            sets: 4,
            repsMin: 6,
            repsMax: 8,
            restSeconds: 180,
            rpeTarget: 8,
            order: 0,
          },
        ],
      },
    ],
    tags: ['legs', 'strength'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const mockPrograms: Program[] = [
  {
    id: 'prog_1',
    name: 'PPL 6-Day Split',
    description: 'Push/Pull/Legs routine, 6 days per week',
    durationWeeks: 8,
    goal: 'hypertrophy',
    difficulty: 'intermediate',
    weeks: [
      {
        id: 'wk_1',
        weekNumber: 1,
        focus: 'Foundation',
        days: [
          { id: 'day_1', dayOfWeek: 1, templateId: 'tmpl_1', isRestDay: false },
          { id: 'day_2', dayOfWeek: 2, templateId: 'tmpl_2', isRestDay: false },
          { id: 'day_3', dayOfWeek: 3, templateId: 'tmpl_3', isRestDay: false },
          { id: 'day_4', dayOfWeek: 4, templateId: 'tmpl_1', isRestDay: false },
          { id: 'day_5', dayOfWeek: 5, templateId: 'tmpl_2', isRestDay: false },
          { id: 'day_6', dayOfWeek: 6, templateId: 'tmpl_3', isRestDay: false },
          { id: 'day_7', dayOfWeek: 0, isRestDay: true },
        ],
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Generate sessions for the current month
const generateSessions = (): ScheduledSession[] => {
  const sessions: ScheduledSession[] = [];
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  for (let i = 0; i < 20; i++) {
    const date = new Date(startOfMonth);
    date.setDate(date.getDate() + Math.floor(Math.random() * 28));
    
    const templateIndex = i % mockTemplates.length;
    const isPast = date < today;
    
    sessions.push({
      id: `sess_${i + 1}`,
      templateId: mockTemplates[templateIndex].id,
      template: mockTemplates[templateIndex],
      scheduledDate: date.toISOString().split('T')[0],
      scheduledTime: '09:00',
      status: isPast ? (Math.random() > 0.2 ? 'completed' : 'skipped') : 'scheduled',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    });
  }
  
  return sessions.sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));
};

export const mockSessions: ScheduledSession[] = generateSessions();

export const mockDexaScans: DexaScan[] = [
  {
    id: 'dexa_1',
    scanDate: '2024-01-15',
    provider: 'DexaFit',
    bodyComposition: {
      totalMass: 82.5,
      fatMass: 14.0,
      leanMass: 65.3,
      boneMass: 3.2,
      bodyFatPercentage: 17.0,
      visceralFatArea: 85,
    },
    regionalData: [
      { region: 'arms', fatMass: 1.2, leanMass: 8.5, boneMass: 0.6, fatPercentage: 12.0 },
      { region: 'legs', fatMass: 4.2, leanMass: 22.0, boneMass: 1.2, fatPercentage: 15.0 },
      { region: 'trunk', fatMass: 7.5, leanMass: 30.0, boneMass: 1.0, fatPercentage: 19.5 },
      { region: 'android', fatMass: 1.8, leanMass: 8.0, boneMass: 0.2, fatPercentage: 18.0 },
      { region: 'gynoid', fatMass: 2.5, leanMass: 12.0, boneMass: 0.4, fatPercentage: 16.5 },
    ],
    boneDensity: {
      tScore: 0.8,
      zScore: 1.2,
      lumbarSpine: 1.15,
      femur: 1.08,
    },
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'dexa_2',
    scanDate: '2024-04-15',
    provider: 'DexaFit',
    bodyComposition: {
      totalMass: 83.2,
      fatMass: 12.5,
      leanMass: 67.5,
      boneMass: 3.2,
      bodyFatPercentage: 15.0,
      visceralFatArea: 78,
    },
    regionalData: [
      { region: 'arms', fatMass: 1.0, leanMass: 9.2, boneMass: 0.6, fatPercentage: 9.5 },
      { region: 'legs', fatMass: 3.8, leanMass: 23.5, boneMass: 1.2, fatPercentage: 13.5 },
      { region: 'trunk', fatMass: 6.5, leanMass: 31.0, boneMass: 1.0, fatPercentage: 16.8 },
      { region: 'android', fatMass: 1.4, leanMass: 8.5, boneMass: 0.2, fatPercentage: 14.0 },
      { region: 'gynoid', fatMass: 2.2, leanMass: 12.8, boneMass: 0.4, fatPercentage: 14.3 },
    ],
    boneDensity: {
      tScore: 0.9,
      zScore: 1.3,
      lumbarSpine: 1.17,
      femur: 1.10,
    },
    createdAt: '2024-04-15T10:00:00Z',
  },
  {
    id: 'dexa_3',
    scanDate: '2024-07-15',
    provider: 'DexaFit',
    bodyComposition: {
      totalMass: 84.0,
      fatMass: 11.8,
      leanMass: 69.0,
      boneMass: 3.2,
      bodyFatPercentage: 14.0,
      visceralFatArea: 72,
    },
    regionalData: [
      { region: 'arms', fatMass: 0.9, leanMass: 9.8, boneMass: 0.6, fatPercentage: 8.0 },
      { region: 'legs', fatMass: 3.5, leanMass: 24.5, boneMass: 1.2, fatPercentage: 12.0 },
      { region: 'trunk', fatMass: 6.0, leanMass: 31.8, boneMass: 1.0, fatPercentage: 15.5 },
      { region: 'android', fatMass: 1.2, leanMass: 8.8, boneMass: 0.2, fatPercentage: 12.0 },
      { region: 'gynoid', fatMass: 2.0, leanMass: 13.2, boneMass: 0.4, fatPercentage: 13.0 },
    ],
    boneDensity: {
      tScore: 1.0,
      zScore: 1.4,
      lumbarSpine: 1.19,
      femur: 1.12,
    },
    createdAt: '2024-07-15T10:00:00Z',
  },
];

export const mockImportJobs: ImportJob[] = [
  {
    id: 'import_1',
    type: 'exercise_library',
    status: 'completed',
    totalItems: 25,
    processedItems: 25,
    successItems: 24,
    failedItems: 1,
    createdAt: '2024-06-01T10:00:00Z',
    completedAt: '2024-06-01T10:00:05Z',
    errors: [{ index: 12, message: 'Duplicate exercise name' }],
  },
  {
    id: 'import_2',
    type: 'dexa_scans',
    status: 'completed',
    totalItems: 3,
    processedItems: 3,
    successItems: 3,
    failedItems: 0,
    createdAt: '2024-07-15T10:30:00Z',
    completedAt: '2024-07-15T10:30:02Z',
  },
];
