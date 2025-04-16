"use client"

import { useState } from "react"
import { Mail, Check, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function EmailIntegration() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [testStatus, setTestStatus] = useState<null | "success" | "error">(null)
  const [provider, setProvider] = useState("smtp")

  const handleInstall = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsInstalled(true)
      setIsLoading(false)
    }, 1500)
  }

  const handleTest = () => {
    setIsLoading(true)
    setTestStatus(null)
    // Simulate API call
    setTimeout(() => {
      setTestStatus(Math.random() > 0.3 ? "success" : "error")
      setIsLoading(false)
    }, 1500)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Email Sender
            </div>
          </CardTitle>
          {isInstalled && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Check className="mr-1 h-3 w-3" /> Active
            </Badge>
          )}
        </div>
        <CardDescription>Configure your email provider to send emails through Pulsehub.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={provider} onValueChange={setProvider}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="smtp">SMTP</TabsTrigger>
            <TabsTrigger value="postal">Postal</TabsTrigger>
          </TabsList>
          <TabsContent value="smtp" className="space-y-4 mt-4">
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input id="smtp-host" placeholder="smtp.example.com" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="smtp-port">Port</Label>
                  <Input id="smtp-port" placeholder="587" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="smtp-security">Security</Label>
                  <Select defaultValue="tls">
                    <SelectTrigger id="smtp-security">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tls">TLS</SelectItem>
                      <SelectItem value="ssl">SSL</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="smtp-username">Username</Label>
                <Input id="smtp-username" placeholder="username@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="smtp-password">Password</Label>
                <Input id="smtp-password" type="password" placeholder="••••••••" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="smtp-from">From Email</Label>
                <Input id="smtp-from" placeholder="noreply@yourdomain.com" />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Switch id="smtp-debug" />
                <Label htmlFor="smtp-debug">Enable debug logging</Label>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="postal" className="space-y-4 mt-4">
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label htmlFor="postal-url">Postal Server URL</Label>
                <Input id="postal-url" placeholder="https://postal.yourdomain.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="postal-api-key">API Key</Label>
                <Input id="postal-api-key" placeholder="Your Postal API key" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="postal-from">From Email</Label>
                <Input id="postal-from" placeholder="noreply@yourdomain.com" />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {testStatus === "success" && (
          <Alert variant="default" className="mt-4 bg-green-50 text-green-700 border-green-200">
            <Check className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>Test email was sent successfully.</AlertDescription>
          </Alert>
        )}

        {testStatus === "error" && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Failed to send test email. Please check your configuration.</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-3">
        <Button variant="outline" onClick={handleTest} disabled={isLoading}>
          Test Connection
        </Button>
        {!isInstalled ? (
          <Button onClick={handleInstall} disabled={isLoading}>
            {isLoading ? "Installing..." : "Install"}
          </Button>
        ) : (
          <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800">
            Uninstall
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
