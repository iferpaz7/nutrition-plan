import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, ClipboardList } from 'lucide-react'
import { PlanCardWithExport } from './PlanCardWithExport'
import type { NutritionalPlan } from '@/lib/types'

async function getPlans(): Promise<NutritionalPlan[]> {
  const supabase = await createClient()
  const { data: plans, error } = await supabase
    .from('nutritional_plan')
    .select(
      `
      *,
      customer:customer (
        id,
        first_name,
        last_name,
        cell_phone
      ),
      meal_entries:meal_entry (*)
    `
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching plans:', error)
    return []
  }
  return plans || []
}

export default async function PlansPage() {
  const plans = await getPlans()

  return (
    <div className="container mx-auto py-6 sm:py-10 px-4 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary flex items-center gap-3">
            <ClipboardList className="h-6 w-6 sm:h-8 sm:w-8" />
            Planes Nutricionales
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Gestiona todos los planes nutricionales de tus clientes
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/plans/new">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Plan
          </Link>
        </Button>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-12">
          <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No hay planes nutricionales</h3>
          <p className="text-muted-foreground mb-4">Comienza creando tu primer plan nutricional</p>
          <Button asChild>
            <Link href="/plans/new">
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Plan
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCardWithExport key={plan.id} plan={plan} />
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Total: {plans.length} {plans.length === 1 ? 'plan' : 'planes'}
      </div>
    </div>
  )
}
