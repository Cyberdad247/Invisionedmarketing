"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, GitBranch, Clock, UserCheck, BarChart, HelpCircle } from "lucide-react"
import type { NodeType } from "@/types/workflow"

interface WorkflowBuilderToolbarProps {
  onAddNode: (type: NodeType) => void
}

export default function WorkflowBuilderToolbar({ onAddNode }: WorkflowBuilderToolbarProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium mb-3">Add Node</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => onAddNode("agent")} className="justify-start">
            <Bot className="h-4 w-4 mr-2" />
            Agent
          </Button>
          <Button variant="outline" onClick={() => onAddNode("condition")} className="justify-start">
            <GitBranch className="h-4 w-4 mr-2" />
            Condition
          </Button>
          <Button variant="outline" onClick={() => onAddNode("trigger")} className="justify-start">
            <Clock className="h-4 w-4 mr-2" />
            Trigger
          </Button>
          <Button variant="outline" onClick={() => onAddNode("hitl")} className="justify-start">
            <UserCheck className="h-4 w-4 mr-2" />
            Human Review
          </Button>
          <Button variant="outline" onClick={() => onAddNode("metric")} className="justify-start">
            <BarChart className="h-4 w-4 mr-2" />
            Metric
          </Button>
          <Button variant="outline" onClick={() => onAddNode("decision")} className="justify-start">
            <HelpCircle className="h-4 w-4 mr-2" />
            Decision
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
