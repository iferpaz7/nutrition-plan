import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { PlanForm } from '@/components/PlanForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getCustomer(id: string) {
  const customer = await prisma.customer.findUnique({
    where: { id },
  })
  return customer
}

export default async function NewPlanForCustomerPage({ params }: PageProps) {
  const { id } = await params
  const customer = await getCustomer(id)

  if (!customer) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/customers/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a {customer.firstName} {customer.lastName}
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">
          Nuevo Plan para {customer.firstName} {customer.lastName}
        </h1>
        <p className="text-muted-foreground">Cédula: {customer.idCard}</p>
      </div>

      <PlanForm mode="create" customerId={id} />
    </div>
  )
}
