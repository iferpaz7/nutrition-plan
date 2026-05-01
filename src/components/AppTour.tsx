'use client'

import { useState, useEffect } from 'react'
import { Joyride, STATUS, type EventData, type Step } from 'react-joyride'
import { Button } from '@/components/ui/button'
import { PlayCircle } from 'lucide-react'

const TOUR_STORAGE_KEY = 'nutriplan_tour_completed'

const tourSteps: Step[] = [
  {
    target: 'body',
    placement: 'center',
    content: (
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">¡Bienvenido a NutriPlan! 🥗</h2>
        <p>Te guiaremos en un recorrido rápido por las funciones principales de la aplicación.</p>
      </div>
    ),

  },
  {
    target: '[data-tour="sidebar-home"]',
    content: (
      <div>
        <h3 className="font-semibold mb-1">Inicio</h3>
        <p>Aquí encontrarás un resumen general con estadísticas y accesos rápidos.</p>
      </div>
    ),

  },
  {
    target: '[data-tour="sidebar-plans"]',
    content: (
      <div>
        <h3 className="font-semibold mb-1">Planes Nutricionales</h3>
        <p>Gestiona todos los planes de alimentación semanal de tus clientes.</p>
      </div>
    ),

  },
  {
    target: '[data-tour="sidebar-customers"]',
    content: (
      <div>
        <h3 className="font-semibold mb-1">Clientes</h3>
        <p>
          Administra la información de tus pacientes: datos personales, peso, altura, alergias y
          más.
        </p>
      </div>
    ),

  },
  {
    target: '[data-tour="sidebar-new-plan"]',
    content: (
      <div>
        <h3 className="font-semibold mb-1">Nuevo Plan</h3>
        <p>Crea rápidamente un nuevo plan nutricional para un cliente.</p>
      </div>
    ),

  },
  {
    target: '[data-tour="sidebar-new-customer"]',
    content: (
      <div>
        <h3 className="font-semibold mb-1">Nuevo Cliente</h3>
        <p>Registra un nuevo paciente con todos sus datos.</p>
      </div>
    ),

  },
  {
    target: '[data-tour="sidebar-config"]',
    content: (
      <div>
        <h3 className="font-semibold mb-1">Configuración</h3>
        <p>Personaliza la aplicación: tema, colores y preferencias.</p>
      </div>
    ),

  },
  {
    target: '[data-tour="sidebar-help"]',
    content: (
      <div>
        <h3 className="font-semibold mb-1">Ayuda</h3>
        <p>Accede a esta guía completa cuando necesites información.</p>
      </div>
    ),

  },
  {
    target: 'body',
    placement: 'center',
    content: (
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">¡Listo para comenzar! 🎉</h2>
        <p className="mb-2">Ya conoces las funciones principales de NutriPlan. Te recomendamos:</p>
        <ol className="text-left text-sm space-y-1 mt-3">
          <li>1. Crear tu primer cliente</li>
          <li>2. Diseñar un plan nutricional</li>
          <li>3. Exportar o compartir por WhatsApp</li>
        </ol>
      </div>
    ),

  },
]

interface AppTourProps {
  autoStart?: boolean
}

export function AppTour({ autoStart = false }: AppTourProps) {
  const [run, setRun] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if tour has been completed before
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY)

    if (autoStart && !tourCompleted) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setRun(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [autoStart])

  const handleJoyrideCallback = (data: EventData) => {
    const { status } = data
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED]

    if (finishedStatuses.includes(status)) {
      setRun(false)
      localStorage.setItem(TOUR_STORAGE_KEY, 'true')
    }
  }

  const startTour = () => {
    setRun(true)
  }

  const resetTour = () => {
    localStorage.removeItem(TOUR_STORAGE_KEY)
    setRun(true)
  }

  if (!mounted) return null

  return (
    <>
      <Joyride
        steps={tourSteps}
        run={run}
        continuous
        scrollToFirstStep
        onEvent={handleJoyrideCallback}
        options={{
          showProgress: true,
          overlayClickAction: false,
          skipBeacon: true,
          buttons: ['back', 'close', 'primary', 'skip'],
          primaryColor: 'hsl(var(--primary))',
          zIndex: 10000,
        }}
        locale={{
          back: 'Anterior',
          close: 'Cerrar',
          last: 'Finalizar',
          next: 'Siguiente',
          skip: 'Saltar tour',
        }}
        styles={{
          tooltip: {
            borderRadius: 12,
            padding: 16,
          },
          buttonPrimary: {
            borderRadius: 8,
            padding: '8px 16px',
          },
          buttonBack: {
            marginRight: 8,
          },
          buttonSkip: {
            color: 'hsl(var(--muted-foreground))',
          },
          floater: {
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
          },
        }}
      />

      {/* Tour Control Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button onClick={startTour} className="gap-2">
          <PlayCircle className="h-4 w-4" />
          Iniciar Tour
        </Button>
        <Button onClick={resetTour} variant="outline" size="sm">
          Reiniciar Tour
        </Button>
      </div>
    </>
  )
}

// Hook to check if tour was completed
export function useTourCompleted(): boolean {
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY)
    setCompleted(!!tourCompleted)
  }, [])

  return completed
}
