import { Meal } from '../app/(protected)/history/types';

/**
 * Calculates the total macronutrients from a list of meals.
 * 
 * @param meals - An array of Meal objects containing nutrient information.
 * @returns An array of objects, each representing a macronutrient with its name and total value.
 * 
 * This function:
 * 1. Initializes an object to store macronutrient totals.
 * 2. Iterates through each meal and its nutrients.
 * 3. Accumulates the amounts for Carbohydrates, Protein, and Fat.
 * 4. Transforms the results into an array of objects, shortening 'Carbohydrates' to 'Carbs'.
 */
export const calculateMacronutrients = (meals: Meal[]) => {
  const macros = { Carbohydrates: 0, Protein: 0, Fat: 0 };
  meals.forEach(meal => {
    meal.meal_details.nutrients?.forEach((nutrient: { name: string; amount: number }) => {
      if (nutrient.name in macros) {
        macros[nutrient.name as keyof typeof macros] += nutrient.amount;
      }
    });
  });
  return Object.entries(macros).map(([name, value]) => ({ 
    name: name === 'Carbohydrates' ? 'Carbs' : name, 
    value 
  }));
};

/**
 * Calculates the total micronutrients from a list of meals.
 * 
 * @param meals - An array of Meal objects containing nutrient information.
 * @returns An object where each key is a micronutrient name, and the value is an object
 *          containing the total value and a default maximum value.
 * 
 * This function:
 * 1. Initializes an empty object to store micronutrient data.
 * 2. Iterates through each meal and its nutrients.
 * 3. For each nutrient, it either initializes a new entry or updates an existing one.
 * 4. Sets a default maximum value of 100 for each micronutrient (this should be adjusted based on actual dietary guidelines).
 * 5. Accumulates the total value for each micronutrient across all meals.
 * 
 * Note: The maximum values are currently set to a default of 100. These should be updated
 * with appropriate values based on dietary recommendations or user-specific needs.
 */
export const calculateMicronutrients = (meals: Meal[]): { [key: string]: { value: number; max: number } } => {
  const micros: { [key: string]: { value: number; max: number } } = {};

  meals.forEach(meal => {
    meal.meal_details.nutrients?.forEach((nutrient: { name: string; amount: number }) => {
      if (!micros[nutrient.name]) {
        micros[nutrient.name] = { value: 0, max: 100 }; // Default max value, adjust as needed
      }
      micros[nutrient.name].value += nutrient.amount;
    });
  });

  return micros;
};