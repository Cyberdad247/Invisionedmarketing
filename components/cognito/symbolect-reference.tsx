import { Card, CardContent } from "@/components/ui/card"

export default function SymbolectReference() {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium mb-3">Symbolect Symbols</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col items-center p-2 border rounded">
            <div className="text-2xl mb-1">👤</div>
            <div className="text-xs text-center">Human Review</div>
          </div>
          <div className="flex flex-col items-center p-2 border rounded">
            <div className="text-2xl mb-1">✅</div>
            <div className="text-xs text-center">Approval</div>
          </div>
          <div className="flex flex-col items-center p-2 border rounded">
            <div className="text-2xl mb-1">❌</div>
            <div className="text-xs text-center">Rejection</div>
          </div>
          <div className="flex flex-col items-center p-2 border rounded">
            <div className="text-2xl mb-1">✏️</div>
            <div className="text-xs text-center">Edit</div>
          </div>
          <div className="flex flex-col items-center p-2 border rounded">
            <div className="text-2xl mb-1">📈</div>
            <div className="text-xs text-center">Performance</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
