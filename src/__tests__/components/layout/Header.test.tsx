import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from '@/components/layout/Header'

describe('Header', () => {
  const mockOnMenuToggle = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders NutriPlan branding', () => {
    render(<Header onMenuToggle={mockOnMenuToggle} />)
    
    expect(screen.getByText('NutriPlan')).toBeInTheDocument()
  })

  it('renders menu toggle button', () => {
    render(<Header onMenuToggle={mockOnMenuToggle} />)
    
    expect(screen.getByRole('button', { name: /toggle menu/i })).toBeInTheDocument()
  })

  it('calls onMenuToggle when menu button is clicked', async () => {
    const user = userEvent.setup()
    render(<Header onMenuToggle={mockOnMenuToggle} />)
    
    const menuButton = screen.getByRole('button', { name: /toggle menu/i })
    await user.click(menuButton)
    
    expect(mockOnMenuToggle).toHaveBeenCalled()
  })

  it('renders logo link to home', () => {
    render(<Header onMenuToggle={mockOnMenuToggle} />)
    
    // There are multiple links, find the one with href="/"
    const links = screen.getAllByRole('link')
    const logoLink = links.find(link => link.getAttribute('href') === '/')
    expect(logoLink).toBeTruthy()
  })

  it('shows subtitle text', () => {
    render(<Header onMenuToggle={mockOnMenuToggle} />)
    
    expect(screen.getByText(/Sistema de Planes Nutricionales/i)).toBeInTheDocument()
  })
})
