// Import necessary dependencies and components
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format, eachDayOfInterval, parseISO } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, Legend } from 'recharts'
import { getFirestoreData } from '@/lib/firestore'
import { DateRange } from 'react-day-picker'

// Define an array of colors for chart elements
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57', '#ffc658'];

// Define the structure of the report data
interface ReportData {
  loggedAt: string;
  mealDetails: {
    calories: number;
    nutrients: Array<{ name: string; amount: number }>;
  };
}

// Main Overview component
const Overview = () => {
  // State variables for managing component data and UI
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: undefined,
  })
  const [reportData, setReportData] = useState<ReportData[] | null>(null)
  const [selectedReports, setSelectedReports] = useState<string[]>([])
  const [chartType, setChartType] = useState<string>('')
  const [isReportGenerated, setIsReportGenerated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Function to fetch report data from Firestore
  async function fetchReportData() {
    if (!dateRange?.from || !dateRange?.to) {
      console.error('Date range is not fully defined');
      return;
    }

    setIsLoading(true)
    const data = await getFirestoreData(dateRange.from, dateRange.to)
    console.log('Report data:', data);
    setReportData(data as ReportData[])
    setIsLoading(false)
  }

  // Function to handle report generation
  function handleGenerateReport() {
    if (!dateRange?.from || !dateRange?.to || !selectedReports.length || !chartType) {
      console.error('All selections are not fully defined');
      return;
    }
    fetchReportData()
    setIsReportGenerated(true)
  }

  // Function to handle selection changes
  function handleSelectionChange() {
    setIsReportGenerated(false)
  }

  // Function to aggregate data for charts
  function aggregateData(data: ReportData[], key: string) {
    if (!dateRange?.from || !dateRange?.to) return [];
    const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
    const aggregatedData = days.map(day => {
      const dayString = format(day, 'yyyy-MM-dd');
      const dayData = data.filter(item => format(parseISO(item.loggedAt), 'yyyy-MM-dd') === dayString);
      
      // Aggregate data based on the selected key (macros, micros, or calories)
      if (key === 'macros') {
        const macros = {
          carbs: dayData.reduce((acc, item) => acc + (item.mealDetails.nutrients.find(n => n.name === 'Carbohydrates')?.amount || 0), 0),
          protein: dayData.reduce((acc, item) => acc + (item.mealDetails.nutrients.find(n => n.name === 'Protein')?.amount || 0), 0),
          fat: dayData.reduce((acc, item) => acc + (item.mealDetails.nutrients.find(n => n.name === 'Fat')?.amount || 0), 0),
        };
        return { name: dayString, ...macros };
      } else if (key === 'micros') {
        const micros = {
          fiber: dayData.reduce((acc, item) => acc + (item.mealDetails.nutrients.find(n => n.name === 'Fiber')?.amount || 0), 0),
          sugar: dayData.reduce((acc, item) => acc + (item.mealDetails.nutrients.find(n => n.name === 'Sugar')?.amount || 0), 0),
          sodium: dayData.reduce((acc, item) => acc + (item.mealDetails.nutrients.find(n => n.name === 'Sodium')?.amount || 0), 0),
        };
        return { name: dayString, ...micros };
      } else if (key === 'calories') {
        const calories = dayData.reduce((acc, item) => acc + (item.mealDetails.calories || 0), 0);
        return { name: dayString, value: calories };
      } else {
        const total = dayData.reduce((acc, item) => acc + (item.mealDetails.nutrients.find(n => n.name === key)?.amount || 0), 0);
        return { name: dayString, value: total };
      }
    });
    return aggregatedData;
  }

  // Function to render the appropriate chart based on user selection
  const renderChart = (data: Array<{ name: string; value?: number; carbs?: number; protein?: number; fat?: number; fiber?: number; sugar?: number; sodium?: number }>) => {
    if (!selectedReports.length) return null;

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {selectedReports.includes('macros') ? (
                <>
                  <Line type="monotone" dataKey="carbs" stroke="#8884d8" />
                  <Line type="monotone" dataKey="protein" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="fat" stroke="#ffc658" />
                </>
              ) : selectedReports.includes('micros') ? (
                <>
                  <Line type="monotone" dataKey="fiber" stroke="#8884d8" />
                  <Line type="monotone" dataKey="sugar" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="sodium" stroke="#ffc658" />
                </>
              ) : (
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              )}
            </LineChart>
          </ResponsiveContainer>
        )
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {selectedReports.includes('macros') ? (
                <>
                  <Bar dataKey="carbs" fill="#8884d8" />
                  <Bar dataKey="protein" fill="#82ca9d" />
                  <Bar dataKey="fat" fill="#ffc658" />
                </>
              ) : selectedReports.includes('micros') ? (
                <>
                  <Bar dataKey="fiber" fill="#8884d8" />
                  <Bar dataKey="sugar" fill="#82ca9d" />
                  <Bar dataKey="sodium" fill="#ffc658" />
                </>
              ) : (
                <Bar dataKey="value" fill="#8884d8" />
              )}
            </BarChart>
          </ResponsiveContainer>
        )
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.reduce((acc: Array<{ name: string; value: number }>, item) => {
                  if (selectedReports.includes('macros')) {
                    return [
                      { name: 'Carbs', value: item.carbs || 0 },
                      { name: 'Protein', value: item.protein || 0 },
                      { name: 'Fat', value: item.fat || 0 },
                    ];
                  } else if (selectedReports.includes('micros')) {
                    return [
                      { name: 'Fiber', value: item.fiber || 0 },
                      { name: 'Sugar', value: item.sugar || 0 },
                      { name: 'Sodium', value: item.sodium || 0 },
                    ];
                  }
                  return [{ name: item.name, value: item.value || 0 }];
                }, [])}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )
      case 'stackedBar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedReports.includes('macros') ? (
                <>
                  <Bar dataKey="carbs" stackId="a" fill="#8884d8" />
                  <Bar dataKey="protein" stackId="a" fill="#82ca9d" />
                  <Bar dataKey="fat" stackId="a" fill="#ffc658" />
                </>
              ) : selectedReports.includes('micros') ? (
                <>
                  <Bar dataKey="fiber" stackId="a" fill="#8884d8" />
                  <Bar dataKey="sugar" stackId="a" fill="#82ca9d" />
                  <Bar dataKey="sodium" stackId="a" fill="#ffc658" />
                </>
              ) : (
                <Bar dataKey="value" fill="#8884d8" />
              )}
            </BarChart>
          </ResponsiveContainer>
        )
      case 'stackedArea':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedReports.includes('macros') ? (
                <>
                  <Area type="monotone" dataKey="carbs" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="protein" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  <Area type="monotone" dataKey="fat" stackId="1" stroke="#ffc658" fill="#ffc658" />
                </>
              ) : selectedReports.includes('micros') ? (
                <>
                  <Area type="monotone" dataKey="fiber" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="sugar" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  <Area type="monotone" dataKey="sodium" stackId="1" stroke="#ffc658" fill="#ffc658" />
                </>
              ) : (
                <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  // Render the Overview component
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {/* Date range selector */}
          <div className="flex items-center space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? format(dateRange.from, 'PPP') : 'Select Date'} - {dateRange?.to ? format(dateRange.to, 'PPP') : 'Present'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => setDateRange(range || { from: new Date(), to: undefined })}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* Report type and chart type selectors */}
          <div className="flex items-center space-x-4">
            <Select onValueChange={(value) => { setSelectedReports(value.split(',')); handleSelectionChange(); }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Reports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="calories">Calories</SelectItem>
                <SelectItem value="macros">Macros</SelectItem>
                <SelectItem value="micros">Micros</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => { setChartType(value); handleSelectionChange(); }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Chart Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="stackedBar">Stacked Bar Chart</SelectItem>
                <SelectItem value="stackedArea">Stacked Area Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Generate report button */}
          <Button onClick={handleGenerateReport} disabled={isLoading}>
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            ) : (
              'Generate Report'
            )}
          </Button>
          {/* Render generated report */}
          {isReportGenerated && reportData && selectedReports.length > 0 && (
            <div className="mt-4">
              <h2 className="text-lg font-bold">Generated Report</h2>
              {selectedReports.includes('calories') && (
                <div>
                  <h3 className="text-md font-semibold">Calories</h3>
                  {renderChart(aggregateData(reportData, 'calories'))}
                </div>
              )}
              {selectedReports.includes('macros') && (
                <div>
                  <h3 className="text-md font-semibold">Macros</h3>
                  {renderChart(aggregateData(reportData, 'macros'))}
                </div>
              )}
              {selectedReports.includes('micros') && (
                <div>
                  <h3 className="text-md font-semibold">Micros</h3>
                  {renderChart(aggregateData(reportData, 'micros'))}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default Overview

/*
This code creates a powerful and interactive nutrition overview dashboard. Here's what it does:

1. Date Selection: Users can choose a specific date range for their nutrition data.
2. Report Type Selection: Users can select what kind of nutritional information they want to see (calories, macronutrients, or micronutrients).
3. Chart Type Selection: Users can choose how they want to visualize their data (line chart, pie chart, bar chart, etc.).
4. Data Fetching: When the user clicks "Generate Report", the dashboard fetches the relevant nutrition data from a database.
5. Data Processing: The code processes the raw data, organizing it by date and calculating totals for the selected nutritional information.
6. Visualization: The processed data is then displayed in the chosen chart type, allowing users to easily see trends and patterns in their nutrition over time.
7. Interactivity: Users can change their selections at any time to view different aspects of their nutritional data or to update the date range.

This dashboard helps users track and understand their nutritional intake over time, providing valuable insights into their dietary habits and helping them make informed decisions about their health and nutrition.
*/
