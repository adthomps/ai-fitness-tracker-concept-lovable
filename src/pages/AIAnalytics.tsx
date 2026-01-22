import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Send,
  Sparkles,
  TrendingUp,
  Target,
  Zap,
  Activity,
  Bot,
  User as UserIcon,
  Download,
  Calendar,
  Clock,
  Flame,
  Award,
  BarChart3
} from 'lucide-react';
import Layout from '@/components/Layout';
import MuscleMap from '@/components/MuscleMap';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAnalytics = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI workout coach. I can help analyze your fitness data, suggest improvements, and answer questions about your training. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Analytics stats
  const stats = {
    totalWorkouts: 47,
    totalTime: 2840,
    avgDuration: 45,
    currentStreak: 5,
    longestStreak: 12,
    caloriesBurned: 8420,
    strengthGains: 15.2,
    weeklyGoal: 5,
    weeklyComplete: 4
  };

  const weeklyData = [
    { day: 'Mon', workouts: 1, duration: 45 },
    { day: 'Tue', workouts: 0, duration: 0 },
    { day: 'Wed', workouts: 1, duration: 50 },
    { day: 'Thu', workouts: 1, duration: 40 },
    { day: 'Fri', workouts: 0, duration: 0 },
    { day: 'Sat', workouts: 1, duration: 60 },
    { day: 'Sun', workouts: 0, duration: 0 }
  ];

  const recentAchievements = [
    { id: 1, title: "5-Day Streak", description: "Worked out 5 days in a row", date: "Today", type: "streak" },
    { id: 2, title: "First Pull-up", description: "Completed your first unassisted pull-up", date: "2 days ago", type: "personal-record" },
    { id: 3, title: "Squat Master", description: "Reached 200lb squat milestone", date: "1 week ago", type: "milestone" },
  ];

  // AI Insights
  const aiInsights = [
    {
      id: 1,
      title: "Optimal Rest Day",
      insight: "Based on your training intensity, consider adding one more rest day per week to maximize recovery.",
      confidence: 92,
      type: "recovery",
      action: "Schedule rest day"
    },
    {
      id: 2,
      title: "Strength Plateau",
      insight: "Your bench press has plateaued. Try incorporating tempo work and pause reps to break through.",
      confidence: 87,
      type: "performance",
      action: "Modify program"
    },
    {
      id: 3,
      title: "Progressive Overload",
      insight: "You're ready to increase weights on squats and deadlifts by 5-10 lbs based on your recent performance.",
      confidence: 89,
      type: "progression",
      action: "Increase load"
    }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'recovery': return <Target className="h-4 w-4" />;
      case 'performance': return <TrendingUp className="h-4 w-4" />;
      case 'balance': return <Activity className="h-4 w-4" />;
      case 'progression': return <Zap className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-success';
    if (confidence >= 80) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'streak': return <Flame className="h-4 w-4 text-warning" />;
      case 'personal-record': return <Award className="h-4 w-4 text-success" />;
      case 'milestone': return <Target className="h-4 w-4 text-primary" />;
      default: return <Award className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const responses = [
        "Based on your recent workouts, I recommend increasing your protein intake to support muscle recovery. Aim for 1.6-2.2g per kg of body weight.",
        "Your workout consistency is excellent! To optimize results, consider periodizing your training with deload weeks every 4-6 weeks.",
        "I notice you're doing a lot of isolation exercises. Adding more compound movements like squats, deadlifts, and pull-ups could improve your overall strength gains.",
        "Great question! Based on your goals and current progress, I suggest adjusting your training split to focus more on your weaker muscle groups."
      ];

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const suggestedQuestions = [
    "How can I improve my squat form?",
    "What's the best recovery strategy?",
    "Should I add more cardio?",
    "How to break through plateaus?"
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              AI Coach & Analytics
            </h1>
            <p className="text-muted-foreground">
              AI-powered insights and performance analytics
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button size="sm">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Insights
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="muscle-map">Muscle Map</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="coach">AI Coach</TabsTrigger>
          </TabsList>

          {/* Overview Tab - Analytics Dashboard */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.totalWorkouts}</p>
                      <p className="text-xs text-muted-foreground">Total Workouts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-warning/10 rounded-xl flex items-center justify-center">
                      <Clock className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{Math.round(stats.totalTime / 60)}h</p>
                      <p className="text-xs text-muted-foreground">Total Time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-accent/10 rounded-xl flex items-center justify-center">
                      <Flame className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.currentStreak}</p>
                      <p className="text-xs text-muted-foreground">Day Streak</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-success/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">+{stats.strengthGains}%</p>
                      <p className="text-xs text-muted-foreground">Strength Gains</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Weekly Activity */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Weekly Activity
                  </CardTitle>
                  <CardDescription>Your workout frequency this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {weeklyData.map((day) => (
                      <div key={day.day} className="flex items-center gap-4">
                        <div className="w-10 text-sm text-muted-foreground">{day.day}</div>
                        <div className="flex-1 flex items-center gap-2">
                          <div 
                            className={`h-6 rounded flex items-center justify-center text-xs font-medium ${
                              day.workouts > 0 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted text-muted-foreground'
                            }`}
                            style={{ width: day.workouts > 0 ? `${Math.max(day.duration, 30)}px` : '30px' }}
                          >
                            {day.workouts > 0 ? `${day.duration}m` : '-'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Weekly Goal</span>
                      <span className="font-medium">{stats.weeklyComplete}/{stats.weeklyGoal}</span>
                    </div>
                    <Progress value={(stats.weeklyComplete / stats.weeklyGoal) * 100} />
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-warning" />
                    Achievements
                  </CardTitle>
                  <CardDescription>Recent milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAchievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-start gap-3">
                        <div className="h-8 w-8 bg-muted rounded-lg flex items-center justify-center shrink-0">
                          {getAchievementIcon(achievement.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{achievement.title}</p>
                          <p className="text-xs text-muted-foreground">{achievement.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Muscle Map Tab */}
          <TabsContent value="muscle-map">
            <MuscleMap />
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Insights
                </CardTitle>
                <CardDescription>
                  Personalized recommendations based on your training data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiInsights.map((insight) => (
                  <div key={insight.id} className="p-4 border border-border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          {getInsightIcon(insight.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{insight.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">Confidence:</span>
                            <span className={`text-xs font-medium ${getConfidenceColor(insight.confidence)}`}>
                              {insight.confidence}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        {insight.action}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.insight}</p>
                    <Progress value={insight.confidence} className="h-1" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Coach Tab */}
          <TabsContent value="coach">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  AI Workout Coach
                </CardTitle>
                <CardDescription>
                  Chat with your personal AI fitness coach
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Chat Messages */}
                <div className="h-80 overflow-y-auto space-y-3 p-2 bg-muted/20 rounded-lg">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-2 ${
                        message.role === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        {message.role === 'user' ? (
                          <UserIcon className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div className={`flex-1 space-y-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                        <div className={`inline-block p-3 rounded-lg text-sm max-w-[85%] ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card border border-border text-foreground'
                        }`}>
                          {message.content}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-start gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-card border border-border p-3 rounded-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Suggested Questions */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Suggested questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => setNewMessage(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask your AI coach..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isLoading}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AIAnalytics;
