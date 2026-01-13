'use client'

import { Button } from '@/components/ui/button'
import { Phone } from 'lucide-react'
import { toast } from 'sonner'
import type { NutritionalPlan, Customer } from '@/lib/types'

interface ShareWhatsAppButtonProps {
  plan: NutritionalPlan
  customer?: Customer | null
  onGeneratePdf?: () => Blob
}

export function ShareWhatsAppButton({ plan, customer, onGeneratePdf }: ShareWhatsAppButtonProps) {
  const formatPhoneNumber = (phone: string | null | undefined): string | null => {
    if (!phone) return null

    // Remove all non-numeric characters
    let cleaned = phone.replace(/\D/g, '')

    // If starts with 0, remove it and add country code
    if (cleaned.startsWith('0')) {
      cleaned = '593' + cleaned.substring(1)
    }
    // If doesn't start with country code, add it
    else if (!cleaned.startsWith('593')) {
      cleaned = '593' + cleaned
    }

    return cleaned
  }

  const generateCordialMessage = (): string => {
    const customerName = customer ? customer.first_name : 'estimado/a cliente'

    const lines: string[] = []

    lines.push(`¡Hola ${customerName}! 👋`)
    lines.push('')
    lines.push(`Espero que te encuentres muy bien. 🌟`)
    lines.push('')
    lines.push(
      `Te envío tu plan nutricional *"${plan.name}"* en formato PDF para que puedas consultarlo fácilmente.`
    )
    lines.push('')
    lines.push(
      `📎 *El archivo PDF ha sido descargado en tu dispositivo.* Por favor, adjúntalo a esta conversación para compartirlo.`
    )
    lines.push('')
    if (plan.description) {
      lines.push(`📝 ${plan.description}`)
      lines.push('')
    }
    lines.push(
      `Si tienes alguna duda o necesitas ajustes en el plan, no dudes en escribirme. Estoy aquí para ayudarte a alcanzar tus objetivos. 💪`
    )
    lines.push('')
    lines.push(`¡Mucho éxito con tu alimentación! 🥗🌿`)
    lines.push('')
    lines.push(`_— Tu nutricionista de confianza_`)

    return lines.join('\n')
  }

  const downloadPdf = (blob: Blob) => {
    const sanitizedName = plan.name.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s]/g, '').replace(/\s+/g, '_')
    const date = new Date().toISOString().split('T')[0]
    const filename = `${sanitizedName}_${date}.pdf`

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleShareWhatsApp = () => {
    const phoneNumber = formatPhoneNumber(customer?.cell_phone)

    if (!phoneNumber) {
      toast.error('El cliente no tiene número de teléfono registrado')
      return
    }

    // Generate and download PDF first
    if (onGeneratePdf) {
      try {
        const pdfBlob = onGeneratePdf()
        downloadPdf(pdfBlob)
        toast.success('PDF descargado. Adjúntalo al chat de WhatsApp.')
      } catch (error) {
        console.error('Error generating PDF:', error)
        toast.error('Error al generar el PDF')
        return
      }
    }

    // Generate cordial message
    const message = generateCordialMessage()
    const encodedMessage = encodeURIComponent(message)

    // WhatsApp URL with phone number and message
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

    // Open in new tab
    window.open(whatsappUrl, '_blank')

    toast.success('Abriendo WhatsApp...')
  }

  const hasPhone = customer?.cell_phone

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShareWhatsApp}
      disabled={!hasPhone}
      className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200 min-w-0"
      title={hasPhone ? 'Compartir por WhatsApp' : 'El cliente no tiene teléfono registrado'}
    >
      <Phone className="h-4 w-4 sm:mr-1" />
      <span className="hidden sm:inline">WhatsApp</span>
    </Button>
  )
}
