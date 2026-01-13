'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import type { Customer } from '@/lib/types'

interface CustomerFormProps {
  initialData?: Customer
  mode: 'create' | 'edit'
}

export function CustomerForm({ initialData, mode }: CustomerFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [idCard, setIdCard] = useState(initialData?.id_card || '')
  const [firstName, setFirstName] = useState(initialData?.first_name || '')
  const [lastName, setLastName] = useState(initialData?.last_name || '')
  const [cellPhone, setCellPhone] = useState(initialData?.cell_phone || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!idCard.trim()) {
      toast.error('La cédula es requerida')
      return
    }

    if (!firstName.trim()) {
      toast.error('El nombre es requerido')
      return
    }

    if (!lastName.trim()) {
      toast.error('El apellido es requerido')
      return
    }

    setIsSubmitting(true)

    try {
      const body = {
        id_card: idCard.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        cell_phone: cellPhone.trim() || undefined
      }

      const url = mode === 'create' 
        ? '/api/customers' 
        : `/api/customers/${initialData?.id}`
      
      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Error al guardar el cliente')
      }

      toast.success(mode === 'create' ? 'Cliente creado exitosamente' : 'Cliente actualizado exitosamente')
      router.push(`/customers/${result.data.id}`)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar el cliente')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            {mode === 'create' ? 'Nuevo Cliente' : 'Editar Cliente'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="idCard">Cédula *</Label>
              <Input
                id="idCard"
                placeholder="Ej: 1234567890"
                value={idCard}
                onChange={(e) => setIdCard(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cellPhone">Teléfono</Label>
              <Input
                id="cellPhone"
                placeholder="Ej: 0999123456"
                value={cellPhone}
                onChange={(e) => setCellPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre *</Label>
              <Input
                id="firstName"
                placeholder="Ej: Juan"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido *</Label>
              <Input
                id="lastName"
                placeholder="Ej: Pérez"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : mode === 'create' ? 'Crear Cliente' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  )
}
