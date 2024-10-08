'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coffee, Utensils, Pizza, Apple, ChevronRight, CalendarIcon, Clock, User, Bot, Tag, Flame, Scale, X, Edit, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfDay, endOfDay, parseISO } from 'date-fns';
import { supabase } from '@/lib/supabaseClient';
import { Meal } from './types';
import { EditMealDialog } from '@/components/dashboard/EditMealDialog';

const HistoryContent = () => {
  const [selectedMeal, setSelectedMeal] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [mealTypeFilter, setMealTypeFilter] = useState('all');
  const [loggedByFilter, setLoggedByFilter] = useState('all');
  const [mealHistory, setMealHistory] = useState<Meal[]>([]);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    const fetchMeals = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      console.log("Fetching meals for user:", user.id);
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error("Error fetching meals:", error);
      } else if (data) {
        console.log("Fetched meals from Supabase:", data);
        const meals = data.map(meal => (
          {
            id: meal.id,
            ...meal,
            logged_at: meal.logged_at,
            meal_details: meal.meal_details || {}
          } as Meal
        ));
        setMealHistory(meals);
      }
    };

    fetchMeals();
  }, []);

  const filteredMeals = mealHistory.filter(meal => {
    const mealDate = meal.logged_at ? parseISO(meal.logged_at) : null;
    return (
      (!startDate || (mealDate && mealDate >= startOfDay(startDate))) &&
      (!endDate || (mealDate && mealDate <= endOfDay(endDate))) &&
      (mealTypeFilter === 'all' || meal.meal_details.mealType?.toLowerCase() === mealTypeFilter) &&
      (loggedByFilter === 'all' || meal.logged_by?.toLowerCase() === loggedByFilter)
    );
  });

  console.log("Filtered meals:", filteredMeals); // Debugging log

  const clearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setMealTypeFilter('all');
    setLoggedByFilter('all');
  };

  const getMealIcon = (mealType?: string) => {
    switch (mealType?.toLowerCase() ?? '') {
      case 'breakfast':
        return <Coffee className="mr-2 h-5 w-5 text-yellow-500" />;
      case 'lunch':
        return <Utensils className="mr-2 h-5 w-5 text-green-500" />;
      case 'dinner':
        return <Pizza className="mr-2 h-5 w-5 text-red-500" />;
      case 'snack':
        return <Apple className="mr-2 h-5 w-5 text-purple-500" />;
      default:
        return <Utensils className="mr-2 h-5 w-5 text-blue-500" />;
    }
  };

  const getMealTypeColor = (mealType?: string) => {
    switch (mealType?.toLowerCase() ?? '') {
      case 'breakfast':
        return 'text-yellow-500';
      case 'lunch':
        return 'text-green-500';
      case 'dinner':
        return 'text-red-500';
      case 'snack':
        return 'text-purple-500';
      default:
        return 'text-blue-500';
    }
  };

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async (updatedMeal: Meal) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      const { error } = await supabase
        .from('meals')
        .update({
          input_text: updatedMeal.input_text,
          logged_by: updatedMeal.logged_by,
          logged_at: updatedMeal.logged_at,
          meal_details: updatedMeal.meal_details
        })
        .eq('id', updatedMeal.id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setEditingMeal(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating meal:", error);
    }
  };

  const handleDeleteMeal = async (mealId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      const { error } = await supabase
        .from('meals')
        .delete()
        .eq('id', mealId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      console.log("Meal deleted successfully");
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

  const toggleMealDetails = (index: number) => {
    setSelectedMeal(selectedMeal === index ? null : index);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Select onValueChange={setMealTypeFilter} defaultValue="all">
            <SelectTrigger className="w-[180px] text-black border-black">
              <SelectValue placeholder="Select meal type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-black">All meals</SelectItem>
              <SelectItem value="breakfast" className="text-black">Breakfast</SelectItem>
              <SelectItem value="lunch" className="text-black">Lunch</SelectItem>
              <SelectItem value="dinner" className="text-black">Dinner</SelectItem>
              <SelectItem value="snack" className="text-black">Snack</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={setLoggedByFilter} defaultValue="all">
            <SelectTrigger className="w-[180px] text-black border-black">
              <SelectValue placeholder="Select logger" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-black">All loggers</SelectItem>
              <SelectItem value="human" className="text-black">Human</SelectItem>
              <SelectItem value="ai" className="text-black">AI</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={clearFilters} 
            variant="outline" 
            size="sm" 
            className="border-black text-black hover:bg-gray-100"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
          <span className="text-sm font-medium text-black">
            {filteredMeals.length} meal{filteredMeals.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <AnimatePresence>
          {filteredMeals.map((meal, index) => {
            const mealDetails = meal.meal_details || {};
            const mealDate = meal.logged_at ? new Date(meal.logged_at) : null;
            const formattedDate = mealDate ? format(mealDate, 'yyyy-MM-dd') : 'N/A';
            const formattedTime = mealDate ? format(mealDate, 'HH:mm:ss') : 'N/A';

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-4 overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                    <CardTitle className="text-xl flex items-center">
                      {getMealIcon(mealDetails.mealType)}
                      {meal.input_text || 'N/A'}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(meal)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMeal(meal.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleMealDetails(index)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <ChevronRight className={`h-4 w-4 transition-transform ${selectedMeal === index ? 'rotate-90' : ''}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{formattedDate}</span>
                        <Clock className="h-4 w-4 ml-2" />
                        <span>{formattedTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Tag className={`h-4 w-4 ${getMealTypeColor(mealDetails.mealType)}`} />
                        <span className={`text-sm font-medium ${getMealTypeColor(mealDetails.mealType)}`}>{mealDetails.mealType || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Flame className="h-4 w-4 text-orange-500 mr-1" />
                        <p className="font-semibold text-lg">{mealDetails.calories ? `${mealDetails.calories} calories` : 'N/A'}</p>
                      </div>
                      <div className="flex items-center">
                        <Scale className="h-4 w-4 text-blue-500 mr-1" />
                        <p className="text-sm text-gray-600">{mealDetails.quantity || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                      {meal.logged_by === 'human' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                      <span>Logged by {meal.logged_by || 'N/A'}</span>
                    </div>
                    <AnimatePresence>
                      {selectedMeal === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-md"
                        >
                          <h3 className="font-semibold mb-2 text-blue-700">Detailed Information</h3>
                          <p className="text-gray-700">Macronutrients:</p>
                          <ul className="list-disc list-inside">
                            {meal.meal_details.nutrients && meal.meal_details.nutrients.length > 0 ? (
                              meal.meal_details.nutrients
                                .filter(nutrient => ['Carbohydrates', 'Protein', 'Fat'].includes(nutrient.name))
                                .map((nutrient, idx) => (
                                  <li key={idx} className="text-gray-700">
                                    {nutrient.name}: {nutrient.amount} {nutrient.unit}
                                  </li>
                                ))
                            ) : (
                              <li className="text-gray-700">No macronutrient data available</li>
                            )}
                          </ul>
                          <p className="text-gray-700 mt-2">Micronutrients:</p>
                          <ul className="list-disc list-inside">
                            {meal.meal_details.nutrients && meal.meal_details.nutrients.length > 0 ? (
                              meal.meal_details.nutrients
                                .filter(nutrient => !['Carbohydrates', 'Protein', 'Fat'].includes(nutrient.name))
                                .map((nutrient, idx) => (
                                  <li key={idx} className="text-gray-700">
                                    {nutrient.name}: {nutrient.amount} {nutrient.unit}
                                  </li>
                                ))
                            ) : (
                              <li className="text-gray-700">No micronutrient data available</li>
                            )}
                          </ul>
                          <div className="mt-2 text-sm text-gray-500">
                            <span>Insights: {meal.meal_details.insights || 'No insights available'}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </ScrollArea>
      {editingMeal && (
        <EditMealDialog
          meal={editingMeal}
          isOpen={isEditDialogOpen}
          onSave={handleSaveEdit}
          onClose={() => {
            setIsEditDialogOpen(false);
            setEditingMeal(null);
          }}
        />
      )}
    </div>
  );
}

export default HistoryContent;