import { Badge } from "@/components/ui/badge"

export function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "active":
      return <Badge className="bg-electric/20 text-electric border-electric">Active</Badge>
    case "idle":
      return <Badge className="bg-gold/20 text-gold border-gold">Idle</Badge>
    case "offline":
      return <Badge className="bg-gray-700/20 text-gray-400 border-gray-700">Offline</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}