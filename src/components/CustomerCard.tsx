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
import { Eye, Pencil, Trash2, Phone, IdCard, FileText } from 'lucide-react'
import type { Customer } from '@/lib/types'

interface CustomerCardProps {
  customer: Customer
  onDelete?: (id: string) => void
}

export function CustomerCard({ customer, onDelete }: CustomerCardProps) {
  const planCount = customer.nutritional_plans?.length || 0

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2">
          {customer.first_name} {customer.last_name}
        </CardTitle>
        <CardDescription className="space-y-1">
          <div className="flex items-center gap-2">
            <IdCard className="h-4 w-4" />
            <span>{customer.id_card}</span>
          </div>
          {customer.cell_phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{customer.cell_phone}</span>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>
            {planCount} {planCount === 1 ? 'plan' : 'planes'} nutricionales
          </span>
        </div>
      </CardContent>
      <CardFooter className="gap-2 flex-wrap justify-center sm:justify-start">
        <Button asChild variant="default" size="sm" className="flex-1 sm:flex-none min-w-0">
          <Link href={`/customers/${customer.id}`}>
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="flex-1 sm:flex-none min-w-0">
          <Link href={`/customers/${customer.id}/edit`}>
            <Pencil className="h-4 w-4 mr-1" />
            Editar
          </Link>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete?.(customer.id)}
          className="sm:flex-none"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
