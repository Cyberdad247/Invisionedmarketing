import { useNavigate } from "react-router-dom"
import WorkflowEditor from "../components/WorkflowEditor"
import { toast } from "@/components/ui/use-toast"

export default function WorkflowCreatePage() {
  const navigate = useNavigate()

  const handleSaveWorkflow = async (workflow) => {
    try {
      // This would be replaced with your actual API call
      // const response = await fetch('/api/workflows', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(workflow),
      // })
      // const data = await response.json()

      // Mock successful save
      toast({
        title: "Workflow created",
        description: `Workflow "${workflow.name}" has been created successfully.`,
      })

      // Navigate to workflows list
      navigate("/workflows")
    } catch (error) {
      console.error("Error saving workflow:", error)
      toast({
        title: "Error",
        description: "Failed to create workflow. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Create New Workflow</h1>
      <WorkflowEditor onSave={handleSaveWorkflow} />
    </div>
  )
}
