'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PlanGrid } from '@/components/PlanGrid'
import { ExportButton } from '@/components/ExportButton'
import { ExportImageButton } from '@/components/ExportImageButton'
import { Calendar } from 'lucide-react'
import type { NutritionalPlan } from '@/lib/types'

interface PlanViewClientProps {
  plan: NutritionalPlan
  children?: React.ReactNode // For action buttons like Edit and Delete
}

export function PlanViewClient({ plan, children }: PlanViewClientProps) {
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
    <Card className="mb-6">
      <div id="plan-grid-container" className="bg-white">
        <CardHeader className="pb-4">
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
        </CardHeader>
        <CardContent>
          <PlanGrid meals={plan.meal_entries || []} />
        </CardContent>
      </div>
      
      {/* Action buttons - outside the export area */}
      <div className="px-6 pb-6 pt-2 flex gap-2 justify-end border-t">
        <ExportImageButton plan={plan} />
        <ExportButton plan={plan} />
        {children}
      </div>
    </Card>
  )
}
