import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, Upload, Cloud } from 'lucide-react'

export function DataSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cloud Backup</CardTitle>
          <CardDescription>
            Keep your data safe with automatic cloud backups
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatic Backup</Label>
              <div className="text-sm text-muted-foreground">
                Automatically backup your data to the cloud
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <Button className="w-full">
            <Cloud className="mr-2 h-4 w-4" /> Backup Now
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export & Import</CardTitle>
          <CardDescription>
            Export your data or import from a backup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select defaultValue="csv">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export Data
            </Button>
          </div>

          <div className="space-y-4">
            <Label>Import Data</Label>
            <Button className="w-full" variant="outline">
              <Upload className="mr-2 h-4 w-4" /> Import from File
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}