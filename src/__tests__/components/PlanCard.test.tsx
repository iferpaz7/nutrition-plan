import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PlanCard } from '@/components/PlanCard'
import type { NutritionalPlan } from '@/lib/types'

const mockPlan: NutritionalPlan = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  name: 'Plan de Pérdida de Peso - Semana 1',
  description: 'Plan diseñado para pérdida de peso gradual',
  status: 'ACTIVO',
  start_date: '2026-01-12',
  end_date: '2026-01-19',
  daily_calories: 2000,
  protein_grams: 150,
  carbs_grams: 200,
  fat_grams: 67,
  fiber_grams: 30,
  water_liters: 2.5,
  notes: 'Seguir las recomendaciones',
  customer_id: '123e4567-e89b-12d3-a456-426614174000',
  created_at: '2026-01-12T00:00:00Z',
  updated_at: '2026-01-12T00:00:00Z',
  meal_entries: [],
}

describe('PlanCard', () => {
  const mockOnDelete = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders plan name correctly', () => {
    render(<PlanCard plan={mockPlan} onDelete={mockOnDelete} />)
    
    expect(screen.getByText('Plan de Pérdida de Peso - Semana 1')).toBeInTheDocument()
  })

  it('renders plan description', () => {
    render(<PlanCard plan={mockPlan} onDelete={mockOnDelete} />)
    
    expect(screen.getByText('Plan diseñado para pérdida de peso gradual')).toBeInTheDocument()
  })

  it('renders meal count progress', () => {
    render(<PlanCard plan={mockPlan} onDelete={mockOnDelete} />)
    
    // Component shows meals planned / 35 total
    expect(screen.getByText('Comidas planificadas')).toBeInTheDocument()
    expect(screen.getByText(/completado/i)).toBeInTheDocument()
  })

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup()
    render(<PlanCard plan={mockPlan} onDelete={mockOnDelete} />)
    
    // Delete button only has an icon, find by button role and class
    const buttons = screen.getAllByRole('button')
    const deleteButton = buttons.find(btn => btn.classList.contains('bg-destructive'))
    expect(deleteButton).toBeTruthy()
    await user.click(deleteButton!)
    
    expect(mockOnDelete).toHaveBeenCalledWith(mockPlan.id)
  })

  it('renders view link with correct href', () => {
    render(<PlanCard plan={mockPlan} onDelete={mockOnDelete} />)
    
    const viewLink = screen.getByRole('link', { name: /ver/i })
    expect(viewLink).toHaveAttribute('href', `/plans/${mockPlan.id}`)
  })

  it('renders edit link with correct href', () => {
    render(<PlanCard plan={mockPlan} onDelete={mockOnDelete} />)
    
    const editLink = screen.getByRole('link', { name: /editar/i })
    expect(editLink).toHaveAttribute('href', `/plans/${mockPlan.id}/edit`)
  })

  it('handles plan without description gracefully', () => {
    const planWithoutDescription = { ...mockPlan, description: null }
    render(<PlanCard plan={planWithoutDescription} onDelete={mockOnDelete} />)
    
    expect(screen.getByText('Plan de Pérdida de Peso - Semana 1')).toBeInTheDocument()
  })

  it('shows creation date', () => {
    render(<PlanCard plan={mockPlan} onDelete={mockOnDelete} />)
    
    expect(screen.getByText(/Creado:/)).toBeInTheDocument()
  })
})
