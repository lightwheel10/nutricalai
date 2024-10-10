import { Meal } from '../app/(protected)/history/types';

export const prepareCalorieTrendData = (meals: Meal[]) => {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - 6); // Start from 6 days ago

  const dailyCalories: { [date: string]: number } = {};

  // Initialize all days with 0 calories
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dailyCalories[date.toISOString().split('T')[0]] = 0;
  }

  // Sum up calories for each day
  meals.forEach(meal => {
    const mealDate = new Date(meal.logged_at).toISOString().split('T')[0];
    if (mealDate in dailyCalories) {
      dailyCalories[mealDate] += meal.meal_details.calories || 0;
    }
  });

  // Convert to array format for the chart
  return Object.entries(dailyCalories).map(([date, calories]) => ({
    date,
    calories
  }));
};