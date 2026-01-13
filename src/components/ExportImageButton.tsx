'use client'

import { Button } from '@/components/ui/button'
import { ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import domtoimage from 'dom-to-image-more'
import type { NutritionalPlan } from '@/lib/types'

interface ExportImageButtonProps {
  plan: NutritionalPlan
  targetId?: string
}

export function ExportImageButton({
  plan,
  targetId = 'plan-grid-container',
}: ExportImageButtonProps) {
  const handleExportImage = async () => {
    try {
      const element = document.getElementById(targetId)

      if (!element) {
        toast.error('No se encontró el elemento para exportar')
        return
      }

      toast.loading('Generando imagen...', { id: 'export-image' })

      // Use dom-to-image-more which has better CSS support
      const blob = await domtoimage.toBlob(element, {
        bgcolor: '#ffffff',
        quality: 1,
        scale: 2,
        style: {
          // Ensure the element is fully visible
          transform: 'none',
        },
        // Filter function to skip problematic elements
        filter: (node: Node) => {
          // Skip script and style tags that might cause issues
          if (node instanceof Element) {
            const tagName = node.tagName?.toLowerCase()
            if (tagName === 'script' || tagName === 'noscript') {
              return false
            }
          }
          return true
        },
      })

      if (!blob) {
        toast.error('Error al generar la imagen', { id: 'export-image' })
        return
      }

      // Download the image
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      // Generate filename with plan name and date
      const sanitizedName = plan.name
        .replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s]/g, '')
        .replace(/\s+/g, '_')
      const date = new Date().toISOString().split('T')[0]
      link.download = `${sanitizedName}_${date}.png`

      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('Imagen exportada exitosamente', { id: 'export-image' })
    } catch (error) {
      console.error('Export image error:', error)
      toast.error('Error al exportar la imagen. Intenta con Exportar PDF.', { id: 'export-image' })
    }
  }

  return (
    <Button variant="secondary" onClick={handleExportImage}>
      <ImageIcon className="h-4 w-4 mr-2" />
      Exportar Imagen
    </Button>
  )
}
