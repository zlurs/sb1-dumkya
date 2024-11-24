import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { LoadingSpinner } from '../LoadingSpinner'

interface WorkplaceFormData {
  name: string
  location: string
}

interface PositionFormData {
  title: string
  hourlyWage: string
}

export function WorkplaceSettings() {
  const { workplaces, loading, addWorkplace, updateWorkplace, deleteWorkplace } = useStore()
  const [expandedWorkplace, setExpandedWorkplace] = useState<string | null>(null)
  const [editingWorkplace, setEditingWorkplace] = useState<string | null>(null)
  const [workplaceForm, setWorkplaceForm] = useState<WorkplaceFormData>({ name: '', location: '' })
  const [positionForm, setPositionForm] = useState<PositionFormData>({ title: '', hourlyWage: '' })
  const [editingPosition, setEditingPosition] = useState<{workplaceId: string, positionId?: string} | null>(null)

  if (loading) {
    return <LoadingSpinner />
  }

  const handleSaveWorkplace = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingWorkplace === 'new') {
      await addWorkplace({
        name: workplaceForm.name,
        location: workplaceForm.location,
        positions: []
      })
    } else if (editingWorkplace) {
      await updateWorkplace(editingWorkplace, {
        name: workplaceForm.name,
        location: workplaceForm.location
      })
    }
    setEditingWorkplace(null)
    setWorkplaceForm({ name: '', location: '' })
  }

  const handleEditWorkplace = (workplace: { id: string; name: string; location: string }) => {
    setEditingWorkplace(workplace.id)
    setWorkplaceForm({ name: workplace.name, location: workplace.location })
  }

  const handleDeleteWorkplace = async (workplaceId: string) => {
    if (confirm('Are you sure you want to delete this workplace?')) {
      await deleteWorkplace(workplaceId)
    }
  }

  const handleSavePosition = async (workplaceId: string) => {
    const workplace = workplaces.find(w => w.id === workplaceId)
    if (!workplace) return

    const position = {
      id: editingPosition?.positionId || Date.now().toString(),
      title: positionForm.title,
      hourlyWage: Number(positionForm.hourlyWage)
    }

    const updatedPositions = editingPosition?.positionId
      ? workplace.positions.map(p => p.id === editingPosition.positionId ? position : p)
      : [...workplace.positions, position]

    await updateWorkplace(workplaceId, { positions: updatedPositions })
    setEditingPosition(null)
    setPositionForm({ title: '', hourlyWage: '' })
  }

  const handleEditPosition = (workplaceId: string, position: { id: string; title: string; hourlyWage: number }) => {
    setEditingPosition({ workplaceId, positionId: position.id })
    setPositionForm({ title: position.title, hourlyWage: position.hourlyWage.toString() })
  }

  const handleDeletePosition = async (workplaceId: string, positionId: string) => {
    const workplace = workplaces.find(w => w.id === workplaceId)
    if (!workplace) return

    const updatedPositions = workplace.positions.filter(p => p.id !== positionId)
    await updateWorkplace(workplaceId, { positions: updatedPositions })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Workplaces</h2>
          <p className="text-sm text-muted-foreground">
            Manage your workplaces and positions
          </p>
        </div>
        <Button onClick={() => {
          setEditingWorkplace('new')
          setWorkplaceForm({ name: '', location: '' })
        }}>
          <Plus className="mr-2 h-4 w-4" /> Add Workplace
        </Button>
      </div>

      <div className="space-y-4">
        {workplaces.map(workplace => (
          <Card key={workplace.id}>
            <CardHeader className="cursor-pointer" onClick={() => setExpandedWorkplace(
              expandedWorkplace === workplace.id ? null : workplace.id
            )}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{workplace.name}</CardTitle>
                  <CardDescription>{workplace.location}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditWorkplace(workplace)
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteWorkplace(workplace.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {expandedWorkplace === workplace.id ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              </div>
            </CardHeader>
            {expandedWorkplace === workplace.id && (
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Positions</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingPosition({ workplaceId: workplace.id })
                        setPositionForm({ title: '', hourlyWage: '' })
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Position
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {workplace.positions.map(position => (
                      <div
                        key={position.id}
                        className="flex items-center justify-between p-2 rounded-lg border"
                      >
                        <div>
                          <p className="font-medium">{position.title}</p>
                          <p className="text-sm text-muted-foreground">
                            ${position.hourlyWage}/hr
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditPosition(workplace.id, position)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePosition(workplace.id, position.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {editingWorkplace && (
        <Card>
          <CardHeader>
            <CardTitle>{editingWorkplace === 'new' ? 'Add Workplace' : 'Edit Workplace'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveWorkplace} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={workplaceForm.name}
                  onChange={(e) => setWorkplaceForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={workplaceForm.location}
                  onChange={(e) => setWorkplaceForm(prev => ({ ...prev, location: e.target.value }))}
                  required
                />
              </div>
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setEditingWorkplace(null)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {editingPosition && (
        <Card>
          <CardHeader>
            <CardTitle>{editingPosition.positionId ? 'Edit Position' : 'Add Position'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault()
              handleSavePosition(editingPosition.workplaceId)
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={positionForm.title}
                  onChange={(e) => setPositionForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourlyWage">Hourly Wage</Label>
                <Input
                  id="hourlyWage"
                  type="number"
                  step="0.01"
                  value={positionForm.hourlyWage}
                  onChange={(e) => setPositionForm(prev => ({ ...prev, hourlyWage: e.target.value }))}
                  required
                />
              </div>
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setEditingPosition(null)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}