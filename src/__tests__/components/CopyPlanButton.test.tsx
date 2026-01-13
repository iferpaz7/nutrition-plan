import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import type { NutritionalPlan } from '@/lib/types'

// Mock the Select component before importing CopyPlanButton
jest.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange, value }: { children: React.ReactNode; onValueChange?: (value: string) => void; value?: string }) => (
    <div data-testid="mock-select" data-value={value}>{children}</div>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <option value={value}>{children}</option>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <button type="button">{children}</button>,
  SelectValue: ({ placeholder }: { placeholder?: string }) => <span>{placeholder}</span>,
}))

import { CopyPlanButton } from '@/components/CopyPlanButton'

// Mock next/navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}))

// Mock fetch
global.fetch = jest.fn()

describe('CopyPlanButton', () => {
  const mockPlan: NutritionalPlan = {
    id: '1',
    name: 'Plan Original',
    description: 'Descripción del plan',
    customer_id: 'cust1',
    daily_calories: 2000,
    protein_grams: 150,
    carbs_grams: 200,
    fat_grams: 70,
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
    meal_entries: [
      {
        id: 'meal1',
        nutritional_plan_id: '1',
        day_of_week: 'monday',
        meal_type: 'breakfast',
        meal_description: 'Huevos con tostadas',
        created_at: '2025-01-15T00:00:00Z',
        updated_at: '2025-01-15T00:00:00Z'
      }
    ]
  }

  const mockCustomers = [
    { id: 'cust1', first_name: 'Juan', last_name: 'Pérez' },
    { id: 'cust2', first_name: 'María', last_name: 'García' }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockImplementation((url) => {
      if (url === '/api/customers') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCustomers)
        })
      }
      if (url === '/api/plans') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 'new-plan-id' })
        })
      }
      if (url.includes('/api/plans/') && url.includes('/meals')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({})
        })
      }
      return Promise.reject(new Error('Unknown URL'))
    })
  })

  it('renders the copy button', () => {
    render(<CopyPlanButton plan={mockPlan} />)
    
    expect(screen.getByRole('button', { name: /copiar/i })).toBeInTheDocument()
  })

  it('opens dialog when button is clicked', async () => {
    render(<CopyPlanButton plan={mockPlan} />)
    
    fireEvent.click(screen.getByRole('button', { name: /copiar/i }))
    
    await waitFor(() => {
      expect(screen.getByText('Copiar Plan')).toBeInTheDocument()
    })
  })

  it('shows input for new plan name', async () => {
    render(<CopyPlanButton plan={mockPlan} />)
    
    fireEvent.click(screen.getByRole('button', { name: /copiar/i }))
    
    await waitFor(() => {
      expect(screen.getByLabelText(/nombre del nuevo plan/i)).toBeInTheDocument()
    })
  })

  it('fetches customers when dialog opens', async () => {
    render(<CopyPlanButton plan={mockPlan} />)
    
    fireEvent.click(screen.getByRole('button', { name: /copiar/i }))
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/customers')
    })
  })

  it('has confirm button labeled Copiar', async () => {
    render(<CopyPlanButton plan={mockPlan} />)
    
    fireEvent.click(screen.getByRole('button', { name: /copiar/i }))
    
    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      const copyButtons = buttons.filter(btn => btn.textContent?.includes('Copiar'))
      expect(copyButtons.length).toBeGreaterThan(0)
    })
  })

  it('has cancel button', async () => {
    render(<CopyPlanButton plan={mockPlan} />)
    
    fireEvent.click(screen.getByRole('button', { name: /copiar/i }))
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
    })
  })
})
