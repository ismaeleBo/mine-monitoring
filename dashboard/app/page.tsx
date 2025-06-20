"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WaterQualityDashboard } from "@/components/water-quality/water-quality-dashboard";
import { TerritorialImpactDashboard } from "@/components/territorial-impact-dashboard";
import { AirQualityDashboard } from "@/components/air-quality/air-quality-dashboard";
import { SoilQualityDashboard } from "@/components/soil-quality/soil-quality-dashboard";

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Tabs defaultValue="air" className="col-span-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="air">Air Quality</TabsTrigger>
          <TabsTrigger value="water">Water Quality</TabsTrigger>
          <TabsTrigger value="soil">Soil Quality</TabsTrigger>
          <TabsTrigger value="territory">Territorial Impact</TabsTrigger>
        </TabsList>
        <TabsContent value="air" className="border-none p-0 pt-4">
          <AirQualityDashboard />
        </TabsContent>
        <TabsContent value="water" className="border-none p-0 pt-4">
          <WaterQualityDashboard />
        </TabsContent>
        <TabsContent value="soil" className="border-none p-0 pt-4">
          <SoilQualityDashboard />
        </TabsContent>
        <TabsContent value="territory" className="border-none p-0 pt-4">
          <TerritorialImpactDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
