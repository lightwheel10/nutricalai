'use client'

import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { LightbulbIcon, UtensilsIcon, PillIcon, BrainIcon } from 'lucide-react'

interface AIAnalysisResultProps {
  mealDetails: {
    meal_name: string;
    calories: number;
    nutrients: Array<{ name: string; amount: number; unit: string }>;
    insights: string;
    quantity: string;
    mealType: string; // 
  }
}

export function AIAnalysisResult({ mealDetails }: AIAnalysisResultProps) {
  const macroData = mealDetails.nutrients
    .filter(nutrient => ['Protein', 'Carbs', 'Fat'].includes(nutrient.name))
    .map(nutrient => {
      const caloriesFromNutrient = nutrient.name === 'Protein' || nutrient.name === 'Carbs' 
        ? nutrient.amount * 4 
        : nutrient.amount * 9;
      return {
        name: nutrient.name,
        value: Math.round((caloriesFromNutrient / mealDetails.calories) * 100),
        color: nutrient.name === 'Protein' ? '#4CAF50' : nutrient.name === 'Carbs' ? '#2196F3' : '#FFC107'
      };
    });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const headingVariants = {
    initial: { background: '#1e40af' },
    animate: {
      background: ['#1e40af', '#3b82f6', '#1e40af'],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: 'reverse' as const
      }
    }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full h-full flex flex-col"
    >
      <motion.div 
        variants={headingVariants}
        initial="initial"
        animate="animate"
        className="bg-blue-600 text-white p-4 flex items-center justify-center"
      >
        <BrainIcon className="w-6 h-6 mr-2" />
        <h1 className="text-xl font-bold">AI Analysis</h1>
      </motion.div>

      <div className="flex-grow overflow-y-auto">
        <div className="px-4 py-2">
          <motion.h2 variants={itemVariants} className="text-base font-semibold text-blue-600 mb-1">{mealDetails.meal_name}</motion.h2>
          <motion.p variants={itemVariants} className="text-xs text-gray-600 mb-3">Quantity: {mealDetails.quantity}</motion.p>

          <motion.div variants={itemVariants} className="mb-4">
            <h3 className="text-sm font-semibold mb-1 flex items-center">
              <UtensilsIcon className="w-4 h-4 mr-1" /> Calorie Breakdown
            </h3>
            <p className="text-xs mb-2">Total Calories: {mealDetails.calories} kcal</p>
            <div className="flex items-center">
              <ResponsiveContainer width="50%" height={100}>
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    outerRadius={40}
                    innerRadius={25}
                    dataKey="value"
                    labelLine={false}
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="w-1/2 pl-2 space-y-1">
                {macroData.map((entry, index) => (
                  <motion.div 
                    key={`legend-${index}`} 
                    className="flex items-center text-xs"
                    variants={itemVariants}
                    custom={index}
                  >
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                    <span>{entry.name}: {entry.value}%</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-4">
            <h3 className="text-sm font-semibold mb-1 flex items-center">
              <PillIcon className="w-4 h-4 mr-1" /> Nutrients
            </h3>
            <div className="space-y-1">
              {mealDetails.nutrients
                .filter(nutrient => !['Protein', 'Carbs', 'Fat'].includes(nutrient.name))
                .map(nutrient => (
                  <MicronutrientBar 
                    key={nutrient.name}
                    label={nutrient.name} 
                    value={nutrient.amount} 
                    unit={nutrient.unit} 
                  />
                ))
              }
              {mealDetails.nutrients.filter(nutrient => !['Protein', 'Carbs', 'Fat'].includes(nutrient.name)).length === 0 && (
                <p className="text-xs text-gray-500">No additional nutrient information available.</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        variants={itemVariants} 
        className="bg-blue-100 p-3"
      >
        <div className="flex items-center mb-1">
          <LightbulbIcon className="w-4 h-4 mr-1 text-blue-600" />
          <h3 className="text-xs font-semibold">AI Insight:</h3>
        </div>
        <p className="text-xs">{mealDetails.insights}</p>
      </motion.div>
    </motion.div>
  )
}

function MicronutrientBar({ label, value, unit }: { label: string; value: number; unit: string }) {
  const percentage = getPercentage(value, label);

  return (
    <motion.div 
      className="flex items-center text-xs"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <span className="w-16">{label}</span>
      <div className="flex-grow mx-2 bg-gray-200 rounded-full h-1.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-blue-500 h-1.5 rounded-full"
        />
      </div>
      <span className="w-12 text-right">{value} {unit}</span>
    </motion.div>
  )
}

function getPercentage(value: number, nutrient: string): number {
  const defaultScale = 100;
  const scales: { [key: string]: number } = {
    'Fiber': 30,
    'Vitamin C': 100,
    'Iron': 20,
    'Calcium': 1000,
    // Add more nutrients and their recommended daily values here
  };
  return Math.min((value / (scales[nutrient] || defaultScale)) * 100, 100);
}
