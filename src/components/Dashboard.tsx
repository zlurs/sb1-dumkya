import { useState } from 'react'
import { useStore } from '../store/useStore'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameWeek,
  isSameDay,
  parseISO, 
  eachMonthOfInterval, 
  eachWeekOfInterval, 
  eachDayOfInterval,
  addYears,
  addMonths,
  addWeeks,
  subYears,
  subMonths,
  subWeeks
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoadingSpinner } from './LoadingSpinner'
import { StatsCards } from './dashboard/StatsCards'
import { OverviewChart } from './dashboard/OverviewChart'

export function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState('month')
  const { shifts, loading } = useStore()

  if (loading) {
    return <LoadingSpinner />
  }

  const getDateRange = () => {
    switch (view) {
      case 'year':
        return {
          start: startOfYear(currentDate),
          end: endOfYear(currentDate)
        }
      case 'month':
        return {
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        }
      case 'week':
        return {
          start: startOfWeek(currentDate),
          end: endOfWeek(currentDate)
        }
      default:
        return {
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        }
    }
  }

  const filterShiftsByDate = () => {
    const { start, end } = getDateRange()
    return shifts.filter(shift => {
      const shiftDate = typeof shift.date === 'string' ? parseISO(shift.date) : shift.date
      return shiftDate >= start && shiftDate <= end
    })
  }

  const filteredShifts = filterShiftsByDate()

  const stats = {
    totalTips: filteredShifts.reduce((sum, shift) => sum + shift.cashTips + shift.cardTips, 0),
    totalHours: filteredShifts.reduce((sum, shift) => sum + shift.hoursWorked, 0),
    averagePerHour: filteredShifts.length > 0
      ? filteredShifts.reduce((sum, shift) => sum + (shift.cashTips + shift.cardTips) / shift.hoursWorked, 0) / filteredShifts.length
      : 0
  }

  const getChartData = () => {
    const { start, end } = getDateRange()
    let intervals: Date[]

    switch (view) {
      case 'year':
        intervals = eachMonthOfInterval({ start, end })
        break
      case 'month':
        intervals = eachWeekOfInterval({ start, end })
        break
      case 'week':
        intervals = eachDayOfInterval({ start, end })
        break
      default:
        intervals = eachWeekOfInterval({ start, end })
    }

    return intervals.map(date => {
      const periodShifts = shifts.filter(shift => {
        const shiftDate = typeof shift.date === 'string' ? parseISO(shift.date) : shift.date
        switch (view) {
          case 'year':
            return isSameMonth(shiftDate, date)
          case 'month':
            return isSameWeek(shiftDate, date)
          case 'week':
            return isSameDay(shiftDate, date)
          default:
            return isSameWeek(shiftDate, date)
        }
      })

      const total = periodShifts.reduce((sum, shift) => sum + shift.cashTips + shift.cardTips, 0)
      const hours = periodShifts.reduce((sum, shift) => sum + shift.hoursWorked, 0)
      const average = hours > 0 ? total / hours : 0

      return {
        date: format(date, view === 'year' ? 'MMM' : view === 'month' ? 'MMM d' : 'EEE'),
        total,
        hours,
        average
      }
    })
  }

  const handlePrevious = () => {
    switch (view) {
      case 'year':
        setCurrentDate(subYears(currentDate, 1))
        break
      case 'month':
        setCurrentDate(subMonths(currentDate, 1))
        break
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1))
        break
    }
  }

  const handleNext = () => {
    switch (view) {
      case 'year':
        setCurrentDate(addYears(currentDate, 1))
        break
      case 'month':
        setCurrentDate(addMonths(currentDate, 1))
        break
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1))
        break
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your earnings and statistics
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Tabs value={view} onValueChange={setView} className="w-full sm:w-[400px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="year">Year</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={handleNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <StatsCards 
          stats={stats}
          view={view}
          shiftsCount={filteredShifts.length}
        />

        <OverviewChart data={getChartData()} />
      </div>
    </div>
  )
}