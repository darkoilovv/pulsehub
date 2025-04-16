"use client"

import type React from "react"

import { Line } from "recharts"
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

interface ChartContainerProps {
  children: React.ReactNode
}

export function ChartContainer({ children }: ChartContainerProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      {children}
    </ResponsiveContainer>
  )
}

interface ChartTooltipProps {
  children: React.ReactNode
}

export function ChartTooltip({ children }: ChartTooltipProps) {
  return <Tooltip>{children}</Tooltip>
}

interface LineChartProps {
  data: any[]
  dataKey: string
  xAxisDataKey: string
  showXAxis?: boolean
  showYAxis?: boolean
  showGrid?: boolean
  showLegend?: boolean
  strokeColor?: string
  strokeWidth?: number
}

export function LineChart({
  data,
  dataKey,
  xAxisDataKey,
  showXAxis = true,
  showYAxis = true,
  showGrid = true,
  showLegend = false,
  strokeColor = "#8884d8",
  strokeWidth = 1,
}: LineChartProps) {
  return (
    <RechartsLineChart data={data}>
      {showGrid && <CartesianGrid strokeDasharray="3 3" />}
      {showXAxis && <XAxis dataKey={xAxisDataKey} />}
      {showYAxis && <YAxis />}
      <Tooltip />
      {showLegend && <Legend />}
      <Line type="monotone" dataKey={dataKey} stroke={strokeColor} strokeWidth={strokeWidth} />
    </RechartsLineChart>
  )
}
