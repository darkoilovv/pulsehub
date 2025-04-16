"use client"

import { EmailIntegration } from "@/components/integrations/email-integration"
import { ViberIntegration } from "@/components/integrations/viber-integration"
import { SmsIntegration } from "@/components/integrations/sms-integration"

export function IntegrationsGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <EmailIntegration />
      <ViberIntegration />
      <SmsIntegration />
    </div>
  )
}
