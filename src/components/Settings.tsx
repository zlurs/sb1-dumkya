import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ProfileSettings } from './settings/ProfileSettings'
import { WorkplaceSettings } from './settings/WorkplaceSettings'
import { PreferenceSettings } from './settings/PreferenceSettings'

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and application settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="workplaces">Workplaces</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="workplaces" className="space-y-4">
          <WorkplaceSettings />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <PreferenceSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}