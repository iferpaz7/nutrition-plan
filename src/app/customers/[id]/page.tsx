import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlanCard } from '@/components/PlanCard'
import {
  ArrowLeft,
  Pencil,
  Plus,
  Phone,
  IdCard,
  Calendar,
  User,
  Scale,
  Ruler,
  Activity,
  Mail,
  Target,
  Flame,
  AlertTriangle,
  Pill,
  UtensilsCrossed,
  FileText,
} from 'lucide-react'
import { DeleteCustomerButton } from './DeleteCustomerButton'
import type { Customer } from '@/lib/types'
import { getImcClassification } from '@/lib/types'

// Labels para enums
const activityLabels: Record<string, string> = {
  SEDENTARIO: 'Sedentario',
  LIGERO: 'Ligero',
  MODERADO: 'Moderado',
  ACTIVO: 'Activo',
  MUY_ACTIVO: 'Muy Activo',
}

const goalLabels: Record<string, string> = {
  PERDER_PESO: 'Perder Peso',
  MANTENER_PESO: 'Mantener Peso',
  GANAR_PESO: 'Ganar Peso',
  GANAR_MUSCULO: 'Ganar Músculo',
  MEJORAR_SALUD: 'Mejorar Salud',
}

const genderLabels: Record<string, string> = {
  MASCULINO: 'Masculino',
  FEMENINO: 'Femenino',
  OTRO: 'Otro',
}

interface PageProps {
  params: Promise<{ id: string }>
}

async function getCustomer(id: string): Promise<Customer | null> {
  const supabase = await createClient()
  const { data: customer, error } = await supabase
    .from('customer')
    .select(
      `
      *,
      nutritional_plans:nutritional_plan (
        *,
        meal_entries:meal_entry (*)
      )
    `
    )
    .eq('id', id)
    .single()

  if (error) return null
  return customer
}

export default async function CustomerViewPage({ params }: PageProps) {
  const { id } = await params
  const customer = await getCustomer(id)

  if (!customer) {
    notFound()
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="container mx-auto py-6 sm:py-10 px-4 max-w-7xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/customers">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Clientes
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-xl sm:text-2xl text-primary break-words">
                {customer.first_name} {customer.last_name}
              </CardTitle>
              <CardDescription className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <IdCard className="h-4 w-4" />
                  <span>{customer.id_card}</span>
                </div>
                {customer.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{customer.email}</span>
                  </div>
                )}
                {customer.cell_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{customer.cell_phone}</span>
                  </div>
                )}
                {customer.gender && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{genderLabels[customer.gender] || customer.gender}</span>
                  </div>
                )}
                {customer.birth_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Nacimiento: {formatDate(customer.birth_date)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground/70 text-xs pt-1">
                  <span>Cliente desde: {formatDate(customer.created_at)}</span>
                </div>
              </CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
              <Button asChild variant="outline" className="flex-1 sm:flex-none">
                <Link href={`/customers/${customer.id}/edit`}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar
                </Link>
              </Button>
              <DeleteCustomerButton
                customerId={customer.id}
                customerName={`${customer.first_name} ${customer.last_name}`}
              />
            </div>
          </div>
        </CardHeader>

        {/* Datos físicos e IMC */}
        {(customer.age ||
          customer.weight ||
          customer.height ||
          customer.imc ||
          customer.body_fat_percentage) && (
          <CardContent className="border-t pt-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Datos Físicos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
              {customer.age && (
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Edad</p>
                    <p className="font-medium">{customer.age} años</p>
                  </div>
                </div>
              )}
              {customer.weight && (
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Scale className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Peso</p>
                    <p className="font-medium">{customer.weight} kg</p>
                  </div>
                </div>
              )}
              {customer.height && (
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Ruler className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Altura</p>
                    <p className="font-medium">{customer.height} m</p>
                  </div>
                </div>
              )}
              {customer.imc && (
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">IMC</p>
                    <p className="font-medium">
                      {customer.imc}{' '}
                      <span className={`text-xs ${getImcClassification(customer.imc).color}`}>
                        ({getImcClassification(customer.imc).label})
                      </span>
                    </p>
                  </div>
                </div>
              )}
              {customer.body_fat_percentage && (
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Grasa Corporal</p>
                    <p className="font-medium">{customer.body_fat_percentage}%</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        )}

        {/* Objetivos */}
        {(customer.activity_level || customer.goal || customer.daily_calorie_target) && (
          <CardContent className="border-t pt-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Objetivos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {customer.activity_level && (
                <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg">
                  <Activity className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Nivel de Actividad</p>
                    <p className="font-medium">{activityLabels[customer.activity_level]}</p>
                  </div>
                </div>
              )}
              {customer.goal && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg">
                  <Target className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Objetivo</p>
                    <p className="font-medium">{goalLabels[customer.goal]}</p>
                  </div>
                </div>
              )}
              {customer.daily_calorie_target && (
                <div className="flex items-center gap-2 p-3 bg-orange-500/10 rounded-lg">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Calorías Diarias</p>
                    <p className="font-medium">{customer.daily_calorie_target} kcal</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        )}

        {/* Información Médica */}
        {(customer.allergies ||
          customer.medical_conditions ||
          customer.medications ||
          customer.dietary_restrictions) && (
          <CardContent className="border-t pt-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Información Médica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customer.allergies && (
                <div className="p-3 bg-red-500/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <p className="text-xs font-medium text-red-500">Alergias</p>
                  </div>
                  <p className="text-sm">{customer.allergies}</p>
                </div>
              )}
              {customer.dietary_restrictions && (
                <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <UtensilsCrossed className="h-4 w-4 text-yellow-600" />
                    <p className="text-xs font-medium text-yellow-600">Restricciones Dietéticas</p>
                  </div>
                  <p className="text-sm">{customer.dietary_restrictions}</p>
                </div>
              )}
              {customer.medical_conditions && (
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-purple-500" />
                    <p className="text-xs font-medium text-purple-500">Condiciones Médicas</p>
                  </div>
                  <p className="text-sm">{customer.medical_conditions}</p>
                </div>
              )}
              {customer.medications && (
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Pill className="h-4 w-4 text-blue-500" />
                    <p className="text-xs font-medium text-blue-500">Medicamentos</p>
                  </div>
                  <p className="text-sm">{customer.medications}</p>
                </div>
              )}
            </div>
          </CardContent>
        )}

        {/* Notas */}
        {customer.notes && (
          <CardContent className="border-t pt-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Notas</h3>
            <p className="text-sm bg-muted/30 p-3 rounded-lg">{customer.notes}</p>
          </CardContent>
        )}
      </Card>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg sm:text-xl font-semibold text-primary">Planes Nutricionales</h2>
        <Button asChild className="w-full sm:w-auto">
          <Link href={`/customers/${customer.id}/plans/new`}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Plan
          </Link>
        </Button>
      </div>

      {customer.nutritional_plans && customer.nutritional_plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customer.nutritional_plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      ) : (
        <Card className="p-10">
          <div className="text-center text-muted-foreground">
            <p className="mb-4">Este cliente no tiene planes nutricionales.</p>
            <Button asChild>
              <Link href={`/customers/${customer.id}/plans/new`}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Plan
              </Link>
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
