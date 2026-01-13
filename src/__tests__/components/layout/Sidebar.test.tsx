import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sidebar } from '@/components/layout/Sidebar'

describe('Sidebar', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders when open', () => {
    render(<Sidebar isOpen={true} onClose={mockOnClose} />)
    
    // There are multiple NutriPlan texts (mobile and desktop headers)
    expect(screen.getAllByText('NutriPlan').length).toBeGreaterThan(0)
  })

  it('shows navigation links', () => {
    render(<Sidebar isOpen={true} onClose={mockOnClose} />)
    
    expect(screen.getByRole('link', { name: /inicio/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /planes/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /clientes/i })).toBeInTheDocument()
  })

  it('shows quick action links', () => {
    render(<Sidebar isOpen={true} onClose={mockOnClose} />)
    
    expect(screen.getByRole('link', { name: /nuevo plan/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /nuevo cliente/i })).toBeInTheDocument()
  })

  it('has correct href for navigation links', () => {
    render(<Sidebar isOpen={true} onClose={mockOnClose} />)
    
    expect(screen.getByRole('link', { name: /inicio/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /planes/i })).toHaveAttribute('href', '/plans')
    expect(screen.getByRole('link', { name: /clientes/i })).toHaveAttribute('href', '/customers')
  })

  it('has correct href for quick action links', () => {
    render(<Sidebar isOpen={true} onClose={mockOnClose} />)
    
    expect(screen.getByRole('link', { name: /nuevo plan/i })).toHaveAttribute('href', '/plans/new')
    expect(screen.getByRole('link', { name: /nuevo cliente/i })).toHaveAttribute('href', '/customers/new')
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<Sidebar isOpen={true} onClose={mockOnClose} />)
    
    // Find the close button (X icon button)
    const closeButtons = screen.getAllByRole('button')
    await user.click(closeButtons[0])
    
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('calls onClose when overlay is clicked', async () => {
    const user = userEvent.setup()
    const { container } = render(<Sidebar isOpen={true} onClose={mockOnClose} />)
    
    // Find the overlay backdrop
    const backdrop = container.querySelector('.fixed.inset-0')
    if (backdrop) {
      await user.click(backdrop)
      expect(mockOnClose).toHaveBeenCalled()
    }
  })

  it('shows section headers', () => {
    render(<Sidebar isOpen={true} onClose={mockOnClose} />)
    
    expect(screen.getByText('Principal')).toBeInTheDocument()
    expect(screen.getByText('Acciones Rápidas')).toBeInTheDocument()
  })

  it('shows configuration and help links', () => {
    render(<Sidebar isOpen={true} onClose={mockOnClose} />)
    
    expect(screen.getByText('Configuración')).toBeInTheDocument()
    expect(screen.getByText('Ayuda')).toBeInTheDocument()
  })
})
