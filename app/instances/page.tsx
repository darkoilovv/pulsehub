import { Suspense } from "react"
import DashboardShell from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { InstancesTable } from "@/components/instances-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { InstancesTableSkeleton } from "@/components/skeletons"

export default function InstancesPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Instances" text="Manage your Pulsehub instances.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Instance
        </Button>
      </DashboardHeader>
      <Suspense fallback={<InstancesTableSkeleton />}>
        <InstancesTable />
      </Suspense>
    </DashboardShell>
  )
}
