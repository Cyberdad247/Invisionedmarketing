import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PerformanceTracking from "@/components/cognito/performance/performance-tracking"
import FeedbackLoop from "@/components/cognito/performance/feedback-loop"
import ABTestingFramework from "@/components/cognito/performance/ab-testing-framework"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PerformancePage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/cognito">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Performance Monitoring & Improvement</h1>
          <p className="text-muted-foreground">Track, analyze, and enhance agent performance</p>
        </div>
      </div>

      <Tabs defaultValue="tracking" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="tracking">Performance Tracking</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Loop</TabsTrigger>
          <TabsTrigger value="testing">A/B Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="tracking" className="space-y-6">
          <PerformanceTracking />
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <FeedbackLoop />
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <ABTestingFramework />
        </TabsContent>
      </Tabs>
    </div>
  )
}
