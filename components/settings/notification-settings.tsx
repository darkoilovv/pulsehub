"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose what notifications you receive and how they are delivered.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Email Notifications</h3>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-marketing">Marketing emails</Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails about new features, product updates, and offers.
                </p>
              </div>
              <Switch id="email-marketing" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-usage">Usage reports</Label>
                <p className="text-sm text-muted-foreground">Weekly reports about your account usage and limits.</p>
              </div>
              <Switch id="email-usage" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-security">Security alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about security events like password changes.
                </p>
              </div>
              <Switch id="email-security" defaultChecked />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">System Notifications</h3>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="system-campaigns">Campaign status</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when your campaigns start, complete, or encounter errors.
                </p>
              </div>
              <Switch id="system-campaigns" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="system-limits">Usage limits</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts when you approach or exceed your plan limits.
                </p>
              </div>
              <Switch id="system-limits" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="system-billing">Billing updates</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about upcoming charges, payment failures, and receipts.
                </p>
              </div>
              <Switch id="system-billing" defaultChecked />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Delivery</h3>
          <Separator />
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="digest-frequency">Email Digest Frequency</Label>
              <Select defaultValue="daily">
                <SelectTrigger id="digest-frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Choose how often you want to receive notification digests.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button>Save Preferences</Button>
      </CardFooter>
    </Card>
  )
}
