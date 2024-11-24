import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { format, parseISO } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Edit2, Trash2, Plus } from 'lucide-react'
import { ShiftForm } from './shifts/ShiftForm'
import { LoadingSpinner } from './LoadingSpinner'

export function Shifts() {
  const [editingShift, setEditingShift] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWorkplace, setSelectedWorkplace] = useState<string | null>(null)
  const { shifts, workplaces, loading, deleteShift } = useStore()

  if (loading) {
    return <LoadingSpinner />
  }

  const filteredShifts = shifts
    .filter(shift => {
      if (selectedWorkplace && shift.workplaceId !== selectedWorkplace) return false
      if (!searchTerm) return true
      
      const workplace = workplaces.find(w => w.id === shift.workplaceId)
      const position = workplace?.positions.find(p => p.id === shift.positionId)
      
      const searchString = `
        ${format(typeof shift.date === 'string' ? parseISO(shift.date) : shift.date, 'PPP')}
        ${workplace?.name}
        ${position?.title}
      `.toLowerCase()
      
      return searchString.includes(searchTerm.toLowerCase())
    })
    .sort((a, b) => {
      const dateA = typeof a.date === 'string' ? parseISO(a.date) : a.date
      const dateB = typeof b.date === 'string' ? parseISO(b.date) : b.date
      return dateB.getTime() - dateA.getTime()
    })

  const handleDelete = async (shiftId: string) => {
    if (confirm('Are you sure you want to delete this shift?')) {
      await deleteShift(shiftId)
    }
  }

  if (editingShift) {
    return (
      <div className="max-w-2xl mx-auto">
        <ShiftForm 
          shiftId={editingShift} 
          onComplete={() => setEditingShift(null)} 
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shifts</h1>
          <p className="text-muted-foreground">
            Manage and track your work shifts
          </p>
        </div>
        <Button onClick={() => setEditingShift('new')}>
          <Plus className="mr-2 h-4 w-4" /> Add Shift
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shift History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label className="sr-only">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search shifts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="w-full sm:w-[200px]">
                <Label className="sr-only">Filter by workplace</Label>
                <Select
                  value={selectedWorkplace || undefined}
                  onValueChange={setSelectedWorkplace}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All workplaces" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All workplaces</SelectItem>
                    {workplaces.map(workplace => (
                      <SelectItem key={workplace.id} value={workplace.id}>
                        {workplace.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Workplace</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Tips</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShifts.map(shift => {
                      const workplace = workplaces.find(w => w.id === shift.workplaceId)
                      const position = workplace?.positions.find(p => p.id === shift.positionId)

                      return (
                        <TableRow key={shift.id}>
                          <TableCell>
                            {format(
                              typeof shift.date === 'string' ? parseISO(shift.date) : shift.date,
                              'MMM d, yyyy'
                            )}
                          </TableCell>
                          <TableCell>{workplace?.name}</TableCell>
                          <TableCell>{position?.title}</TableCell>
                          <TableCell>{shift.hoursWorked}h</TableCell>
                          <TableCell>${(shift.cashTips + shift.cardTips).toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingShift(shift.id)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(shift.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {filteredShifts.map(shift => {
                const workplace = workplaces.find(w => w.id === shift.workplaceId)
                const position = workplace?.positions.find(p => p.id === shift.positionId)

                return (
                  <div key={shift.id} className="p-4 rounded-lg border">
                    <div className="grid grid-cols-2 gap-2">
                      {/* Top Left: Date */}
                      <div>
                        <div className="text-sm font-medium">
                          {format(
                            typeof shift.date === 'string' ? parseISO(shift.date) : shift.date,
                            'MMM d, yyyy'
                          )}
                        </div>
                      </div>

                      {/* Top Right: Actions */}
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingShift(shift.id)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(shift.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Bottom Left: Workplace and Hours */}
                      <div>
                        <div className="font-medium">{workplace?.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {position?.title} • {shift.hoursWorked}h
                        </div>
                      </div>

                      {/* Bottom Right: Tips */}
                      <div className="text-right">
                        <div className="font-medium">
                          ${(shift.cashTips + shift.cardTips).toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">Tips</div>
                      </div>
                    </div>
                  </div>
                )
              })}
              {filteredShifts.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No shifts found</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}