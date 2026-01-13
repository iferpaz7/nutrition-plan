'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CustomerCard } from '@/components/CustomerCard'
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog'
import { Plus, Users } from 'lucide-react'
import { toast } from 'sonner'
import type { Customer, ApiResponse } from '@/lib/types'

export default function CustomersPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)

  const fetchCustomers = useCallback(async () => {
    try {
      const response = await fetch('/api/customers')
      const result: ApiResponse<Customer[]> = await response.json()

      if (result.success && result.data) {
        setCustomers(result.data)
      } else {
        toast.error('Error al cargar los clientes')
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const handleDeleteClick = (id: string) => {
    const customer = customers.find((c) => c.id === id)
    if (customer) {
      setCustomerToDelete(customer)
      setDeleteDialogOpen(true)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return

    try {
      const response = await fetch(`/api/customers/${customerToDelete.id}`, {
        method: 'DELETE',
      })
      const result = await response.json()

      if (result.success) {
        toast.success('Cliente eliminado exitosamente')
        setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete.id))
        setDeleteDialogOpen(false)
        setCustomerToDelete(null)
        router.refresh()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar el cliente')
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-100">
          <div className="animate-pulse text-muted-foreground">Cargando clientes...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Users className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary">Clientes</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Gestiona tus clientes y sus planes nutricionales
              </p>
            </div>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/customers/new">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Cliente
            </Link>
          </Button>
        </div>
      </header>

      {customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-100 bg-card rounded-lg border border-border p-10">
          <Users className="h-20 w-20 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No hay clientes registrados</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Registra tu primer cliente para comenzar a crear planes nutricionales.
          </p>
          <Button asChild>
            <Link href="/customers/new">
              <Plus className="h-4 w-4 mr-2" />
              Registrar Primer Cliente
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} onDelete={handleDeleteClick} />
          ))}
        </div>
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        planName={
          customerToDelete ? `${customerToDelete.first_name} ${customerToDelete.last_name}` : ''
        }
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
