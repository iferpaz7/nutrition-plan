'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  ClipboardList,
  Plus,
  FileText,
  Download,
  Image,
  Copy,
  Pencil,
  Trash2,
  Eye,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Lightbulb,
  Phone,
} from 'lucide-react'
import { AppTour } from '@/components/AppTour'

export default function HelpPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">Centro de Ayuda</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
          Guía completa para utilizar NutriPlan, tu sistema de gestión de planes nutricionales
          semanales.
        </p>

        {/* Tour Button */}
        <div className="flex justify-center">
          <AppTour />
        </div>
      </div>

      {/* Quick Start */}
      <Card className="mb-8 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Lightbulb className="h-6 w-6 text-primary" />
            Inicio Rápido
          </CardTitle>
          <CardDescription>
            Sigue estos pasos para comenzar a usar NutriPlan en minutos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-primary/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white mb-3">
                <span className="font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">Registra un Cliente</h4>
              <p className="text-sm text-muted-foreground">
                Crea el perfil del cliente con sus datos personales y médicos
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-primary/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white mb-3">
                <span className="font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">Crea un Plan</h4>
              <p className="text-sm text-muted-foreground">
                Diseña un plan nutricional semanal personalizado
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-primary/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white mb-3">
                <span className="font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">Exporta y Comparte</h4>
              <p className="text-sm text-muted-foreground">
                Descarga en PDF, Excel o comparte por WhatsApp
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section: Gestión de Clientes */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Users className="h-5 w-5 text-primary" />
            Gestión de Clientes
          </CardTitle>
          <CardDescription>Administra la información de tus pacientes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Plus className="h-4 w-4" /> Crear un Nuevo Cliente
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                Ve a <strong>Clientes</strong> en el menú lateral
              </li>
              <li>
                Haz clic en <strong>"Nuevo Cliente"</strong>
              </li>
              <li>Completa los datos obligatorios: nombre, apellido, cédula</li>
              <li>Añade información adicional: email, teléfono, fecha de nacimiento</li>
              <li>Ingresa datos físicos: peso, altura (se calculará el IMC automáticamente)</li>
              <li>Especifica alergias, condiciones médicas y restricciones dietéticas</li>
              <li>
                Guarda el cliente haciendo clic en <strong>"Crear Cliente"</strong>
              </li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Eye className="h-4 w-4" /> Ver Detalles del Cliente
            </h4>
            <p className="text-muted-foreground ml-4">
              Desde la lista de clientes, haz clic en <strong>"Ver"</strong> para acceder al perfil
              completo del cliente, incluyendo sus datos personales, información médica,
              clasificación de IMC y todos los planes nutricionales asociados.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Pencil className="h-4 w-4" /> Editar Cliente
            </h4>
            <p className="text-muted-foreground ml-4">
              Haz clic en <strong>"Editar"</strong> en la tarjeta del cliente o desde su perfil para
              modificar cualquier información. Los cambios se guardan automáticamente al hacer clic
              en "Guardar".
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Trash2 className="h-4 w-4" /> Eliminar Cliente
            </h4>
            <p className="text-muted-foreground ml-4">
              El botón rojo de eliminar te pedirá confirmación antes de borrar el cliente.
              <strong className="text-destructive"> ¡Atención!</strong> Esta acción eliminará
              también todos los planes nutricionales asociados.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section: Gestión de Planes */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <ClipboardList className="h-5 w-5 text-primary" />
            Gestión de Planes Nutricionales
          </CardTitle>
          <CardDescription>Crea y administra planes de alimentación semanales</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Plus className="h-4 w-4" /> Crear un Nuevo Plan
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                Ve a <strong>Planes</strong> o haz clic en <strong>"Nuevo Plan"</strong>
              </li>
              <li>Selecciona el cliente para el plan (puedes buscar por nombre)</li>
              <li>Ingresa el nombre del plan (ej: "Plan Semana 1 - Pérdida de peso")</li>
              <li>Añade una descripción opcional</li>
              <li>
                Configura los objetivos nutricionales: calorías, proteínas, carbohidratos, grasas
              </li>
              <li>Guarda el plan</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Completar la Grilla de Comidas
            </h4>
            <p className="text-muted-foreground ml-4 mb-2">
              La grilla muestra los 7 días de la semana con 5 tiempos de comida:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-8">
              <li>
                <strong>Desayuno:</strong> Primera comida del día
              </li>
              <li>
                <strong>Colación 1:</strong> Snack de media mañana
              </li>
              <li>
                <strong>Almuerzo:</strong> Comida principal
              </li>
              <li>
                <strong>Colación 2:</strong> Snack de media tarde
              </li>
              <li>
                <strong>Cena:</strong> Última comida del día
              </li>
            </ul>
            <p className="text-muted-foreground ml-4 mt-2">
              Haz clic en cualquier celda para agregar o editar la descripción de la comida.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Copy className="h-4 w-4" /> Copiar un Plan
            </h4>
            <p className="text-muted-foreground ml-4">
              Puedes duplicar un plan existente para el mismo cliente o para otro diferente. Esto es
              útil para crear variaciones o reutilizar planes base. El plan copiado incluirá todas
              las comidas configuradas.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section: Exportar y Compartir */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Download className="h-5 w-5 text-primary" />
            Exportar y Compartir
          </CardTitle>
          <CardDescription>
            Descarga los planes en diferentes formatos o compártelos directamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" /> Exportar a PDF
            </h4>
            <p className="text-muted-foreground ml-4">
              Genera un documento PDF profesional con el plan nutricional completo. Incluye
              información del cliente, objetivos nutricionales y la tabla de comidas semanal. Ideal
              para imprimir o enviar por correo electrónico.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Download className="h-4 w-4" /> Exportar a Excel
            </h4>
            <p className="text-muted-foreground ml-4">
              Descarga el plan en formato Excel (.xlsx) para editarlo posteriormente o integrarlo
              con otras herramientas. Mantiene la estructura de días y tiempos de comida.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Image className="h-4 w-4" /> Exportar como Imagen
            </h4>
            <p className="text-muted-foreground ml-4">
              Captura la grilla de comidas como una imagen PNG de alta resolución. Perfecta para
              compartir en redes sociales o mensajería.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Phone className="h-4 w-4" /> Compartir por WhatsApp
            </h4>
            <p className="text-muted-foreground ml-4">
              Envía el plan directamente al WhatsApp del cliente. El sistema formateará
              automáticamente las comidas en un mensaje de texto legible. Se utilizará el número de
              teléfono registrado del cliente con el código de país +593 (Ecuador).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section: Consejos */}
      <Card className="mb-8 border-secondary/30 bg-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Lightbulb className="h-5 w-5 text-secondary" />
            Consejos y Mejores Prácticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">
                <strong>Completa siempre el IMC:</strong> Ingresa peso y altura para que el sistema
                calcule automáticamente el IMC y muestre la clasificación nutricional.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">
                <strong>Usa nombres descriptivos:</strong> Nombra los planes con información clara
                como "Semana 1 - Definición" o "Plan Mantenimiento Enero 2026".
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">
                <strong>Registra alergias y restricciones:</strong> Esta información es crucial para
                diseñar planes seguros y personalizados.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">
                <strong>Reutiliza planes con la función Copiar:</strong> Ahorra tiempo duplicando
                planes base y ajustándolos según las necesidades de cada cliente.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">
                <strong>Mantén el teléfono actualizado:</strong> Asegúrate de tener el número de
                celular correcto para poder usar la función de compartir por WhatsApp.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Section: Soporte */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <HelpCircle className="h-5 w-5 text-primary" />
            ¿Necesitas más ayuda?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Si tienes preguntas adicionales o encuentras algún problema, puedes:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-primary" />
              Revisar el código fuente en{' '}
              <a
                href="https://github.com/iferpaz7/nutrition-plan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GitHub
              </a>
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-primary" />
              Reportar un problema creando un Issue en el repositorio
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
