'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flame } from 'lucide-react'
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'
import { motion } from 'framer-motion'
import { DashboardCard } from '@/components/dashboard/dashboard-card'
import { NutrientProgress } from '@/components/dashboard/nutrient-progress'
import { getFirestore, collection, onSnapshot } from 'firebase/firestore'
import { auth } from '@/lib/firebase'
import { Meal } from '../history/types'
import { calculateMacronutrients, calculateMicronutrients } from '@/utils/nutrientCalculations';
import Overview from '@/components/insight/overview'

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

  useEffect(() => {
    const fetchMeals = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      const db = getFirestore();
      const userMealsRef = collection(db, 'users', user.uid, 'meals');
      const unsubscribe = onSnapshot(userMealsRef, (snapshot) => {
        const meals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Meal));

        // Calculate total calories consumed for today
        const today = new Date().toISOString().split('T')[0];
        const todayCalories = meals
          .filter(meal => meal.loggedAt.startsWith(today))
          .reduce((sum, meal) => sum + (meal.mealDetails.calories || 0), 0);
        setCaloriesConsumed(todayCalories);

        // Calculate macronutrients for today
        const macros = calculateMacronutrients(meals.filter(meal => meal.loggedAt.startsWith(today)));
        console.log("Macros:", macros); // Debugging log
        setMacroData(macros);

        // Calculate micronutrients for today
        const micros = calculateMicronutrients(meals.filter(meal => meal.loggedAt.startsWith(today)));
        console.log("Micros:", micros); // Debugging log
        setMicroData(prevMicroData => ({
          ...prevMicroData,
          ...Object.fromEntries(
            Object.entries(micros).map(([key, value]) => [key, { value, max: prevMicroData[key as keyof MicroData].max }])
          )
        }));
      });

      return () => unsubscribe();
    };

    fetchMeals();
  }, []);

  return (
    <div className="p-4">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="calories">Calories</TabsTrigger>
          <TabsTrigger value="macros">Macros</TabsTrigger>
          <TabsTrigger value="micros">Micros</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Overview />
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
                  .filter(([name]) => !['Protein', 'Fat', 'Carbohydrates'].includes(name))
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
              {/* Add activity summary content here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default InsightsContent
