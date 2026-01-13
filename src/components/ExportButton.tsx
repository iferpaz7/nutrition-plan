'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'
import type { NutritionalPlan } from '@/lib/types'
import { DAYS, MEAL_TYPES } from '@/components/PlanGrid'

interface ExportButtonProps {
  plan: NutritionalPlan
}

export function ExportButton({ plan }: ExportButtonProps) {
  const handleExport = () => {
    try {
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new()
      
      // Prepare data for export
      const data: (string | undefined)[][] = []
      
      // Header row with days
      const headerRow = ['Comida', ...DAYS.map(d => d.label)]
      data.push(headerRow)
      
      // Data rows for each meal type
      MEAL_TYPES.forEach(mealType => {
        const row: (string | undefined)[] = [mealType.label]
        DAYS.forEach(day => {
          const meal = plan.mealEntries.find(
            m => m.dayOfWeek === day.key && m.mealType === mealType.key
          )
          row.push(meal?.mealDescription || '')
        })
        data.push(row)
      })
      
      // Create worksheet from data
      const ws = XLSX.utils.aoa_to_sheet(data)
      
      // Set column widths
      ws['!cols'] = [
        { wch: 15 }, // Meal type column
        ...DAYS.map(() => ({ wch: 25 })) // Day columns
      ]
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Plan Nutricional')
      
      // Generate filename with plan name and date
      const sanitizedName = plan.name.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s]/g, '').replace(/\s+/g, '_')
      const date = new Date().toISOString().split('T')[0]
      const filename = `${sanitizedName}_${date}.xlsx`
      
      // Download the file
      XLSX.writeFile(wb, filename)
      
      toast.success('Plan exportado exitosamente')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Error al exportar el plan')
    }
  }

  return (
    <Button variant="secondary" onClick={handleExport}>
      <Download className="h-4 w-4 mr-2" />
      Exportar a Excel
    </Button>
  )
}
