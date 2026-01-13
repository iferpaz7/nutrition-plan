'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PlanCard } from '@/components/PlanCard'
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog'
import { Plus, Salad, Users } from 'lucide-react'
import { toast } from 'sonner'
import type { NutritionalPlan, ApiResponse } from '@/lib/types'

export default function HomePage() {
  const router = useRouter()
  const [plans, setPlans] = useState<NutritionalPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [planToDelete, setPlanToDelete] = useState<NutritionalPlan | null>(null)

  const fetchPlans = useCallback(async () => {
    try {
      const response = await fetch('/api/plans')
      const result: ApiResponse<NutritionalPlan[]> = await response.json()
      
      if (result.success && result.data) {
        setPlans(result.data)
      } else {
        toast.error('Error al cargar los planes')
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  const handleDeleteClick = (id: string) => {
    const plan = plans.find(p => p.id === id)
    if (plan) {
      setPlanToDelete(plan)
      setDeleteDialogOpen(true)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return

    try {
      const response = await fetch(`/api/plans/${planToDelete.id}`, {
        method: 'DELETE'
      })
      const result = await response.json()

      if (result.success) {
        toast.success('Plan eliminado exitosamente')
        setPlans(prev => prev.filter(p => p.id !== planToDelete.id))
        setDeleteDialogOpen(false)
        setPlanToDelete(null)
        router.refresh()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar el plan')
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-muted-foreground">Cargando planes...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Salad className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary">Planes Nutricionales</h1>
              <p className="text-muted-foreground text-sm sm:text-base">Gestiona tus planes de alimentación semanales</p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button asChild className="flex-1 sm:flex-none">
              <Link href="/plans/new">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Plan
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-card rounded-lg border border-border p-10">
          <Salad className="h-20 w-20 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No hay planes nutricionales</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Crea tu primer plan nutricional para comenzar a organizar tus comidas semanales.
          </p>
          <Button asChild>
            <Link href="/plans/new">
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Plan
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map(plan => (
            <PlanCard 
              key={plan.id} 
              plan={plan} 
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        planName={planToDelete?.name || ''}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
