import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { ApiResponse, Customer, ApiError } from '@/lib/types'

// GET /api/customers - List all customers
export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        nutritionalPlans: {
          include: {
            mealEntries: true,
          },
        },
      },
      orderBy: {
        lastName: 'asc',
      },
    })

    return NextResponse.json<ApiResponse<Customer[]>>({
      success: true,
      data: customers,
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: 'Failed to fetch customers',
        code: 'DATABASE_ERROR',
      },
      { status: 500 }
    )
  }
}

// POST /api/customers - Create a new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.idCard || typeof body.idCard !== 'string' || body.idCard.trim() === '') {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'La cédula es requerida',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      )
    }

    if (!body.firstName || typeof body.firstName !== 'string' || body.firstName.trim() === '') {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'El nombre es requerido',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      )
    }

    if (!body.lastName || typeof body.lastName !== 'string' || body.lastName.trim() === '') {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'El apellido es requerido',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      )
    }

    // Check if customer with same idCard already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { idCard: body.idCard.trim() },
    })

    if (existingCustomer) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Ya existe un cliente con esta cédula',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      )
    }

    // Create the customer
    const customer = await prisma.customer.create({
      data: {
        idCard: body.idCard.trim(),
        firstName: body.firstName.trim(),
        lastName: body.lastName.trim(),
        cellPhone: body.cellPhone?.trim() || null,
      },
      include: {
        nutritionalPlans: true,
      },
    })

    return NextResponse.json<ApiResponse<Customer>>(
      {
        success: true,
        data: customer,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: 'Failed to create customer',
        code: 'DATABASE_ERROR',
      },
      { status: 500 }
    )
  }
}
