import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Clock, TrendingUp } from 'lucide-react'

interface StatsCardsProps {
  stats: {
    totalTips: number
    totalHours: number
    averagePerHour: number
  }
  view: string
  shiftsCount: number
}

export function StatsCards({ stats, view, shiftsCount }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border border-border/40">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tips</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalTips.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            For current {view}
          </p>
        </CardContent>
      </Card>
      <Card className="border border-border/40">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hours Worked</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalHours.toFixed(1)}h</div>
          <p className="text-xs text-muted-foreground">
            {shiftsCount} shifts
          </p>
        </CardContent>
      </Card>
      <Card className="border border-border/40">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Per Hour</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.averagePerHour.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Tips per hour
          </p>
        </CardContent>
      </Card>
    </div>
  )
}