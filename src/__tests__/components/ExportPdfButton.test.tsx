import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExportPdfButton } from '@/components/ExportPdfButton'
import type { NutritionalPlan, Customer } from '@/lib/types'
import jsPDF from 'jspdf'

jest.mock('jspdf')
jest.mock('jspdf-autotable')

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
  notes: null,
  created_at: '2026-01-12T00:00:00Z',
  updated_at: '2026-01-12T00:00:00Z',
}

const mockPlan: NutritionalPlan = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  name: 'Plan de Pérdida de Peso',
  description: 'Plan diseñado para pérdida de peso',
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
  meal_entries: [
    {
      id: '1',
      nutritional_plan_id: '123e4567-e89b-12d3-a456-426614174001',
      day_of_week: 'LUNES',
      meal_type: 'DESAYUNO',
      meal_description: '2 huevos revueltos',
      calories: 420,
      protein_grams: 22,
      carbs_grams: 28,
      fat_grams: 24,
      fiber_grams: 3,
      portion_size: null,
      preparation_notes: null,
    },
  ],
}

describe('ExportPdfButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders export PDF button correctly', () => {
    render(<ExportPdfButton plan={mockPlan} />)

    expect(screen.getByRole('button', { name: /exportar pdf/i })).toBeInTheDocument()
  })

  it('shows PDF icon', () => {
    render(<ExportPdfButton plan={mockPlan} />)

    expect(screen.getByText(/exportar pdf/i)).toBeInTheDocument()
  })

  it('creates jsPDF instance when clicked', async () => {
    const user = userEvent.setup()
    render(<ExportPdfButton plan={mockPlan} customer={mockCustomer} />)

    const button = screen.getByRole('button', { name: /exportar pdf/i })
    await user.click(button)

    expect(jsPDF).toHaveBeenCalledWith('landscape', 'mm', 'a4')
  })

  it('works without customer data', async () => {
    const user = userEvent.setup()
    render(<ExportPdfButton plan={mockPlan} />)

    const button = screen.getByRole('button', { name: /exportar pdf/i })
    await user.click(button)

    expect(jsPDF).toHaveBeenCalled()
  })

  it('works with null customer', async () => {
    const user = userEvent.setup()
    render(<ExportPdfButton plan={mockPlan} customer={null} />)

    const button = screen.getByRole('button', { name: /exportar pdf/i })
    await user.click(button)

    expect(jsPDF).toHaveBeenCalled()
  })
})
