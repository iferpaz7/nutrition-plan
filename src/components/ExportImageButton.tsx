'use client'

import { Button } from '@/components/ui/button'
import { ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import html2canvas from 'html2canvas'
import type { NutritionalPlan } from '@/lib/types'

interface ExportImageButtonProps {
  plan: NutritionalPlan
  targetId?: string
}

export function ExportImageButton({ plan, targetId = 'plan-grid-container' }: ExportImageButtonProps) {
  const handleExportImage = async () => {
    try {
      const element = document.getElementById(targetId)
      
      if (!element) {
        toast.error('No se encontró el elemento para exportar')
        return
      }

      toast.loading('Generando imagen...', { id: 'export-image' })

      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      })

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error('Error al generar la imagen', { id: 'export-image' })
          return
        }

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        
        // Generate filename with plan name and date
        const sanitizedName = plan.name.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s]/g, '').replace(/\s+/g, '_')
        const date = new Date().toISOString().split('T')[0]
        link.download = `${sanitizedName}_${date}.png`
        
        link.href = url
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        toast.success('Imagen exportada exitosamente', { id: 'export-image' })
      }, 'image/png', 1.0)
    } catch (error) {
      console.error('Export image error:', error)
      toast.error('Error al exportar la imagen', { id: 'export-image' })
    }
  }

  return (
    <Button variant="secondary" onClick={handleExportImage}>
      <ImageIcon className="h-4 w-4 mr-2" />
      Exportar Imagen
    </Button>
  )
}
