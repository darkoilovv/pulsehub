"use client"

import { useState } from "react"
import { MessageSquare, Check, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function ViberIntegration() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [testStatus, setTestStatus] = useState<null | "success" | "error">(null)

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
              <MessageSquare className="h-5 w-5 text-violet-500" />
              Viber Sender
            </div>
          </CardTitle>
          {isInstalled && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Check className="mr-1 h-3 w-3" /> Active
            </Badge>
          )}
        </div>
        <CardDescription>Connect Viber to send messages through your Pulsehub instance.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="viber-token">Viber Auth Token</Label>
            <Input id="viber-token" placeholder="Enter your Viber API token" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="viber-sender">Sender Name</Label>
            <Input id="viber-sender" placeholder="Your business name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="viber-webhook">Webhook URL (Optional)</Label>
            <Input id="viber-webhook" placeholder="https://yourdomain.com/webhook/viber" />
            <p className="text-xs text-muted-foreground mt-1">
              We'll configure this webhook to receive delivery reports
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="viber-test-number">Test Phone Number</Label>
            <Input id="viber-test-number" placeholder="+1234567890" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="viber-test-message">Test Message</Label>
            <Textarea id="viber-test-message" placeholder="Enter a test message" rows={2} />
          </div>
        </div>

        {testStatus === "success" && (
          <Alert variant="default" className="mt-4 bg-green-50 text-green-700 border-green-200">
            <Check className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>Test message was sent successfully.</AlertDescription>
          </Alert>
        )}

        {testStatus === "error" && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Failed to send test message. Please check your configuration.</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-3">
        <Button variant="outline" onClick={handleTest} disabled={isLoading}>
          Send Test Message
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
