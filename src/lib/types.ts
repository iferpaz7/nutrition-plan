// Re-export Prisma types for consistency
export { DayOfWeek, MealType } from '@prisma/client'
import type { DayOfWeek, MealType } from '@prisma/client'

export interface Customer {
  id: string;
  idCard: string;
  firstName: string;
  lastName: string;
  cellPhone: string | null;
  createdAt: Date;
  updatedAt: Date;
  nutritionalPlans?: NutritionalPlan[];
}

export interface NutritionalPlan {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  customerId?: string | null;
  customer?: Customer;
  mealEntries?: MealEntry[];
}

export interface MealEntry {
  id: string;
  dayOfWeek: DayOfWeek;
  mealType: MealType;
  mealDescription: string;
  nutritionalPlanId: string;
}

export interface CustomerFormData {
  idCard: string;
  firstName: string;
  lastName: string;
  cellPhone?: string;
}

export interface PlanFormData {
  name: string;
  description?: string;
  customerId: string;
  meals: Record<string, Record<string, string>>; // dayOfWeek -> mealType -> description
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