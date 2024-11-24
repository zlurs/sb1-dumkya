import { format, parseISO } from 'date-fns'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface DayDetailsProps {
  date: Date
}

export function DayDetails({ date }: DayDetailsProps) {
  const { shifts, workplaces } = useStore()
  const navigate = useNavigate()

  const dayShifts = shifts
    .filter(shift => {
      const shiftDate = typeof shift.date === 'string' ? parseISO(shift.date) : shift.date
      return format(shiftDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    })
    .sort((a, b) => {
      const dateA = typeof a.date === 'string' ? parseISO(a.date) : a.date
      const dateB = typeof b.date === 'string' ? parseISO(b.date) : b.date
      return dateA.getTime() - dateB.getTime()
    })

  const totalIncome = dayShifts.reduce((sum, shift) => sum + shift.cashTips + shift.cardTips, 0)
  const totalHours = dayShifts.reduce((sum, shift) => sum + shift.hoursWorked, 0)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">
          {format(date, 'EEEE, MMMM d, yyyy')}
        </h2>
        {dayShifts.length > 0 && (
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Total: ${totalIncome.toFixed(2)}</span>
            <span>Hours: {totalHours.toFixed(1)}h</span>
          </div>
        )}
      </div>

      {dayShifts.length > 0 ? (
        <div className="space-y-4">
          {dayShifts.map(shift => {
            const workplace = workplaces.find(w => w.id === shift.workplaceId)
            const position = workplace?.positions.find(p => p.id === shift.positionId)

            return (
              <div
                key={shift.id}
                className="flex flex-col space-y-1 rounded-lg border p-3"
              >
                <div className="flex justify-between">
                  <span className="font-medium">{workplace?.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {position?.title}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tips:</span>
                  <span>${(shift.cashTips + shift.cardTips).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hours:</span>
                  <span>{shift.hoursWorked}h</span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-muted-foreground mb-4">No shifts recorded for this day</p>
          <Button onClick={() => navigate('/shifts')}>
            <Plus className="mr-2 h-4 w-4" /> Add Shift
          </Button>
        </div>
      )}
    </div>
  )
}