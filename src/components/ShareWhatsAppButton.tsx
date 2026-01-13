'use client'

import { Button } from '@/components/ui/button'
import { Phone } from 'lucide-react'
import { toast } from 'sonner'
import type { NutritionalPlan, Customer, MealEntry } from '@/lib/types'
import { DAYS, MEAL_TYPES } from '@/components/PlanGrid'

interface ShareWhatsAppButtonProps {
  plan: NutritionalPlan
  customer?: Customer | null
}

export function ShareWhatsAppButton({ plan, customer }: ShareWhatsAppButtonProps) {
  
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

  const generateWhatsAppMessage = (): string => {
    const lines: string[] = []
    
    // Header
    lines.push(`🥗 *${plan.name}*`)
    lines.push('')
    
    if (customer) {
      lines.push(`👤 Cliente: ${customer.first_name} ${customer.last_name}`)
      lines.push('')
    }

    if (plan.description) {
      lines.push(`📝 ${plan.description}`)
      lines.push('')
    }

    // Nutritional targets
    if (plan.daily_calories || plan.protein_grams || plan.carbs_grams || plan.fat_grams) {
      lines.push('📊 *Objetivos Nutricionales:*')
      if (plan.daily_calories) lines.push(`• Calorías: ${plan.daily_calories} kcal`)
      if (plan.protein_grams) lines.push(`• Proteínas: ${plan.protein_grams}g`)
      if (plan.carbs_grams) lines.push(`• Carbohidratos: ${plan.carbs_grams}g`)
      if (plan.fat_grams) lines.push(`• Grasas: ${plan.fat_grams}g`)
      lines.push('')
    }

    // Meals by day
    lines.push('📅 *Plan Semanal:*')
    lines.push('')
    
    DAYS.forEach(day => {
      const dayMeals = (plan.meal_entries || []).filter(
        (m: MealEntry) => m.day_of_week === day.key
      )
      
      if (dayMeals.length > 0) {
        lines.push(`*${day.label.toUpperCase()}*`)
        
        MEAL_TYPES.forEach(mealType => {
          const meal = dayMeals.find((m: MealEntry) => m.meal_type === mealType.key)
          if (meal && meal.meal_description) {
            lines.push(`• ${mealType.label}: ${meal.meal_description}`)
          }
        })
        lines.push('')
      }
    })

    // Footer
    lines.push('---')
    lines.push('_Generado por NutriPlan_ 🌿')

    return lines.join('\n')
  }

  const handleShareWhatsApp = () => {
    const phoneNumber = formatPhoneNumber(customer?.cell_phone)
    
    if (!phoneNumber) {
      toast.error('El cliente no tiene número de teléfono registrado')
      return
    }

    const message = generateWhatsAppMessage()
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
      className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
      title={hasPhone ? 'Compartir por WhatsApp' : 'El cliente no tiene teléfono registrado'}
    >
      <Phone className="h-4 w-4 mr-1" />
      WhatsApp
    </Button>
  )
}
