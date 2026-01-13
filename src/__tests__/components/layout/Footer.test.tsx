import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/layout/Footer'

describe('Footer', () => {
  it('renders NutriPlan branding', () => {
    render(<Footer />)

    expect(screen.getByText('NutriPlan')).toBeInTheDocument()
  })

  it('renders description text', () => {
    render(<Footer />)

    expect(screen.getByText(/Sistema de gestión de planes nutricionales/i)).toBeInTheDocument()
  })

  it('renders quick links section', () => {
    render(<Footer />)

    expect(screen.getByText('Enlaces Rápidos')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Footer />)

    expect(screen.getAllByRole('link', { name: /inicio/i })).toHaveLength(1)
    expect(screen.getAllByRole('link', { name: /planes/i })).toHaveLength(1)
    expect(screen.getAllByRole('link', { name: /clientes/i })).toHaveLength(1)
  })

  it('renders action links', () => {
    render(<Footer />)

    expect(screen.getByRole('link', { name: /crear plan/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /nuevo cliente/i })).toBeInTheDocument()
  })

  it('renders copyright with current year', () => {
    render(<Footer />)

    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument()
  })

  it('renders GitHub link', () => {
    render(<Footer />)

    const githubLink = screen.getByRole('link', { name: '' }) // Icon link
    expect(githubLink).toHaveAttribute('href', expect.stringContaining('github.com'))
  })

  it('has correct href for navigation links', () => {
    render(<Footer />)

    // Get the first Inicio link (in Enlaces Rápidos section)
    const inicioLinks = screen.getAllByRole('link', { name: /inicio/i })
    expect(inicioLinks[0]).toHaveAttribute('href', '/')
  })

  it('renders "Hecho con amor" message', () => {
    render(<Footer />)

    expect(screen.getByText(/Hecho con/i)).toBeInTheDocument()
    // Multiple elements contain "para nutricionistas" text
    expect(screen.getAllByText(/para nutricionistas/i).length).toBeGreaterThan(0)
  })
})
