import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExportButton } from '@/components/ExportButton'
import type { NutritionalPlan } from '@/lib/types'
import * as XLSX from 'xlsx'

jest.mock('xlsx')

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

describe('ExportButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders export button correctly', () => {
    render(<ExportButton plan={mockPlan} />)
    
    expect(screen.getByRole('button', { name: /exportar a excel/i })).toBeInTheDocument()
  })

  it('shows download icon', () => {
    render(<ExportButton plan={mockPlan} />)
    
    expect(screen.getByText(/exportar a excel/i)).toBeInTheDocument()
  })

  it('calls XLSX functions when clicked', async () => {
    const user = userEvent.setup()
    render(<ExportButton plan={mockPlan} />)
    
    const button = screen.getByRole('button', { name: /exportar a excel/i })
    await user.click(button)
    
    expect(XLSX.utils.book_new).toHaveBeenCalled()
    expect(XLSX.utils.aoa_to_sheet).toHaveBeenCalled()
    expect(XLSX.utils.book_append_sheet).toHaveBeenCalled()
    expect(XLSX.writeFile).toHaveBeenCalled()
  })

  it('generates correct filename format', async () => {
    const user = userEvent.setup()
    render(<ExportButton plan={mockPlan} />)
    
    const button = screen.getByRole('button', { name: /exportar a excel/i })
    await user.click(button)
    
    // Check that writeFile was called with a filename containing plan name
    expect(XLSX.writeFile).toHaveBeenCalledWith(
      expect.anything(),
      expect.stringMatching(/Plan_de_Pérdida_de_Peso.*\.xlsx/)
    )
  })
})
