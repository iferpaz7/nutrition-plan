// Types for Supabase database

export type DayOfWeek =
  | 'LUNES'
  | 'MARTES'
  | 'MIERCOLES'
  | 'JUEVES'
  | 'VIERNES'
  | 'SABADO'
  | 'DOMINGO'
export type MealType = 'DESAYUNO' | 'COLACION_1' | 'ALMUERZO' | 'COLACION_2' | 'CENA'
export type Gender = 'MASCULINO' | 'FEMENINO' | 'OTRO'
export type ActivityLevel = 'SEDENTARIO' | 'LIGERO' | 'MODERADO' | 'ACTIVO' | 'MUY_ACTIVO'
export type GoalType =
  | 'PERDER_PESO'
  | 'MANTENER_PESO'
  | 'GANAR_PESO'
  | 'GANAR_MUSCULO'
  | 'MEJORAR_SALUD'
export type PlanStatus = 'BORRADOR' | 'ACTIVO' | 'PAUSADO' | 'COMPLETADO' | 'CANCELADO'

export interface Customer {
  id: string

  // Datos personales
  id_card: string
  first_name: string
  last_name: string
  email: string | null
  cell_phone: string | null
  gender: Gender | null
  birth_date: string | null

  // Datos físicos
  age: number | null
  weight: number | null
  height: number | null
  imc: number | null
  body_fat_percentage: number | null

  // Información nutricional
  activity_level: ActivityLevel | null
  goal: GoalType | null
  daily_calorie_target: number | null

  // Información médica
  allergies: string | null
  medical_conditions: string | null
  medications: string | null
  dietary_restrictions: string | null

  // Notas
  notes: string | null

  // Timestamps
  created_at: string
  updated_at: string

  // Relaciones
  nutritional_plans?: NutritionalPlan[]
}

export interface NutritionalPlan {
  id: string

  // Información básica
  name: string
  description: string | null
  status: PlanStatus

  // Fechas
  start_date: string | null
  end_date: string | null

  // Objetivos nutricionales
  daily_calories: number | null
  protein_grams: number | null
  carbs_grams: number | null
  fat_grams: number | null
  fiber_grams: number | null
  water_liters: number | null

  // Notas
  notes: string | null

  // Relaciones
  customer_id: string
  customer?: Customer
  meal_entries?: MealEntry[]

  // Timestamps
  created_at: string
  updated_at: string
}

export interface MealEntry {
  id: string

  // Clasificación
  day_of_week: DayOfWeek
  meal_type: MealType

  // Descripción
  meal_description: string

  // Información nutricional (opcional)
  calories: number | null
  protein_grams: number | null
  carbs_grams: number | null
  fat_grams: number | null
  fiber_grams: number | null

  // Información adicional
  portion_size: string | null
  preparation_notes: string | null

  // Relaciones
  nutritional_plan_id: string
}

export interface CustomerFormData {
  id_card: string
  first_name: string
  last_name: string
  cell_phone?: string
  age?: number
  weight?: number
  height?: number
}

// Clasificación de IMC según OMS
export function getImcClassification(imc: number | null): { label: string; color: string } {
  if (imc === null) return { label: 'No calculado', color: 'text-muted-foreground' }
  if (imc < 18.5) return { label: 'Bajo peso', color: 'text-blue-500' }
  if (imc < 25) return { label: 'Normal', color: 'text-green-500' }
  if (imc < 30) return { label: 'Sobrepeso', color: 'text-yellow-500' }
  if (imc < 35) return { label: 'Obesidad I', color: 'text-orange-500' }
  if (imc < 40) return { label: 'Obesidad II', color: 'text-red-500' }
  return { label: 'Obesidad III', color: 'text-red-700' }
}

export interface PlanFormData {
  name: string
  description?: string
  customer_id: string
  meals: Record<string, Record<string, string>> // day_of_week -> meal_type -> description
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface ApiError {
  success: false
  error: string
  code?: 'VALIDATION_ERROR' | 'NOT_FOUND' | 'DATABASE_ERROR' | 'INTERNAL_ERROR'
}
