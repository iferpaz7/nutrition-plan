'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import type { Customer, Gender, ActivityLevel, GoalType } from '@/lib/types'

interface CustomerFormProps {
  initialData?: Customer
  mode: 'create' | 'edit'
}

export function CustomerForm({ initialData, mode }: CustomerFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Datos personales (requeridos)
  const [idCard, setIdCard] = useState(initialData?.id_card || '')
  const [firstName, setFirstName] = useState(initialData?.first_name || '')
  const [lastName, setLastName] = useState(initialData?.last_name || '')
  
  // Datos personales (opcionales)
  const [email, setEmail] = useState(initialData?.email || '')
  const [cellPhone, setCellPhone] = useState(initialData?.cell_phone || '')
  const [gender, setGender] = useState<Gender | ''>(initialData?.gender || '')
  const [birthDate, setBirthDate] = useState(initialData?.birth_date?.split('T')[0] || '')
  
  // Datos físicos
  const [weight, setWeight] = useState<string>(initialData?.weight?.toString() || '')
  const [height, setHeight] = useState<string>(initialData?.height?.toString() || '')
  const [bodyFatPercentage, setBodyFatPercentage] = useState<string>(initialData?.body_fat_percentage?.toString() || '')
  
  // Información nutricional
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | ''>(initialData?.activity_level || '')
  const [goal, setGoal] = useState<GoalType | ''>(initialData?.goal || '')
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState<string>(initialData?.daily_calorie_target?.toString() || '')
  
  // Información médica
  const [allergies, setAllergies] = useState(initialData?.allergies || '')
  const [medicalConditions, setMedicalConditions] = useState(initialData?.medical_conditions || '')
  const [medications, setMedications] = useState(initialData?.medications || '')
  const [dietaryRestrictions, setDietaryRestrictions] = useState(initialData?.dietary_restrictions || '')
  
  // Notas
  const [notes, setNotes] = useState(initialData?.notes || '')

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
        // Requeridos
        id_card: idCard.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        
        // Datos personales opcionales
        email: email.trim() || null,
        cell_phone: cellPhone.trim() || null,
        gender: gender || null,
        birth_date: birthDate || null,
        
        // Datos físicos
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        body_fat_percentage: bodyFatPercentage ? parseFloat(bodyFatPercentage) : null,
        
        // Información nutricional
        activity_level: activityLevel || null,
        goal: goal || null,
        daily_calorie_target: dailyCalorieTarget ? parseInt(dailyCalorieTarget) : null,
        
        // Información médica
        allergies: allergies.trim() || null,
        medical_conditions: medicalConditions.trim() || null,
        medications: medications.trim() || null,
        dietary_restrictions: dietaryRestrictions.trim() || null,
        
        // Notas
        notes: notes.trim() || null,
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
      {/* Datos Personales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            {mode === 'create' ? 'Nuevo Cliente' : 'Editar Cliente'}
          </CardTitle>
          <CardDescription>Información personal del cliente</CardDescription>
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Ej: juan@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cellPhone">Teléfono</Label>
              <Input
                id="cellPhone"
                placeholder="Ej: 0999123456"
                value={cellPhone}
                onChange={(e) => setCellPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Género</Label>
              <Select
                value={gender}
                onValueChange={(value) => setGender(value as Gender | '')}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MASCULINO">Masculino</SelectItem>
                  <SelectItem value="FEMENINO">Femenino</SelectItem>
                  <SelectItem value="OTRO">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Datos Físicos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Datos Físicos</CardTitle>
          <CardDescription>Para cálculo de IMC y requerimientos calóricos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                min="1"
                max="500"
                placeholder="Ej: 84"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Altura (m)</Label>
              <Input
                id="height"
                type="number"
                step="0.01"
                min="0.5"
                max="2.5"
                placeholder="Ej: 1.69"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bodyFatPercentage">% Grasa Corporal</Label>
              <Input
                id="bodyFatPercentage"
                type="number"
                step="0.1"
                min="1"
                max="70"
                placeholder="Ej: 25"
                value={bodyFatPercentage}
                onChange={(e) => setBodyFatPercentage(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Objetivos Nutricionales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Objetivos</CardTitle>
          <CardDescription>Nivel de actividad y metas del cliente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="activityLevel">Nivel de Actividad</Label>
              <Select
                value={activityLevel}
                onValueChange={(value) => setActivityLevel(value as ActivityLevel | '')}
              >
                <SelectTrigger id="activityLevel">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEDENTARIO">Sedentario (poco ejercicio)</SelectItem>
                  <SelectItem value="LIGERO">Ligero (1-3 días/semana)</SelectItem>
                  <SelectItem value="MODERADO">Moderado (3-5 días/semana)</SelectItem>
                  <SelectItem value="ACTIVO">Activo (6-7 días/semana)</SelectItem>
                  <SelectItem value="MUY_ACTIVO">Muy Activo (intenso diario)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Objetivo</Label>
              <Select
                value={goal}
                onValueChange={(value) => setGoal(value as GoalType | '')}
              >
                <SelectTrigger id="goal">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERDER_PESO">Perder Peso</SelectItem>
                  <SelectItem value="MANTENER_PESO">Mantener Peso</SelectItem>
                  <SelectItem value="GANAR_PESO">Ganar Peso</SelectItem>
                  <SelectItem value="GANAR_MUSCULO">Ganar Músculo</SelectItem>
                  <SelectItem value="MEJORAR_SALUD">Mejorar Salud</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dailyCalorieTarget">Calorías Diarias Objetivo</Label>
              <Input
                id="dailyCalorieTarget"
                type="number"
                min="500"
                max="10000"
                placeholder="Ej: 2000"
                value={dailyCalorieTarget}
                onChange={(e) => setDailyCalorieTarget(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información Médica */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Información Médica</CardTitle>
          <CardDescription>Alergias, condiciones y restricciones alimentarias</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="allergies">Alergias Alimentarias</Label>
              <Textarea
                id="allergies"
                placeholder="Ej: Maní, mariscos, lácteos..."
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dietaryRestrictions">Restricciones Dietéticas</Label>
              <Textarea
                id="dietaryRestrictions"
                placeholder="Ej: Vegetariano, vegano, sin gluten..."
                value={dietaryRestrictions}
                onChange={(e) => setDietaryRestrictions(e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="medicalConditions">Condiciones Médicas</Label>
              <Textarea
                id="medicalConditions"
                placeholder="Ej: Diabetes, hipertensión..."
                value={medicalConditions}
                onChange={(e) => setMedicalConditions(e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medications">Medicamentos</Label>
              <Textarea
                id="medications"
                placeholder="Medicamentos que afectan la dieta..."
                value={medications}
                onChange={(e) => setMedications(e.target.value)}
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Notas Adicionales</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="notes"
            placeholder="Notas del nutricionista..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
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
