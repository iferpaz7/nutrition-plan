'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface DeleteCustomerButtonProps {
  customerId: string
  customerName: string
}

export function DeleteCustomerButton({ customerId, customerName }: DeleteCustomerButtonProps) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'DELETE'
      })
      const result = await response.json()

      if (result.success) {
        toast.success('Cliente eliminado exitosamente')
        router.push('/customers')
        router.refresh()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar el cliente')
    }
  }

  return (
    <>
      <Button variant="destructive" onClick={() => setDialogOpen(true)}>
        <Trash2 className="h-4 w-4 mr-2" />
        Eliminar
      </Button>
      <DeleteConfirmDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        planName={customerName}
        onConfirm={handleDelete}
      />
    </>
  )
}
