import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExportImageButton } from '@/components/ExportImageButton'
import type { NutritionalPlan } from '@/lib/types'
import domtoimage from 'dom-to-image-more'

jest.mock('dom-to-image-more')

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
  notes: null,
  customer_id: '123e4567-e89b-12d3-a456-426614174000',
  created_at: '2026-01-12T00:00:00Z',
  updated_at: '2026-01-12T00:00:00Z',
  meal_entries: [],
}

describe('ExportImageButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock getElementById
    document.getElementById = jest.fn().mockReturnValue(document.createElement('div'))
    // Mock dom-to-image-more toBlob
    ;(domtoimage.toBlob as jest.Mock).mockResolvedValue(new Blob(['test'], { type: 'image/png' }))
  })

  it('renders export image button correctly', () => {
    render(<ExportImageButton plan={mockPlan} />)

    expect(screen.getByRole('button', { name: /exportar imagen/i })).toBeInTheDocument()
  })

  it('shows image icon', () => {
    render(<ExportImageButton plan={mockPlan} />)

    expect(screen.getByText(/exportar imagen/i)).toBeInTheDocument()
  })

  it('calls dom-to-image when clicked', async () => {
    const user = userEvent.setup()
    render(<ExportImageButton plan={mockPlan} />)

    const button = screen.getByRole('button', { name: /exportar imagen/i })
    await user.click(button)

    expect(domtoimage.toBlob).toHaveBeenCalled()
  })

  it('uses default targetId if not provided', async () => {
    const user = userEvent.setup()
    render(<ExportImageButton plan={mockPlan} />)

    const button = screen.getByRole('button', { name: /exportar imagen/i })
    await user.click(button)

    expect(document.getElementById).toHaveBeenCalledWith('plan-grid-container')
  })

  it('uses custom targetId when provided', async () => {
    const user = userEvent.setup()
    render(<ExportImageButton plan={mockPlan} targetId="custom-container" />)

    const button = screen.getByRole('button', { name: /exportar imagen/i })
    await user.click(button)

    expect(document.getElementById).toHaveBeenCalledWith('custom-container')
  })
})
