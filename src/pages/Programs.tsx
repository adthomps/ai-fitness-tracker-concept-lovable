import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Play,
  Calendar,
  Target,
  Clock,
  Layers,
  ChevronRight,
  Zap
} from 'lucide-react';
import Layout from '@/components/Layout';
import { Program } from '@/lib/api/types';

// Mock programs data
const mockPrograms: (Program & { completedWeeks?: number })[] = [
  {
    id: '1',
    name: 'Beginner Strength Foundation',
    description: 'Perfect 8-week introduction to strength training with progressive overload',
    durationWeeks: 8,
    goal: 'strength',
    difficulty: 'beginner',
    weeks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedWeeks: 3
  },
  {
    id: '2',
    name: 'Hypertrophy Builder',
    description: '12-week muscle building program focused on volume and time under tension',
    durationWeeks: 12,
    goal: 'hypertrophy',
    difficulty: 'intermediate',
    weeks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedWeeks: 0
  },
  {
    id: '3',
    name: 'Elite Power Program',
    description: 'Advanced 16-week periodization for serious strength athletes',
    durationWeeks: 16,
    goal: 'strength',
    difficulty: 'advanced',
    weeks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedWeeks: 8
  },
  {
    id: '4',
    name: 'Fat Loss Accelerator',
    description: '6-week high-intensity program designed for maximum calorie burn',
    durationWeeks: 6,
    goal: 'weight_loss',
    difficulty: 'intermediate',
    weeks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedWeeks: 6
  }
];

const Programs = () => {
  const [programs] = useState(mockPrograms);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('All');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<typeof mockPrograms[0] | null>(null);

  const goals = ['All', 'strength', 'hypertrophy', 'endurance', 'weight_loss', 'general_fitness'];

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (program.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesGoal = selectedGoal === 'All' || program.goal === selectedGoal;
    return matchesSearch && matchesGoal;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-success/10 text-success border-success/20';
      case 'intermediate': return 'bg-warning/10 text-warning border-warning/20';
      case 'advanced': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-border';
    }
  };

  const getGoalLabel = (goal: string) => {
    const labels: Record<string, string> = {
      strength: 'Strength',
      hypertrophy: 'Hypertrophy',
      endurance: 'Endurance',
      weight_loss: 'Weight Loss',
      general_fitness: 'General Fitness'
    };
    return labels[goal] || goal;
  };

  const getGoalColor = (goal: string) => {
    const colors: Record<string, string> = {
      strength: 'bg-primary/10 text-primary',
      hypertrophy: 'bg-accent/10 text-accent-foreground',
      endurance: 'bg-warning/10 text-warning',
      weight_loss: 'bg-destructive/10 text-destructive',
      general_fitness: 'bg-muted text-muted-foreground'
    };
    return colors[goal] || 'bg-muted text-muted-foreground';
  };

  const totalPrograms = programs.length;
  const activePrograms = programs.filter(p => (p.completedWeeks ?? 0) > 0 && (p.completedWeeks ?? 0) < p.durationWeeks).length;
  const completedPrograms = programs.filter(p => (p.completedWeeks ?? 0) >= p.durationWeeks).length;
  const totalWeeks = programs.reduce((sum, p) => sum + p.durationWeeks, 0);

  const handleScheduleProgram = (program: typeof mockPrograms[0]) => {
    setSelectedProgram(program);
    setIsScheduleOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Training Programs</h1>
            <p className="text-muted-foreground">
              Build structured multi-week training programs with progressive overload
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0">
                <Plus className="mr-2 h-4 w-4" />
                Create Program
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Program</DialogTitle>
                <DialogDescription>
                  Build a structured training program with weekly schedules
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Program Name</Label>
                  <Input id="name" placeholder="e.g., 12-Week Strength Builder" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe the program goals and approach..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (weeks)</Label>
                    <Input id="duration" type="number" min={1} max={52} placeholder="12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal">Primary Goal</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strength">Strength</SelectItem>
                        <SelectItem value="hypertrophy">Hypertrophy</SelectItem>
                        <SelectItem value="endurance">Endurance</SelectItem>
                        <SelectItem value="weight_loss">Weight Loss</SelectItem>
                        <SelectItem value="general_fitness">General Fitness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={() => setIsCreateOpen(false)}>
                  Create Program
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Layers className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalPrograms}</p>
                  <p className="text-sm text-muted-foreground">Total Programs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 bg-warning/10 rounded-xl flex items-center justify-center">
                  <Play className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{activePrograms}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 bg-success/10 rounded-xl flex items-center justify-center">
                  <Target className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{completedPrograms}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Clock className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalWeeks}</p>
                  <p className="text-sm text-muted-foreground">Total Weeks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search programs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {goals.map((goal) => (
                  <Button
                    key={goal}
                    variant={selectedGoal === goal ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedGoal(goal)}
                    className="whitespace-nowrap capitalize"
                  >
                    {goal === 'All' ? 'All' : getGoalLabel(goal)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Program Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPrograms.map((program) => {
            const progress = program.completedWeeks !== undefined 
              ? (program.completedWeeks / program.durationWeeks) * 100 
              : 0;
            const isCompleted = (program.completedWeeks ?? 0) >= program.durationWeeks;
            const isActive = (program.completedWeeks ?? 0) > 0 && !isCompleted;

            return (
              <Card key={program.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {isActive && (
                          <Badge className="bg-warning/10 text-warning border-warning/20 text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        )}
                        {isCompleted && (
                          <Badge className="bg-success/10 text-success border-success/20 text-xs">
                            Completed
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg leading-tight">{program.name}</CardTitle>
                      <CardDescription className="text-sm mt-1 line-clamp-2">
                        {program.description}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${getDifficultyColor(program.difficulty)} capitalize shrink-0`}
                    >
                      {program.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground font-medium">{program.durationWeeks} weeks</span>
                    </div>
                    <Badge className={`${getGoalColor(program.goal)} capitalize`}>
                      {getGoalLabel(program.goal)}
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  {(program.completedWeeks ?? 0) > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground font-medium">
                          Week {program.completedWeeks} of {program.durationWeeks}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button 
                      className="flex-1" 
                      size="sm"
                      onClick={() => handleScheduleProgram(program)}
                    >
                      <Calendar className="mr-2 h-3 w-3" />
                      Schedule
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredPrograms.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No programs found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or create a new program to get started.
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Program
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Schedule Dialog */}
        <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule Program</DialogTitle>
              <DialogDescription>
                Generate a calendar schedule for "{selectedProgram?.name}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label>Training Days</Label>
                <div className="grid grid-cols-7 gap-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                    <Button
                      key={i}
                      variant={[0, 2, 4].includes(i) ? "default" : "outline"}
                      size="sm"
                      className="h-10 w-10 p-0"
                    >
                      {day}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Select which days of the week to schedule workouts
                </p>
              </div>
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{selectedProgram?.durationWeeks} weeks</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-muted-foreground">Estimated Sessions:</span>
                    <span className="font-medium">
                      {(selectedProgram?.durationWeeks ?? 0) * 3} workouts
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Button className="w-full" onClick={() => setIsScheduleOpen(false)}>
                <Calendar className="mr-2 h-4 w-4" />
                Generate Schedule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Programs;
