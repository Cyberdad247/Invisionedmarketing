"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FormDescription } from "@/components/ui/form"
import { useState, useEffect } from "react"

interface MemoryConfigProps {
  value: {
    memoryType: string
    messageWindow?: number
  }
  onChange: (value: any) => void
}

export default function MemoryConfiguration({ value, onChange }: MemoryConfigProps) {
  const [memoryType, setMemoryType] = useState(value.memoryType || "conversation")
  const [messageWindow, setMessageWindow] = useState(value.messageWindow?.toString() || "10")

  useEffect(() => {
    onChange({
      memoryType,
      messageWindow: Number.parseInt(messageWindow, 10),
    })
  }, [memoryType, messageWindow, onChange])

  return (
    <div className="space-y-4 border rounded-lg p-4">
      <div>
        <h3 className="text-base font-medium">Memory Configuration</h3>
        <p className="text-sm text-muted-foreground">Configure how your agent remembers past interactions.</p>
      </div>

      <RadioGroup value={memoryType} onValueChange={setMemoryType}>
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="none" id="memory-none" />
          <div className="grid gap-1.5">
            <Label htmlFor="memory-none">No Memory</Label>
            <FormDescription>Agent doesn't remember previous messages in the conversation.</FormDescription>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <RadioGroupItem value="conversation" id="memory-conversation" />
          <div className="grid gap-1.5 w-full">
            <Label htmlFor="memory-conversation">Conversation Memory</Label>
            <FormDescription>Agent remembers previous messages in the current conversation.</FormDescription>

            {memoryType === "conversation" && (
              <div className="mt-2">
                <Label htmlFor="message-window" className="text-xs">
                  Message Window
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="message-window"
                    type="number"
                    min="1"
                    max="100"
                    value={messageWindow}
                    onChange={(e) => setMessageWindow(e.target.value)}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">messages</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <RadioGroupItem value="vector" id="memory-vector" />
          <div className="grid gap-1.5">
            <Label htmlFor="memory-vector">Vector Memory</Label>
            <FormDescription>
              Agent stores conversation history in a vector database for long-term memory.
            </FormDescription>
          </div>
        </div>
      </RadioGroup>
    </div>
  )
}
