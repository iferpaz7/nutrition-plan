'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { PlanGrid, DAYS, MEAL_TYPES } from '@/components/PlanGrid'
import { toast } from 'sonner'
import { Search, UserPlus, X, Check, User } from 'lucide-react'
import type { DayOfWeek, MealType, NutritionalPlan, Customer } from '@/lib/types'

interface PlanFormProps {
  initialData?: NutritionalPlan
  mode: 'create' | 'edit'
  customerId?: string
}

type MealsState = Record<string, Record<string, string>>

export function PlanForm({ initialData, mode, customerId: initialCustomerId }: PlanFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState(initialData?.name || '')
  const [description, setDescription] = useState(initialData?.description || '')

  // Customer selection state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Customer[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false)

  // New customer form state
  const [newCustomerIdCard, setNewCustomerIdCard] = useState('')
  const [newCustomerFirstName, setNewCustomerFirstName] = useState('')
  const [newCustomerLastName, setNewCustomerLastName] = useState('')
  const [newCustomerCellPhone, setNewCustomerCellPhone] = useState('')
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false)

  // Load customer if customerId is provided
  useEffect(() => {
    if (initialCustomerId) {
      fetchCustomerById(initialCustomerId)
    } else if (initialData?.customer) {
      setSelectedCustomer(initialData.customer)
    }
  }, [initialCustomerId, initialData?.customer])

  const fetchCustomerById = async (id: string) => {
    try {
      const response = await fetch(`/api/customers/${id}`)
      const result = await response.json()
      if (result.success && result.data) {
        setSelectedCustomer(result.data)
      }
    } catch (error) {
      console.error('Error fetching customer:', error)
    }
  }

  // Search customers
  const searchCustomers = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/customers?search=${encodeURIComponent(query.trim())}`)
      const result = await response.json()

      if (result.success && result.data) {
        setSearchResults(result.data)
      }
    } catch (error) {
      console.error('Error searching customers:', error)
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchCustomers(searchQuery)
      } else {
        setSearchResults([])
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, searchCustomers])

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setSearchQuery('')
    setSearchResults([])
  }

  const handleClearCustomer = () => {
    setSelectedCustomer(null)
  }

  const handleCreateCustomer = async () => {
    if (!newCustomerIdCard.trim() || !newCustomerFirstName.trim() || !newCustomerLastName.trim()) {
      toast.error('Cédula, nombre y apellido son requeridos')
      return
    }

    setIsCreatingCustomer(true)
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_card: newCustomerIdCard.trim(),
          first_name: newCustomerFirstName.trim(),
          last_name: newCustomerLastName.trim(),
          cell_phone: newCustomerCellPhone.trim() || undefined,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Error al crear cliente')
      }

      toast.success('Cliente creado exitosamente')
      setSelectedCustomer(result.data)
      setShowNewCustomerDialog(false)

      // Reset form
      setNewCustomerIdCard('')
      setNewCustomerFirstName('')
      setNewCustomerLastName('')
      setNewCustomerCellPhone('')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al crear cliente')
    } finally {
      setIsCreatingCustomer(false)
    }
  }
  // Initialize meals from existing data
  const initializeMeals = (): MealsState => {
    const meals: MealsState = {}
    DAYS.forEach((day) => {
      meals[day.key] = {}
      MEAL_TYPES.forEach((mealType) => {
        const existingMeal = (initialData?.meal_entries || []).find(
          (m) => m.day_of_week === day.key && m.meal_type === mealType.key
        )
        meals[day.key][mealType.key] = existingMeal?.meal_description || ''
      })
    })
    return meals
  }

  const [meals, setMeals] = useState<MealsState>(initializeMeals)

  const handleMealChange = useCallback((day: DayOfWeek, mealType: MealType, value: string) => {
    setMeals((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: value,
      },
    }))
  }, [])

  const getMealValue = useCallback(
    (day: DayOfWeek, mealType: MealType): string => {
      return meals[day]?.[mealType] || ''
    },
    [meals]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('El nombre del plan es requerido')
      return
    }

    // Validate customer selection for new plans
    if (mode === 'create' && !selectedCustomer && !initialCustomerId) {
      toast.error('Debe seleccionar un cliente')
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
        customer_id: selectedCustomer?.id || initialCustomerId || initialData?.customer_id,
      }

      const url = mode === 'create' ? '/api/plans' : `/api/plans/${initialData?.id}`

      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Error al guardar el plan')
      }

      toast.success(
        mode === 'create' ? 'Plan creado exitosamente' : 'Plan actualizado exitosamente'
      )

      // Redirect to customer page if customer exists, otherwise to plan page
      const redirectCustomerId = selectedCustomer?.id || initialCustomerId
      if (redirectCustomerId) {
        router.push(`/customers/${redirectCustomerId}`)
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
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Selection Card - Only show if no customerId is provided */}
        {!initialCustomerId && (
          <Card>
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <User className="h-5 w-5" />
                Cliente
              </CardTitle>
              <CardDescription>Busque un cliente existente o cree uno nuevo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedCustomer ? (
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-primary">
                        {selectedCustomer.first_name} {selectedCustomer.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Cédula: {selectedCustomer.id_card}
                        {selectedCustomer.cell_phone && ` • Tel: ${selectedCustomer.cell_phone}`}
                      </p>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={handleClearCustomer}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por cédula o nombre..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {isSearching && (
                    <p className="text-sm text-muted-foreground text-center py-2">Buscando...</p>
                  )}

                  {searchResults.length > 0 && (
                    <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                      {searchResults.map((customer) => (
                        <button
                          key={customer.id}
                          type="button"
                          onClick={() => handleSelectCustomer(customer)}
                          className="w-full p-3 text-left hover:bg-muted/50 flex items-center justify-between group"
                        >
                          <div>
                            <p className="font-medium">
                              {customer.first_name} {customer.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">{customer.id_card}</p>
                          </div>
                          <Check className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  )}

                  {searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      No se encontraron clientes
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-sm text-muted-foreground">o</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowNewCustomerDialog(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Crear Nuevo Cliente
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-primary">Planificación Semanal</CardTitle>
          </CardHeader>
          <CardContent className="px-0 sm:px-6">
            <PlanGrid
              meals={[]}
              editMode={true}
              onMealChange={handleMealChange}
              getMealValue={getMealValue}
            />
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end px-2 sm:px-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={
              isSubmitting || (mode === 'create' && !selectedCustomer && !initialCustomerId)
            }
          >
            {isSubmitting ? 'Guardando...' : mode === 'create' ? 'Crear Plan' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>

      {/* New Customer Dialog */}
      <Dialog open={showNewCustomerDialog} onOpenChange={setShowNewCustomerDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo Cliente</DialogTitle>
            <DialogDescription>Complete los datos del nuevo cliente</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newIdCard">Cédula *</Label>
              <Input
                id="newIdCard"
                placeholder="Ej: 1234567890"
                value={newCustomerIdCard}
                onChange={(e) => setNewCustomerIdCard(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newFirstName">Nombre *</Label>
                <Input
                  id="newFirstName"
                  placeholder="Ej: Juan"
                  value={newCustomerFirstName}
                  onChange={(e) => setNewCustomerFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newLastName">Apellido *</Label>
                <Input
                  id="newLastName"
                  placeholder="Ej: Pérez"
                  value={newCustomerLastName}
                  onChange={(e) => setNewCustomerLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newCellPhone">Teléfono</Label>
              <Input
                id="newCellPhone"
                placeholder="Ej: 0999123456"
                value={newCustomerCellPhone}
                onChange={(e) => setNewCustomerCellPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowNewCustomerDialog(false)}
              disabled={isCreatingCustomer}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleCreateCustomer} disabled={isCreatingCustomer}>
              {isCreatingCustomer ? 'Creando...' : 'Crear Cliente'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
