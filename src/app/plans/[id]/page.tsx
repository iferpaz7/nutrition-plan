import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlanGrid } from '@/components/PlanGrid'
import { ExportButton } from '@/components/ExportButton'
import { DeletePlanButton } from './DeletePlanButton'
import { ArrowLeft, Pencil, Calendar } from 'lucide-react'
import type { NutritionalPlan } from '@/lib/types'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getPlan(id: string): Promise<NutritionalPlan | null> {
  const supabase = await createClient()
  const { data: plan, error } = await supabase
    .from('nutritional_plan')
    .select(`
      *,
      meal_entries:meal_entry (*)
    `)
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl text-primary">{plan.name}</CardTitle>
              {plan.description && (
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              )}
              <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Creado: {formatDate(plan.created_at)}</span>
                {plan.updated_at !== plan.created_at && (
                  <>
                    <span className="mx-2">•</span>
                    <span>Actualizado: {formatDate(plan.updated_at)}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <ExportButton plan={plan} />
              <Button asChild variant="outline">
                <Link href={`/plans/${plan.id}/edit`}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar
                </Link>
              </Button>
              <DeletePlanButton planId={plan.id} planName={plan.name} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PlanGrid meals={plan.meal_entries || []} />
        </CardContent>
      </Card>
    </div>
  )
}
