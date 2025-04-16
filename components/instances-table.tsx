"use client"

import { useState } from "react"
import { CheckCircle2, Clock, MoreHorizontal, PauseCircle, PlayCircle, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Badge } from "@/components/ui/badge"

// Mock data for instances
const instances = [
  {
    id: "1",
    name: "Marketing Automation",
    status: "active",
    createdAt: new Date("2023-01-15"),
    emailsSent: 12500,
    emailLimit: 15000,
  },
  {
    id: "2",
    name: "Customer Support",
    status: "suspended",
    createdAt: new Date("2023-03-22"),
    emailsSent: 8200,
    emailLimit: 10000,
  },
  {
    id: "3",
    name: "Sales Outreach",
    status: "active",
    createdAt: new Date("2023-05-10"),
    emailsSent: 9800,
    emailLimit: 10000,
  },
  {
    id: "4",
    name: "Product Updates",
    status: "pending",
    createdAt: new Date("2023-06-05"),
    emailsSent: 2100,
    emailLimit: 5000,
  },
]

export function InstancesTable() {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openSuspendDialog, setOpenSuspendDialog] = useState(false)
  const [selectedInstance, setSelectedInstance] = useState<string | null>(null)

  const handleAction = (instanceId: string, action: string) => {
    setSelectedInstance(instanceId)
    if (action === "delete") {
      setOpenDeleteDialog(true)
    } else if (action === "suspend") {
      setOpenSuspendDialog(true)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "suspended":
        return <PauseCircle className="h-4 w-4 text-amber-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Active
          </Badge>
        )
      case "suspended":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Suspended
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Pending
          </Badge>
        )
      default:
        return null
    }
  }

  const getUsageIndicator = (used: number, limit: number) => {
    const percentage = (used / limit) * 100
    let bgColor = "bg-green-500"
    let textColor = "text-green-700"

    if (percentage > 90) {
      bgColor = "bg-red-500"
      textColor = "text-red-700"
    } else if (percentage > 75) {
      bgColor = "bg-amber-500"
      textColor = "text-amber-700"
    }

    return (
      <div className="w-full">
        <div className="flex justify-between text-xs mb-1">
          <span>{used.toLocaleString()} emails sent</span>
          <span className={textColor}>{percentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className={`${bgColor} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {instances.map((instance) => (
            <TableRow key={instance.id}>
              <TableCell className="font-medium">{instance.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(instance.status)}
                  {getStatusBadge(instance.status)}
                </div>
              </TableCell>
              <TableCell>{formatDistanceToNow(instance.createdAt, { addSuffix: true })}</TableCell>
              <TableCell className="max-w-[200px]">
                {getUsageIndicator(instance.emailsSent, instance.emailLimit)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    {instance.status === "active" ? (
                      <DropdownMenuItem onClick={() => handleAction(instance.id, "suspend")}>
                        <PauseCircle className="mr-2 h-4 w-4" />
                        Suspend instance
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Activate instance
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={() => handleAction(instance.id, "delete")}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete instance
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the instance and all associated data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700">Delete Instance</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openSuspendDialog} onOpenChange={setOpenSuspendDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend this instance?</AlertDialogTitle>
            <AlertDialogDescription>
              This will temporarily pause all operations for this instance. You can reactivate it at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Suspend Instance</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
