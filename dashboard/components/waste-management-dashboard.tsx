"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, AlertTriangle, Info, CheckCircle, Trash, Recycle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { SimpleLineChart, SimpleBarChart, SimplePieChart } from "@/components/dashboard-charts"

export function WasteManagementDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Waste Management Overview</CardTitle>
            <CardDescription>Monitoring waste production and recycling efficiency</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select waste type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="hazardous">Hazardous</SelectItem>
                <SelectItem value="non-hazardous">Non-Hazardous</SelectItem>
                <SelectItem value="recyclable">Recyclable</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
              <span className="sr-only">Download data</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="production">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="production">Waste Production</TabsTrigger>
              <TabsTrigger value="recycling">Recycling Rate</TabsTrigger>
              <TabsTrigger value="disposal">Disposal Methods</TabsTrigger>
            </TabsList>
            <TabsContent value="production" className="pt-4">
              <div className="h-[300px]">
                <SimpleBarChart title="Waste Production by Type (tons)" />
              </div>
              <Alert className="mt-4" variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Hazardous waste production has increased by 18% compared to last quarter.
                </AlertDescription>
              </Alert>
            </TabsContent>
            <TabsContent value="recycling" className="pt-4">
              <div className="h-[300px]">
                <SimplePieChart title="Recycling Rate by Material" />
              </div>
              <Alert className="mt-4">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Good Status</AlertTitle>
                <AlertDescription>Overall recycling rate has improved by 7% compared to last quarter.</AlertDescription>
              </Alert>
            </TabsContent>
            <TabsContent value="disposal" className="pt-4">
              <div className="h-[300px]">
                <SimpleLineChart title="Waste Disposal Methods" dataKeys={["value2", "value3"]} />
              </div>
              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  Landfill disposal has decreased by 12% as more waste is being recycled or treated.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash className="h-5 w-5" />
            Total Waste
          </CardTitle>
          <CardDescription>Monthly production (tons)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">1,245</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-red-500">↑ 8%</span> from last month
          </p>
          <div className="mt-4 h-[200px]">
            <SimpleBarChart title="Waste Production Trend" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Recycle className="h-5 w-5" />
            Recycling Rate
          </CardTitle>
          <CardDescription>Overall percentage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">42%</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">↑ 7%</span> from last month
          </p>
          <div className="mt-4 h-[200px]">
            <SimplePieChart title="Recycling Rate by Material" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Waste by Type</CardTitle>
          <CardDescription>Monthly breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Hazardous</div>
                <div className="text-sm text-red-500 font-medium">320 tons</div>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-muted">
                <div className="h-full w-[26%] rounded-full bg-red-500"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Non-Hazardous</div>
                <div className="text-sm text-amber-500 font-medium">685 tons</div>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-muted">
                <div className="h-full w-[55%] rounded-full bg-amber-500"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Recyclable</div>
                <div className="text-sm text-green-500 font-medium">240 tons</div>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-muted">
                <div className="h-full w-[19%] rounded-full bg-green-500"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

