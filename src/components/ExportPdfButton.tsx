'use client'

import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'
import { toast } from 'sonner'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { NutritionalPlan, Customer } from '@/lib/types'
import { DAYS, MEAL_TYPES } from '@/components/PlanGrid'

interface ExportPdfButtonProps {
  plan: NutritionalPlan
  customer?: Customer | null
}

// Helper functions for labels
const getGenderLabel = (gender: string | null): string => {
  const labels: Record<string, string> = {
    MASCULINO: 'Masculino',
    FEMENINO: 'Femenino',
    OTRO: 'Otro',
  }
  return gender ? labels[gender] || gender : '-'
}

const getActivityLabel = (level: string | null): string => {
  const labels: Record<string, string> = {
    SEDENTARIO: 'Sedentario',
    LIGERO: 'Ligero (1-3 días/sem)',
    MODERADO: 'Moderado (3-5 días/sem)',
    ACTIVO: 'Activo (6-7 días/sem)',
    MUY_ACTIVO: 'Muy activo',
  }
  return level ? labels[level] || level : '-'
}

const getGoalLabel = (goal: string | null): string => {
  const labels: Record<string, string> = {
    PERDER_PESO: 'Perder peso',
    MANTENER_PESO: 'Mantener peso',
    GANAR_PESO: 'Ganar peso',
    GANAR_MUSCULO: 'Ganar músculo',
    MEJORAR_SALUD: 'Mejorar salud',
  }
  return goal ? labels[goal] || goal : '-'
}

const getImcClassification = (imc: number | null): string => {
  if (!imc) return '-'
  if (imc < 18.5) return 'Bajo peso'
  if (imc < 25) return 'Normal'
  if (imc < 30) return 'Sobrepeso'
  if (imc < 35) return 'Obesidad I'
  if (imc < 40) return 'Obesidad II'
  return 'Obesidad III'
}

const getStatusLabel = (status: string | null): string => {
  const labels: Record<string, string> = {
    BORRADOR: 'Borrador',
    ACTIVO: 'Activo',
    PAUSADO: 'Pausado',
    COMPLETADO: 'Completado',
    CANCELADO: 'Cancelado',
  }
  return status ? labels[status] || status : '-'
}

