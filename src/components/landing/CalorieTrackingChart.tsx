"use client"

import { TrendingDown } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { day: "Mon", calories: 2100, target: 2000 },
  { day: "Tue", calories: 1950, target: 2000 },
  { day: "Wed", calories: 2200, target: 2000 },
  { day: "Thu", calories: 1800, target: 2000 },
  { day: "Fri", calories: 2050, target: 2000 },
  { day: "Sat", calories: 2300, target: 2000 },
  { day: "Sun", calories: 1900, target: 2000 },
]

const chartConfig = {
  calories: {
    label: "Calories Consumed",
    color: "text-chart-1",
  },
  target: {
    label: "Target Calories",
    color: "text-chart-2",
  },
} satisfies ChartConfig

export function CalorieTrackingChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Calorie Tracking</CardTitle>
        <CardDescription>Last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="calories" fill="hsl(var(--chart-1))" radius={4} />
            <Bar dataKey="target" fill="hsl(var(--chart-2))" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending down by 2.5% this week <TrendingDown className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing daily calorie intake vs target for the last week
        </div>
      </CardFooter>
    </Card>
  )
}
