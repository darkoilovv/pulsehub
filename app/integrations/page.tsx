import DashboardShell from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { IntegrationsGrid } from "@/components/integrations/integrations-grid"

export default function IntegrationsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Integrations" text="Connect your Pulsehub instances with communication services." />
      <div className="grid gap-6">
        <IntegrationsGrid />
      </div>
    </DashboardShell>
  )
}
