import { useState } from 'react'
import { format, startOfMonth, endOfMonth, isSameDay, parseISO, addMonths, subMonths } from 'date-fns'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarGrid } from './calendar/CalendarGrid'
import { DayDetails } from './calendar/DayDetails'
import { LoadingSpinner } from './LoadingSpinner'

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const { shifts, loading } = useStore()

  if (loading) {
    return <LoadingSpinner />
  }

  const start = startOfMonth(currentDate)
  const end = endOfMonth(currentDate)

  const getDayIncome = (date: Date) => {
    return shifts
      .filter(shift => {
        const shiftDate = typeof shift.date === 'string' ? parseISO(shift.date) : shift.date
        return isSameDay(shiftDate, date)
      })
      .reduce((sum, shift) => sum + shift.cashTips + shift.cardTips, 0)
  }

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(currentDate.getFullYear(), i)
    return {
      value: i.toString(),
      label: format(date, 'MMMM')
    }
  })

  const years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - 5 + i
    return {
      value: year.toString(),
      label: year.toString()
    }
  })

  if (selectedDate) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            {format(selectedDate, 'MMMM d, yyyy')}
          </h1>
          <Button variant="outline" onClick={() => setSelectedDate(null)}>
            Back to Calendar
          </Button>
        </div>
        <DayDetails date={selectedDate} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            View and manage your shifts by date
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex w-full sm:w-auto gap-2">
            <Select
              value={currentDate.getMonth().toString()}
              onValueChange={(value) => {
                setCurrentDate(new Date(currentDate.getFullYear(), parseInt(value)))
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map(month => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={currentDate.getFullYear().toString()}
              onValueChange={(value) => {
                setCurrentDate(new Date(parseInt(value), currentDate.getMonth()))
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <CalendarGrid
            start={start}
            end={end}
            currentDate={currentDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            getDayIncome={getDayIncome}
          />
        </CardContent>
      </Card>
    </div>
  )
}