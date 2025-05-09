import type React from "react"
import { cn } from "@/lib/utils"

interface CodeProps {
  children: React.ReactNode
  className?: string
  language?: string
  showLineNumbers?: boolean
}

export function Code({ children, className, language, showLineNumbers = false, ...props }: CodeProps) {
  return (
    <div className="relative w-full">
      {language && (
        <div className="absolute right-4 top-3 z-10 rounded-md bg-slate-900/20 px-2 py-1 text-xs font-medium text-slate-100">
          {language}
        </div>
      )}
      <pre
        className={cn(
          "mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-slate-950 py-4 dark:bg-slate-950",
          showLineNumbers && "line-numbers",
          className,
        )}
        {...props}
      >
        <code className={cn("relative rounded bg-slate-950 px-[1rem] py-[1rem] font-mono text-sm text-slate-50")}>
          {children}
        </code>
      </pre>
    </div>
  )
}
