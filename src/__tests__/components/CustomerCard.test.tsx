import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CustomerCard } from '@/components/CustomerCard'
import type { Customer } from '@/lib/types'

const mockCustomer: Customer = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  id_card: '1234567890',
  first_name: 'Ivan',
  last_name: 'Paz',
  email: 'ivan.paz@email.com',
  cell_phone: '0999123456',
  gender: 'MASCULINO',
  birth_date: '1995-06-15',
  age: 30,
  weight: 84,
  height: 1.69,
  imc: 29.41,
  body_fat_percentage: null,
  activity_level: 'MODERADO',
  goal: 'PERDER_PESO',
  daily_calorie_target: 2000,
  allergies: 'Mariscos',
  medical_conditions: null,
  medications: null,
  dietary_restrictions: 'Sin gluten',
  notes: 'Cliente comprometido',
  created_at: '2026-01-12T00:00:00Z',
  updated_at: '2026-01-12T00:00:00Z',
}

describe('CustomerCard', () => {
  const mockOnDelete = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders customer name correctly', () => {
    render(<CustomerCard customer={mockCustomer} onDelete={mockOnDelete} />)
    
    // Component renders first_name and last_name separately
    expect(screen.getByText(/Ivan/)).toBeInTheDocument()
    expect(screen.getByText(/Paz/)).toBeInTheDocument()
  })

  it('renders customer phone', () => {
    render(<CustomerCard customer={mockCustomer} onDelete={mockOnDelete} />)
    
    expect(screen.getByText('0999123456')).toBeInTheDocument()
  })

  it('renders ID card', () => {
    render(<CustomerCard customer={mockCustomer} onDelete={mockOnDelete} />)
    
    expect(screen.getByText('1234567890')).toBeInTheDocument()
  })

  it('renders plan count', () => {
    render(<CustomerCard customer={mockCustomer} onDelete={mockOnDelete} />)
    
    // Component shows plan count (0 planes for mockCustomer with no plans)
    expect(screen.getByText(/planes/)).toBeInTheDocument()
  })

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup()
    render(<CustomerCard customer={mockCustomer} onDelete={mockOnDelete} />)
    
    // Delete button only has an icon, find by button role
    const buttons = screen.getAllByRole('button')
    const deleteButton = buttons.find(btn => btn.classList.contains('bg-destructive'))
    expect(deleteButton).toBeTruthy()
    await user.click(deleteButton!)
    
    expect(mockOnDelete).toHaveBeenCalledWith(mockCustomer.id)
  })

  it('renders view link with correct href', () => {
    render(<CustomerCard customer={mockCustomer} onDelete={mockOnDelete} />)
    
    const viewLink = screen.getByRole('link', { name: /ver/i })
    expect(viewLink).toHaveAttribute('href', `/customers/${mockCustomer.id}`)
  })

  it('renders edit link with correct href', () => {
    render(<CustomerCard customer={mockCustomer} onDelete={mockOnDelete} />)
    
    const editLink = screen.getByRole('link', { name: /editar/i })
    expect(editLink).toHaveAttribute('href', `/customers/${mockCustomer.id}/edit`)
  })

  it('handles customer without phone gracefully', () => {
    const customerWithoutPhone = { ...mockCustomer, cell_phone: null }
    render(<CustomerCard customer={customerWithoutPhone} onDelete={mockOnDelete} />)
    
    expect(screen.getByText(/Ivan/)).toBeInTheDocument()
  })
})