export function ExportPdfButton({ plan, customer }: ExportPdfButtonProps) {
  const handleExportPdf = () => {
    try {
      toast.loading('Generando PDF...', { id: 'export-pdf' })

      const doc = new jsPDF('landscape', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.getWidth()
      let yPosition = 20

      // Colors
      const primaryColor: [number, number, number] = [22, 163, 74] // green-600
      const textColor: [number, number, number] = [31, 41, 55] // gray-800

      // Title
      doc.setFontSize(20)
      doc.setTextColor(...primaryColor)
      doc.text('Plan Nutricional', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 10

      // Plan name
      doc.setFontSize(16)
      doc.setTextColor(...textColor)
      doc.text(plan.name, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 8

      // Plan description
      if (plan.description) {
        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.text(plan.description, pageWidth / 2, yPosition, { align: 'center' })
        yPosition += 8
      }

      // Customer Information Section
      if (customer) {
        yPosition += 5
        doc.setFontSize(14)
        doc.setTextColor(...primaryColor)
        doc.text('Información del Cliente', 14, yPosition)
        yPosition += 2

        // Customer data table
        const customerData = [
          ['Nombre completo', `${customer.first_name} ${customer.last_name}`],
          ['Cédula', customer.id_card],
          ['Email', customer.email || '-'],
          ['Teléfono', customer.cell_phone || '-'],
          ['Género', getGenderLabel(customer.gender)],
          ['Edad', customer.age ? `${customer.age} años` : '-'],
        ]

        const physicalData = [
          ['Peso', customer.weight ? `${customer.weight} kg` : '-'],
          ['Altura', customer.height ? `${customer.height} m` : '-'],
          ['IMC', customer.imc ? `${customer.imc} (${getImcClassification(customer.imc)})` : '-'],
          [
            '% Grasa corporal',
            customer.body_fat_percentage ? `${customer.body_fat_percentage}%` : '-',
          ],
          ['Nivel de actividad', getActivityLabel(customer.activity_level)],
          ['Objetivo', getGoalLabel(customer.goal)],
        ]

        // Two column layout for customer info
        autoTable(doc, {
          startY: yPosition,
          head: [['Datos Personales', '']],
          body: customerData,
          theme: 'grid',
          headStyles: { fillColor: primaryColor, fontSize: 10 },
          bodyStyles: { fontSize: 9 },
          columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 }, 1: { cellWidth: 55 } },
          margin: { left: 14 },
          tableWidth: 100,
        })

        autoTable(doc, {
          startY: yPosition,
          head: [['Datos Físicos', '']],
          body: physicalData,
          theme: 'grid',
          headStyles: { fillColor: primaryColor, fontSize: 10 },
          bodyStyles: { fontSize: 9 },
          columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 }, 1: { cellWidth: 55 } },
          margin: { left: 120 },
          tableWidth: 100,
        })

        // Get final Y from the longer table
        const finalY1 = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
          .finalY
        yPosition = finalY1 + 5

        // Medical information if exists
        const hasMedicalInfo =
          customer.allergies ||
          customer.dietary_restrictions ||
          customer.medical_conditions ||
          customer.medications

        if (hasMedicalInfo) {
          doc.setFontSize(12)
          doc.setTextColor(...primaryColor)
          doc.text('Información Médica', 14, yPosition)
          yPosition += 2

          const medicalData: string[][] = []
          if (customer.allergies) medicalData.push(['Alergias', customer.allergies])
          if (customer.dietary_restrictions)
            medicalData.push(['Restricciones dietéticas', customer.dietary_restrictions])
          if (customer.medical_conditions)
            medicalData.push(['Condiciones médicas', customer.medical_conditions])
          if (customer.medications) medicalData.push(['Medicamentos', customer.medications])

          autoTable(doc, {
            startY: yPosition,
            body: medicalData,
            theme: 'grid',
            bodyStyles: { fontSize: 9 },
            columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
            margin: { left: 14 },
          })

          yPosition =
            (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 5
        }
      }

      // Plan status and dates
      yPosition += 3
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)

      const planInfo: string[] = []
      planInfo.push(`Estado: ${getStatusLabel(plan.status)}`)
      if (plan.start_date)
        planInfo.push(`Inicio: ${new Date(plan.start_date).toLocaleDateString('es-ES')}`)
      if (plan.end_date)
        planInfo.push(`Fin: ${new Date(plan.end_date).toLocaleDateString('es-ES')}`)

      doc.text(planInfo.join('  |  '), 14, yPosition)
      yPosition += 5

      // Nutritional targets if exists
      const hasTargets =
        plan.daily_calories ||
        plan.protein_grams ||
        plan.carbs_grams ||
        plan.fat_grams ||
        plan.fiber_grams ||
        plan.water_liters

      if (hasTargets) {
        const targets: string[] = []
        if (plan.daily_calories) targets.push(`Calorías: ${plan.daily_calories} kcal`)
        if (plan.protein_grams) targets.push(`Proteínas: ${plan.protein_grams}g`)
        if (plan.carbs_grams) targets.push(`Carbohidratos: ${plan.carbs_grams}g`)
        if (plan.fat_grams) targets.push(`Grasas: ${plan.fat_grams}g`)
        if (plan.fiber_grams) targets.push(`Fibra: ${plan.fiber_grams}g`)
        if (plan.water_liters) targets.push(`Agua: ${plan.water_liters}L`)

        doc.setFontSize(9)
        doc.text(`Objetivos: ${targets.join('  |  ')}`, 14, yPosition)
        yPosition += 8
      }

      // Weekly Plan Table
      doc.setFontSize(14)
      doc.setTextColor(...primaryColor)
      doc.text('Plan Semanal', 14, yPosition)
      yPosition += 2

      // Prepare table data
      const tableData = DAYS.map((day) => {
        const row = [day.label]
        MEAL_TYPES.forEach((mealType) => {
          const meal = (plan.meal_entries || []).find(
            (m) => m.day_of_week === day.key && m.meal_type === mealType.key
          )
          row.push(meal?.meal_description || '-')
        })
        return row
      })

      // Create meal plan table
      autoTable(doc, {
        startY: yPosition,
        head: [['Día', ...MEAL_TYPES.map((m) => m.label)]],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: primaryColor,
          fontSize: 10,
          halign: 'center',
        },
        bodyStyles: {
          fontSize: 8,
          cellPadding: 3,
          valign: 'top',
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 25, halign: 'center' },
          1: { cellWidth: 48 },
          2: { cellWidth: 48 },
          3: { cellWidth: 48 },
          4: { cellWidth: 48 },
          5: { cellWidth: 48 },
        },
        margin: { left: 14, right: 14 },
        styles: {
          overflow: 'linebreak',
          lineWidth: 0.5,
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      })

      // Plan notes
      if (plan.notes) {
        const notesY =
          (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8
        doc.setFontSize(11)
        doc.setTextColor(...primaryColor)
        doc.text('Notas del Plan:', 14, notesY)
        doc.setFontSize(9)
        doc.setTextColor(...textColor)
        doc.text(plan.notes, 14, notesY + 5, { maxWidth: pageWidth - 28 })
      }

      // Footer with date
      const footerY = doc.internal.pageSize.getHeight() - 10
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(
        `Generado el ${new Date().toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}`,
        pageWidth / 2,
        footerY,
        { align: 'center' }
      )

      // Generate filename
      const sanitizedName = plan.name
        .replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s]/g, '')
        .replace(/\s+/g, '_')
      const customerName = customer
        ? `_${customer.first_name}_${customer.last_name}`.replace(/\s+/g, '_')
        : ''
      const date = new Date().toISOString().split('T')[0]
      const filename = `Plan_${sanitizedName}${customerName}_${date}.pdf`

      // Save PDF
      doc.save(filename)

      toast.success('PDF exportado exitosamente', { id: 'export-pdf' })
    } catch (error) {
      console.error('Export PDF error:', error)
      toast.error('Error al exportar el PDF', { id: 'export-pdf' })
    }
  }

  return (
    <Button variant="secondary" onClick={handleExportPdf} className="min-w-0">
      <FileText className="h-4 w-4 sm:mr-2" />
      <span className="hidden sm:inline">Exportar PDF</span>
      <span className="sm:hidden">PDF</span>
    </Button>
  )
}
