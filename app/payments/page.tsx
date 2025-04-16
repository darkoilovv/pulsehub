import DashboardShell from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { SubscriptionPlan } from "@/components/payments/subscription-plan"
import { BillingHistory } from "@/components/payments/billing-history"
import { PaymentMethods } from "@/components/payments/payment-methods"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PaymentsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Payments & Subscriptions" text="Manage your billing and subscription details." />
      <Tabs defaultValue="subscription" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="billing-history">Billing History</TabsTrigger>
        </TabsList>
        <TabsContent value="subscription">
          <SubscriptionPlan />
        </TabsContent>
        <TabsContent value="payment-methods">
          <PaymentMethods />
        </TabsContent>
        <TabsContent value="billing-history">
          <BillingHistory />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
