"use client"

import { ArrowUpRight, BarChart3, Mail, Users } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, LineChart } from "@/components/ui/chart"

export function DashboardCards() {
  // Mock data for charts
  const emailData = [
    { name: "Mon", value: 1200 },
    { name: "Tue", value: 1800 },
    { name: "Wed", value: 1400 },
    { name: "Thu", value: 2200 },
    { name: "Fri", value: 1900 },
    { name: "Sat", value: 800 },
    { name: "Sun", value: 600 },
  ]

  const campaignData = [
    { name: "Mon", value: 5 },
    { name: "Tue", value: 8 },
    { name: "Wed", value: 7 },
    { name: "Thu", value: 10 },
    { name: "Fri", value: 12 },
    { name: "Sat", value: 4 },
    { name: "Sun", value: 3 },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Instances</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">4</div>
          <p className="text-xs text-muted-foreground">+1 from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <div className="h-[80px]">
            <ChartContainer>
              <LineChart
                data={campaignData}
                dataKey="value"
                xAxisDataKey="name"
                showXAxis={false}
                showYAxis={false}
                showGrid={false}
                showLegend={false}
                strokeColor="hsl(var(--primary))"
                strokeWidth={2}
              />
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">32,594</div>
          <div className="h-[80px]">
            <ChartContainer>
              <LineChart
                data={emailData}
                dataKey="value"
                xAxisDataKey="name"
                showXAxis={false}
                showYAxis={false}
                showGrid={false}
                showLegend={false}
                strokeColor="hsl(var(--primary))"
                strokeWidth={2}
              />
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">18,749</div>
          <p className="text-xs text-muted-foreground">+2.5% from last month</p>
        </CardContent>
        <CardFooter className="p-2">
          <a href="#" className="text-xs text-primary flex items-center">
            View all subscribers
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </a>
        </CardFooter>
      </Card>
    </div>
  )
}
