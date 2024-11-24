import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function NotificationSettings() {
  const [shiftReminders, setShiftReminders] = useState(true)
  const [unloggedShifts, setUnloggedShifts] = useState(true)
  const [summaryFrequency, setSummaryFrequency] = useState('weekly')
  const [pushNotifications, setPushNotifications] = useState(true)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Manage how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Shift Reminders</Label>
            <div className="text-sm text-muted-foreground">
              Receive reminders for upcoming shifts
            </div>
          </div>
          <Switch
            checked={shiftReminders}
            onCheckedChange={setShiftReminders}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Unlogged Shift Alerts</Label>
            <div className="text-sm text-muted-foreground">
              Get notified about shifts you haven't logged
            </div>
          </div>
          <Switch
            checked={unloggedShifts}
            onCheckedChange={setUnloggedShifts}
          />
        </div>

        <div className="space-y-2">
          <Label>Summary Reports</Label>
          <Select value={summaryFrequency} onValueChange={setSummaryFrequency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Push Notifications</Label>
            <div className="text-sm text-muted-foreground">
              Enable push notifications on your device
            </div>
          </div>
          <Switch
            checked={pushNotifications}
            onCheckedChange={setPushNotifications}
          />
        </div>
      </CardContent>
    </Card>
  )
}