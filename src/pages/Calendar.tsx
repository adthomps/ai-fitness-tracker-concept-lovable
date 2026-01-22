import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Clock,
  Dumbbell,
  CheckCircle,
  XCircle,
  PlayCircle
} from 'lucide-react';
import Layout from '@/components/Layout';
import { sessionApi } from '@/lib/api';
import type { ScheduledSession } from '@/lib/api';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sessions, setSessions] = useState<ScheduledSession[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, [currentDate]);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const data = await sessionApi.list(
        format(monthStart, 'yyyy-MM-dd'),
        format(monthEnd, 'yyyy-MM-dd')
      );
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSessionsForDate = (date: Date) => {
    return sessions.filter(s => isSameDay(new Date(s.scheduledDate), date));
  };

  const getStatusIcon = (status: ScheduledSession['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-3 w-3 text-success" />;
      case 'skipped':
        return <XCircle className="h-3 w-3 text-destructive" />;
      case 'in_progress':
        return <PlayCircle className="h-3 w-3 text-warning" />;
      default:
        return <Clock className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: ScheduledSession['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 text-success border-success/20';
      case 'skipped':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'in_progress':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const renderCalendarGrid = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const daySessions = getSessionsForDate(currentDay);
        const isCurrentMonth = isSameMonth(currentDay, currentDate);
        const isToday = isSameDay(currentDay, new Date());
        const isSelected = selectedDate && isSameDay(currentDay, selectedDate);

        days.push(
          <div
            key={currentDay.toISOString()}
            onClick={() => setSelectedDate(currentDay)}
            className={`min-h-[100px] p-2 border border-border cursor-pointer transition-colors
              ${!isCurrentMonth ? 'bg-muted/30' : 'bg-card'}
              ${isToday ? 'ring-2 ring-primary ring-inset' : ''}
              ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/50'}
            `}
          >
            <div className={`text-sm font-medium mb-1 ${
              !isCurrentMonth ? 'text-muted-foreground/50' : 
              isToday ? 'text-primary' : 'text-foreground'
            }`}>
              {format(currentDay, 'd')}
            </div>
            <div className="space-y-1">
              {daySessions.slice(0, 3).map((session) => (
                <div
                  key={session.id}
                  className={`text-xs p-1 rounded border truncate flex items-center gap-1 ${getStatusColor(session.status)}`}
                >
                  {getStatusIcon(session.status)}
                  <span className="truncate">{session.template?.name || 'Workout'}</span>
                </div>
              ))}
              {daySessions.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{daySessions.length - 3} more
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toISOString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }

    return rows;
  };

  const selectedDateSessions = selectedDate ? getSessionsForDate(selectedDate) : [];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <CalendarIcon className="h-8 w-8 text-primary" />
              Workout Calendar
            </h1>
            <p className="text-muted-foreground">
              Schedule and track your workouts
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Workout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar Grid */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>{format(currentDate, 'MMMM yyyy')}</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Day Headers */}
              <div className="grid grid-cols-7 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>
              {/* Calendar Grid */}
              <div className="border-t border-l border-border rounded-lg overflow-hidden">
                {isLoading ? (
                  <div className="h-96 flex items-center justify-center">
                    <div className="animate-pulse text-muted-foreground">Loading...</div>
                  </div>
                ) : (
                  renderCalendarGrid()
                )}
              </div>
            </CardContent>
          </Card>

          {/* Selected Day Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate ? format(selectedDate, 'EEEE, MMM d') : 'Select a date'}
              </CardTitle>
              <CardDescription>
                {selectedDateSessions.length} workout{selectedDateSessions.length !== 1 ? 's' : ''} scheduled
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                <div className="space-y-3">
                  {selectedDateSessions.length === 0 ? (
                    <div className="text-center py-8">
                      <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-sm text-muted-foreground mb-3">No workouts scheduled</p>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Workout
                      </Button>
                    </div>
                  ) : (
                    selectedDateSessions.map((session) => (
                      <div key={session.id} className="p-3 border border-border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">
                            {session.template?.name || 'Workout'}
                          </span>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            {getStatusIcon(session.status)}
                            {session.status}
                          </Badge>
                        </div>
                        {session.scheduledTime && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {session.scheduledTime}
                          </div>
                        )}
                        {session.template && (
                          <div className="text-sm text-muted-foreground">
                            ~{session.template.estimatedDuration} min • {session.template.difficulty}
                          </div>
                        )}
                        <div className="flex gap-2 pt-2">
                          {session.status === 'scheduled' && (
                            <Button size="sm" className="flex-1">
                              <PlayCircle className="mr-2 h-4 w-4" />
                              Start
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="flex-1">
                            View
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto opacity-50 mb-3" />
                  <p className="text-sm">Click on a date to see details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary/20 border border-primary/40" />
            <span className="text-muted-foreground">Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-success/20 border border-success/40" />
            <span className="text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-warning/20 border border-warning/40" />
            <span className="text-muted-foreground">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-destructive/20 border border-destructive/40" />
            <span className="text-muted-foreground">Skipped</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Calendar;
