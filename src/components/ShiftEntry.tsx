import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export function ShiftEntry() {
  const navigate = useNavigate()
  const { user, workplaces, addShift } = useStore()
  const [selectedWorkplace, setSelectedWorkplace] = useState('')
  const [selectedPosition, setSelectedPosition] = useState('')
  const [hoursWorked, setHoursWorked] = useState('')
  const [cashTips, setCashTips] = useState('')
  const [cardTips, setCardTips] = useState('')

  const workplace = workplaces.find(w => w.id === selectedWorkplace)
  const positions = workplace?.positions || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const workplace = workplaces.find(w => w.id === selectedWorkplace)
    const position = workplace?.positions.find(p => p.id === selectedPosition)

    if (workplace && position) {
      const newShift = {
        userId: user.id,
        date: new Date(),
        workplaceId: workplace.id,
        positionId: position.id,
        hoursWorked: Number(hoursWorked),
        cashTips: Number(cashTips),
        cardTips: Number(cardTips),
        hourlyWage: position.hourlyWage
      }
      await addShift(newShift)
      navigate('/')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>New Shift Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Workplace</Label>
                <Select
                  value={selectedWorkplace}
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
                  value={selectedPosition}
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
                <Label>Cash Tips</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={cashTips}
                  onChange={(e) => setCashTips(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Card Tips</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={cardTips}
                  onChange={(e) => setCardTips(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} className="w-full">
                Cancel
              </Button>
              <Button type="submit" className="w-full">
                Save Shift
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}