import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PlanCardWithExport } from '@/app/plans/PlanCardWithExport'
import type { NutritionalPlan } from '@/lib/types'

// Mock jsPDF
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    internal: {
      pageSize: { getWidth: () => 297, getHeight: () => 210 },
    },
    setFontSize: jest.fn(),
    setTextColor: jest.fn(),
    text: jest.fn(),
    save: jest.fn(),
    output: jest.fn(() => new Blob(['test'], { type: 'application/pdf' })),
  }))
})

jest.mock('jspdf-autotable', () => jest.fn())

// Mock fetch for delete functionality
global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as jest.Mock

const mockPlan: NutritionalPlan & {
  customer?: { id: string; first_name: string; last_name: string } | null
} = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  name: 'Plan de Pérdida de Peso',
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
  customer: {
    id: '123e4567-e89b-12d3-a456-426614174000',
    first_name: 'Ivan',
    last_name: 'Paz',
  },
}

describe('PlanCardWithExport', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders plan name', () => {
    render(<PlanCardWithExport plan={mockPlan} />)

    expect(screen.getByText('Plan de Pérdida de Peso')).toBeInTheDocument()
  })

  it('renders plan description', () => {
    render(<PlanCardWithExport plan={mockPlan} />)

    expect(screen.getByText('Plan diseñado para pérdida de peso gradual')).toBeInTheDocument()
  })

  it('renders customer name badge', () => {
    render(<PlanCardWithExport plan={mockPlan} />)

    expect(screen.getByText('Ivan Paz')).toBeInTheDocument()
  })

  it('renders view and edit links', () => {
    render(<PlanCardWithExport plan={mockPlan} />)

    expect(screen.getByRole('link', { name: /ver/i })).toHaveAttribute(
      'href',
      `/plans/${mockPlan.id}`
    )
    expect(screen.getByRole('link', { name: /editar/i })).toHaveAttribute(
      'href',
      `/plans/${mockPlan.id}/edit`
    )
  })

  it('renders export PDF button', () => {
    render(<PlanCardWithExport plan={mockPlan} />)

    expect(screen.getByRole('button', { name: /exportar pdf/i })).toBeInTheDocument()
  })

  it('renders meal progress', () => {
    render(<PlanCardWithExport plan={mockPlan} />)

    expect(screen.getByText('Comidas planificadas')).toBeInTheDocument()
    expect(screen.getByText(/completado/i)).toBeInTheDocument()
  })

  it('renders creation date', () => {
    render(<PlanCardWithExport plan={mockPlan} />)

    expect(screen.getByText(/Creado:/)).toBeInTheDocument()
  })

  it('handles plan without customer', () => {
    const planWithoutCustomer = { ...mockPlan, customer: null }
    render(<PlanCardWithExport plan={planWithoutCustomer} />)

    expect(screen.getByText('Plan de Pérdida de Peso')).toBeInTheDocument()
    expect(screen.queryByText('Ivan Paz')).not.toBeInTheDocument()
  })

  it('handles plan without description', () => {
    const planWithoutDescription = { ...mockPlan, description: null }
    render(<PlanCardWithExport plan={planWithoutDescription} />)

    expect(screen.getByText('Plan de Pérdida de Peso')).toBeInTheDocument()
  })

  it('calculates correct completion percentage', () => {
    // Plan with 7 meals (20%)
    const planWithMeals = {
      ...mockPlan,
      meal_entries: Array(7).fill({
        id: '1',
        nutritional_plan_id: mockPlan.id,
        day_of_week: 'LUNES',
        meal_type: 'DESAYUNO',
        meal_description: 'Test',
        calories: 500,
        protein_grams: 20,
        carbs_grams: 50,
        fat_grams: 20,
        fiber_grams: 5,
        portion_size: null,
        preparation_notes: null,
      }),
    }
    render(<PlanCardWithExport plan={planWithMeals} />)

    expect(screen.getByText(/20% completado/)).toBeInTheDocument()
  })
})
