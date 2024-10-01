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
    input_text: string;
    loggedBy: string;
    loggedAt: string;
    mealDetails: MealDetails;
  }