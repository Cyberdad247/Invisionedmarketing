import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import RoleBasedAccess from "@/components/cognito/security/role-based-access"
import DataEncryption from "@/components/cognito/security/data-encryption"
import ComplianceChecks from "@/components/cognito/security/compliance-checks"
import CognitoNavigation from "@/components/cognito/navigation"

export default function SecurityPage() {
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
            <h1 className="text-2xl font-bold">Security & Compliance</h1>
            <p className="text-muted-foreground">Manage security settings and compliance requirements</p>
          </div>
        </div>
      </div>

      <CognitoNavigation />

      <Tabs defaultValue="rbac" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rbac">Role-Based Access</TabsTrigger>
          <TabsTrigger value="encryption">Data Encryption</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Checks</TabsTrigger>
        </TabsList>

        <TabsContent value="rbac" className="space-y-6">
          <RoleBasedAccess />
        </TabsContent>

        <TabsContent value="encryption" className="space-y-6">
          <DataEncryption />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <ComplianceChecks />
        </TabsContent>
      </Tabs>
    </div>
  )
}
