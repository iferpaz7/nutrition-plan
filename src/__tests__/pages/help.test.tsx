import React from 'react'
import { render, screen } from '@testing-library/react'
import HelpPage from '@/app/help/page'

describe('HelpPage', () => {
  it('renders the help page title', () => {
    render(<HelpPage />)

    expect(screen.getByText('Centro de Ayuda')).toBeInTheDocument()
  })

  it('renders quick start section', () => {
    render(<HelpPage />)

    expect(screen.getByText('Inicio Rápido')).toBeInTheDocument()
  })

  it('shows three quick start steps', () => {
    render(<HelpPage />)

    expect(screen.getByText('Registra un Cliente')).toBeInTheDocument()
    expect(screen.getByText('Crea un Plan')).toBeInTheDocument()
    expect(screen.getByText('Exporta y Comparte')).toBeInTheDocument()
  })

  it('renders client management section', () => {
    render(<HelpPage />)

    expect(screen.getByText('Gestión de Clientes')).toBeInTheDocument()
  })

  it('renders plan management section', () => {
    render(<HelpPage />)

    expect(screen.getByText('Gestión de Planes Nutricionales')).toBeInTheDocument()
  })

  it('renders export and share section', () => {
    render(<HelpPage />)

    expect(screen.getByText('Exportar y Compartir')).toBeInTheDocument()
  })

  it('shows PDF export information', () => {
    render(<HelpPage />)

    expect(screen.getByText('Exportar a PDF')).toBeInTheDocument()
  })

  it('shows Excel export information', () => {
    render(<HelpPage />)

    expect(screen.getByText('Exportar a Excel')).toBeInTheDocument()
  })

  it('shows WhatsApp share information', () => {
    render(<HelpPage />)

    // Use getAllByText since there are multiple occurrences
    const whatsappElements = screen.getAllByText(/Compartir por WhatsApp/i)
    expect(whatsappElements.length).toBeGreaterThan(0)
  })

  it('renders tips section', () => {
    render(<HelpPage />)

    expect(screen.getByText('Consejos y Mejores Prácticas')).toBeInTheDocument()
  })

  it('renders support section', () => {
    render(<HelpPage />)

    expect(screen.getByText(/¿Necesitas más ayuda\?/i)).toBeInTheDocument()
  })

  it('has GitHub link', () => {
    render(<HelpPage />)

    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/iferpaz7/nutrition-plan'
    )
  })
})
