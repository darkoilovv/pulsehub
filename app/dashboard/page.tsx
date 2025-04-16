"use client"

import { Suspense } from "react"
import DashboardShell from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { InstancesTable } from "@/components/instances-table"
import { DashboardCards } from "@/components/dashboard-cards"
import { InstancesTableSkeleton } from "@/components/skeletons"


export default function DashboardPage() {
  return (
    <DashboardShell>
    <DashboardHeader heading="Dashboard" text="Manage your Pulsehub instances and monitor performance." />
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
