import { useState, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ShiftFormProps {
  shiftId?: string
  onComplete: () => void
}

export function ShiftForm({ shiftId, onComplete }: ShiftFormProps) {
  const { user, workplaces, shifts, addShift, updateShift } = useStore()
  const [selectedWorkplace, setSelectedWorkplace] = useState<string | null>(null)
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)
  const [hoursWorked, setHoursWorked] = useState('')
  const [tips, setTips] = useState('')

  const isEditing = shiftId && shiftId !== 'new'
  const existingShift = isEditing ? shifts.find(s => s.id === shiftId) : null

  useEffect(() => {
    if (existingShift) {
      setSelectedWorkplace(existingShift.workplaceId)
      setSelectedPosition(existingShift.positionId)
      setHoursWorked(existingShift.hoursWorked.toString())
      setTips((existingShift.cashTips + existingShift.cardTips).toString())
    }
  }, [existingShift])

  const workplace = workplaces.find(w => w.id === selectedWorkplace)
  const positions = workplace?.positions || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const workplace = workplaces.find(w => w.id === selectedWorkplace)
    const position = workplace?.positions.find(p => p.id === selectedPosition)

    if (workplace && position) {
      const shiftData = {
        userId: user.id,
        date: existingShift?.date || new Date(),
        workplaceId: workplace.id,
        positionId: position.id,
        hoursWorked: Number(hoursWorked),
        cashTips: Number(tips),
        cardTips: 0,
        hourlyWage: position.hourlyWage
      }

      if (isEditing && shiftId) {
        await updateShift(shiftId, shiftData)
      } else {
        await addShift(shiftData)
      }
      onComplete()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Shift' : 'Add New Shift'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Workplace</Label>
              <Select
                value={selectedWorkplace || undefined}
                onValueChange={setSelectedWorkplace}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select workplace" />
                </SelectTrigger>
                <SelectContent>
                  {workplaces.map(workplace => (
                    <SelectItem key={workplace.id} value={workplace.id}>
                      {workplace.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Position</Label>
              <Select
                value={selectedPosition || undefined}
                onValueChange={setSelectedPosition}
                disabled={!selectedWorkplace}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map(position => (
                    <SelectItem key={position.id} value={position.id}>
                      {position.title} (${position.hourlyWage}/hr)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Hours Worked</Label>
              <Input
                type="number"
                step="0.1"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Tips</Label>
              <Input
                type="number"
                step="0.01"
                value={tips}
                onChange={(e) => setTips(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onComplete} className="w-full">
              Cancel
            </Button>
            <Button type="submit" className="w-full">
              {isEditing ? 'Update Shift' : 'Save Shift'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}