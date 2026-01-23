import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Play,
  Clock,
  Calendar,
  Target,
  Activity
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';

// Mock workouts data
const mockWorkouts = [
  {
    id: 1,
    name: "Push Day - Upper Body Power",
    description: "Chest, shoulders, and triceps focused workout",
    exercises: 6,
    estimatedDuration: 45,
    difficulty: "Intermediate",
    lastPerformed: "2 days ago",
    timesCompleted: 12,
    category: "Strength"
  },
  {
    id: 2,
    name: "Pull Day - Back & Biceps",
    description: "Complete back and bicep development routine",
    exercises: 5,
    estimatedDuration: 50,
    difficulty: "Intermediate",
    lastPerformed: "4 days ago",
    timesCompleted: 8,
    category: "Strength"
  },
  {
    id: 3,
    name: "Leg Day - Lower Body Strength",
    description: "Comprehensive lower body muscle building",
    exercises: 7,
    estimatedDuration: 60,
    difficulty: "Advanced",
    lastPerformed: "1 week ago",
    timesCompleted: 15,
    category: "Strength"
  },
  {
    id: 4,
    name: "HIIT Cardio Blast",
    description: "High intensity interval training for fat loss",
    exercises: 8,
    estimatedDuration: 30,
    difficulty: "Advanced",
    lastPerformed: "Yesterday",
    timesCompleted: 6,
    category: "Cardio"
  },
  {
    id: 5,
    name: "Full Body Beginner",
    description: "Perfect introduction to strength training",
    exercises: 4,
    estimatedDuration: 35,
    difficulty: "Beginner",
    lastPerformed: "Never",
    timesCompleted: 0,
    category: "Strength"
  }
];

const Workouts = () => {
  const navigate = useNavigate();
  const [workouts] = useState(mockWorkouts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Strength', 'Cardio', 'Flexibility', 'HIIT'];

  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workout.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || workout.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-success/10 text-success border-success/20';
      case 'Intermediate': return 'bg-warning/10 text-warning border-warning/20';
      case 'Advanced': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-border';
    }
  };

  const totalWorkouts = workouts.length;
  const completedWorkouts = workouts.filter(w => w.timesCompleted > 0).length;
  const totalExercises = workouts.reduce((sum, w) => sum + w.exercises, 0);
  const avgDuration = Math.round(workouts.reduce((sum, w) => sum + w.estimatedDuration, 0) / workouts.length);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Workout Library</h1>
            <p className="text-muted-foreground">
              Create, manage, and track your workout routines
            </p>
          </div>
          <Button className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            Create Workout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalWorkouts}</p>
                  <p className="text-sm text-muted-foreground">Total Workouts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 bg-success/10 rounded-xl flex items-center justify-center">
                  <Activity className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{completedWorkouts}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
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
                  <p className="text-2xl font-bold text-foreground">{totalExercises}</p>
                  <p className="text-sm text-muted-foreground">Total Exercises</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{avgDuration}m</p>
                  <p className="text-sm text-muted-foreground">Avg Duration</p>
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
                    placeholder="Search workouts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="whitespace-nowrap"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout) => (
            <Card key={workout.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">{workout.name}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {workout.description}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={getDifficultyColor(workout.difficulty)}
                  >
                    {workout.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-foreground">{workout.exercises}</p>
                    <p className="text-xs text-muted-foreground">Exercises</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{workout.estimatedDuration}m</p>
                    <p className="text-xs text-muted-foreground">Duration</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{workout.timesCompleted}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last performed:</span>
                    <span className="text-foreground font-medium">{workout.lastPerformed}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Category:</span>
                    <Badge variant="secondary" className="text-xs">
                      {workout.category}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" size="sm" onClick={() => navigate(`/session/${workout.id}`)}>
                    <Play className="mr-2 h-3 w-3" />
                    Start Workout
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredWorkouts.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No workouts found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or create a new workout to get started.
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Workout
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Workouts;