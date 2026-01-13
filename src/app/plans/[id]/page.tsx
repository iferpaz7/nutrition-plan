import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { PlanViewClient } from '@/components/PlanViewClient'
import { DeletePlanButton } from './DeletePlanButton'
import { ArrowLeft, Pencil } from 'lucide-react'
import type { NutritionalPlan } from '@/lib/types'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getPlan(id: string): Promise<NutritionalPlan | null> {
  const supabase = await createClient()
  const { data: plan, error } = await supabase
    .from('nutritional_plan')
    .select(
      `
      *,
      customer (*),
      meal_entries:meal_entry (*)
    `
    )
    .eq('id', id)
    .single()

  if (error) return null
  return plan
}

export default async function PlanViewPage({ params }: PageProps) {
  const { id } = await params
  const plan = await getPlan(id)

  if (!plan) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Planes
          </Link>
        </Button>
      </div>

      <PlanViewClient plan={plan}>
        <Button asChild variant="outline">
          <Link href={`/plans/${plan.id}/edit`}>
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </Link>
        </Button>
        <DeletePlanButton planId={plan.id} planName={plan.name} />
      </PlanViewClient>
    </div>
  )
}
