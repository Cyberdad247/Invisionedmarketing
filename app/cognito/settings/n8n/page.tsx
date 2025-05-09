import { N8nSelfHostedSetup } from "@/components/cognito/n8n-self-hosted-setup"

export default function N8nSettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">n8n Integration Settings</h1>
      <p className="text-muted-foreground mb-8">
        Configure your self-hosted n8n instance to integrate with the Cognito platform.
      </p>

      <N8nSelfHostedSetup />
    </div>
  )
}
