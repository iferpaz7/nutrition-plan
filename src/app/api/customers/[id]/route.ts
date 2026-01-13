import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import type { ApiResponse, Customer, ApiError } from '@/lib/types'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/customers/[id] - Get a single customer
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient()
    const { id } = await params

    const { data: customer, error } = await supabase
      .from('customer')
      .select(`
        *,
        nutritional_plans:nutritional_plan (
          *,
          meal_entries:meal_entry (*)
        )
      `)
      .eq('id', id)
      .single()

    if (error || !customer) {
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
    const supabase = await createClient()
    const { id } = await params
    const body = await request.json()

    // Check if customer exists
    const { data: existingCustomer, error: findError } = await supabase
      .from('customer')
      .select('*')
      .eq('id', id)
      .single()

    if (findError || !existingCustomer) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Cliente no encontrado',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      )
    }

    // Validate fields if provided
    if (body.id_card !== undefined) {
      if (typeof body.id_card !== 'string' || body.id_card.trim() === '') {
        return NextResponse.json<ApiError>(
          {
            success: false,
            error: 'La cédula no puede estar vacía',
            code: 'VALIDATION_ERROR',
          },
          { status: 400 }
        )
      }

      // Check if idCard already exists for another customer
      const { data: duplicateCustomer } = await supabase
        .from('customer')
        .select('id')
        .eq('id_card', body.id_card.trim())
        .neq('id', id)
        .single()

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

    if (body.first_name !== undefined && (typeof body.first_name !== 'string' || body.first_name.trim() === '')) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'El nombre no puede estar vacío',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      )
    }

    if (body.last_name !== undefined && (typeof body.last_name !== 'string' || body.last_name.trim() === '')) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'El apellido no puede estar vacío',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      )
    }

    // Update customer
    const { data: updatedCustomer, error: updateError } = await supabase
      .from('customer')
      .update({
        id_card: body.id_card?.trim() ?? existingCustomer.id_card,
        first_name: body.first_name?.trim() ?? existingCustomer.first_name,
        last_name: body.last_name?.trim() ?? existingCustomer.last_name,
        cell_phone: body.cell_phone !== undefined 
          ? (body.cell_phone?.trim() || null) 
          : existingCustomer.cell_phone,
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError

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
    const supabase = await createClient()
    const { id } = await params

    // Check if customer exists
    const { data: existingCustomer, error: findError } = await supabase
      .from('customer')
      .select('id')
      .eq('id', id)
      .single()

    if (findError || !existingCustomer) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Cliente no encontrado',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      )
    }

    // Delete the customer (cascade will delete nutritional plans and meal entries)
    const { error: deleteError } = await supabase
      .from('customer')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError

    return NextResponse.json<ApiResponse<null>>({
      success: true,
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
