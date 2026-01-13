'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface DeletePlanButtonProps {
  planId: string
  planName: string
}

export function DeletePlanButton({ planId, planName }: DeletePlanButtonProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Error al eliminar el plan')
      }

      toast.success('Plan eliminado correctamente')
      router.refresh()
    } catch (error) {
      console.error('Error deleting plan:', error)
      toast.error('Error al eliminar el plan')
    } finally {
      setShowDeleteDialog(false)
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="absolute bottom-4 right-4 text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={() => setShowDeleteDialog(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        planName={planName}
      />
    </>
  )
}
