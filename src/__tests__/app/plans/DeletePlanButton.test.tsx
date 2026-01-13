import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeletePlanButton } from '@/app/plans/DeletePlanButton'

// Mock fetch
global.fetch = jest.fn()

describe('DeletePlanButton', () => {
  const mockPlanId = '123e4567-e89b-12d3-a456-426614174001'
  const mockPlanName = 'Plan de Pérdida de Peso'

  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true })
  })

  it('renders delete button', () => {
    render(<DeletePlanButton planId={mockPlanId} planName={mockPlanName} />)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('opens confirmation dialog when clicked', async () => {
    const user = userEvent.setup()
    render(<DeletePlanButton planId={mockPlanId} planName={mockPlanName} />)

    const button = screen.getByRole('button')
    await user.click(button)

    // Dialog should appear with plan name mention
    expect(screen.getByText(/¿Estás seguro/i)).toBeInTheDocument()
  })

  it('closes dialog when cancel is clicked', async () => {
    const user = userEvent.setup()
    render(<DeletePlanButton planId={mockPlanId} planName={mockPlanName} />)

    // Open dialog
    const button = screen.getByRole('button')
    await user.click(button)

    // Click cancel
    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    await user.click(cancelButton)

    // Dialog should be closed
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('calls delete API when confirmed', async () => {
    const user = userEvent.setup()
    render(<DeletePlanButton planId={mockPlanId} planName={mockPlanName} />)

    // Open dialog
    const button = screen.getByRole('button')
    await user.click(button)

    // Click confirm
    const confirmButton = screen.getByRole('button', { name: /eliminar/i })
    await user.click(confirmButton)

    expect(global.fetch).toHaveBeenCalledWith(
      `/api/plans/${mockPlanId}`,
      expect.objectContaining({ method: 'DELETE' })
    )
  })

  it('has destructive styling', () => {
    render(<DeletePlanButton planId={mockPlanId} planName={mockPlanName} />)

    const button = screen.getByRole('button')
    expect(button.className).toContain('destructive')
  })
})
