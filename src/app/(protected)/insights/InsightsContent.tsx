'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flame, Footprints, Weight as WeightIcon, Activity } from 'lucide-react'
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { motion } from 'framer-motion'
import { DashboardCard } from '@/components/dashboard/dashboard-card'
import { NutrientProgress } from '@/components/dashboard/nutrient-progress'
import { supabase } from '@/lib/supabaseClient'
import { calculateMacronutrients, calculateMicronutrients } from '@/utils/nutrientCalculations'
import Overview from '@/components/insight/overview'
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from 'date-fns'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

interface MicroData {
  'Vitamin C': { value: number; max: number };
  'Iron': { value: number; max: number };
  'Calcium': { value: number; max: number };
  'Fiber': { value: number; max: number };
  'Sugar': { value: number; max: number };
  'Sodium': { value: number; max: number };
}

const InsightsContent = () => {
  const [caloriesConsumed, setCaloriesConsumed] = useState(0)
  const calorieGoal = 2200
  const [macroData, setMacroData] = useState([
    { name: 'Carbs', value: 0 },
    { name: 'Protein', value: 0 },
    { name: 'Fat', value: 0 },
  ])
  const [microData, setMicroData] = useState<MicroData>({
    'Vitamin C': { value: 0, max: 90 },
    'Iron': { value: 0, max: 18 },
    'Calcium': { value: 0, max: 1000 },
    'Fiber': { value: 0, max: 30 },
    'Sugar': { value: 0, max: 50 },
    'Sodium': { value: 0, max: 2300 }
  })
  const [weightData, setWeightData] = useState<{ date: string; weight: number }[]>([])
  const [stepsData, setStepsData] = useState<{ date: string; steps: number }[]>([])
  const [latestActivity, setLatestActivity] = useState({ workout: '', quantity: '' })

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfDay(new Date()),
    to: endOfDay(new Date())
  })

  const [timePeriod, setTimePeriod] = useState<'day' | 'week' | 'month' | 'custom'>('day')

  const [selectedTab, setSelectedTab] = useState("overview")

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      // Fetch meals
      const { data: meals, error: mealsError } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', dateRange.from.toISOString())
        .lte('logged_at', dateRange.to.toISOString())

      if (mealsError) {
        console.error("Error fetching meals:", mealsError);
        return;
      }

      // Calculate nutritional data
      const totalCalories = meals.reduce((sum, meal) => sum + (meal.meal_details?.calories || 0), 0);
      setCaloriesConsumed(totalCalories);

      const macros = calculateMacronutrients(meals);
      setMacroData(macros);

      const micros = calculateMicronutrients(meals);
      setMicroData(prevMicroData => {
        return Object.fromEntries(
          Object.entries(prevMicroData).map(([key, data]) => [
            key,
            { ...data, value: micros[key as keyof typeof micros] || data.value }
          ])
        ) as MicroData;
      });

      // Fetch activities
      const { data: activities, error: activitiesError } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', dateRange.from.toISOString())
        .lte('date', dateRange.to.toISOString())
        .order('date', { ascending: true })

      if (activitiesError) {
        console.error("Error fetching activities:", activitiesError);
        return;
      }

      const weightHistory = activities.map(activity => ({
        date: format(new Date(activity.date), 'yyyy-MM-dd'),
        weight: activity.weight
      }));

      const stepsHistory = activities.map(activity => ({
        date: format(new Date(activity.date), 'yyyy-MM-dd'),
        steps: activity.steps
      }));

      setWeightData(weightHistory);
      setStepsData(stepsHistory);

      if (activities.length > 0 && activities[0].workout) {
        setLatestActivity({
          workout: activities[0].workout,
          quantity: activities[0].workout_quantity || ''
        });
      }
    };

    fetchData();

    const mealSubscription = supabase
      .channel('meals')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'meals' }, fetchData)
      .subscribe()

    const activitySubscription = supabase
      .channel('activities')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, fetchData)
      .subscribe()

    return () => {
      supabase.removeChannel(mealSubscription)
      supabase.removeChannel(activitySubscription)
    };
  }, [dateRange]);

  const handleTimePeriodChange = (period: 'day' | 'week' | 'month' | 'custom') => {
    const today = new Date();
    let from, to;

    switch (period) {
      case 'day':
        from = startOfDay(today);
        to = endOfDay(today);
        break;
      case 'week':
        from = startOfWeek(today);
        to = endOfWeek(today);
        break;
      case 'month':
        from = startOfMonth(today);
        to = endOfMonth(today);
        break;
      case 'custom':
        // Don't change the date range for custom, just update the timePeriod state
        setTimePeriod(period);
        return;
    }

    setDateRange({ from, to });
    setTimePeriod(period);
  };

  const showTimePeriodOptions = (tab: string) => {
    return ['weight', 'calories', 'macros', 'micros'].includes(tab);
  };

  return (
    <div className="p-4">
      <Tabs defaultValue="overview" onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="calories">Calories</TabsTrigger>
          <TabsTrigger value="macros">Macros</TabsTrigger>
          <TabsTrigger value="micros">Micros</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {showTimePeriodOptions(selectedTab) && (
          <div className="mb-4 flex space-x-2">
            <Button 
              onClick={() => handleTimePeriodChange('day')} 
              variant={timePeriod === 'day' ? 'default' : 'outline'}
              className="text-black hover:text-white"
            >
              Day
            </Button>
            <Button 
              onClick={() => handleTimePeriodChange('week')} 
              variant={timePeriod === 'week' ? 'default' : 'outline'}
              className="text-black hover:text-white"
            >
              Week
            </Button>
            <Button 
              onClick={() => handleTimePeriodChange('month')} 
              variant={timePeriod === 'month' ? 'default' : 'outline'}
              className="text-black hover:text-white"
            >
              Month
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant={timePeriod === 'custom' ? 'default' : 'outline'}
                  className="text-black hover:text-white"
                >
                  Custom
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setDateRange({ from: range.from, to: range.to });
                      setTimePeriod('custom');
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        <TabsContent value="overview">
          <Overview />
        </TabsContent>

        <TabsContent value="weight">
          <Card>
            <CardHeader>
              <CardTitle>Weight History</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calories">
          <Card>
            <CardHeader>
              <CardTitle>Calorie Intake</CardTitle>
            </CardHeader>
            <CardContent>
              <DashboardCard
                title="Calorie Intake"
                icon={<Flame className="h-8 w-8 text-orange-500" />}
                content={
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Calories Consumed</span>
                      <span>{caloriesConsumed} / {calorieGoal}</span>
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(caloriesConsumed / calorieGoal) * 100}%` }}
                      transition={{ duration: 1.5 }}
                      className="h-2 bg-green-500 rounded"
                    />
                  </div>
                }
                animation={{
                  initial: { opacity: 0, y: 50 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.5 }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="macros">
          <Card>
            <CardHeader>
              <CardTitle>Macronutrients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0 md:mr-4">
                  {macroData.map(({ name, value }) => (
                    <div key={name} className="flex justify-between text-sm mb-2">
                      <span>{name}</span>
                      <span>{value}g</span>
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={macroData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="micros">
          <Card>
            <CardHeader>
              <CardTitle>Micronutrients Insight</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 h-48">
                {Object.entries(microData)
                  .filter(([name, data]) => !['Protein', 'Fat', 'Carbohydrates'].includes(name) && data !== undefined)
                  .map(([name, { value, max }]) => (
                    <NutrientProgress 
                      key={name} 
                      label={name} 
                      value={Math.round(value)} 
                      max={max} 
                    />
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Footprints className="h-5 w-5 mr-2" />
                  <span>Latest Steps: {stepsData[stepsData.length - 1]?.steps || 0}</span>
                </div>
                <div className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  <span>Latest Workout: {latestActivity.workout} {latestActivity.quantity}</span>
                </div>
                <div className="flex items-center">
                  <WeightIcon className="h-5 w-5 mr-2" />
                  <span>Latest Weight: {weightData[weightData.length - 1]?.weight || 0} kg</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default InsightsContent
