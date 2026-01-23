import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Play,
  Pause,
  Square,
  Plus,
  Minus,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dumbbell,
  Timer,
  Trophy,
  RotateCcw,
  Save
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useNavigate, useParams } from 'react-router-dom';

interface SetLog {
  id: string;
  setNumber: number;
  weight: number;
  reps: number;
  rpe?: number;
  completed: boolean;
}

interface ExerciseLog {
  id: string;
  name: string;
  targetSets: number;
  targetReps: string;
  muscleGroups: string[];
  sets: SetLog[];
  notes?: string;
}

// Mock workout data for the session
const mockWorkoutSession = {
  id: '1',
  name: 'Push Day - Upper Body Power',
  exercises: [
    {
      id: 'e1',
      name: 'Bench Press',
      targetSets: 4,
      targetReps: '8-10',
      muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
      sets: [
        { id: 's1', setNumber: 1, weight: 135, reps: 10, completed: false },
        { id: 's2', setNumber: 2, weight: 155, reps: 8, completed: false },
        { id: 's3', setNumber: 3, weight: 155, reps: 8, completed: false },
        { id: 's4', setNumber: 4, weight: 135, reps: 10, completed: false },
      ]
    },
    {
      id: 'e2',
      name: 'Overhead Press',
      targetSets: 3,
      targetReps: '8-12',
      muscleGroups: ['Shoulders', 'Triceps'],
      sets: [
        { id: 's5', setNumber: 1, weight: 95, reps: 10, completed: false },
        { id: 's6', setNumber: 2, weight: 95, reps: 10, completed: false },
        { id: 's7', setNumber: 3, weight: 95, reps: 8, completed: false },
      ]
    },
    {
      id: 'e3',
      name: 'Incline Dumbbell Press',
      targetSets: 3,
      targetReps: '10-12',
      muscleGroups: ['Upper Chest', 'Shoulders'],
      sets: [
        { id: 's8', setNumber: 1, weight: 50, reps: 12, completed: false },
        { id: 's9', setNumber: 2, weight: 55, reps: 10, completed: false },
        { id: 's10', setNumber: 3, weight: 55, reps: 10, completed: false },
      ]
    },
    {
      id: 'e4',
      name: 'Lateral Raises',
      targetSets: 3,
      targetReps: '12-15',
      muscleGroups: ['Side Delts'],
      sets: [
        { id: 's11', setNumber: 1, weight: 20, reps: 15, completed: false },
        { id: 's12', setNumber: 2, weight: 20, reps: 12, completed: false },
        { id: 's13', setNumber: 3, weight: 20, reps: 12, completed: false },
      ]
    },
    {
      id: 'e5',
      name: 'Tricep Pushdowns',
      targetSets: 3,
      targetReps: '12-15',
      muscleGroups: ['Triceps'],
      sets: [
        { id: 's14', setNumber: 1, weight: 50, reps: 15, completed: false },
        { id: 's15', setNumber: 2, weight: 55, reps: 12, completed: false },
        { id: 's16', setNumber: 3, weight: 55, reps: 12, completed: false },
      ]
    },
    {
      id: 'e6',
      name: 'Dips',
      targetSets: 3,
      targetReps: '8-12',
      muscleGroups: ['Chest', 'Triceps'],
      sets: [
        { id: 's17', setNumber: 1, weight: 0, reps: 12, completed: false },
        { id: 's18', setNumber: 2, weight: 0, reps: 10, completed: false },
        { id: 's19', setNumber: 3, weight: 0, reps: 10, completed: false },
      ]
    }
  ]
};

