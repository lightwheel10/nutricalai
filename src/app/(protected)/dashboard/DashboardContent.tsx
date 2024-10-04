'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Dumbbell, Droplet, Activity, History, BarChart, Settings, LogOut, ChevronLeft, ChevronRight, Filter, Flame, PieChart as PieChartIcon } from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import { NutrientProgress } from '@/components/dashboard/nutrient-progress';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import HistoryPage from '../history/page';
import InsightsPage from '../insights/page';
import ActivityPage from '../activity/page';
import SettingsPage from '../settings/page';
import { LogMealVoice } from '@/components/log-meal/log-meal-voice';
import { LogMealText } from '@/components/log-meal/log-meal-text';
import { Meal } from '../history/types';
import { useRouter } from 'next/navigation';
import { calculateMacronutrients, calculateMicronutrients } from '@/utils/nutrientCalculations';
import { prepareCalorieTrendData } from '@/utils/prepareChartData';
import { supabase } from '@/lib/supabaseClient';

interface User {
  id: string;
  // Add other user properties as needed
}

const DashboardContent = () => {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mealHistory, setMealHistory] = useState<Meal[]>([]);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const calorieGoal = 2200;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [macroData, setMacroData] = useState([
    { name: 'Carbs', value: 0 },
    { name: 'Protein', value: 0 },
    { name: 'Fat', value: 0 },
  ]);
  const [microData, setMicroData] = useState<{ [key: string]: { value: number; max: number } }>({
    'Vitamin C': { value: 0, max: 90 },
    'Iron': { value: 0, max: 18 },
    'Calcium': { value: 0, max: 1000 },
    'Fiber': { value: 0, max: 30 },
    'Sugar': { value: 0, max: 50 },
    'Sodium': { value: 0, max: 2300 }
  });
  const [dashboardTimeFrame, setDashboardTimeFrame] = useState('today');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user as User);
      setLoading(false);
      if (!user) {
        router.push('/login');
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    const fetchMeals = async () => {
      if (!user) return;

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

      const { data: meals, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', sevenDaysAgo.toISOString())
        .order('logged_at', { ascending: false });

      if (error) {
        console.error('Error fetching meals:', error);
        return;
      }

      setMealHistory(meals as Meal[]);
      
      const today = new Date().toISOString().split('T')[0];
      const todayCalories = meals
        .filter((meal: Meal) => meal.loggedAt.startsWith(today))
        .reduce((sum: number, meal: Meal) => sum + (meal.mealDetails.calories || 0), 0);
      setCaloriesConsumed(todayCalories);

      const macros = calculateMacronutrients(meals.filter((meal: Meal) => meal.loggedAt.startsWith(today)));
      setMacroData(macros);

      const micros = calculateMicronutrients(meals.filter((meal: Meal) => meal.loggedAt.startsWith(today)));
      setMicroData(micros);
    };

    if (user) {
      fetchMeals();
    }
  }, [user, dashboardTimeFrame]);

  const handleLogMealVoice = (input: string) => {
    console.log("Logging meal via voice:", input);
    // TODO: Implement voice logging logic here
  };

  const handleLogMealText = (mealDetails: unknown) => {
    console.log("Meal logged via text:", mealDetails);
    // TODO: Add any additional UI updates or messages if needed
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="flex justify-end mb-8">
              <div className="relative">
                <select
                  value={dashboardTimeFrame}
                  onChange={(e) => setDashboardTimeFrame(e.target.value)}
                  className="appearance-none block w-48 p-2 pr-8 border border-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="today">Today</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
                <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
              </div>
            </div>
            <div className="space-y-8">
              <DashboardCard
                title="Calorie Intake"
                icon={<Flame className="w-5 h-5 text-orange-500" />}
                content={
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-2xl font-bold">{caloriesConsumed}</span>
                      <span className="text-sm text-gray-500">/ {calorieGoal} kcal</span>
                    </div>
                    <Progress value={(caloriesConsumed / calorieGoal) * 100} className="h-2 w-full" />
                  </div>
                }
                animation={{
                  initial: { opacity: 0, y: 50 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.5 }
                }}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DashboardCard
                  title="Micronutrients Insight"
                  icon={<Droplet className="w-5 h-5 text-cyan-500" />}
                  content={
                    <div className="space-y-4 h-48 overflow-y-auto pr-2">
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
                  }
                  animation={{
                    initial: { opacity: 0, rotate: -10 },
                    animate: { opacity: 1, rotate: 0 },
                    transition: { duration: 0.5 }
                  }}
                  className="h-48"
                />
                <DashboardCard
                  title="Macronutrients"
                  icon={<PieChartIcon className="w-5 h-5 text-blue-500" />}
                  content={
                    <div className="h-48 flex">
                      <div className="w-2/3">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart width={150} height={150}>
                            <Pie
                              data={macroData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={75}
                              fill="#8884d8"
                              stroke="#ffffff"
                              strokeWidth={2}
                            >
                              {macroData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value, name) => {
                                const total = macroData.reduce((sum, macro) => sum + macro.value, 0);
                                const percentage = ((value as number) / total * 100).toFixed(1);
                                return [`${percentage}%`, name];
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="w-1/3 flex flex-col justify-center space-y-2 pl-4">
                        {macroData.map((macro, index) => (
                          <MacroLabel key={macro.name} color={COLORS[index]} label={macro.name} value={`${macro.value}g`} />
                        ))}
                      </div>
                    </div>
                  }
                  animation={{
                    initial: { opacity: 0, scale: 0.9 },
                    animate: { opacity: 1, scale: 1 },
                    transition: { duration: 0.5 }
                  }}
                  className="h-64"
                />
              </div>
              <DashboardCard
                title="Calorie Trend"
                icon={<TrendingUp className="w-5 h-5 text-green-500" />}
                content={
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={prepareCalorieTrendData(mealHistory)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => {
                            const d = new Date(date);
                            return d.toLocaleDateString(undefined, { weekday: 'short' });
                          }}
                        />
                        <YAxis domain={[0, 'auto']} allowDataOverflow={true} />
                        <Tooltip 
                          labelFormatter={(label) => new Date(label).toLocaleDateString()} 
                          formatter={(value) => [`${value} calories`, 'Calories']}
                        />
                        <Line type="monotone" dataKey="calories" stroke="#3B82F6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                }
                animation={{
                  initial: { opacity: 0, y: 50 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.5 }
                }}
                className="col-span-2"
              />
            </div>
          </>
        );
      case 'history':
        return <HistoryPage />;
      case 'insights':
        return <InsightsPage />;
      case 'activity':
        return <ActivityPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <aside className={`flex flex-col bg-blue-100 shadow-md transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="p-4 flex justify-between items-center">
          {isSidebarOpen && <h1 className="text-2xl font-bold text-black">AI Calorie Tracker</h1>}
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
          </Button>
        </div>
        <nav className="flex flex-col space-y-1 p-4 flex-grow">
          <Button variant="ghost" className={`justify-start text-black ${isSidebarOpen ? '' : 'px-2'}`} onClick={() => setActiveTab('dashboard')}>
            <Activity className="h-4 w-4" />
            {isSidebarOpen && <span className="ml-2">Dashboard</span>}
          </Button>
          <Button variant="ghost" className={`justify-start text-black ${isSidebarOpen ? '' : 'px-2'}`} onClick={() => setActiveTab('history')}>
            <History className="h-4 w-4" />
            {isSidebarOpen && <span className="ml-2">History</span>}
          </Button>
          <Button variant="ghost" className={`justify-start text-black ${isSidebarOpen ? '' : 'px-2'}`} onClick={() => setActiveTab('insights')}>
            <BarChart className="h-4 w-4" />
            {isSidebarOpen && <span className="ml-2">Insights</span>}
          </Button>
          <Button variant="ghost" className={`justify-start text-black ${isSidebarOpen ? '' : 'px-2'}`} onClick={() => setActiveTab('activity')}>
            <Dumbbell className="h-4 w-4" />
            {isSidebarOpen && <span className="ml-2">Activity</span>}
          </Button>
          <Button variant="ghost" className={`justify-start text-black ${isSidebarOpen ? '' : 'px-2'}`} onClick={() => setActiveTab('settings')}>
            <Settings className="h-4 w-4" />
            {isSidebarOpen && <span className="ml-2">Settings</span>}
          </Button>
        </nav>
        <Button variant="ghost" className={`justify-start text-black m-4 ${isSidebarOpen ? '' : 'px-2'}`} onClick={async () => {
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.error('Error signing out:', error);
          } else {
            router.push('/login');
          }
        }}>
          <LogOut className="h-4 w-4" />
          {isSidebarOpen && <span className="ml-2">Logout</span>}
        </Button>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <DashboardHeader
          currentPage={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          theme={theme}
          onThemeChange={setTheme}
        />
        <div className="p-8">
          {renderContent()}
        </div>
      </main>

      <div className="fixed bottom-8 right-8 flex flex-col space-y-4">
        <LogMealVoice onLogMeal={handleLogMealVoice} />
        <LogMealText onLogMeal={handleLogMealText} />
      </div>
    </div>
  );
};

const MacroLabel = ({ color, label, value }: { color: string; label: string; value: string }) => (
  <div className="flex items-center space-x-2">
    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: color }}></div>
    <div className="text-sm font-medium">{label}:</div>
    <div className="text-sm font-bold">{value}</div>
  </div>
);

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1'];

export default DashboardContent;