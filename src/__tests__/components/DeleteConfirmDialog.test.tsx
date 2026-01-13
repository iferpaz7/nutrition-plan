import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog'

describe('DeleteConfirmDialog', () => {
  const mockOnConfirm = jest.fn()
  const mockOnOpenChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders dialog when open', () => {
    render(
      <DeleteConfirmDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        planName="Plan de Prueba"
        onConfirm={mockOnConfirm}
      />
    )

    expect(screen.getByText(/¿Estás seguro/i)).toBeInTheDocument()
  })

  it('shows plan name in dialog', () => {
    render(
      <DeleteConfirmDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        planName="Plan de Prueba"
        onConfirm={mockOnConfirm}
      />
    )

    expect(screen.getByText(/Plan de Prueba/)).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(
      <DeleteConfirmDialog
        open={false}
        onOpenChange={mockOnOpenChange}
        planName="Plan de Prueba"
        onConfirm={mockOnConfirm}
      />
    )

    expect(screen.queryByText(/¿Estás seguro/i)).not.toBeInTheDocument()
  })

  it('calls onConfirm when delete button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <DeleteConfirmDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        planName="Plan de Prueba"
        onConfirm={mockOnConfirm}
      />
    )

    const deleteButton = screen.getByRole('button', { name: /eliminar/i })
    await user.click(deleteButton)

    expect(mockOnConfirm).toHaveBeenCalled()
  })

  it('calls onOpenChange when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <DeleteConfirmDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        planName="Plan de Prueba"
        onConfirm={mockOnConfirm}
      />
    )

    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    await user.click(cancelButton)

    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it('shows warning about irreversible action', () => {
    render(
      <DeleteConfirmDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        planName="Plan de Prueba"
        onConfirm={mockOnConfirm}
      />
    )

    expect(screen.getByText(/no se puede deshacer/i)).toBeInTheDocument()
  })
})
