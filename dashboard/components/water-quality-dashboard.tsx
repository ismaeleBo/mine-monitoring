"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, AlertTriangle, Info, CheckCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

import { SimpleLineChart, SimpleBarChart } from "@/components/dashboard-charts"

export function WaterQualityDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Water Quality Overview</CardTitle>
            <CardDescription>Monitoring contaminants and pH levels</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select water source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="surface">Surface Water</SelectItem>
                <SelectItem value="underground">Underground Water</SelectItem>
                <SelectItem value="discharge">Discharge Points</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
              <span className="sr-only">Download data</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ph">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ph">pH Levels</TabsTrigger>
              <TabsTrigger value="contaminants">Contaminants</TabsTrigger>
              <TabsTrigger value="toxic">Toxic Substances</TabsTrigger>
            </TabsList>
            <TabsContent value="ph" className="pt-4">
              <div className="h-[300px]">
                <SimpleLineChart title="pH Levels Over Time" />
              </div>
              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  pH levels are within acceptable range (6.5-8.5) for all water sources.
                </AlertDescription>
              </Alert>
            </TabsContent>
            <TabsContent value="contaminants" className="pt-4">
              <div className="h-[300px]">
                <SimpleLineChart title="Contaminant Levels (ppm)" dataKeys={["value2", "value3"]} />
              </div>
              <Alert className="mt-4" variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Heavy metal concentration in discharge points exceeds regulatory limits.
                </AlertDescription>
              </Alert>
            </TabsContent>
            <TabsContent value="toxic" className="pt-4">
              <div className="h-[300px]">
                <SimpleBarChart title="Toxic Substances Detection" />
              </div>
              <Alert className="mt-4">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Good Status</AlertTitle>
                <AlertDescription>No toxic substances detected above threshold levels.</AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>pH Levels</CardTitle>
          <CardDescription>Average across all sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">7.2</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">Optimal range</span>
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div>Surface Water: 7.4</div>
              <div className="text-green-500">Normal</div>
            </div>
            <Progress value={74} className="h-2" />

            <div className="flex items-center justify-between text-sm">
              <div>Underground Water: 6.9</div>
              <div className="text-green-500">Normal</div>
            </div>
            <Progress value={69} className="h-2" />

            <div className="flex items-center justify-between text-sm">
              <div>Discharge Points: 7.3</div>
              <div className="text-green-500">Normal</div>
            </div>
            <Progress value={73} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Heavy Metals</CardTitle>
          <CardDescription>Concentration (ppm)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">0.28</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-red-500">↑ 15%</span> from last month
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div>Lead: 0.05</div>
              <div className="text-green-500">Normal</div>
            </div>
            <Progress value={25} className="h-2" />

            <div className="flex items-center justify-between text-sm">
              <div>Mercury: 0.03</div>
              <div className="text-green-500">Normal</div>
            </div>
            <Progress value={15} className="h-2" />

            <div className="flex items-center justify-between text-sm">
              <div>Arsenic: 0.20</div>
              <div className="text-red-500">High</div>
            </div>
            <Progress value={80} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Turbidity</CardTitle>
          <CardDescription>Clarity measurement (NTU)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">4.8</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-amber-500">↑ 5%</span> from last month
          </p>
          <div className="mt-4 h-[200px]">
            <SimpleLineChart title="Turbidity Trend" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

