import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Upload,
  FileJson,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  Download,
  Eye,
  History
} from 'lucide-react';
import Layout from '@/components/Layout';
import { importApi } from '@/lib/api';
import type { ImportType, ImportPreview, ImportJob } from '@/lib/api';
import { format } from 'date-fns';

const Imports = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [importType, setImportType] = useState<ImportType>('exercise_library');
  const [jsonData, setJsonData] = useState('');
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [importJobs, setImportJobs] = useState<ImportJob[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadImportHistory();
  }, []);

  const loadImportHistory = async () => {
    try {
      const jobs = await importApi.list();
      setImportJobs(jobs);
    } catch (error) {
      console.error('Failed to load import history:', error);
    }
  };

  const handlePreview = async () => {
    setError(null);
    setPreview(null);
    setIsValidating(true);

    try {
      const parsed = JSON.parse(jsonData);
      const result = await importApi.preview(importType, parsed);
      setPreview(result);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON format. Please check your data.');
      } else {
        setError('Failed to validate import data.');
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handleCommit = async () => {
    if (!preview?.isValid) return;

    setIsImporting(true);
    try {
      const parsed = JSON.parse(jsonData);
      await importApi.commit(importType, parsed);
      setJsonData('');
      setPreview(null);
      await loadImportHistory();
      setActiveTab('history');
    } catch (err) {
      setError('Failed to import data.');
    } finally {
      setIsImporting(false);
    }
  };

  const getStatusIcon = (status: ImportJob['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-warning animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeLabel = (type: ImportType) => {
    switch (type) {
      case 'exercise_library':
        return 'Exercises';
      case 'workout_templates':
        return 'Templates';
      case 'programs':
        return 'Programs';
      case 'dexa_scans':
        return 'DEXA Scans';
      default:
        return type;
    }
  };

  const sampleData: Record<ImportType, string> = {
    exercise_library: JSON.stringify([
      {
        name: "Romanian Deadlift",
        category: "compound",
        muscleGroups: ["hamstrings", "glutes", "lower back"],
        equipment: ["barbell"],
        difficulty: "intermediate",
        description: "Hip hinge movement targeting the posterior chain"
      }
    ], null, 2),
    workout_templates: JSON.stringify([
      {
        name: "Upper Body Strength",
        description: "Strength-focused upper body workout",
        category: "Push",
        difficulty: "intermediate",
        estimatedDuration: 60,
        blocks: [
          {
            name: "Main Lifts",
            type: "main",
            order: 0,
            items: [
              {
                exerciseId: "ex_1",
                sets: 4,
                repsMin: 5,
                repsMax: 5,
                restSeconds: 180,
                order: 0
              }
            ]
          }
        ]
      }
    ], null, 2),
    programs: JSON.stringify([
      {
        name: "12 Week Strength Program",
        description: "Progressive overload strength program",
        durationWeeks: 12,
        goal: "strength",
        difficulty: "intermediate"
      }
    ], null, 2),
    dexa_scans: JSON.stringify([
      {
        scanDate: "2024-01-15",
        provider: "DexaFit",
        bodyComposition: {
          totalMass: 80.0,
          fatMass: 12.0,
          leanMass: 65.0,
          boneMass: 3.0,
          bodyFatPercentage: 15.0
        },
        regionalData: []
      }
    ], null, 2),
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Upload className="h-8 w-8 text-primary" />
              Data Import
            </h1>
            <p className="text-muted-foreground">
              Import exercises, templates, programs, and DEXA scans via JSON
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="new" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              New Import
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Import History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Import Form */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileJson className="h-5 w-5 text-primary" />
                      Import Data
                    </CardTitle>
                    <CardDescription>
                      Paste your JSON data to import exercises, templates, or scans
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Import Type</label>
                      <Select value={importType} onValueChange={(v) => setImportType(v as ImportType)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="exercise_library">Exercise Library</SelectItem>
                          <SelectItem value="workout_templates">Workout Templates</SelectItem>
                          <SelectItem value="programs">Programs</SelectItem>
                          <SelectItem value="dexa_scans">DEXA Scans</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">JSON Data</label>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setJsonData(sampleData[importType])}
                        >
                          Load Sample
                        </Button>
                      </div>
                      <Textarea
                        placeholder='Paste your JSON data here...'
                        value={jsonData}
                        onChange={(e) => {
                          setJsonData(e.target.value);
                          setPreview(null);
                          setError(null);
                        }}
                        rows={12}
                        className="font-mono text-sm"
                      />
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                        <XCircle className="h-4 w-4" />
                        <span className="text-sm">{error}</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={handlePreview}
                        disabled={!jsonData.trim() || isValidating}
                        variant="outline"
                        className="flex-1"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        {isValidating ? 'Validating...' : 'Preview Import'}
                      </Button>
                      <Button
                        onClick={handleCommit}
                        disabled={!preview?.isValid || isImporting}
                        className="flex-1"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {isImporting ? 'Importing...' : 'Import Data'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Preview Results */}
                {preview && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Import Preview</span>
                        <Badge variant={preview.isValid ? 'default' : 'destructive'}>
                          {preview.isValid ? 'Valid' : 'Has Errors'}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {preview.totalItems} items to process
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Summary */}
                      <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="p-3 bg-success/10 rounded-lg text-center">
                          <div className="text-2xl font-bold text-success">{preview.adds}</div>
                          <div className="text-xs text-muted-foreground">New</div>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-lg text-center">
                          <div className="text-2xl font-bold text-primary">{preview.updates}</div>
                          <div className="text-xs text-muted-foreground">Updates</div>
                        </div>
                        <div className="p-3 bg-muted rounded-lg text-center">
                          <div className="text-2xl font-bold text-muted-foreground">{preview.skips}</div>
                          <div className="text-xs text-muted-foreground">Skipped</div>
                        </div>
                        <div className="p-3 bg-destructive/10 rounded-lg text-center">
                          <div className="text-2xl font-bold text-destructive">{preview.errors}</div>
                          <div className="text-xs text-muted-foreground">Errors</div>
                        </div>
                      </div>

                      {/* Item List */}
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {preview.items.map((item) => (
                          <div key={item.index} className="flex items-center justify-between p-2 border border-border rounded">
                            <div className="flex items-center gap-2">
                              {item.action === 'add' && <CheckCircle className="h-4 w-4 text-success" />}
                              {item.action === 'update' && <ArrowRight className="h-4 w-4 text-primary" />}
                              {item.action === 'skip' && <AlertTriangle className="h-4 w-4 text-warning" />}
                              <span className="text-sm">{item.name}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {item.action}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Help Panel */}
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="text-lg">Import Format</CardTitle>
                  <CardDescription>
                    Supported JSON schemas for {getTypeLabel(importType)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2">Your JSON should contain an array of objects with the required fields.</p>
                    <p>Click "Load Sample" to see an example for the selected import type.</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Supported Sources</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">DexaFit</Badge>
                      <Badge variant="secondary">InBody</Badge>
                      <Badge variant="secondary">Custom JSON</Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download Schema Docs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Import History</CardTitle>
                <CardDescription>
                  View past import jobs and their results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {importJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">No import history yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {importJobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-4">
                          {getStatusIcon(job.status)}
                          <div>
                            <div className="font-medium">{getTypeLabel(job.type)}</div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(job.createdAt), 'MMM d, yyyy h:mm a')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm">
                              <span className="text-success">{job.successItems}</span>
                              <span className="text-muted-foreground"> / {job.totalItems}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {job.failedItems > 0 && (
                                <span className="text-destructive">{job.failedItems} failed</span>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Imports;
