/**
 * APT API Types - Designed for easy migration to Cloudflare Workers
 * All types follow the API contract spec for exercises, templates, programs, etc.
 */

// ============ Base Types ============

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor?: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// ============ User Types ============

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

// ============ Exercise Types ============

export interface Exercise {
  id: string;
  name: string;
  category: 'compound' | 'isolation' | 'cardio' | 'mobility' | 'plyometric';
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description?: string;
  instructions?: string[];
  aliases?: string[];
  externalId?: string;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExerciseInput {
  name: string;
  category: Exercise['category'];
  muscleGroups: string[];
  equipment: string[];
  difficulty: Exercise['difficulty'];
  description?: string;
  instructions?: string[];
  aliases?: string[];
}

// ============ Workout Template Types ============

export interface TemplateItem {
  id: string;
  exerciseId: string;
  exercise?: Exercise;
  sets: number;
  repsMin: number;
  repsMax: number;
  restSeconds: number;
  rpeTarget?: number;
  notes?: string;
  order: number;
}

export interface TemplateBlock {
  id: string;
  name: string;
  type: 'warmup' | 'main' | 'cooldown' | 'circuit' | 'superset';
  items: TemplateItem[];
  order: number;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
  blocks: TemplateBlock[];
  tags?: string[];
  externalId?: string;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateInput {
  name: string;
  description?: string;
  category: string;
  difficulty: WorkoutTemplate['difficulty'];
  estimatedDuration: number;
  blocks: Omit<TemplateBlock, 'id'>[];
  tags?: string[];
}

// ============ Program Types ============

export interface ProgramDay {
  id: string;
  dayOfWeek: number; // 0-6
  templateId?: string;
  template?: WorkoutTemplate;
  isRestDay: boolean;
  notes?: string;
}

export interface ProgramWeek {
  id: string;
  weekNumber: number;
  days: ProgramDay[];
  focus?: string;
}

export interface Program {
  id: string;
  name: string;
  description?: string;
  durationWeeks: number;
  goal: 'strength' | 'hypertrophy' | 'endurance' | 'weight_loss' | 'general_fitness';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  weeks: ProgramWeek[];
  externalId?: string;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProgramInput {
  name: string;
  description?: string;
  durationWeeks: number;
  goal: Program['goal'];
  difficulty: Program['difficulty'];
  weeks: Omit<ProgramWeek, 'id'>[];
}

// ============ Scheduled Session Types ============

export interface ScheduledSession {
  id: string;
  templateId?: string;
  template?: WorkoutTemplate;
  programId?: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime?: string; // HH:MM
  status: 'scheduled' | 'in_progress' | 'completed' | 'skipped';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionInput {
  templateId?: string;
  scheduledDate: string;
  scheduledTime?: string;
  notes?: string;
}

// ============ Workout Log Types ============

export interface LogSet {
  id: string;
  setNumber: number;
  weight?: number;
  reps?: number;
  duration?: number; // seconds for timed exercises
  rpe?: number;
  notes?: string;
  completedAt: string;
}

export interface LogExercise {
  id: string;
  exerciseId: string;
  exercise?: Exercise;
  sets: LogSet[];
  order: number;
}

export interface WorkoutLog {
  id: string;
  sessionId: string;
  session?: ScheduledSession;
  startedAt: string;
  finishedAt?: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  exercises: LogExercise[];
  notes?: string;
  totalDuration?: number; // seconds
  caloriesBurned?: number;
}

// ============ DEXA Scan Types ============

export interface DexaBodyComposition {
  totalMass: number; // kg
  fatMass: number;
  leanMass: number;
  boneMass: number;
  bodyFatPercentage: number;
  visceralFatArea?: number;
}

export interface DexaRegionalData {
  region: 'arms' | 'legs' | 'trunk' | 'android' | 'gynoid';
  fatMass: number;
  leanMass: number;
  boneMass: number;
  fatPercentage: number;
}

export interface DexaScan {
  id: string;
  scanDate: string;
  provider?: string;
  bodyComposition: DexaBodyComposition;
  regionalData: DexaRegionalData[];
  boneDensity?: {
    tScore?: number;
    zScore?: number;
    lumbarSpine?: number;
    femur?: number;
  };
  notes?: string;
  rawData?: Record<string, unknown>;
  externalId?: string;
  source?: string;
  createdAt: string;
}

export interface DexaComparison {
  currentScan: DexaScan;
  previousScan: DexaScan;
  changes: {
    totalMass: { value: number; percentage: number };
    fatMass: { value: number; percentage: number };
    leanMass: { value: number; percentage: number };
    bodyFatPercentage: { value: number; percentage: number };
    regionalChanges: {
      region: string;
      fatChange: number;
      leanChange: number;
    }[];
  };
  timeSpan: number; // days
}

// ============ Import Types ============

export type ImportType = 'exercise_library' | 'workout_templates' | 'programs' | 'dexa_scans';

export interface ImportPreviewItem {
  index: number;
  action: 'add' | 'update' | 'skip';
  name: string;
  reason?: string;
  warnings?: string[];
  errors?: string[];
  data: Record<string, unknown>;
}

export interface ImportPreview {
  type: ImportType;
  schemaVersion: string;
  totalItems: number;
  adds: number;
  updates: number;
  skips: number;
  errors: number;
  items: ImportPreviewItem[];
  isValid: boolean;
}

export interface ImportJob {
  id: string;
  type: ImportType;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalItems: number;
  processedItems: number;
  successItems: number;
  failedItems: number;
  createdAt: string;
  completedAt?: string;
  errors?: { index: number; message: string }[];
}

// ============ AI Types ============

export interface AiSession {
  id: string;
  type: 'dexa_analyze' | 'weekly_summary' | 'progression' | 'plan_suggestions';
  status: 'streaming' | 'completed' | 'failed' | 'refused';
  promptInput: Record<string, unknown>;
  contextRefs: { type: string; id: string; range?: string }[];
  model: string;
  output?: Record<string, unknown>;
  createdAt: string;
  completedAt?: string;
}

export interface AiInsight {
  id: string;
  title: string;
  insight: string;
  confidence: number;
  type: 'recovery' | 'performance' | 'balance' | 'progression' | 'nutrition';
  action?: string;
  dataUsed?: string[];
}

// ============ Stats Types ============

export interface TrainingDayStats {
  date: string;
  workoutsCompleted: number;
  totalDuration: number;
  totalVolume: number;
  exercisesPerformed: number;
  muscleGroupsWorked: string[];
}

export interface ExerciseWeeklyStats {
  exerciseId: string;
  exerciseName: string;
  weekStart: string;
  totalSets: number;
  totalReps: number;
  totalVolume: number;
  avgWeight: number;
  maxWeight: number;
  avgRpe?: number;
}
