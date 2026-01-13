'use client'

import { useTheme, THEME_PALETTES, ThemePalette } from '@/lib/theme-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Palette, Settings } from 'lucide-react'
import { toast } from 'sonner'

function PalettePreview({ palette, isSelected, onSelect }: { 
  palette: ThemePalette
  isSelected: boolean
  onSelect: () => void 
}) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {palette.name}
            {isSelected && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3 w-3" />
              </span>
            )}
          </CardTitle>
        </div>
        <CardDescription>{palette.description}</CardDescription>
      </CardHeader>
      <CardContent>
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
            className="h-6 rounded-md border" 
            style={{ backgroundColor: `hsl(${palette.colors.background})` }}
            title="Fondo"
          />
          <div 
            className="h-6 rounded-md border" 
            style={{ backgroundColor: `hsl(${palette.colors.card})` }}
            title="Tarjeta"
          />
          <div 
            className="h-6 rounded-md border" 
            style={{ backgroundColor: `hsl(${palette.colors.muted})` }}
            title="Atenuado"
          />
          <div 
            className="h-6 rounded-md border" 
            style={{ backgroundColor: `hsl(${palette.colors.border})` }}
            title="Borde"
          />
        </div>
        
        {/* Etiquetas */}
        <div className="mt-3 flex flex-wrap gap-1">
          <span className="text-[10px] px-2 py-0.5 rounded-full" 
            style={{ 
              backgroundColor: `hsl(${palette.colors.primary})`, 
              color: 'white' 
            }}>
            Principal
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full" 
            style={{ 
              backgroundColor: `hsl(${palette.colors.secondary})`, 
              color: 'white' 
            }}>
            Secundario
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full" 
            style={{ 
              backgroundColor: `hsl(${palette.colors.accent})`, 
              color: 'white' 
            }}>
            Acento
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ConfigPage() {
  const { currentPalette, setPalette, palettes } = useTheme()

  const handleSelectPalette = (paletteId: string) => {
    setPalette(paletteId)
    const palette = palettes.find(p => p.id === paletteId)
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
            Selecciona una paleta de colores para personalizar la apariencia de la aplicación. 
            Los colores están inspirados en alimentos y elementos naturales relacionados con la nutrición.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Paleta actual */}
          <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm font-medium mb-2">Tema actual:</p>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="h-6 w-6 rounded-full shadow-md" 
                  style={{ backgroundColor: `hsl(${currentPalette.colors.primary})` }} />
                <div className="h-6 w-6 rounded-full shadow-md" 
                  style={{ backgroundColor: `hsl(${currentPalette.colors.secondary})` }} />
                <div className="h-6 w-6 rounded-full shadow-md" 
                  style={{ backgroundColor: `hsl(${currentPalette.colors.accent})` }} />
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
