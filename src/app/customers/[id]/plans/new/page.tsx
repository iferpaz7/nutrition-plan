import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { PlanForm } from '@/components/PlanForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getCustomer(id: string) {
  const supabase = await createClient()
  const { data: customer, error } = await supabase
    .from('customer')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
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
            Volver a {customer.first_name} {customer.last_name}
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">
          Nuevo Plan para {customer.first_name} {customer.last_name}
        </h1>
        <p className="text-muted-foreground">Cédula: {customer.id_card}</p>
      </div>

      <PlanForm mode="create" customerId={id} />
    </div>
  )
}
