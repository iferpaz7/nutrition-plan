import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ConfigPage from '@/app/config/page'
import { ThemeProvider, THEME_PALETTES } from '@/lib/theme-context'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Helper to render with ThemeProvider
const renderWithTheme = (component: React.ReactNode) => {
  return render(<ThemeProvider>{component}</ThemeProvider>)
}

describe('ConfigPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    // Reset CSS properties
    document.documentElement.style.cssText = ''
  })

  it('renders the configuration page title', () => {
    renderWithTheme(<ConfigPage />)

    expect(screen.getByText('Configuración')).toBeInTheDocument()
  })

  it('shows palette of colors section', () => {
    renderWithTheme(<ConfigPage />)

    expect(screen.getByText('Paleta de Colores')).toBeInTheDocument()
  })

  it('displays all available palettes', () => {
    renderWithTheme(<ConfigPage />)

    THEME_PALETTES.forEach((palette) => {
      // Use getAllByText since Naturaleza appears twice (in current theme and in grid)
      const elements = screen.getAllByText(palette.name)
      expect(elements.length).toBeGreaterThan(0)
    })
  })

  it('shows current theme indicator', () => {
    renderWithTheme(<ConfigPage />)

    expect(screen.getByText('Tema actual:')).toBeInTheDocument()
  })

  it('displays palette descriptions', () => {
    renderWithTheme(<ConfigPage />)

    // Check first palette description is present
    expect(screen.getByText(THEME_PALETTES[0].description)).toBeInTheDocument()
  })

  it('shows information section', () => {
    renderWithTheme(<ConfigPage />)

    expect(screen.getByText('Información')).toBeInTheDocument()
  })

  it('indicates that configuration is saved automatically', () => {
    renderWithTheme(<ConfigPage />)

    expect(screen.getByText(/se guarda automáticamente/i)).toBeInTheDocument()
  })

  it('can select a different palette', () => {
    renderWithTheme(<ConfigPage />)

    // Find and click on Ocean palette
    const oceanPalette = screen.getByText('Océano')
    fireEvent.click(oceanPalette.closest('[class*="cursor-pointer"]') || oceanPalette)

    // Check localStorage was called
    expect(localStorageMock.setItem).toHaveBeenCalledWith('nutriplan-theme-palette', 'ocean')
  })

  it('shows check mark on selected palette', () => {
    localStorageMock.getItem.mockReturnValue('nature')
    renderWithTheme(<ConfigPage />)

    // The nature palette should have ring-2 class (as it's selected)
    const naturePalettes = screen.getAllByText('Naturaleza')
    // Find the one inside the grid (which has cursor-pointer parent)
    const paletteCard = naturePalettes
      .find((el) => el.closest('[class*="cursor-pointer"]'))
      ?.closest('[class*="cursor-pointer"]')

    expect(paletteCard).toHaveClass('ring-2')
  })
})
