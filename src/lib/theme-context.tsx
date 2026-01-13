'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface ThemePalette {
  id: string
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    card: string
    muted: string
    border: string
    destructive: string
  }
}

// Paletas predeterminadas para aplicación de nutrición
export const THEME_PALETTES: ThemePalette[] = [
  {
    id: 'nature',
    name: 'Naturaleza',
    description: 'Verdes frescos inspirados en vegetales y hojas',
    colors: {
      primary: '142 76% 36%', // Verde espinaca
      secondary: '25 95% 53%', // Naranja zanahoria
      accent: '270 95% 75%', // Púrpura arándano
      background: '36 39% 88%', // Crema cálido
      card: '36 46% 82%', // Beige claro
      muted: '84 6% 86%', // Verde salvia
      border: '84 6% 80%', // Salvia claro
      destructive: '0 84% 60%', // Rojo tomate
    },
  },
  {
    id: 'ocean',
    name: 'Océano',
    description: 'Azules relajantes como el mar y alimentos marinos',
    colors: {
      primary: '200 80% 40%', // Azul océano
      secondary: '180 60% 45%', // Turquesa
      accent: '160 70% 50%', // Verde agua
      background: '200 30% 95%', // Azul muy claro
      card: '200 25% 90%', // Azul pálido
      muted: '200 15% 85%', // Gris azulado
      border: '200 15% 80%', // Borde azulado
      destructive: '0 70% 55%', // Rojo coral
    },
  },
  {
    id: 'sunset',
    name: 'Atardecer',
    description: 'Tonos cálidos como frutas tropicales',
    colors: {
      primary: '20 85% 50%', // Naranja mango
      secondary: '45 90% 55%', // Amarillo dorado
      accent: '340 75% 60%', // Rosa sandía
      background: '40 50% 92%', // Crema melocotón
      card: '35 55% 88%', // Beige dorado
      muted: '30 20% 85%', // Marrón claro
      border: '30 20% 78%', // Borde marrón
      destructive: '0 75% 55%', // Rojo fresa
    },
  },
  {
    id: 'forest',
    name: 'Bosque',
    description: 'Verdes profundos como hierbas y especias',
    colors: {
      primary: '150 60% 30%', // Verde bosque
      secondary: '90 45% 45%', // Verde oliva
      accent: '50 70% 50%', // Amarillo mostaza
      background: '80 20% 92%', // Verde muy claro
      card: '80 25% 88%', // Verde pálido
      muted: '80 15% 82%', // Gris verdoso
      border: '80 15% 75%', // Borde verdoso
      destructive: '15 80% 50%', // Naranja rojizo
    },
  },
  {
    id: 'berry',
    name: 'Frutos Rojos',
    description: 'Morados y rojos como bayas y uvas',
    colors: {
      primary: '280 60% 45%', // Púrpura uva
      secondary: '330 70% 55%', // Rosa frambuesa
      accent: '350 80% 60%', // Rojo cereza
      background: '280 20% 95%', // Lavanda muy claro
      card: '280 25% 90%', // Lavanda pálido
      muted: '280 15% 85%', // Gris morado
      border: '280 15% 78%', // Borde morado
      destructive: '0 80% 55%', // Rojo intenso
    },
  },
  {
    id: 'earth',
    name: 'Tierra',
    description: 'Marrones naturales como granos y semillas',
    colors: {
      primary: '25 50% 35%', // Marrón café
      secondary: '35 60% 45%', // Caramelo
      accent: '45 70% 55%', // Miel dorada
      background: '35 30% 93%', // Crema tostado
      card: '35 35% 88%', // Beige cálido
      muted: '30 20% 83%', // Gris cálido
      border: '30 20% 75%', // Borde marrón
      destructive: '10 70% 50%', // Terracota
    },
  },
  {
    id: 'mint',
    name: 'Menta',
    description: 'Tonos frescos y revitalizantes',
    colors: {
      primary: '165 60% 40%', // Verde menta
      secondary: '175 50% 50%', // Menta clara
      accent: '145 55% 45%', // Verde lima
      background: '165 30% 95%', // Menta muy claro
      card: '165 25% 90%', // Menta pálido
      muted: '165 15% 85%', // Gris mentolado
      border: '165 15% 78%', // Borde mentolado
      destructive: '0 65% 55%', // Rojo suave
    },
  },
  {
    id: 'citrus',
    name: 'Cítricos',
    description: 'Colores vibrantes como limón, lima y naranja',
    colors: {
      primary: '85 70% 45%', // Verde lima
      secondary: '50 90% 50%', // Amarillo limón
      accent: '25 95% 55%', // Naranja brillante
      background: '55 50% 94%', // Amarillo crema
      card: '50 45% 90%', // Amarillo pálido
      muted: '50 25% 85%', // Gris amarillento
      border: '50 25% 78%', // Borde amarillo
      destructive: '0 80% 55%', // Rojo
    },
  },
]

interface ThemeContextType {
  currentPalette: ThemePalette
  setPalette: (paletteId: string) => void
  palettes: ThemePalette[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = 'nutriplan-theme-palette'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentPalette, setCurrentPalette] = useState<ThemePalette>(THEME_PALETTES[0])
  const [isLoaded, setIsLoaded] = useState(false)

  const applyPalette = useCallback((palette: ThemePalette) => {
    const root = document.documentElement

    // Aplicar colores principales
    root.style.setProperty('--primary', palette.colors.primary)
    root.style.setProperty('--primary-foreground', '355 100% 97%')

    root.style.setProperty('--secondary', palette.colors.secondary)
    root.style.setProperty('--secondary-foreground', '210 40% 2%')

    root.style.setProperty('--accent', palette.colors.accent)
    root.style.setProperty('--accent-foreground', '210 40% 2%')

    root.style.setProperty('--background', palette.colors.background)
    root.style.setProperty('--foreground', '84 6% 10%')

    root.style.setProperty('--card', palette.colors.card)
    root.style.setProperty('--card-foreground', '84 6% 10%')

    root.style.setProperty('--muted', palette.colors.muted)
    root.style.setProperty('--muted-foreground', '84 6% 40%')

    root.style.setProperty('--border', palette.colors.border)
    root.style.setProperty('--input', palette.colors.border)

    root.style.setProperty('--destructive', palette.colors.destructive)
    root.style.setProperty('--destructive-foreground', '355 100% 97%')

    // Ring color = primary
    root.style.setProperty('--ring', palette.colors.primary)
  }, [])

  // Cargar tema de localStorage al montar
  useEffect(() => {
    const savedPaletteId = localStorage.getItem(STORAGE_KEY)
    if (savedPaletteId) {
      const palette = THEME_PALETTES.find((p) => p.id === savedPaletteId)
      if (palette) {
        setCurrentPalette(palette)
        applyPalette(palette)
      }
    }
    setIsLoaded(true)
  }, [applyPalette])

  const setPalette = useCallback(
    (paletteId: string) => {
      const palette = THEME_PALETTES.find((p) => p.id === paletteId)
      if (palette) {
        setCurrentPalette(palette)
        applyPalette(palette)
        localStorage.setItem(STORAGE_KEY, paletteId)
      }
    },
    [applyPalette]
  )

  // No renderizar hasta que se cargue el tema
  if (!isLoaded) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ currentPalette, setPalette, palettes: THEME_PALETTES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
