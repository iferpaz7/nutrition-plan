import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import type { ApiResponse, Customer, ApiError } from '@/lib/types'

// GET /api/customers - List all customers or search
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    let query = supabase
      .from('customer')
      .select(`
        *,
        nutritional_plans:nutritional_plan (
          id,
          name,
          created_at
        )
      `)

    // If search query provided, filter by id_card, first_name, or last_name
    if (search && search.trim().length >= 2) {
      const searchTerm = `%${search.trim()}%`
      query = query.or(`id_card.ilike.${searchTerm},first_name.ilike.${searchTerm},last_name.ilike.${searchTerm}`)
    }

    const { data: customers, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json<ApiResponse<Customer[]>>({
      success: true,
      data: customers || [],
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
    const supabase = await createClient()
    const body = await request.json()

    // Validate required fields
    if (!body.id_card || typeof body.id_card !== 'string' || body.id_card.trim() === '') {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'La cédula es requerida',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      )
    }

    if (!body.first_name || typeof body.first_name !== 'string' || body.first_name.trim() === '') {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'El nombre es requerido',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      )
    }

    if (!body.last_name || typeof body.last_name !== 'string' || body.last_name.trim() === '') {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'El apellido es requerido',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      )
    }

    // Check if idCard already exists
    const { data: existingCustomer } = await supabase
      .from('customer')
      .select('id')
      .eq('id_card', body.id_card.trim())
      .single()

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

    // Create customer
    const { data: customer, error } = await supabase
      .from('customer')
      .insert({
        id_card: body.id_card.trim(),
        first_name: body.first_name.trim(),
        last_name: body.last_name.trim(),
        cell_phone: body.cell_phone?.trim() || null,
      })
      .select(`
        *,
        nutritional_plans:nutritional_plan (*)
      `)
      .single()

    if (error) throw error

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
