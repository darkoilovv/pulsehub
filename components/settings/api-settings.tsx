"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Eye, EyeOff, RefreshCw } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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

export function ApiSettings() {
  const [showApiKey, setShowApiKey] = useState(false)
  const [isRegenerateDialogOpen, setIsRegenerateDialogOpen] = useState(false)
  const [isCreateTokenDialogOpen, setIsCreateTokenDialogOpen] = useState(false)
  const [isDeleteTokenDialogOpen, setIsDeleteTokenDialogOpen] = useState(false)
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null)

  // Mock API key and tokens
  const apiKey = "pk_live_51HG6D9JKl6KAOSThFBjQT9STKl6KAOSThFBjQT9ST"
  const apiTokens = [
    {
      id: "token_1",
      name: "Production API",
      lastUsed: "2 hours ago",
      created: "Apr 23, 2023",
      status: "active",
    },
    {
      id: "token_2",
      name: "Development Testing",
      lastUsed: "3 days ago",
      created: "Mar 15, 2023",
      status: "active",
    },
    {
      id: "token_3",
      name: "Integration Server",
      lastUsed: "Never",
      created: "Feb 10, 2023",
      status: "inactive",
    },
  ]

  const handleDeleteToken = (tokenId: string) => {
    setSelectedTokenId(tokenId)
    setIsDeleteTokenDialogOpen(true)
  }

  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You would typically show a toast notification here
  }

  const maskApiKey = (key: string) => {
    return `${key.substring(0, 8)}${"•".repeat(24)}${key.substring(key.length - 4)}`
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>API Key</CardTitle>
          <CardDescription>Your API key provides full access to your account. Keep it secure!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex">
              <div className="relative flex-1">
                <Input id="api-key" readOnly value={showApiKey ? apiKey : maskApiKey(apiKey)} className="pr-10" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-8 top-0 h-full"
                  onClick={() => copyToClipboard(apiKey)}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={toggleApiKeyVisibility}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">Toggle visibility</span>
                </Button>
              </div>
              <Button variant="outline" className="ml-2" onClick={() => setIsRegenerateDialogOpen(true)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              This key can be used to make API requests on behalf of your account.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>API Tokens</CardTitle>
            <CardDescription>Create and manage API tokens for specific purposes.</CardDescription>
          </div>
          <Dialog open={isCreateTokenDialogOpen} onOpenChange={setIsCreateTokenDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create Token</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create API Token</DialogTitle>
                <DialogDescription>Create a new API token with specific permissions.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="token-name">Token Name</Label>
                  <Input id="token-name" placeholder="e.g., Production API" />
                </div>
                <div className="grid gap-2">
                  <Label>Permissions</Label>
                  <div className="grid gap-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="read-instances" className="rounded border-gray-300" />
                      <Label htmlFor="read-instances">Read Instances</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="write-instances" className="rounded border-gray-300" />
                      <Label htmlFor="write-instances">Write Instances</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="read-campaigns" className="rounded border-gray-300" />
                      <Label htmlFor="read-campaigns">Read Campaigns</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="write-campaigns" className="rounded border-gray-300" />
                      <Label htmlFor="write-campaigns">Write Campaigns</Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateTokenDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateTokenDialogOpen(false)}>Create Token</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiTokens.map((token) => (
                <TableRow key={token.id}>
                  <TableCell className="font-medium">{token.name}</TableCell>
                  <TableCell>{token.created}</TableCell>
                  <TableCell>{token.lastUsed}</TableCell>
                  <TableCell>
                    {token.status === "active" ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteToken(token.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Revoke
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={isRegenerateDialogOpen} onOpenChange={setIsRegenerateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerate API Key?</AlertDialogTitle>
            <AlertDialogDescription>
              This will invalidate your existing API key. Any applications or scripts using this key will need to be
              updated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Regenerate</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteTokenDialogOpen} onOpenChange={setIsDeleteTokenDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke API Token?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately revoke access for applications using this token.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Revoke Token</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
