import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard-header";
import { WaterQualityDashboard } from "@/components/water-quality-dashboard";
import { WasteManagementDashboard } from "@/components/waste-management-dashboard";
import { TerritorialImpactDashboard } from "@/components/territorial-impact-dashboard";
import { AirQualityDashboard } from "@/components/air-quality";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Tabs defaultValue="air" className="col-span-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="air">Air Quality</TabsTrigger>
              <TabsTrigger value="water">Water Quality</TabsTrigger>
              <TabsTrigger value="waste">Waste Management</TabsTrigger>
              <TabsTrigger value="territory">Territorial Impact</TabsTrigger>
            </TabsList>
            <TabsContent value="air" className="border-none p-0 pt-4">
              <AirQualityDashboard />
            </TabsContent>
            <TabsContent value="water" className="border-none p-0 pt-4">
              <WaterQualityDashboard />
            </TabsContent>
            <TabsContent value="waste" className="border-none p-0 pt-4">
              <WasteManagementDashboard />
            </TabsContent>
            <TabsContent value="territory" className="border-none p-0 pt-4">
              <TerritorialImpactDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
