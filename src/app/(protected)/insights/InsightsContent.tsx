'use client'

import { useState, useEffect } from "react"
import { BarChart as BarChartIcon, LineChart as LineChartIcon, AreaChart as AreaChartIcon, Weight, Footprints, Utensils, ChevronDown, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format, addDays, startOfDay, endOfDay } from "date-fns"
import { supabase } from '@/lib/supabaseClient'
import { calculateMacronutrients } from '@/utils/nutrientCalculations'

interface InsightsData {
  date: string
  weight: number
  steps: number
  calories: number
}

const chartColors = {
  weight: "#FF6B6B",
  calories: "#4ECDC4",
  steps: "#45B7D1",
  protein: "#FFA07A",
  carbs: "#98FB98",
  fat: "#DDA0DD",
}

const InsightsContent = () => {
  const [dateRange, setDateRange] = useState({
    from: startOfDay(addDays(new Date(), -7)),
    to: endOfDay(new Date())
  })
  const [insightsData, setInsightsData] = useState<InsightsData[]>([])
  const [macrosData, setMacrosData] = useState([
    { name: "Protein", value: 0 },
    { name: "Carbs", value: 0 },
    { name: "Fat", value: 0 },
  ])
  const [weightChartType, setWeightChartType] = useState("line")
  const [stepsChartType, setStepsChartType] = useState("bar")
  const [caloriesChartType, setCaloriesChartType] = useState("area")
  const [detailedView, setDetailedView] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!dateRange.from || !dateRange.to) return

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error("User not authenticated")
        return
      }

      // Fetch activities
      const { data: activities, error: activitiesError } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', dateRange.from.toISOString())
        .lte('date', dateRange.to.toISOString())
        .order('date', { ascending: true })

      if (activitiesError) {
        console.error("Error fetching activities:", activitiesError)
        return
      }

      // Fetch meals
      const { data: meals, error: mealsError } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', dateRange.from.toISOString())
        .lte('logged_at', dateRange.to.toISOString())

      if (mealsError) {
        console.error("Error fetching meals:", mealsError)
        return
      }

      // Process data
      const processedData: InsightsData[] = activities.map(activity => ({
        date: format(new Date(activity.date), 'yyyy-MM-dd'),
        weight: activity.weight,
        steps: activity.steps,
        calories: meals
          .filter(meal => format(new Date(meal.logged_at), 'yyyy-MM-dd') === format(new Date(activity.date), 'yyyy-MM-dd'))
          .reduce((sum, meal) => sum + (meal.meal_details?.calories || 0), 0)
      }))

      setInsightsData(processedData)

      const macros = calculateMacronutrients(meals)
      setMacrosData(macros)
    }

    fetchData()
  }, [dateRange])

  const toggleDetailedView = (category: string) => {
    setDetailedView(detailedView === category ? null : category)
  }

  const renderChart = (type: string, dataKey: string, color: string) => {
    const CommonProps = {
      data: insightsData,
      margin: { top: 5, right: 5, bottom: 5, left: 5 },
    }

    const commonAxisProps = {
      stroke: "#888888",
      strokeWidth: 1,
    }

    switch (type) {
      case "line":
        return (
          <LineChart {...CommonProps}>
            <XAxis dataKey="date" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
          </LineChart>
        )
      case "bar":
        return (
          <BarChart {...CommonProps}>
            <XAxis dataKey="date" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Bar dataKey={dataKey} fill={color} />
            <ChartTooltip content={<ChartTooltipContent />} />
          </BarChart>
        )
      case "area":
        return (
          <AreaChart {...CommonProps}>
            <XAxis dataKey="date" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.2} />
            <ChartTooltip content={<ChartTooltipContent />} />
          </AreaChart>
        )
      default:
        return (
          <LineChart {...CommonProps}>
            <XAxis dataKey="date" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
          </LineChart>
        )
    }
  }

  const renderInsightCard = (title: string, icon: React.ReactNode, dataKey: string, chartType: string, setChartType: (type: string) => void, color: string) => (
    <Card className="w-full">
      <div className="flex flex-col h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            {icon}
            <CardTitle className="text-sm font-medium ml-2">{title}</CardTitle>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" onClick={() => setChartType("line")}><LineChartIcon className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => setChartType("bar")}><BarChartIcon className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => setChartType("area")}><AreaChartIcon className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => toggleDetailedView(dataKey)}>
              {detailedView === dataKey ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-grow pt-4 pl-0.5"> {/* Reduced left padding and added top padding */}
          <ChartContainer config={{ [dataKey]: { label: title, color: color } }} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart(chartType, dataKey, color)}
            </ResponsiveContainer>
          </ChartContainer>
          {detailedView === dataKey && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Detailed {title} Data</h4>
              <ul className="text-sm">
                {insightsData.map((day, index) => (
                  <li key={index} className="flex justify-between mb-1">
                    <span>{day.date}</span>
                    <span>{day[dataKey as keyof typeof day]} {dataKey === 'weight' ? 'kg' : dataKey === 'calories' ? 'kcal' : ''}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  )

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-end items-center flex-wrap gap-4">
        <div className="flex gap-4">
          <Input
            type="date"
            value={dateRange.from.toISOString().split('T')[0]}
            onChange={(e) => setDateRange(prev => ({ ...prev, from: new Date(e.target.value) }))}
            className="text-black"
          />
          <Input
            type="date"
            value={dateRange.to.toISOString().split('T')[0]}
            onChange={(e) => setDateRange(prev => ({ ...prev, to: new Date(e.target.value) }))}
            className="text-black"
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {renderInsightCard("Weight", <Weight className="h-4 w-4" />, "weight", weightChartType, setWeightChartType, chartColors.weight)}
        {renderInsightCard("Calories", <Utensils className="h-4 w-4" />, "calories", caloriesChartType, setCaloriesChartType, chartColors.calories)}
        {renderInsightCard("Steps", <Footprints className="h-4 w-4" />, "steps", stepsChartType, setStepsChartType, chartColors.steps)}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <Utensils className="mr-2 h-4 w-4" />
              <CardTitle className="text-sm font-medium">Macros</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 pl-0.5"> {/* Reduced left padding and added top padding */}
            <div className="flex justify-between mb-4">
              {macrosData.map((macro, index) => (
                <div key={index} className="text-center">
                  <div className="font-semibold" style={{ color: chartColors[macro.name.toLowerCase() as keyof typeof chartColors] }}>
                    {macro.name}
                  </div>
                  <div>{macro.value}g</div>
                </div>
              ))}
            </div>
            <ChartContainer
              config={{
                protein: { label: "Protein", color: chartColors.protein },
                carbs: { label: "Carbs", color: chartColors.carbs },
                fat: { label: "Fat", color: chartColors.fat },
              }}
              className="h-[250px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macrosData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label={({ name, value }) => `${name}: ${value}g`}
                  >
                    {macrosData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[entry.name.toLowerCase() as keyof typeof chartColors]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default InsightsContent