const WorkoutSession = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [exercises, setExercises] = useState<ExerciseLog[]>(mockWorkoutSession.exercises);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [workoutStarted, setWorkoutStarted] = useState(false);

  const currentExercise = exercises[currentExerciseIndex];

  // Main workout timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Rest timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startWorkout = () => {
    setWorkoutStarted(true);
    setIsTimerRunning(true);
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const startRest = (seconds: number = 90) => {
    setRestTimer(seconds);
    setIsResting(true);
  };

  const skipRest = () => {
    setRestTimer(0);
    setIsResting(false);
  };

  const updateSetValue = (exerciseId: string, setId: string, field: 'weight' | 'reps', delta: number) => {
    setExercises(exercises.map(exercise => {
      if (exercise.id !== exerciseId) return exercise;
      return {
        ...exercise,
        sets: exercise.sets.map(set => {
          if (set.id !== setId) return set;
          const newValue = Math.max(0, set[field] + delta);
          return { ...set, [field]: newValue };
        })
      };
    }));
  };

  const setInputValue = (exerciseId: string, setId: string, field: 'weight' | 'reps', value: number) => {
    setExercises(exercises.map(exercise => {
      if (exercise.id !== exerciseId) return exercise;
      return {
        ...exercise,
        sets: exercise.sets.map(set => {
          if (set.id !== setId) return set;
          return { ...set, [field]: Math.max(0, value) };
        })
      };
    }));
  };

  const toggleSetComplete = (exerciseId: string, setId: string) => {
    setExercises(exercises.map(exercise => {
      if (exercise.id !== exerciseId) return exercise;
      return {
        ...exercise,
        sets: exercise.sets.map(set => {
          if (set.id !== setId) return set;
          const newCompleted = !set.completed;
          if (newCompleted && !isResting) {
            startRest();
          }
          return { ...set, completed: newCompleted };
        })
      };
    }));
  };

  const addSet = (exerciseId: string) => {
    setExercises(exercises.map(exercise => {
      if (exercise.id !== exerciseId) return exercise;
      const lastSet = exercise.sets[exercise.sets.length - 1];
      const newSet: SetLog = {
        id: `s${Date.now()}`,
        setNumber: exercise.sets.length + 1,
        weight: lastSet?.weight ?? 0,
        reps: lastSet?.reps ?? 10,
        completed: false
      };
      return { ...exercise, sets: [...exercise.sets, newSet] };
    }));
  };

  const totalSets = exercises.reduce((sum, e) => sum + e.sets.length, 0);
  const completedSets = exercises.reduce((sum, e) => sum + e.sets.filter(s => s.completed).length, 0);
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  const finishWorkout = () => {
    setIsTimerRunning(false);
    // In a real app, save to API here
    navigate('/workouts');
  };

  if (!workoutStarted) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="text-center">
            <CardHeader>
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">{mockWorkoutSession.name}</CardTitle>
              <CardDescription>
                {exercises.length} exercises • {totalSets} sets total
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-foreground">{exercises.length}</p>
                  <p className="text-sm text-muted-foreground">Exercises</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalSets}</p>
                  <p className="text-sm text-muted-foreground">Sets</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">~45</p>
                  <p className="text-sm text-muted-foreground">Minutes</p>
                </div>
              </div>

              <div className="space-y-2">
                {exercises.map((exercise, i) => (
                  <div 
                    key={exercise.id} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-6 w-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                        {i + 1}
                      </span>
                      <span className="font-medium text-foreground">{exercise.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {exercise.targetSets} × {exercise.targetReps}
                    </span>
                  </div>
                ))}
              </div>

              <Button size="lg" className="w-full" onClick={startWorkout}>
                <Play className="mr-2 h-5 w-5" />
                Start Workout
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Top Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/workouts')}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Exit
                </Button>
                <div className="h-6 border-l border-border" />
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xl font-mono font-bold text-foreground">
                    {formatTime(elapsedTime)}
                  </span>
                  <Button variant="ghost" size="sm" onClick={toggleTimer}>
                    {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="font-bold text-foreground">{completedSets}/{totalSets} sets</p>
                </div>
                <div className="w-24">
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rest Timer Overlay */}
        {isResting && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-4">
                <Clock className="h-6 w-6 text-primary animate-pulse" />
                <div>
                  <p className="text-sm text-muted-foreground">Rest Timer</p>
                  <p className="text-4xl font-mono font-bold text-primary">
                    {formatTime(restTimer)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setRestTimer(r => r + 30)}>
                    +30s
                  </Button>
                  <Button size="sm" onClick={skipRest}>
                    Skip
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Exercise Navigation */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            size="sm"
            disabled={currentExerciseIndex === 0}
            onClick={() => setCurrentExerciseIndex(i => i - 1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {exercises.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentExerciseIndex(i)}
                className={`h-2 w-2 rounded-full transition-all ${
                  i === currentExerciseIndex 
                    ? 'bg-primary w-4' 
                    : exercises[i].sets.every(s => s.completed)
                      ? 'bg-success'
                      : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            disabled={currentExerciseIndex === exercises.length - 1}
            onClick={() => setCurrentExerciseIndex(i => i + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Current Exercise */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="outline" className="mb-2">
                  Exercise {currentExerciseIndex + 1} of {exercises.length}
                </Badge>
                <CardTitle className="text-xl">{currentExercise.name}</CardTitle>
                <div className="flex gap-2 mt-2">
                  {currentExercise.muscleGroups.map(group => (
                    <Badge key={group} variant="secondary" className="text-xs">
                      {group}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Target</p>
                <p className="font-bold text-foreground">
                  {currentExercise.targetSets} × {currentExercise.targetReps}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sets Table */}
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground font-medium px-2">
                <div className="col-span-1">Set</div>
                <div className="col-span-4 text-center">Weight (lbs)</div>
                <div className="col-span-4 text-center">Reps</div>
                <div className="col-span-3 text-center">Done</div>
              </div>
              
              {currentExercise.sets.map((set) => (
                <div 
                  key={set.id} 
                  className={`grid grid-cols-12 gap-2 items-center p-3 rounded-lg transition-colors ${
                    set.completed ? 'bg-success/10' : 'bg-muted/50'
                  }`}
                >
                  <div className="col-span-1">
                    <span className={`font-bold ${set.completed ? 'text-success' : 'text-foreground'}`}>
                      {set.setNumber}
                    </span>
                  </div>
                  
                  <div className="col-span-4 flex items-center justify-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => updateSetValue(currentExercise.id, set.id, 'weight', -5)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      value={set.weight}
                      onChange={(e) => setInputValue(currentExercise.id, set.id, 'weight', parseInt(e.target.value) || 0)}
                      className="w-16 text-center h-8"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => updateSetValue(currentExercise.id, set.id, 'weight', 5)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="col-span-4 flex items-center justify-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => updateSetValue(currentExercise.id, set.id, 'reps', -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      value={set.reps}
                      onChange={(e) => setInputValue(currentExercise.id, set.id, 'reps', parseInt(e.target.value) || 0)}
                      className="w-16 text-center h-8"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => updateSetValue(currentExercise.id, set.id, 'reps', 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="col-span-3 flex justify-center">
                    <Button
                      variant={set.completed ? "default" : "outline"}
                      size="sm"
                      className={set.completed ? "bg-success hover:bg-success/90" : ""}
                      onClick={() => toggleSetComplete(currentExercise.id, set.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Set */}
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => addSet(currentExercise.id)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Set
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => startRest(60)}
          >
            <Clock className="h-4 w-4 mr-2" />
            Rest 1:00
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => startRest(90)}
          >
            <Clock className="h-4 w-4 mr-2" />
            Rest 1:30
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => startRest(120)}
          >
            <Clock className="h-4 w-4 mr-2" />
            Rest 2:00
          </Button>
        </div>

        {/* Finish Workout */}
        <Card className="bg-gradient-to-r from-success/10 to-primary/10 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-success/10 rounded-full flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Ready to finish?</p>
                  <p className="text-sm text-muted-foreground">
                    {completedSets} of {totalSets} sets completed
                  </p>
                </div>
              </div>
              <Button onClick={finishWorkout} className="bg-success hover:bg-success/90">
                <Save className="h-4 w-4 mr-2" />
                Finish Workout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default WorkoutSession;
