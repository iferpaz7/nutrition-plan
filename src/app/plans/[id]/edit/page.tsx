import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { PlanForm } from '@/components/PlanForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import type { NutritionalPlan } from '@/lib/types'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getPlan(id: string): Promise<NutritionalPlan | null> {
  const plan = await prisma.nutritionalPlan.findUnique({
    where: { id },
    include: { mealEntries: true }
  })
  return plan
}

export default async function EditPlanPage({ params }: PageProps) {
  const { id } = await params
  const plan = await getPlan(id)

  if (!plan) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/plans/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Plan
          </Link>
        </Button>
      </div>

      <PlanForm mode="edit" initialData={plan} />
    </div>
  )
}
