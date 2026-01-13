'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { NutritionalPlan, Customer } from '@/lib/types'

interface CopyPlanButtonProps {
  plan: NutritionalPlan
  currentCustomerId?: string
}

export function CopyPlanButton({ plan, currentCustomerId }: CopyPlanButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(currentCustomerId || '')
  const [newPlanName, setNewPlanName] = useState(`${plan.name} (Copia)`)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingCustomers, setIsFetchingCustomers] = useState(false)

  const fetchCustomers = useCallback(async () => {
    setIsFetchingCustomers(true)
    try {
      const response = await fetch('/api/customers')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setCustomers(data.data)
          // Set default to current customer if exists
          if (currentCustomerId) {
            setSelectedCustomerId(currentCustomerId)
          } else if (data.data.length > 0) {
            setSelectedCustomerId(data.data[0].id)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
      toast.error('Error al cargar clientes')
    } finally {
      setIsFetchingCustomers(false)
    }
  }, [currentCustomerId])

  // Fetch customers when dialog opens
  useEffect(() => {
    if (open) {
      fetchCustomers()
    }
  }, [open, fetchCustomers])

  const handleCopyPlan = async () => {
    if (!selectedCustomerId) {
      toast.error('Selecciona un cliente')
      return
    }

    if (!newPlanName.trim()) {
      toast.error('Ingresa un nombre para el plan')
      return
    }

    setIsLoading(true)
    try {
      // Create new plan
      const planResponse = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newPlanName,
          description: plan.description,
          status: 'ACTIVO',
          customer_id: selectedCustomerId,
          daily_calories: plan.daily_calories,
          protein_grams: plan.protein_grams,
          carbs_grams: plan.carbs_grams,
          fat_grams: plan.fat_grams,
          fiber_grams: plan.fiber_grams,
          water_liters: plan.water_liters,
          notes: plan.notes,
        }),
      })

      if (!planResponse.ok) {
        throw new Error('Error al crear el plan')
      }

      const planData = await planResponse.json()
      const newPlanId = planData.data.id

      // Copy meal entries if they exist
      if (plan.meal_entries && plan.meal_entries.length > 0) {
        const mealPromises = plan.meal_entries.map((meal) =>
          fetch(`/api/plans/${newPlanId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              meals: [
                {
                  day_of_week: meal.day_of_week,
                  meal_type: meal.meal_type,
                  meal_description: meal.meal_description,
                  calories: meal.calories,
                  protein_grams: meal.protein_grams,
                  carbs_grams: meal.carbs_grams,
                  fat_grams: meal.fat_grams,
                  fiber_grams: meal.fiber_grams,
                  portion_size: meal.portion_size,
                  preparation_notes: meal.preparation_notes,
                },
              ],
            }),
          })
        )
        await Promise.all(mealPromises)
      }

      toast.success('Plan copiado exitosamente')
      setOpen(false)
      router.push(`/plans/${newPlanId}`)
      router.refresh()
    } catch (error) {
      console.error('Error copying plan:', error)
      toast.error('Error al copiar el plan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="min-w-0">
          <Copy className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Copiar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-w-[calc(100vw-2rem)] mx-auto">
        <DialogHeader>
          <DialogTitle>Copiar Plan Nutricional</DialogTitle>
          <DialogDescription>
            Crea una copia de este plan para el mismo cliente o para otro diferente.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="plan-name">Nombre del nuevo plan</Label>
            <Input
              id="plan-name"
              value={newPlanName}
              onChange={(e) => setNewPlanName(e.target.value)}
              placeholder="Nombre del plan"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="customer">Cliente destino</Label>
            {isFetchingCustomers ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando clientes...
              </div>
            ) : (
              <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.first_name} {customer.last_name}
                      {customer.id === currentCustomerId && ' (actual)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          {plan.meal_entries && plan.meal_entries.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Se copiarán {plan.meal_entries.length} comidas configuradas.
            </p>
          )}
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button
            onClick={handleCopyPlan}
            disabled={isLoading || isFetchingCustomers}
            className="w-full sm:w-auto"
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Copiar Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
