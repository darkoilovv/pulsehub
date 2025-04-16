"use client"

import { Input } from "@/components/ui/input"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function SecuritySettings() {
  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false)
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)

  // Mock active sessions
  const activeSessions = [
    {
      id: "session_1",
      device: "Chrome on Windows",
      location: "New York, USA",
      ip: "192.168.1.1",
      lastActive: "Just now",
      current: true,
    },
    {
      id: "session_2",
      device: "Safari on macOS",
      location: "San Francisco, USA",
      ip: "192.168.1.2",
      lastActive: "2 hours ago",
      current: false,
    },
    {
      id: "session_3",
      device: "Firefox on Ubuntu",
      location: "London, UK",
      ip: "192.168.1.3",
      lastActive: "Yesterday",
      current: false,
    },
  ]

  const handleTerminateSession = (sessionId: string) => {
    setSelectedSessionId(sessionId)
    setIsSessionDialogOpen(true)
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="2fa">Two-factor authentication</Label>
              <p className="text-sm text-muted-foreground">
                Protect your account with an additional verification step.
              </p>
            </div>
            <Switch id="2fa" onCheckedChange={() => setIs2FADialogOpen(true)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Manage your active sessions across devices.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div className="font-medium">{session.device}</div>
                    {session.current && (
                      <Badge variant="outline" className="mt-1 bg-green-50 text-green-700 border-green-200">
                        Current
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{session.location}</TableCell>
                  <TableCell>{session.ip}</TableCell>
                  <TableCell>{session.lastActive}</TableCell>
                  <TableCell className="text-right">
                    {!session.current && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTerminateSession(session.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Terminate
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            Terminate All Other Sessions
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Login History</CardTitle>
          <CardDescription>View your recent login activity.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <div className="font-medium">Successful login</div>
              <div className="text-sm text-muted-foreground">Chrome on Windows • New York, USA • Today, 10:45 AM</div>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <div className="font-medium">Successful login</div>
              <div className="text-sm text-muted-foreground">
                Safari on macOS • San Francisco, USA • Yesterday, 8:30 PM
              </div>
            </div>
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <div className="font-medium">Failed login attempt</div>
              <div className="text-sm text-muted-foreground">
                Unknown device • Beijing, China • Apr 12, 2023, 3:15 AM
              </div>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <div className="font-medium">Successful login</div>
              <div className="text-sm text-muted-foreground">
                Firefox on Ubuntu • London, UK • Apr 10, 2023, 11:20 AM
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline">View Full History</Button>
        </CardFooter>
      </Card>

      <AlertDialog open={is2FADialogOpen} onOpenChange={setIs2FADialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Enable Two-Factor Authentication</AlertDialogTitle>
            <AlertDialogDescription>
              Two-factor authentication adds an extra layer of security to your account. You'll need to enter a code
              from your authenticator app when logging in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <div className="flex justify-center mb-4">
              <div className="border p-4 rounded-md">
                <div className="text-center mb-2">Scan this QR code with your authenticator app</div>
                <div className="h-48 w-48 bg-gray-200 flex items-center justify-center">
                  <div className="text-sm text-gray-500">[QR Code Placeholder]</div>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="verification-code">Enter verification code</Label>
              <Input id="verification-code" placeholder="123456" className="text-center text-xl tracking-widest" />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Verify and Enable</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminate Session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately sign out this device. The user will need to log in again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Terminate Session</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
