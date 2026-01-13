'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { DayOfWeek, MealType } from '@/lib/types'
import type { MealEntry } from '@/lib/types'
import { cn } from '@/lib/utils'

interface PlanGridProps {
  meals: MealEntry[]
  editMode?: boolean
  onMealChange?: (day: DayOfWeek, mealType: MealType, description: string) => void
  getMealValue?: (day: DayOfWeek, mealType: MealType) => string
}

const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: DayOfWeek.LUNES, label: 'Lunes' },
  { key: DayOfWeek.MARTES, label: 'Martes' },
  { key: DayOfWeek.MIERCOLES, label: 'Miércoles' },
  { key: DayOfWeek.JUEVES, label: 'Jueves' },
  { key: DayOfWeek.VIERNES, label: 'Viernes' },
  { key: DayOfWeek.SABADO, label: 'Sábado' },
  { key: DayOfWeek.DOMINGO, label: 'Domingo' },
]

const MEAL_TYPES: { key: MealType; label: string; color: string }[] = [
  { key: MealType.DESAYUNO, label: 'Desayuno', color: 'bg-amber-100' },
  { key: MealType.COLACION_1, label: 'Colación 1', color: 'bg-green-100' },
  { key: MealType.ALMUERZO, label: 'Almuerzo', color: 'bg-orange-100' },
  { key: MealType.COLACION_2, label: 'Colación 2', color: 'bg-green-100' },
  { key: MealType.MERIENDA, label: 'Merienda', color: 'bg-purple-100' },
  { key: MealType.CENA, label: 'Cena', color: 'bg-blue-100' },
]

export function PlanGrid({ meals, editMode = false, onMealChange, getMealValue }: PlanGridProps) {
  const getMealDescription = (day: DayOfWeek, mealType: MealType): string => {
    if (getMealValue) {
      return getMealValue(day, mealType)
    }
    const meal = meals.find(m => m.dayOfWeek === day && m.mealType === mealType)
    return meal?.mealDescription || ''
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary/10">
            <TableHead className="w-32 font-semibold text-primary">Comida</TableHead>
            {DAYS.map((day) => (
              <TableHead key={day.key} className="text-center font-semibold text-primary min-w-[120px]">
                {day.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {MEAL_TYPES.map((mealType) => (
            <TableRow key={mealType.key} className="hover:bg-muted/30">
              <TableCell className={cn('font-medium', mealType.color)}>
                {mealType.label}
              </TableCell>
              {DAYS.map((day) => (
                <TableCell key={`${day.key}-${mealType.key}`} className="p-2">
                  {editMode ? (
                    <Textarea
                      className="min-h-[80px] text-sm resize-none"
                      placeholder={`${mealType.label}...`}
                      value={getMealDescription(day.key, mealType.key)}
                      onChange={(e) => onMealChange?.(day.key, mealType.key, e.target.value)}
                    />
                  ) : (
                    <div className="min-h-[60px] text-sm whitespace-pre-wrap">
                      {getMealDescription(day.key, mealType.key) || (
                        <span className="text-muted-foreground italic">Sin especificar</span>
                      )}
                    </div>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export { DAYS, MEAL_TYPES }
