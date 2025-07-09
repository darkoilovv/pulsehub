// "use client"
//
// import { Suspense } from "react"
// import DashboardShell from "@/components/dashboard-shell"
// import { DashboardHeader } from "@/components/dashboard-header"
// import { InstancesTable } from "@/components/instances-table"
// import { DashboardCards } from "@/components/dashboard-cards"
// import { InstancesTableSkeleton } from "@/components/skeletons"
//
//
// export default function DashboardPage() {
//   return (
//     <DashboardShell>
//     <DashboardHeader heading="Dashboard" text="Manage your Pulsehub instances and monitor performance." />
//     <div className="grid gap-6">
//       <DashboardCards />
//       <div>
//         <h2 className="text-xl font-semibold mb-4">Your Instances</h2>
//         <Suspense fallback={<InstancesTableSkeleton />}>
//           <InstancesTable />
//         </Suspense>
//       </div>
//     </div>
//   </DashboardShell>
//   )
// }


"use client"

import { Suspense, useState } from "react"
import { account } from "@/lib/appwrite" // assumes you have Appwrite setup
import DashboardShell from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { InstancesTable } from "@/components/instances-table"
import { DashboardCards } from "@/components/dashboard-cards"
import { InstancesTableSkeleton } from "@/components/skeletons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function DashboardPage() {
  const [showDialog, setShowDialog] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleInvite = async () => {
    setIsInviting(true)
    setError("")
    setSuccess("")

    try {
      const user = await account.get()
      const teamId = user?.prefs?.teamId

      if (!teamId) {
        throw new Error("Team ID not found in user preferences.")
      }

      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail,
          teamId: teamId,
          roles: ["guest"],
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Invite failed")
      }

      // console.log("Membership created:", data)
      // console.log("Confirmation link:", data.confirmLink)

      setSuccess("Invitation sent successfully!")
      setInviteEmail("")
    } catch (err) {
      console.error("Invite failed:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setIsInviting(false)
    }
  }
  // const handleInvite = async () => {
  //   try {
  //     const user = await account.get();
  //     const teamId = user?.prefs?.teamId;
  //
  //     const res = await fetch('/api/invite', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         email: inviteEmail,
  //         teamId: teamId,
  //         roles: ['guest'],
  //       }),
  //     });
  //
  //     const data = await res.json();
  //
  //     if (!res.ok) throw new Error(data.error || 'Invite failed');
  //
  //     console.log('Membership created:', data);
  //
  //     console.log('Confirmation link:', data.confirmLink);
  //   } catch (err) {
  //     console.error('Invite failed:', err);
  //   }
  // };


  return (
      <DashboardShell>
        {/* Header with Invite Button */}
        <div className="flex items-center justify-between mb-4">
          <DashboardHeader
              heading="Dashboard"
              text="Manage your Pulsehub instances and monitor performance."
          />
          <Button onClick={() => setShowDialog(true)}>Invite Member</Button>
        </div>

        {/* Invite Modal */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite a Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Label htmlFor="email">Email</Label>
              <Input
                  id="email"
                  type="email"
                  placeholder="member@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  disabled={isInviting}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}
            </div>
            <DialogFooter>
              <Button onClick={handleInvite} disabled={isInviting || !inviteEmail}>
                {isInviting ? "Inviting..." : "Send Invite"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dashboard Content */}
        <div className="grid gap-6">
          <DashboardCards />
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Instances</h2>
            <Suspense fallback={<InstancesTableSkeleton />}>
              <InstancesTable />
            </Suspense>
          </div>
        </div>
      </DashboardShell>
  )
}
