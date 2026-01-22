import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity,
  Upload,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Scale,
  Percent,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import Layout from '@/components/Layout';
import { dexaApi } from '@/lib/api';
import type { DexaScan, DexaComparison } from '@/lib/api';
import { format } from 'date-fns';

const DexaScans = () => {
  const [scans, setScans] = useState<DexaScan[]>([]);
  const [selectedScan, setSelectedScan] = useState<DexaScan | null>(null);
  const [comparison, setComparison] = useState<DexaComparison | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = async () => {
    setIsLoading(true);
    try {
      const data = await dexaApi.list();
      setScans(data);
      if (data.length > 0) {
        setSelectedScan(data[0]);
        if (data.length > 1) {
          const comp = await dexaApi.compare(data[0].id, 'last');
          setComparison(comp);
        }
      }
    } catch (error) {
      console.error('Failed to load scans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectScan = async (scan: DexaScan) => {
    setSelectedScan(scan);
    const scanIndex = scans.findIndex(s => s.id === scan.id);
    if (scanIndex < scans.length - 1) {
      try {
        const comp = await dexaApi.compare(scan.id, 'last');
        setComparison(comp);
      } catch {
        setComparison(null);
      }
    } else {
      setComparison(null);
    }
  };

  const getTrendIcon = (value: number) => {
    if (value > 0.5) return <TrendingUp className="h-4 w-4 text-success" />;
    if (value < -0.5) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const formatChange = (value: number, suffix = '') => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}${suffix}`;
  };

  const getChangeColor = (value: number, invert = false) => {
    const positive = invert ? value < 0 : value > 0;
    if (Math.abs(value) < 0.5) return 'text-muted-foreground';
    return positive ? 'text-success' : 'text-destructive';
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-pulse text-muted-foreground">Loading scans...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Activity className="h-8 w-8 text-primary" />
              DEXA Scans
            </h1>
            <p className="text-muted-foreground">
              Track your body composition over time
            </p>
          </div>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Import Scan
          </Button>
        </div>

        {scans.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Activity className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No DEXA Scans</h3>
              <p className="text-muted-foreground mb-4">
                Import your first DEXA scan to start tracking body composition
              </p>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Import Scan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Scan List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Scan History</CardTitle>
                <CardDescription>{scans.length} scans recorded</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {scans.map((scan) => (
                  <div
                    key={scan.id}
                    onClick={() => handleSelectScan(scan)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedScan?.id === scan.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                          {format(new Date(scan.scanDate), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <Badge variant="secondary">
                        {scan.bodyComposition.bodyFatPercentage.toFixed(1)}%
                      </Badge>
                    </div>
                    {scan.provider && (
                      <p className="text-xs text-muted-foreground mt-1">{scan.provider}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Scan Details */}
            <div className="lg:col-span-3 space-y-6">
              {selectedScan && (
                <>
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Scale className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Total Mass</span>
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                          {selectedScan.bodyComposition.totalMass.toFixed(1)} kg
                        </div>
                        {comparison && (
                          <div className={`text-sm flex items-center gap-1 ${getChangeColor(comparison.changes.totalMass.value)}`}>
                            {getTrendIcon(comparison.changes.totalMass.value)}
                            {formatChange(comparison.changes.totalMass.value, ' kg')}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Percent className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Body Fat %</span>
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                          {selectedScan.bodyComposition.bodyFatPercentage.toFixed(1)}%
                        </div>
                        {comparison && (
                          <div className={`text-sm flex items-center gap-1 ${getChangeColor(comparison.changes.bodyFatPercentage.value, true)}`}>
                            {getTrendIcon(-comparison.changes.bodyFatPercentage.value)}
                            {formatChange(comparison.changes.bodyFatPercentage.value, '%')}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Lean Mass</span>
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                          {selectedScan.bodyComposition.leanMass.toFixed(1)} kg
                        </div>
                        {comparison && (
                          <div className={`text-sm flex items-center gap-1 ${getChangeColor(comparison.changes.leanMass.value)}`}>
                            {getTrendIcon(comparison.changes.leanMass.value)}
                            {formatChange(comparison.changes.leanMass.value, ' kg')}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingDown className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Fat Mass</span>
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                          {selectedScan.bodyComposition.fatMass.toFixed(1)} kg
                        </div>
                        {comparison && (
                          <div className={`text-sm flex items-center gap-1 ${getChangeColor(comparison.changes.fatMass.value, true)}`}>
                            {getTrendIcon(-comparison.changes.fatMass.value)}
                            {formatChange(comparison.changes.fatMass.value, ' kg')}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Detailed View */}
                  <Tabs defaultValue="composition">
                    <TabsList>
                      <TabsTrigger value="composition">Body Composition</TabsTrigger>
                      <TabsTrigger value="regional">Regional Analysis</TabsTrigger>
                      {selectedScan.boneDensity && (
                        <TabsTrigger value="bone">Bone Density</TabsTrigger>
                      )}
                    </TabsList>

                    <TabsContent value="composition" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Body Composition Breakdown</CardTitle>
                          <CardDescription>
                            Scan from {format(new Date(selectedScan.scanDate), 'MMMM d, yyyy')}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Visual breakdown */}
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Lean Mass</span>
                                <span className="font-medium">
                                  {((selectedScan.bodyComposition.leanMass / selectedScan.bodyComposition.totalMass) * 100).toFixed(1)}%
                                </span>
                              </div>
                              <Progress 
                                value={(selectedScan.bodyComposition.leanMass / selectedScan.bodyComposition.totalMass) * 100} 
                                className="h-3"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Fat Mass</span>
                                <span className="font-medium">
                                  {selectedScan.bodyComposition.bodyFatPercentage.toFixed(1)}%
                                </span>
                              </div>
                              <Progress 
                                value={selectedScan.bodyComposition.bodyFatPercentage} 
                                className="h-3"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Bone Mass</span>
                                <span className="font-medium">
                                  {((selectedScan.bodyComposition.boneMass / selectedScan.bodyComposition.totalMass) * 100).toFixed(1)}%
                                </span>
                              </div>
                              <Progress 
                                value={(selectedScan.bodyComposition.boneMass / selectedScan.bodyComposition.totalMass) * 100} 
                                className="h-3"
                              />
                            </div>
                          </div>

                          {comparison && (
                            <div className="pt-4 border-t border-border">
                              <h4 className="font-medium mb-3 flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                Changes from Previous Scan
                              </h4>
                              <div className="text-sm text-muted-foreground mb-2">
                                Compared to scan from {format(new Date(comparison.previousScan.scanDate), 'MMM d, yyyy')} ({comparison.timeSpan} days)
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-3 bg-muted/30 rounded-lg">
                                  <div className="text-sm text-muted-foreground">Weight</div>
                                  <div className={`font-semibold ${getChangeColor(comparison.changes.totalMass.value)}`}>
                                    {formatChange(comparison.changes.totalMass.value, ' kg')}
                                  </div>
                                </div>
                                <div className="p-3 bg-muted/30 rounded-lg">
                                  <div className="text-sm text-muted-foreground">Body Fat</div>
                                  <div className={`font-semibold ${getChangeColor(comparison.changes.bodyFatPercentage.value, true)}`}>
                                    {formatChange(comparison.changes.bodyFatPercentage.value, '%')}
                                  </div>
                                </div>
                                <div className="p-3 bg-muted/30 rounded-lg">
                                  <div className="text-sm text-muted-foreground">Lean Mass</div>
                                  <div className={`font-semibold ${getChangeColor(comparison.changes.leanMass.value)}`}>
                                    {formatChange(comparison.changes.leanMass.value, ' kg')}
                                  </div>
                                </div>
                                <div className="p-3 bg-muted/30 rounded-lg">
                                  <div className="text-sm text-muted-foreground">Fat Mass</div>
                                  <div className={`font-semibold ${getChangeColor(comparison.changes.fatMass.value, true)}`}>
                                    {formatChange(comparison.changes.fatMass.value, ' kg')}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="regional" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Regional Body Composition</CardTitle>
                          <CardDescription>
                            Fat and lean mass distribution by body region
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {selectedScan.regionalData.map((region) => (
                              <div key={region.region} className="p-4 border border-border rounded-lg">
                                <h4 className="font-medium capitalize mb-3">{region.region}</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Fat Mass</span>
                                    <span>{region.fatMass.toFixed(1)} kg</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Lean Mass</span>
                                    <span>{region.leanMass.toFixed(1)} kg</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Fat %</span>
                                    <span>{region.fatPercentage.toFixed(1)}%</span>
                                  </div>
                                  <Progress value={region.fatPercentage} className="h-2 mt-2" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {selectedScan.boneDensity && (
                      <TabsContent value="bone" className="mt-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Bone Density Analysis</CardTitle>
                            <CardDescription>
                              Bone mineral density measurements
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {selectedScan.boneDensity.tScore !== undefined && (
                                <div className="p-4 border border-border rounded-lg">
                                  <div className="text-sm text-muted-foreground mb-1">T-Score</div>
                                  <div className="text-2xl font-bold">
                                    {selectedScan.boneDensity.tScore.toFixed(1)}
                                  </div>
                                </div>
                              )}
                              {selectedScan.boneDensity.zScore !== undefined && (
                                <div className="p-4 border border-border rounded-lg">
                                  <div className="text-sm text-muted-foreground mb-1">Z-Score</div>
                                  <div className="text-2xl font-bold">
                                    {selectedScan.boneDensity.zScore.toFixed(1)}
                                  </div>
                                </div>
                              )}
                              {selectedScan.boneDensity.lumbarSpine !== undefined && (
                                <div className="p-4 border border-border rounded-lg">
                                  <div className="text-sm text-muted-foreground mb-1">Lumbar Spine</div>
                                  <div className="text-2xl font-bold">
                                    {selectedScan.boneDensity.lumbarSpine.toFixed(2)}
                                  </div>
                                </div>
                              )}
                              {selectedScan.boneDensity.femur !== undefined && (
                                <div className="p-4 border border-border rounded-lg">
                                  <div className="text-sm text-muted-foreground mb-1">Femur</div>
                                  <div className="text-2xl font-bold">
                                    {selectedScan.boneDensity.femur.toFixed(2)}
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    )}
                  </Tabs>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DexaScans;
