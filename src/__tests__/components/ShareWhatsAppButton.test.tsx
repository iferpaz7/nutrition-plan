import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ShareWhatsAppButton } from '@/components/ShareWhatsAppButton'
import type { NutritionalPlan, Customer } from '@/lib/types'

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock window.open
const mockWindowOpen = jest.fn()
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true,
})

describe('ShareWhatsAppButton', () => {
  const mockPlan: NutritionalPlan = {
    id: '1',
    name: 'Plan de Prueba',
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
        updated_at: '2025-01-15T00:00:00Z',
      },
    ],
  }

  const mockCustomer: Customer = {
    id: 'cust1',
    first_name: 'Juan',
    last_name: 'Pérez',
    email: 'juan@test.com',
    cell_phone: '0991234567',
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the WhatsApp button', () => {
    render(<ShareWhatsAppButton plan={mockPlan} customer={mockCustomer} />)

    expect(screen.getByRole('button', { name: /whatsapp/i })).toBeInTheDocument()
  })

  it('shows button disabled when customer has no phone', () => {
    const customerNoPhone = { ...mockCustomer, cell_phone: null }
    render(<ShareWhatsAppButton plan={mockPlan} customer={customerNoPhone} />)

    const button = screen.getByRole('button', { name: /whatsapp/i })
    expect(button).toBeDisabled()
  })

  it('opens WhatsApp link when clicked with valid phone', () => {
    render(<ShareWhatsAppButton plan={mockPlan} customer={mockCustomer} />)

    const button = screen.getByRole('button', { name: /whatsapp/i })
    fireEvent.click(button)

    expect(mockWindowOpen).toHaveBeenCalledTimes(1)
    const callArg = mockWindowOpen.mock.calls[0][0]
    expect(callArg).toContain('https://wa.me/593991234567')
    expect(callArg).toContain('text=')
  })

  it('formats phone number correctly removing leading 0', () => {
    render(<ShareWhatsAppButton plan={mockPlan} customer={mockCustomer} />)

    fireEvent.click(screen.getByRole('button', { name: /whatsapp/i }))

    const callArg = mockWindowOpen.mock.calls[0][0]
    // Should convert 0991234567 to 593991234567
    expect(callArg).toContain('wa.me/593991234567')
  })

  it('handles phone number already with country code', () => {
    const customerWithCode = { ...mockCustomer, cell_phone: '593991234567' }
    render(<ShareWhatsAppButton plan={mockPlan} customer={customerWithCode} />)

    fireEvent.click(screen.getByRole('button', { name: /whatsapp/i }))

    const callArg = mockWindowOpen.mock.calls[0][0]
    expect(callArg).toContain('wa.me/593991234567')
  })

  it('includes plan name in WhatsApp message', () => {
    render(<ShareWhatsAppButton plan={mockPlan} customer={mockCustomer} />)

    fireEvent.click(screen.getByRole('button', { name: /whatsapp/i }))

    const callArg = mockWindowOpen.mock.calls[0][0]
    const decodedMessage = decodeURIComponent(callArg.split('text=')[1])
    expect(decodedMessage).toContain('Plan de Prueba')
  })

  it('includes customer first name in WhatsApp message', () => {
    render(<ShareWhatsAppButton plan={mockPlan} customer={mockCustomer} />)

    fireEvent.click(screen.getByRole('button', { name: /whatsapp/i }))

    const callArg = mockWindowOpen.mock.calls[0][0]
    const decodedMessage = decodeURIComponent(callArg.split('text=')[1])
    expect(decodedMessage).toContain('Juan')
  })

  it('includes cordial message with PDF reference', () => {
    render(<ShareWhatsAppButton plan={mockPlan} customer={mockCustomer} />)

    fireEvent.click(screen.getByRole('button', { name: /whatsapp/i }))

    const callArg = mockWindowOpen.mock.calls[0][0]
    const decodedMessage = decodeURIComponent(callArg.split('text=')[1])
    expect(decodedMessage).toContain('PDF')
    expect(decodedMessage).toContain('adjúntalo')
  })

  it('button is disabled when customer is null', async () => {
    render(<ShareWhatsAppButton plan={mockPlan} customer={null} />)

    const button = screen.getByRole('button', { name: /whatsapp/i })
    expect(button).toBeDisabled()
  })
})
