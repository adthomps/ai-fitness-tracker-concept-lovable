import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Calendar, 
  Clock, 
  Dumbbell, 
  Target, 
  TrendingUp,
  Plus,
  Award,
  Brain
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data for demo
  const stats = {
    weeklyWorkouts: 4,
    totalExercises: 127,
    currentStreak: 5,
    weeklyGoal: 5
  };

  const recentWorkouts = [
    { id: 1, name: "Push Day", date: "Today", duration: "45 min", exercises: 6 },
    { id: 2, name: "Pull Day", date: "Yesterday", duration: "50 min", exercises: 5 },
    { id: 3, name: "Leg Day", date: "2 days ago", duration: "60 min", exercises: 7 },
  ];

  const weeklyProgress = (stats.weeklyWorkouts / stats.weeklyGoal) * 100;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-muted-foreground">
            Ready to crush your fitness goals today?
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.weeklyWorkouts}</p>
                  <p className="text-sm text-muted-foreground">This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Dumbbell className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalExercises}</p>
                  <p className="text-sm text-muted-foreground">Total Exercises</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 bg-warning/10 rounded-xl flex items-center justify-center">
                  <Award className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.currentStreak}</p>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
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
                  <p className="text-2xl font-bold text-foreground">{Math.round(weeklyProgress)}%</p>
                  <p className="text-sm text-muted-foreground">Weekly Goal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Progress */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Weekly Progress</span>
              </CardTitle>
              <CardDescription>
                {stats.weeklyWorkouts} of {stats.weeklyGoal} workouts completed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={weeklyProgress} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Keep going! You're doing great 💪</span>
                <span>{stats.weeklyGoal - stats.weeklyWorkouts} more to go</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Jump into your workout</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/workouts">
                <Button className="w-full justify-start" size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Start New Workout
                </Button>
              </Link>
              <Link to="/exercises">
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Exercise
                </Button>
              </Link>
              <Link to="/calendar">
                <Button variant="secondary" className="w-full justify-start" size="lg">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Calendar
                </Button>
              </Link>
              <Link to="/ai-analytics">
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <Brain className="mr-2 h-4 w-4" />
                  AI Coach
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Workouts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Recent Workouts</span>
            </CardTitle>
            <CardDescription>Your latest training sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentWorkouts.map((workout) => (
                <div key={workout.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Dumbbell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{workout.name}</h4>
                      <p className="text-sm text-muted-foreground">{workout.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{workout.duration}</span>
                    </div>
                    <Badge variant="secondary">{workout.exercises} exercises</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
