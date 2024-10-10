export interface Nutrient {
    name: string;
    amount: number;
    unit: string;
  }
  
  export interface MealDetails {
    mealType?: string;
    calories?: number;
    quantity?: string;
    nutrients?: Nutrient[];
    insights?: string;
  }
  
  export interface Meal {
    id: string;
    user_id: string;
    input_text: string;
    logged_by: string;
    logged_at: string;
    quantity: string;
    meal_details: {
      meal_name: string;
      calories: number;
      nutrients: Array<{ name: string; amount: number; unit: string }>;
      insights: string;
      quantity: string;
      mealType: string;
    };
  }