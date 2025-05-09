import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import NewConnectionForm from "@/components/cognito/integrations/new-connection-form"
import CognitoNavigation from "@/components/cognito/navigation"

export default function NewConnectionPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/cognito/integrations">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">New Connection</h1>
            <p className="text-muted-foreground">Connect to an external platform or service</p>
          </div>
        </div>
      </div>

      <CognitoNavigation />

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Connection</CardTitle>
          <CardDescription>
            Set up a new connection to an advertising platform, analytics service, or other data source.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewConnectionForm />
        </CardContent>
      </Card>
    </div>
  )
}
