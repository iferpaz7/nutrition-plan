'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Eye, Pencil, Calendar, FileText, Download, FileDown,
  Copy, Phone
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { NutritionalPlan, Customer } from '@/lib/types'
import { DAYS, MEAL_TYPES } from '@/components/PlanGrid'
import { DeletePlanButton } from './DeletePlanButton'
import { CopyPlanButton } from '@/components/CopyPlanButton'
import { ShareWhatsAppButton } from '@/components/ShareWhatsAppButton'

interface PlanCardWithExportProps {
  plan: NutritionalPlan & { 
    customer?: { 
      id: string
      first_name: string
      last_name: string
      cell_phone?: string | null 
    } | null 
  }
}

export function PlanCardWithExport({ plan }: PlanCardWithExportProps) {
  const mealCount = plan.meal_entries?.length || 0
  const totalPossibleMeals = 7 * 5 // 7 days * 5 meal types
  const completionPercentage = Math.round((mealCount / totalPossibleMeals) * 100)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Export to Excel
  const handleExportExcel = () => {
    try {
      const wb = XLSX.utils.book_new()
      const data: (string | undefined)[][] = []
      
      const headerRow = ['DÍA', ...MEAL_TYPES.map(m => m.label.toUpperCase())]
      data.push(headerRow)
      
      DAYS.forEach(day => {
        const row: (string | undefined)[] = [day.label.toUpperCase()]
        MEAL_TYPES.forEach(mealType => {
          const meal = (plan.meal_entries || []).find(
            m => m.day_of_week === day.key && m.meal_type === mealType.key
          )
          row.push(meal?.meal_description || '')
        })
        data.push(row)
      })
      
      const ws = XLSX.utils.aoa_to_sheet(data)
      ws['!cols'] = [
        { wch: 12 },
        ...MEAL_TYPES.map(() => ({ wch: 25 }))
      ]
      
      XLSX.utils.book_append_sheet(wb, ws, 'Plan Nutricional')
      
      const sanitizedName = plan.name.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s]/g, '').replace(/\s+/g, '_')
      const date = new Date().toISOString().split('T')[0]
      
      XLSX.writeFile(wb, `${sanitizedName}_${date}.xlsx`)
      toast.success('Plan exportado a Excel correctamente')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Error al exportar el plan')
    }
  }

  // Export to PDF
  const handleExportPdf = () => {
    try {
      const doc = new jsPDF('l', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.getWidth()
      
      // Header
      doc.setFontSize(18)
      doc.setTextColor(34, 139, 34) // Forest green
      doc.text(plan.name, pageWidth / 2, 15, { align: 'center' })
      
      if (plan.customer) {
        doc.setFontSize(12)
        doc.setTextColor(100, 100, 100)
        doc.text(`Cliente: ${plan.customer.first_name} ${plan.customer.last_name}`, pageWidth / 2, 22, { align: 'center' })
      }
      
      // Table data
      const tableData = DAYS.map(day => {
        const row = [day.label]
        MEAL_TYPES.forEach(mealType => {
          const meal = (plan.meal_entries || []).find(
            m => m.day_of_week === day.key && m.meal_type === mealType.key
          )
          row.push(meal?.meal_description || '-')
        })
        return row
      })
      
      autoTable(doc, {
        startY: 30,
        head: [['Día', ...MEAL_TYPES.map(m => m.label)]],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [34, 139, 34],
          textColor: 255,
          fontSize: 9,
          fontStyle: 'bold',
        },
        bodyStyles: {
          fontSize: 8,
        },
        columnStyles: {
          0: { fontStyle: 'bold', fillColor: [240, 248, 240] },
        },
        styles: {
          cellPadding: 3,
          overflow: 'linebreak',
        },
      })
      
      const sanitizedName = plan.name.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s]/g, '').replace(/\s+/g, '_')
      const date = new Date().toISOString().split('T')[0]
      doc.save(`${sanitizedName}_${date}.pdf`)
      toast.success('Plan exportado a PDF correctamente')
    } catch (error) {
      console.error('PDF export error:', error)
      toast.error('Error al exportar a PDF')
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow relative">
      {plan.customer && (
        <div className="absolute top-2 right-2 z-10">
          <Link 
            href={`/customers/${plan.customer.id}`}
            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full hover:bg-primary/20 transition-colors"
          >
            {plan.customer.first_name} {plan.customer.last_name}
          </Link>
        </div>
      )}
      
      <CardHeader className="pb-2">
        <CardTitle className="text-primary flex items-center gap-2 pr-20">
          <FileText className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">{plan.name}</span>
        </CardTitle>
        {plan.description && (
          <CardDescription className="line-clamp-2">
            {plan.description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Creado: {formatDate(plan.created_at)}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Comidas planificadas</span>
              <span className="font-medium">{mealCount} / {totalPossibleMeals}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {completionPercentage}% completado
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="gap-2 flex-wrap">
        <Button asChild variant="default" size="sm">
          <Link href={`/plans/${plan.id}`}>
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`/plans/${plan.id}/edit`}>
            <Pencil className="h-4 w-4 mr-1" />
            Editar
          </Link>
        </Button>
        
        {/* Export Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Exportar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportExcel}>
              <FileDown className="h-4 w-4 mr-2" />
              Exportar Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportPdf}>
              <FileText className="h-4 w-4 mr-2" />
              Exportar PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <CopyPlanButton plan={plan} />
        
        {plan.customer && (
          <ShareWhatsAppButton 
            plan={plan} 
            customer={{
              ...plan.customer,
              email: '',
              cell_phone: plan.customer.cell_phone || null,
              created_at: '',
              updated_at: ''
            }} 
          />
        )}
        
        <DeletePlanButton planId={plan.id} planName={plan.name} />
      </CardFooter>
    </Card>
  )
}
