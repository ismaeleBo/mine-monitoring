"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, AlertTriangle, Info, CheckCircle, TreePine, Fish, Leaf } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

import { SimpleLineChart, SimpleBarChart, SimplePieChart } from "@/components/dashboard-charts"

export function TerritorialImpactDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Territorial Impact Overview</CardTitle>
            <CardDescription>Monitoring deforestation, biodiversity, and soil alterations</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                <SelectItem value="north">North Zone</SelectItem>
                <SelectItem value="south">South Zone</SelectItem>
                <SelectItem value="east">East Zone</SelectItem>
                <SelectItem value="west">West Zone</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
              <span className="sr-only">Download data</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="deforestation">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="deforestation">Deforestation</TabsTrigger>
              <TabsTrigger value="biodiversity">Biodiversity</TabsTrigger>
              <TabsTrigger value="soil">Soil Quality</TabsTrigger>
            </TabsList>
            <TabsContent value="deforestation" className="pt-4">
              <div className="h-[300px]">
                <SimpleLineChart title="Deforestation Rate (hectares/month)" />
              </div>
              <Alert className="mt-4" variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Deforestation rate in the North Zone exceeds permitted limits by 15%.
                </AlertDescription>
              </Alert>
            </TabsContent>
            <TabsContent value="biodiversity" className="pt-4">
              <div className="h-[300px]">
                <SimpleBarChart title="Biodiversity Index by Area" />
              </div>
              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  Biodiversity index has decreased by 8% in the East Zone compared to baseline.
                </AlertDescription>
              </Alert>
            </TabsContent>
            <TabsContent value="soil" className="pt-4">
              <div className="h-[300px]">
                <SimplePieChart title="Soil Quality Parameters" />
              </div>
              <Alert className="mt-4">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Good Status</AlertTitle>
                <AlertDescription>
                  Soil quality parameters are within acceptable ranges in all monitored areas.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TreePine className="h-5 w-5" />
            Deforestation
          </CardTitle>
          <CardDescription>Total area (hectares)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">124.5</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-red-500">↑ 12%</span> from last year
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div>North Zone: 45.2 ha</div>
              <div className="text-red-500">Critical</div>
            </div>
            <Progress value={90} className="h-2" />

            <div className="flex items-center justify-between text-sm">
              <div>South Zone: 32.8 ha</div>
              <div className="text-amber-500">Warning</div>
            </div>
            <Progress value={65} className="h-2" />

            <div className="flex items-center justify-between text-sm">
              <div>East Zone: 28.3 ha</div>
              <div className="text-amber-500">Warning</div>
            </div>
            <Progress value={56} className="h-2" />

            <div className="flex items-center justify-between text-sm">
              <div>West Zone: 18.2 ha</div>
              <div className="text-green-500">Normal</div>
            </div>
            <Progress value={36} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fish className="h-5 w-5" />
            Biodiversity
          </CardTitle>
          <CardDescription>Species count and index</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">0.72</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-amber-500">↓ 8%</span> from baseline
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <div className="mb-1 text-sm font-medium">Mammals</div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-semibold">24</div>
                <div className="text-xs text-red-500">-3 species</div>
              </div>
            </div>
            <div>
              <div className="mb-1 text-sm font-medium">Birds</div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-semibold">78</div>
                <div className="text-xs text-amber-500">-5 species</div>
              </div>
            </div>
            <div>
              <div className="mb-1 text-sm font-medium">Amphibians</div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-semibold">12</div>
                <div className="text-xs text-red-500">-2 species</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Soil Quality
          </CardTitle>
          <CardDescription>Contamination levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">Medium</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-amber-500">↑ 5%</span> contamination from last quarter
          </p>
          <div className="mt-4 h-[200px]">
            <SimplePieChart title="Soil Contamination by Type" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

