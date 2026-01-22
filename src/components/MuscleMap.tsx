import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  RotateCcw
} from 'lucide-react';

interface MuscleGroup {
  id: string;
  name: string;
  status: 'worked' | 'rest' | 'missed' | 'active';
  lastWorked: string;
  intensity: number;
}

type MuscleStatus = 'worked' | 'rest' | 'missed' | 'active' | 'default';

const MuscleMap = () => {
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  const [viewMode, setViewMode] = useState<'front' | 'back'>('front');

  const frontMuscleData: Record<string, MuscleGroup> = {
    chest: { id: 'chest', name: 'Chest', status: 'worked', lastWorked: '1 day ago', intensity: 85 },
    shoulders: { id: 'shoulders', name: 'Shoulders', status: 'rest', lastWorked: '2 days ago', intensity: 70 },
    biceps: { id: 'biceps', name: 'Biceps', status: 'active', lastWorked: 'Today', intensity: 90 },
    forearms: { id: 'forearms', name: 'Forearms', status: 'rest', lastWorked: '3 days ago', intensity: 60 },
    abs: { id: 'abs', name: 'Abs', status: 'worked', lastWorked: '1 day ago', intensity: 75 },
    obliques: { id: 'obliques', name: 'Obliques', status: 'missed', lastWorked: '5 days ago', intensity: 45 },
    quads: { id: 'quads', name: 'Quadriceps', status: 'rest', lastWorked: '3 days ago', intensity: 80 },
    calves: { id: 'calves', name: 'Calves', status: 'missed', lastWorked: '6 days ago', intensity: 30 },
  };

  const backMuscleData: Record<string, MuscleGroup> = {
    traps: { id: 'traps', name: 'Trapezius', status: 'worked', lastWorked: 'Today', intensity: 95 },
    'rear-delts': { id: 'rear-delts', name: 'Rear Delts', status: 'active', lastWorked: 'Today', intensity: 85 },
    lats: { id: 'lats', name: 'Latissimus', status: 'active', lastWorked: 'Today', intensity: 88 },
    'lower-back': { id: 'lower-back', name: 'Lower Back', status: 'missed', lastWorked: '7 days ago', intensity: 40 },
    glutes: { id: 'glutes', name: 'Glutes', status: 'worked', lastWorked: '1 day ago', intensity: 82 },
    hamstrings: { id: 'hamstrings', name: 'Hamstrings', status: 'rest', lastWorked: '3 days ago', intensity: 70 },
    'back-calves': { id: 'back-calves', name: 'Calves', status: 'missed', lastWorked: '6 days ago', intensity: 30 },
    triceps: { id: 'triceps', name: 'Triceps', status: 'worked', lastWorked: '1 day ago', intensity: 78 },
  };

  const currentMuscleData = viewMode === 'front' ? frontMuscleData : backMuscleData;
  const allMuscles = Object.values(currentMuscleData);

  const getStatusColor = (status: MuscleStatus): string => {
    switch (status) {
      case 'worked': return 'var(--success)';
      case 'active': return 'var(--primary)';
      case 'rest': return 'var(--warning)';
      case 'missed': return 'var(--destructive)';
      default: return 'var(--muted)';
    }
  };

  const getStatusFill = (muscleId: string): string => {
    const muscle = currentMuscleData[muscleId];
    if (!muscle) return 'hsl(var(--muted))';
    return `hsl(${getStatusColor(muscle.status)})`;
  };

  const getStatusOpacity = (muscleId: string): number => {
    const muscle = currentMuscleData[muscleId];
    if (!muscle) return 0.3;
    return selectedMuscle?.id === muscleId ? 1 : 0.7;
  };

  const handleMuscleClick = (muscleId: string) => {
    const muscle = currentMuscleData[muscleId];
    if (muscle) {
      setSelectedMuscle(muscle);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'worked': return <CheckCircle className="h-3 w-3" />;
      case 'active': return <Activity className="h-3 w-3" />;
      case 'rest': return <Clock className="h-3 w-3" />;
      case 'missed': return <AlertTriangle className="h-3 w-3" />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'worked': return 'Recently Worked';
      case 'active': return 'Currently Active';
      case 'rest': return 'Needs Rest';
      case 'missed': return 'Needs Attention';
      default: return 'Unknown';
    }
  };

  // Front view anatomical SVG
  const FrontBodySVG = () => (
    <svg viewBox="0 0 200 400" className="w-full h-full max-w-[240px] mx-auto">
      {/* Head */}
      <ellipse cx="100" cy="30" rx="22" ry="28" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
      
      {/* Neck */}
      <rect x="90" y="55" width="20" height="15" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.5" />
      
      {/* Shoulders */}
      <path
        d="M60 70 Q45 75 35 95 L55 95 Q60 80 70 75 Z"
        fill={getStatusFill('shoulders')}
        opacity={getStatusOpacity('shoulders')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('shoulders')}
      />
      <path
        d="M140 70 Q155 75 165 95 L145 95 Q140 80 130 75 Z"
        fill={getStatusFill('shoulders')}
        opacity={getStatusOpacity('shoulders')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('shoulders')}
      />
      
      {/* Chest */}
      <path
        d="M70 75 Q100 70 130 75 L130 115 Q100 125 70 115 Z"
        fill={getStatusFill('chest')}
        opacity={getStatusOpacity('chest')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('chest')}
      />
      
      {/* Abs */}
      <path
        d="M78 120 L122 120 L120 180 Q100 185 80 180 Z"
        fill={getStatusFill('abs')}
        opacity={getStatusOpacity('abs')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('abs')}
      />
      
      {/* Obliques */}
      <path
        d="M65 115 L78 120 L80 180 L68 175 Q60 150 65 115 Z"
        fill={getStatusFill('obliques')}
        opacity={getStatusOpacity('obliques')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('obliques')}
      />
      <path
        d="M135 115 L122 120 L120 180 L132 175 Q140 150 135 115 Z"
        fill={getStatusFill('obliques')}
        opacity={getStatusOpacity('obliques')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('obliques')}
      />
      
      {/* Upper Arms - Biceps */}
      <path
        d="M35 95 Q25 100 20 130 Q25 160 35 170 L50 170 Q55 140 55 95 Z"
        fill={getStatusFill('biceps')}
        opacity={getStatusOpacity('biceps')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('biceps')}
      />
      <path
        d="M165 95 Q175 100 180 130 Q175 160 165 170 L150 170 Q145 140 145 95 Z"
        fill={getStatusFill('biceps')}
        opacity={getStatusOpacity('biceps')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('biceps')}
      />
      
      {/* Forearms */}
      <path
        d="M20 170 Q12 200 15 230 L30 235 Q38 210 35 170 Z"
        fill={getStatusFill('forearms')}
        opacity={getStatusOpacity('forearms')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('forearms')}
      />
      <path
        d="M180 170 Q188 200 185 230 L170 235 Q162 210 165 170 Z"
        fill={getStatusFill('forearms')}
        opacity={getStatusOpacity('forearms')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('forearms')}
      />
      
      {/* Hands */}
      <ellipse cx="22" cy="248" rx="10" ry="15" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.5" />
      <ellipse cx="178" cy="248" rx="10" ry="15" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.5" />
      
      {/* Quadriceps */}
      <path
        d="M68 185 L80 180 L85 195 L88 280 L70 285 Q62 240 68 185 Z"
        fill={getStatusFill('quads')}
        opacity={getStatusOpacity('quads')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('quads')}
      />
      <path
        d="M132 185 L120 180 L115 195 L112 280 L130 285 Q138 240 132 185 Z"
        fill={getStatusFill('quads')}
        opacity={getStatusOpacity('quads')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('quads')}
      />
      
      {/* Inner thigh area */}
      <path
        d="M85 195 Q100 200 115 195 L112 280 Q100 275 88 280 Z"
        fill="hsl(var(--muted))"
        stroke="hsl(var(--border))"
        strokeWidth="0.5"
      />
      
      {/* Knees */}
      <ellipse cx="80" cy="295" rx="12" ry="8" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.5" />
      <ellipse cx="120" cy="295" rx="12" ry="8" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.5" />
      
      {/* Calves */}
      <path
        d="M68 300 L92 300 Q95 335 90 360 L70 360 Q65 335 68 300 Z"
        fill={getStatusFill('calves')}
        opacity={getStatusOpacity('calves')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('calves')}
      />
      <path
        d="M132 300 L108 300 Q105 335 110 360 L130 360 Q135 335 132 300 Z"
        fill={getStatusFill('calves')}
        opacity={getStatusOpacity('calves')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('calves')}
      />
      
      {/* Feet */}
      <ellipse cx="80" cy="375" rx="15" ry="10" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.5" />
      <ellipse cx="120" cy="375" rx="15" ry="10" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.5" />
    </svg>
  );

  // Back view anatomical SVG
  const BackBodySVG = () => (
    <svg viewBox="0 0 200 400" className="w-full h-full max-w-[240px] mx-auto">
      {/* Head */}
      <ellipse cx="100" cy="30" rx="22" ry="28" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
      
      {/* Neck */}
      <rect x="90" y="55" width="20" height="15" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.5" />
      
      {/* Traps */}
      <path
        d="M70 65 Q100 55 130 65 L125 100 Q100 105 75 100 Z"
        fill={getStatusFill('traps')}
        opacity={getStatusOpacity('traps')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('traps')}
      />
      
      {/* Rear Delts */}
      <path
        d="M60 70 Q45 80 40 105 L55 105 Q58 85 70 75 Z"
        fill={getStatusFill('rear-delts')}
        opacity={getStatusOpacity('rear-delts')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('rear-delts')}
      />
      <path
        d="M140 70 Q155 80 160 105 L145 105 Q142 85 130 75 Z"
        fill={getStatusFill('rear-delts')}
        opacity={getStatusOpacity('rear-delts')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('rear-delts')}
      />
      
      {/* Lats */}
      <path
        d="M68 100 L75 100 L75 160 Q65 155 60 130 Q60 110 68 100 Z"
        fill={getStatusFill('lats')}
        opacity={getStatusOpacity('lats')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('lats')}
      />
      <path
        d="M132 100 L125 100 L125 160 Q135 155 140 130 Q140 110 132 100 Z"
        fill={getStatusFill('lats')}
        opacity={getStatusOpacity('lats')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('lats')}
      />
      
      {/* Mid back / spine area */}
      <path
        d="M75 100 L125 100 L125 160 Q100 165 75 160 Z"
        fill="hsl(var(--muted))"
        stroke="hsl(var(--border))"
        strokeWidth="0.5"
      />
      
      {/* Lower Back */}
      <path
        d="M75 160 L125 160 L125 185 Q100 195 75 185 Z"
        fill={getStatusFill('lower-back')}
        opacity={getStatusOpacity('lower-back')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('lower-back')}
      />
      
      {/* Triceps */}
      <path
        d="M40 105 Q30 115 25 145 Q30 175 40 185 L55 180 Q55 145 55 105 Z"
        fill={getStatusFill('triceps')}
        opacity={getStatusOpacity('triceps')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('triceps')}
      />
      <path
        d="M160 105 Q170 115 175 145 Q170 175 160 185 L145 180 Q145 145 145 105 Z"
        fill={getStatusFill('triceps')}
        opacity={getStatusOpacity('triceps')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('triceps')}
      />
      
      {/* Forearms */}
      <path
        d="M25 185 Q18 210 20 235 L35 240 Q40 215 40 185 Z"
        fill="hsl(var(--muted))"
        stroke="hsl(var(--border))"
        strokeWidth="0.5"
      />
      <path
        d="M175 185 Q182 210 180 235 L165 240 Q160 215 160 185 Z"
        fill="hsl(var(--muted))"
        stroke="hsl(var(--border))"
        strokeWidth="0.5"
      />
      
      {/* Hands */}
      <ellipse cx="27" cy="253" rx="10" ry="15" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.5" />
      <ellipse cx="173" cy="253" rx="10" ry="15" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.5" />
      
      {/* Glutes */}
      <path
        d="M68 185 Q100 195 132 185 L130 220 Q100 230 70 220 Z"
        fill={getStatusFill('glutes')}
        opacity={getStatusOpacity('glutes')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('glutes')}
      />
      
      {/* Hamstrings */}
      <path
        d="M70 220 L85 225 L85 285 L68 285 Q62 250 70 220 Z"
        fill={getStatusFill('hamstrings')}
        opacity={getStatusOpacity('hamstrings')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('hamstrings')}
      />
      <path
        d="M130 220 L115 225 L115 285 L132 285 Q138 250 130 220 Z"
        fill={getStatusFill('hamstrings')}
        opacity={getStatusOpacity('hamstrings')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('hamstrings')}
      />
      
      {/* Inner thigh */}
      <path
        d="M85 225 Q100 230 115 225 L115 285 Q100 280 85 285 Z"
        fill="hsl(var(--muted))"
        stroke="hsl(var(--border))"
        strokeWidth="0.5"
      />
      
      {/* Knees */}
      <ellipse cx="78" cy="295" rx="12" ry="8" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.5" />
      <ellipse cx="122" cy="295" rx="12" ry="8" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.5" />
      
      {/* Calves */}
      <path
        d="M66 300 L90 300 Q93 335 88 360 L68 360 Q63 335 66 300 Z"
        fill={getStatusFill('back-calves')}
        opacity={getStatusOpacity('back-calves')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('back-calves')}
      />
      <path
        d="M134 300 L110 300 Q107 335 112 360 L132 360 Q137 335 134 300 Z"
        fill={getStatusFill('back-calves')}
        opacity={getStatusOpacity('back-calves')}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => handleMuscleClick('back-calves')}
      />
      
      {/* Feet */}
      <ellipse cx="78" cy="375" rx="15" ry="10" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.5" />
      <ellipse cx="122" cy="375" rx="15" ry="10" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.5" />
    </svg>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Muscle Map</span>
            </CardTitle>
            <CardDescription>
              Click muscle groups to see status and recovery needs
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'front' ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setViewMode('front'); setSelectedMuscle(null); }}
            >
              Front
            </Button>
            <Button
              variant={viewMode === 'back' ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setViewMode('back'); setSelectedMuscle(null); }}
            >
              Back
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedMuscle(null)}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Body SVG */}
          <div className="lg:col-span-2">
            <div className="relative bg-muted/20 rounded-lg p-6 min-h-[420px] flex items-center justify-center">
              {viewMode === 'front' ? <FrontBodySVG /> : <BackBodySVG />}
            </div>
            
            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-sm text-muted-foreground">Recently Worked</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Currently Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-warning" />
                <span className="text-sm text-muted-foreground">Needs Rest</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-sm text-muted-foreground">Needs Attention</span>
              </div>
            </div>
          </div>

          {/* Details Panel */}
          <div className="space-y-4">
            {selectedMuscle ? (
              <div className="p-4 bg-muted/30 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{selectedMuscle.name}</h3>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {getStatusIcon(selectedMuscle.status)}
                    <span>{getStatusLabel(selectedMuscle.status)}</span>
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Last Worked</span>
                    <p className="text-sm font-medium text-foreground">{selectedMuscle.lastWorked}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground">Training Intensity</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${selectedMuscle.intensity}%`,
                            backgroundColor: `hsl(${getStatusColor(selectedMuscle.status)})`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground">{selectedMuscle.intensity}%</span>
                    </div>
                  </div>

                  <Button size="sm" className="w-full">
                    View Exercises
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground bg-muted/20 rounded-lg">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Click a muscle group to view details</p>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-success/10 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Worked</p>
                <p className="text-lg font-semibold text-success">
                  {allMuscles.filter(m => m.status === 'worked').length}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-lg font-semibold text-primary">
                  {allMuscles.filter(m => m.status === 'active').length}
                </p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Rest</p>
                <p className="text-lg font-semibold text-warning">
                  {allMuscles.filter(m => m.status === 'rest').length}
                </p>
              </div>
              <div className="p-3 bg-destructive/10 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Missed</p>
                <p className="text-lg font-semibold text-destructive">
                  {allMuscles.filter(m => m.status === 'missed').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MuscleMap;
