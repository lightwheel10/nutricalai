'use client'

// Import necessary dependencies and components
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flame } from 'lucide-react'
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'
import { motion } from 'framer-motion'
import { DashboardCard } from '@/components/dashboard/dashboard-card'
import { NutrientProgress } from '@/components/dashboard/nutrient-progress'
import { supabase } from '@/lib/supabaseClient'
import { calculateMacronutrients, calculateMicronutrients } from '@/utils/nutrientCalculations';
import Overview from '@/components/insight/overview'

// Define colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

// Define the structure for micronutrient data
interface MicroData {
  'Vitamin C': { value: number; max: number };
  'Iron': { value: number; max: number };
  'Calcium': { value: number; max: number };
  'Fiber': { value: number; max: number };
  'Sugar': { value: number; max: number };
  'Sodium': { value: number; max: number };
}

// Main component for displaying insights
const InsightsContent = () => {
  // State variables to store various nutritional data
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

  // Effect hook to fetch and process meal data
  useEffect(() => {
    const fetchMeals = async () => {
      // Fetch user data
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      // Fetch meals for the user
      const { data: meals, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)

      if (error) {
        console.error("Error fetching meals:", error);
        return;
      }

      // Calculate total calories consumed for today
      const today = new Date().toISOString().split('T')[0];
      const todayCalories = meals
        .filter(meal => meal.logged_at && meal.logged_at.startsWith(today))
        .reduce((sum, meal) => sum + (meal.meal_details?.calories || 0), 0);
      setCaloriesConsumed(todayCalories);

      // Calculate macronutrients for today
      const macros = calculateMacronutrients(meals.filter(meal => meal.logged_at && meal.logged_at.startsWith(today)));
      console.log("Macros:", macros); // Debugging log
      setMacroData(macros);

      // Calculate micronutrients for today
      const micros = calculateMicronutrients(meals.filter(meal => meal.logged_at && meal.logged_at.startsWith(today)));
      console.log("Micros:", micros); // Debugging log
      setMicroData(prevMicroData => {
        return Object.fromEntries(
          Object.entries(prevMicroData).map(([key, data]) => [
            key,
            { ...data, value: micros[key as keyof typeof micros] || data.value }
          ])
        ) as MicroData;
      });
    };

    fetchMeals();

    // Set up real-time subscription for meal updates
    const mealSubscription = supabase
      .channel('meals')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'meals' }, fetchMeals)
      .subscribe()

    // Cleanup function to remove the subscription
    return () => {
      supabase.removeChannel(mealSubscription)
    };
  }, []);

  return (
    <div className="p-4">
      {/* Tabs for different sections of insights */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="calories">Calories</TabsTrigger>
          <TabsTrigger value="macros">Macros</TabsTrigger>
          <TabsTrigger value="micros">Micros</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview tab content */}
        <TabsContent value="overview">
          <Overview />
        </TabsContent>

        {/* Calories tab content */}
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

        {/* Macronutrients tab content */}
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

        {/* Micronutrients tab content */}
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

        {/* Activity tab content (placeholder) */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add activity summary content here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default InsightsContent

{/* 
  For Non-Technical Readers:
  
  This component, InsightsContent, is responsible for displaying various health and nutrition insights to the user. 
  It includes several sections:

  1. Overview: A general summary of the user's health data.
  2. Weight: (Not implemented in this code snippet) Likely to show weight trends.
  3. Calories: Shows the user's calorie intake for the day compared to their goal.
  4. Macros: Displays the breakdown of macronutrients (carbs, protein, fat) in a pie chart.
  5. Micros: Shows the user's intake of various micronutrients (vitamins and minerals) compared to recommended values.
  6. Activity: (Not implemented in this code snippet) Likely to show physical activity data.

  The component fetches the user's meal data from a database and calculates various nutritional metrics. 
  It then presents this information in an easy-to-understand format using charts and progress bars.

  This tool can help users track their nutrition and make informed decisions about their diet and health.
*/}
