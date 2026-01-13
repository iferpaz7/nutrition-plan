'use client'

import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, Pencil, Trash2, Calendar, FileText } from 'lucide-react'
import type { NutritionalPlan } from '@/lib/types'

interface PlanCardProps {
  plan: NutritionalPlan
  onDelete?: (id: string) => void
}

export function PlanCard({ plan, onDelete }: PlanCardProps) {
  const mealCount = plan.meal_entries?.length || 0
  const totalPossibleMeals = 7 * 5 // 7 days * 5 meal types
  const completionPercentage = Math.round((mealCount / totalPossibleMeals) * 100)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {plan.name}
        </CardTitle>
        {plan.description && (
          <CardDescription className="line-clamp-2">{plan.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Creado: {formatDate(plan.created_at)}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Comidas planificadas</span>
              <span className="font-medium">
                {mealCount} / {totalPossibleMeals}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {completionPercentage}% completado
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button asChild variant="default" size="sm" className="flex-1">
          <Link href={`/plans/${plan.id}`}>
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link href={`/plans/${plan.id}/edit`}>
            <Pencil className="h-4 w-4 mr-1" />
            Editar
          </Link>
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete?.(plan.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
