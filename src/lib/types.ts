// Types for Supabase database

export type DayOfWeek = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';
export type MealType = 'DESAYUNO' | 'COLACION_1' | 'ALMUERZO' | 'COLACION_2' | 'CENA';

export interface Customer {
  id: string;
  id_card: string;
  first_name: string;
  last_name: string;
  cell_phone: string | null;
  created_at: string;
  updated_at: string;
  nutritional_plans?: NutritionalPlan[];
}

export interface NutritionalPlan {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  customer_id?: string | null;
  customer?: Customer;
  meal_entries?: MealEntry[];
}

export interface MealEntry {
  id: string;
  day_of_week: DayOfWeek;
  meal_type: MealType;
  meal_description: string;
  nutritional_plan_id: string;
}

export interface CustomerFormData {
  id_card: string;
  first_name: string;
  last_name: string;
  cell_phone?: string;
}

export interface PlanFormData {
  name: string;
  description?: string;
  customer_id: string;
  meals: Record<string, Record<string, string>>; // day_of_week -> meal_type -> description
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ApiError {
  success: false;
  error: string;
  code?: 'VALIDATION_ERROR' | 'NOT_FOUND' | 'DATABASE_ERROR' | 'INTERNAL_ERROR';
}
