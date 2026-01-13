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
import type { DayOfWeek, MealType, MealEntry } from '@/lib/types'
import { cn } from '@/lib/utils'

interface PlanGridProps {
  meals: MealEntry[]
  editMode?: boolean
  onMealChange?: (day: DayOfWeek, mealType: MealType, description: string) => void
  getMealValue?: (day: DayOfWeek, mealType: MealType) => string
}

const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: 'LUNES', label: 'Lunes' },
  { key: 'MARTES', label: 'Martes' },
  { key: 'MIERCOLES', label: 'Miércoles' },
  { key: 'JUEVES', label: 'Jueves' },
  { key: 'VIERNES', label: 'Viernes' },
  { key: 'SABADO', label: 'Sábado' },
  { key: 'DOMINGO', label: 'Domingo' },
]

const MEAL_TYPES: { key: MealType; label: string; color: string }[] = [
  { key: 'DESAYUNO', label: 'Desayuno', color: 'bg-amber-100' },
  { key: 'COLACION_1', label: 'Colación', color: 'bg-green-100' },
  { key: 'ALMUERZO', label: 'Almuerzo', color: 'bg-orange-100' },
  { key: 'COLACION_2', label: 'Colación', color: 'bg-green-100' },
  { key: 'CENA', label: 'Cena', color: 'bg-blue-100' },
]

export function PlanGrid({ meals, editMode = false, onMealChange, getMealValue }: PlanGridProps) {
  const getMealDescription = (day: DayOfWeek, mealType: MealType): string => {
    if (getMealValue) {
      return getMealValue(day, mealType)
    }
    const meal = meals.find((m) => m.day_of_week === day && m.meal_type === mealType)
    return meal?.meal_description || ''
  }

  return (
    <div className="-mx-4 sm:mx-0">
      <div className="overflow-x-auto px-4 sm:px-0">
        <div className="min-w-[700px] rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/10">
                <TableHead className="w-24 sm:w-28 font-semibold text-primary sticky left-0 bg-primary/10 z-10">
                  Día
                </TableHead>
                {MEAL_TYPES.map((mealType) => (
                  <TableHead
                    key={mealType.key}
                    className={cn(
                      'text-center font-semibold min-w-[120px] sm:min-w-[140px]',
                      mealType.color
                    )}
                  >
                    {mealType.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {DAYS.map((day) => (
                <TableRow key={day.key} className="hover:bg-muted/30">
                  <TableCell className="font-medium bg-primary/20 text-primary sticky left-0 z-10 text-xs sm:text-sm">
                    {day.label}
                  </TableCell>
                  {MEAL_TYPES.map((mealType) => (
                    <TableCell key={`${day.key}-${mealType.key}`} className="p-1 sm:p-2">
                      {editMode ? (
                        <Textarea
                          className="min-h-16 sm:min-h-20 text-xs sm:text-sm resize-none"
                          placeholder={`${mealType.label}...`}
                          value={getMealDescription(day.key, mealType.key)}
                          onChange={(e) => onMealChange?.(day.key, mealType.key, e.target.value)}
                        />
                      ) : (
                        <div className="min-h-12 sm:min-h-15 text-xs sm:text-sm whitespace-pre-wrap">
                          {getMealDescription(day.key, mealType.key) || (
                            <span className="text-muted-foreground italic">-</span>
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
      </div>
    </div>
  )
}

export { DAYS, MEAL_TYPES }
