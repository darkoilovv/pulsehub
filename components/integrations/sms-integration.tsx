"use client"

import { useState } from "react"
import { Phone, Check, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function SmsIntegration() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [testStatus, setTestStatus] = useState<null | "success" | "error">(null)
  const [provider, setProvider] = useState("twilio")

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
              <Phone className="h-5 w-5 text-blue-500" />
              SMS Sender
            </div>
          </CardTitle>
          {isInstalled && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Check className="mr-1 h-3 w-3" /> Active
            </Badge>
          )}
        </div>
        <CardDescription>Configure SMS provider to send text messages through Pulsehub.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="sms-provider">SMS Provider</Label>
            <Select defaultValue={provider} onValueChange={setProvider}>
              <SelectTrigger id="sms-provider">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="twilio">Twilio</SelectItem>
                <SelectItem value="messagebird">MessageBird</SelectItem>
                <SelectItem value="vonage">Vonage (Nexmo)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {provider === "twilio" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="twilio-account-sid">Account SID</Label>
                <Input id="twilio-account-sid" placeholder="Enter your Twilio Account SID" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="twilio-auth-token">Auth Token</Label>
                <Input id="twilio-auth-token" type="password" placeholder="Enter your Twilio Auth Token" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="twilio-phone">Twilio Phone Number</Label>
                <Input id="twilio-phone" placeholder="+1234567890" />
              </div>
            </>
          )}

          {provider === "messagebird" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="messagebird-api-key">API Key</Label>
                <Input id="messagebird-api-key" placeholder="Enter your MessageBird API Key" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="messagebird-originator">Originator</Label>
                <Input id="messagebird-originator" placeholder="Your sender name or number" />
              </div>
            </>
          )}

          {provider === "vonage" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="vonage-api-key">API Key</Label>
                <Input id="vonage-api-key" placeholder="Enter your Vonage API Key" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vonage-api-secret">API Secret</Label>
                <Input id="vonage-api-secret" type="password" placeholder="Enter your Vonage API Secret" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vonage-from">From</Label>
                <Input id="vonage-from" placeholder="Your brand name or number" />
              </div>
            </>
          )}

          <div className="grid gap-2 pt-2">
            <Label htmlFor="sms-test-number">Test Phone Number</Label>
            <Input id="sms-test-number" placeholder="+1234567890" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sms-test-message">Test Message</Label>
            <Textarea id="sms-test-message" placeholder="Enter a test message" rows={2} />
          </div>

          {isInstalled && (
            <div className="mt-2 p-3 bg-blue-50 rounded-md">
              <h4 className="text-sm font-medium text-blue-700 mb-1">SMS Credits</h4>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-600">Remaining: 950 messages</span>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  Buy Credits
                </Button>
              </div>
            </div>
          )}
        </div>

        {testStatus === "success" && (
          <Alert variant="default" className="mt-4 bg-green-50 text-green-700 border-green-200">
            <Check className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>Test SMS was sent successfully.</AlertDescription>
          </Alert>
        )}

        {testStatus === "error" && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Failed to send test SMS. Please check your configuration.</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-3">
        <Button variant="outline" onClick={handleTest} disabled={isLoading}>
          Send Test SMS
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
