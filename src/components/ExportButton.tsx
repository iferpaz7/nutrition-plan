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
      
      // Prepare data for export (days as rows, meals as columns - like original template)
      const data: (string | undefined)[][] = []
      
      // Header row with meal types
      const headerRow = ['DÍA', ...MEAL_TYPES.map(m => m.label.toUpperCase())]
      data.push(headerRow)
      
      // Data rows for each day
      DAYS.forEach(day => {
        const row: (string | undefined)[] = [day.label.toUpperCase()]
        MEAL_TYPES.forEach(mealType => {
          const meal = (plan.mealEntries || []).find(
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
        { wch: 12 }, // Day column
        ...MEAL_TYPES.map(() => ({ wch: 25 })) // Meal columns
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
