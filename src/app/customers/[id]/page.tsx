import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlanCard } from '@/components/PlanCard'
import { ArrowLeft, Pencil, Plus, Phone, IdCard, Calendar } from 'lucide-react'
import { DeleteCustomerButton } from './DeleteCustomerButton'
import type { Customer } from '@/lib/types'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getCustomer(id: string): Promise<Customer | null> {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      nutritionalPlans: {
        include: {
          mealEntries: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })
  return customer
}

export default async function CustomerViewPage({ params }: PageProps) {
  const { id } = await params
  const customer = await getCustomer(id)

  if (!customer) {
    notFound()
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/customers">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Clientes
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl text-primary">
                {customer.firstName} {customer.lastName}
              </CardTitle>
              <CardDescription className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <IdCard className="h-4 w-4" />
                  <span>{customer.idCard}</span>
                </div>
                {customer.cellPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{customer.cellPhone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Cliente desde: {formatDate(customer.createdAt)}</span>
                </div>
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href={`/customers/${customer.id}/edit`}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar
                </Link>
              </Button>
              <DeleteCustomerButton customerId={customer.id} customerName={`${customer.firstName} ${customer.lastName}`} />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-primary">Planes Nutricionales</h2>
        <Button asChild>
          <Link href={`/customers/${customer.id}/plans/new`}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Plan
          </Link>
        </Button>
      </div>

      {customer.nutritionalPlans && customer.nutritionalPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customer.nutritionalPlans.map(plan => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      ) : (
        <Card className="p-10">
          <div className="text-center text-muted-foreground">
            <p className="mb-4">Este cliente no tiene planes nutricionales.</p>
            <Button asChild>
              <Link href={`/customers/${customer.id}/plans/new`}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Plan
              </Link>
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
