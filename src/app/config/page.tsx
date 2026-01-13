'use client'

import type { ThemePalette } from '@/lib/theme-context'
import { useTheme } from '@/lib/theme-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Palette, Settings } from 'lucide-react'
import { toast } from 'sonner'

function PalettePreview({
  palette,
  isSelected,
  onSelect,
}: {
  palette: ThemePalette
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <div
      className={`cursor-pointer rounded-xl bg-card p-5 shadow-md transition-all hover:shadow-xl hover:-translate-y-1 ${        isSelected ? 'ring-2 ring-primary ring-offset-2 shadow-lg' : ''
      }`}
      onClick={onSelect}
    >
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {palette.name}
            {isSelected && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3 w-3" />
              </span>
            )}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{palette.description}</p>
      </div>
      <div>
        {/* Vista previa de colores */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <div
            className="h-10 rounded-md shadow-inner"
            style={{ backgroundColor: `hsl(${palette.colors.primary})` }}
            title="Principal"
          />
          <div
            className="h-10 rounded-md shadow-inner"
            style={{ backgroundColor: `hsl(${palette.colors.secondary})` }}
            title="Secundario"
          />
          <div
            className="h-10 rounded-md shadow-inner"
            style={{ backgroundColor: `hsl(${palette.colors.accent})` }}
            title="Acento"
          />
          <div
            className="h-10 rounded-md shadow-inner"
            style={{ backgroundColor: `hsl(${palette.colors.destructive})` }}
            title="Destructivo"
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div
            className="h-6 rounded-md shadow-sm"
            style={{ backgroundColor: `hsl(${palette.colors.background})` }}
            title="Fondo"
          />
          <div
            className="h-6 rounded-md shadow-sm"
            style={{ backgroundColor: `hsl(${palette.colors.card})` }}
            title="Tarjeta"
          />
          <div
            className="h-6 rounded-md shadow-sm"
            style={{ backgroundColor: `hsl(${palette.colors.muted})` }}
            title="Atenuado"
          />
          <div
            className="h-6 rounded-md shadow-sm"
            style={{ backgroundColor: `hsl(${palette.colors.border})` }}
            title="Borde"
          />
        </div>

      </div>
    </div>
  )
}

export default function ConfigPage() {
  const { currentPalette, setPalette, palettes } = useTheme()

  const handleSelectPalette = (paletteId: string) => {
    setPalette(paletteId)
    const palette = palettes.find((p) => p.id === paletteId)
    toast.success(`Tema "${palette?.name}" aplicado correctamente`)
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <Settings className="h-8 w-8" />
          Configuración
        </h1>
        <p className="text-muted-foreground mt-2">
          Personaliza la apariencia de NutriPlan según tus preferencias
        </p>
      </div>

      {/* Sección de Paleta de Colores */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Paleta de Colores
          </CardTitle>
          <CardDescription>
            Selecciona una paleta de colores para personalizar la apariencia de la aplicación. Los
            colores están inspirados en alimentos y elementos naturales relacionados con la
            nutrición.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Paleta actual */}
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 shadow-inner">
            <p className="text-sm font-medium mb-2">Tema actual:</p>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div
                  className="h-6 w-6 rounded-full shadow-md"
                  style={{ backgroundColor: `hsl(${currentPalette.colors.primary})` }}
                />
                <div
                  className="h-6 w-6 rounded-full shadow-md"
                  style={{ backgroundColor: `hsl(${currentPalette.colors.secondary})` }}
                />
                <div
                  className="h-6 w-6 rounded-full shadow-md"
                  style={{ backgroundColor: `hsl(${currentPalette.colors.accent})` }}
                />
              </div>
              <span className="font-semibold text-primary">{currentPalette.name}</span>
              <span className="text-sm text-muted-foreground">— {currentPalette.description}</span>
            </div>
          </div>

          {/* Grid de paletas */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {palettes.map((palette) => (
              <PalettePreview
                key={palette.id}
                palette={palette}
                isSelected={currentPalette.id === palette.id}
                onSelect={() => handleSelectPalette(palette.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Información</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-2">
          <p>• La configuración de tema se guarda automáticamente en tu navegador</p>
          <p>• El tema seleccionado se aplicará en todas las páginas de la aplicación</p>
          <p>• Cada paleta está diseñada para mantener una buena legibilidad y accesibilidad</p>
        </CardContent>
      </Card>
    </div>
  )
}
