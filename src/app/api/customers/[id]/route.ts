import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { ApiResponse, Customer, ApiError } from '@/lib/types'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/customers/[id] - Get a single customer
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        nutritionalPlans: {
          include: {
            mealEntries: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!customer) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Cliente no encontrado',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse<Customer>>({
      success: true,
      data: customer,
    })
  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: 'Failed to fetch customer',
        code: 'DATABASE_ERROR',
      },
      { status: 500 }
    )
  }
}

// PUT /api/customers/[id] - Update a customer
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id },
    })

    if (!existingCustomer) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Cliente no encontrado',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      )
    }

    // Validate idCard if provided
    if (body.idCard !== undefined) {
      if (typeof body.idCard !== 'string' || body.idCard.trim() === '') {
        return NextResponse.json<ApiError>(
          {
            success: false,
            error: 'La cédula no puede estar vacía',
            code: 'VALIDATION_ERROR',
          },
          { status: 400 }
        )
      }

      // Check if another customer has the same idCard
      const duplicateCustomer = await prisma.customer.findFirst({
        where: {
          idCard: body.idCard.trim(),
          NOT: { id },
        },
      })

      if (duplicateCustomer) {
        return NextResponse.json<ApiError>(
          {
            success: false,
            error: 'Ya existe otro cliente con esta cédula',
            code: 'VALIDATION_ERROR',
          },
          { status: 400 }
        )
      }
    }

    // Update the customer
    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        idCard: body.idCard?.trim() ?? existingCustomer.idCard,
        firstName: body.firstName?.trim() ?? existingCustomer.firstName,
        lastName: body.lastName?.trim() ?? existingCustomer.lastName,
        cellPhone: body.cellPhone !== undefined 
          ? (body.cellPhone?.trim() || null) 
          : existingCustomer.cellPhone,
      },
      include: {
        nutritionalPlans: {
          include: {
            mealEntries: true,
          },
        },
      },
    })

    return NextResponse.json<ApiResponse<Customer>>({
      success: true,
      data: updatedCustomer,
    })
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: 'Failed to update customer',
        code: 'DATABASE_ERROR',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/customers/[id] - Delete a customer
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id },
    })

    if (!existingCustomer) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Cliente no encontrado',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      )
    }

    // Delete the customer (cascade will delete plans and meals)
    await prisma.customer.delete({
      where: { id },
    })

    return NextResponse.json<ApiResponse<{ deleted: boolean }>>({
      success: true,
      data: { deleted: true },
    })
  } catch (error) {
    console.error('Error deleting customer:', error)
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: 'Failed to delete customer',
        code: 'DATABASE_ERROR',
      },
      { status: 500 }
    )
  }
}
