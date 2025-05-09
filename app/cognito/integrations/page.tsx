import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, PlusCircle } from "lucide-react"
import Link from "next/link"
import ApiConnectors from "@/components/cognito/integrations/api-connectors"
import DataMapping from "@/components/cognito/integrations/data-mapping"
import EventProcessing from "@/components/cognito/integrations/event-processing"
import CognitoNavigation from "@/components/cognito/navigation"

export default function IntegrationsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/cognito">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Data Flow & Integration</h1>
            <p className="text-muted-foreground">Connect, transform, and process marketing data</p>
          </div>
        </div>
        <Link href="/cognito/integrations/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Connection
          </Button>
        </Link>
      </div>

      <CognitoNavigation />

      <Tabs defaultValue="connectors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="connectors">API Connectors</TabsTrigger>
          <TabsTrigger value="mapping">Data Mapping</TabsTrigger>
          <TabsTrigger value="processing">Real-time Processing</TabsTrigger>
        </TabsList>

        <TabsContent value="connectors" className="space-y-6">
          <ApiConnectors />
        </TabsContent>

        <TabsContent value="mapping" className="space-y-6">
          <DataMapping />
        </TabsContent>

        <TabsContent value="processing" className="space-y-6">
          <EventProcessing />
        </TabsContent>
      </Tabs>
    </div>
  )
}
