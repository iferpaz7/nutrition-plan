'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PlanGrid, DAYS, MEAL_TYPES } from '@/components/PlanGrid'
import { toast } from 'sonner'
import { DayOfWeek, MealType } from '@/lib/types'
import type { NutritionalPlan } from '@/lib/types'

interface PlanFormProps {
  initialData?: NutritionalPlan
  mode: 'create' | 'edit'
  customerId?: string
}

type MealsState = Record<string, Record<string, string>>

export function PlanForm({ initialData, mode, customerId }: PlanFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState(initialData?.name || '')
  const [description, setDescription] = useState(initialData?.description || '')
  
  // Initialize meals from existing data
  const initializeMeals = (): MealsState => {
    const meals: MealsState = {}
    DAYS.forEach(day => {
      meals[day.key] = {}
      MEAL_TYPES.forEach(mealType => {
        const existingMeal = (initialData?.mealEntries || []).find(
          m => m.dayOfWeek === day.key && m.mealType === mealType.key
        )
        meals[day.key][mealType.key] = existingMeal?.mealDescription || ''
      })
    })
    return meals
  }

  const [meals, setMeals] = useState<MealsState>(initializeMeals)

  const handleMealChange = useCallback((day: DayOfWeek, mealType: MealType, value: string) => {
    setMeals(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: value
      }
    }))
  }, [])

  const getMealValue = useCallback((day: DayOfWeek, mealType: MealType): string => {
    return meals[day]?.[mealType] || ''
  }, [meals])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast.error('El nombre del plan es requerido')
      return
    }

    setIsSubmitting(true)

    try {
      // Filter out empty meal entries
      const filteredMeals: MealsState = {}
      Object.entries(meals).forEach(([day, mealTypes]) => {
        Object.entries(mealTypes).forEach(([mealType, desc]) => {
          if (desc.trim()) {
            if (!filteredMeals[day]) filteredMeals[day] = {}
            filteredMeals[day][mealType] = desc.trim()
          }
        })
      })

      const body = {
        name: name.trim(),
        description: description.trim() || undefined,
        meals: filteredMeals,
        customerId: customerId || initialData?.customerId
      }

      const url = mode === 'create' 
        ? '/api/plans' 
        : `/api/plans/${initialData?.id}`
      
      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Error al guardar el plan')
      }

      toast.success(mode === 'create' ? 'Plan creado exitosamente' : 'Plan actualizado exitosamente')
      
      // Redirect to customer page if customerId exists, otherwise to plan page
      if (customerId) {
        router.push(`/customers/${customerId}`)
      } else {
        router.push(`/plans/${result.data.id}`)
      }
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar el plan')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            {mode === 'create' ? 'Nuevo Plan Nutricional' : 'Editar Plan Nutricional'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Plan *</Label>
            <Input
              id="name"
              placeholder="Ej: Plan Semanal Saludable"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Descripción opcional del plan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Planificación Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <PlanGrid 
            meals={[]} 
            editMode={true}
            onMealChange={handleMealChange}
            getMealValue={getMealValue}
          />
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : mode === 'create' ? 'Crear Plan' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  )
}
