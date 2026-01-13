export enum DayOfWeek {
  LUNES = 'LUNES',
  MARTES = 'MARTES',
  MIERCOLES = 'MIERCOLES',
  JUEVES = 'JUEVES',
  VIERNES = 'VIERNES',
  SABADO = 'SABADO',
  DOMINGO = 'DOMINGO'
}

export enum MealType {
  DESAYUNO = 'DESAYUNO',
  COLACION_1 = 'COLACION_1',
  ALMUERZO = 'ALMUERZO',
  COLACION_2 = 'COLACION_2',
  MERIENDA = 'MERIENDA',
  CENA = 'CENA'
}

export interface NutritionalPlan {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  mealEntries: MealEntry[];
}

export interface MealEntry {
  id: string;
  dayOfWeek: DayOfWeek;
  mealType: MealType;
  mealDescription: string;
  nutritionalPlanId: string;
}

export interface PlanFormData {
  name: string;
  description?: string;
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