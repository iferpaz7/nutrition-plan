import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { CustomerForm } from '@/components/CustomerForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import type { Customer } from '@/lib/types'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getCustomer(id: string): Promise<Customer | null> {
  const customer = await prisma.customer.findUnique({
    where: { id },
  })
  return customer
}

export default async function EditCustomerPage({ params }: PageProps) {
  const { id } = await params
  const customer = await getCustomer(id)

  if (!customer) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/customers/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Cliente
          </Link>
        </Button>
      </div>

      <CustomerForm mode="edit" initialData={customer} />
    </div>
  )
}
