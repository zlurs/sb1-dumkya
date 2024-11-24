import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface CalendarGridProps {
  start: Date
  end: Date
  currentDate: Date
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
  getDayIncome: (date: Date) => number
}

export function CalendarGrid({
  start,
  end,
  currentDate,
  selectedDate,
  onSelectDate,
  getDayIncome
}: CalendarGridProps) {
  const weekStart = startOfWeek(start)
  const weekEnd = endOfWeek(end)
  const calendarDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const getIncomeColor = (income: number) => {
    if (income === 0) return ''
    if (income > 200) return 'text-green-500'
    if (income > 100) return 'text-blue-500'
    return 'text-yellow-500'
  }

  return (
    <div className="grid h-[calc(100vh-24rem)] sm:h-[32rem] grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div
          key={day}
          className="bg-card p-2 text-center text-xs font-medium text-muted-foreground"
        >
          {day}
        </div>
      ))}
      
      {calendarDays.map(day => {
        const income = getDayIncome(day)
        const isSelected = selectedDate ? day.getTime() === selectedDate.getTime() : false
        const isCurrentMonth = day.getMonth() === currentDate.getMonth()

        return (
          <Button
            key={day.toString()}
            variant="ghost"
            className={cn(
              'h-auto rounded-none p-1.5 font-normal flex flex-col items-start justify-start',
              !isCurrentMonth && 'text-muted-foreground/50',
              isSelected && 'bg-accent text-accent-foreground'
            )}
            onClick={() => onSelectDate(day)}
          >
            <span className="text-sm">{format(day, 'd')}</span>
            {income > 0 && (
              <span className={cn('text-xs font-medium mt-auto', getIncomeColor(income))}>
                ${income.toFixed(0)}
              </span>
            )}
          </Button>
        )
      })}
    </div>
  )
}