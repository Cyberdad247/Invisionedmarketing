"use client"

import type React from "react"

import { Bot, GitBranch, Clock, UserCheck, BarChart, HelpCircle, Play, CheckCircle } from "lucide-react"
import type { NodeType } from "@/types/workflow"

interface SymbolectNodeProps {
  type: NodeType
  isSelected: boolean
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent) => void
  onMouseDown?: (e: React.MouseEvent) => void
}

export default function SymbolectNode({
  type,
  isSelected,
  children,
  className = "",
  onClick,
  onMouseDown,
}: SymbolectNodeProps) {
  const baseNodeClasses = `
    flex items-center justify-center rounded-lg shadow-md border-2
    ${isSelected ? "border-primary" : "border-gray-200"}
    transition-all duration-200
    ${className}
  `

  // Get background color based on node type
  const getBgColor = () => {
    switch (type) {
      case "start":
        return "bg-green-100"
      case "end":
        return "bg-red-100"
      case "agent":
        return "bg-blue-100"
      case "condition":
        return "bg-yellow-100"
      case "trigger":
        return "bg-purple-100"
      case "hitl":
        return "bg-pink-100"
      case "metric":
        return "bg-cyan-100"
      case "decision":
        return "bg-amber-100"
      default:
        return "bg-gray-100"
    }
  }

  // Get icon based on node type
  const getIcon = () => {
    switch (type) {
      case "start":
        return <Play className="h-4 w-4 mx-auto mb-1" />
      case "end":
        return <CheckCircle className="h-4 w-4 mx-auto mb-1" />
      case "agent":
        return <Bot className="h-4 w-4 mx-auto mb-1" />
      case "condition":
        return <GitBranch className="h-4 w-4 mx-auto mb-1" />
      case "trigger":
        return <Clock className="h-4 w-4 mx-auto mb-1" />
      case "hitl":
        return <UserCheck className="h-4 w-4 mx-auto mb-1" />
      case "metric":
        return <BarChart className="h-4 w-4 mx-auto mb-1" />
      case "decision":
        return <HelpCircle className="h-4 w-4 mx-auto mb-1" />
      default:
        return null
    }
  }

  // Get Symbolect symbol based on node type
  const getSymbolectSymbol = () => {
    switch (type) {
      case "hitl":
        return <div className="text-lg absolute -top-2 -right-2">👤</div>
      case "condition":
        return type === "condition" && <div className="text-lg absolute -top-2 -right-2">📊</div>
      default:
        return null
    }
  }

  return (
    <div className={`${baseNodeClasses} ${getBgColor()} relative`} onClick={onClick} onMouseDown={onMouseDown}>
      {getSymbolectSymbol()}
      <div className="text-center p-2">
        {getIcon()}
        {children}
      </div>
    </div>
  )
}
