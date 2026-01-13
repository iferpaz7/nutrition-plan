import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import type { ApiResponse, NutritionalPlan, MealEntry, DayOfWeek, MealType, ApiError } from '@/lib/types'

const VALID_DAYS: DayOfWeek[] = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO']
const VALID_MEAL_TYPES: MealType[] = ['DESAYUNO', 'COLACION_1', 'ALMUERZO', 'COLACION_2', 'CENA']

// GET /api/plans - List all nutritional plans
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')

    let query = supabase
      .from('nutritional_plan')
      .select(`
        *,
        customer (*),
        meal_entries:meal_entry (*)
      `)
      .order('created_at', { ascending: false })

    if (customerId) {
      query = query.eq('customer_id', customerId)
    }

    const { data: plans, error } = await query

    if (error) throw error

    return NextResponse.json<ApiResponse<NutritionalPlan[]>>({
      success: true,
      data: plans || [],
    })
  } catch (error) {
    console.error('Error fetching plans:', error)
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: 'Failed to fetch nutritional plans',
        code: 'DATABASE_ERROR',
      },
      { status: 500 }
    )
  }
}

// POST /api/plans - Create a new nutritional plan
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validate customerId
    if (!body.customer_id || typeof body.customer_id !== 'string') {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'El cliente es requerido',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      )
    }

    // Check if customer exists
    const { data: customer, error: customerError } = await supabase
      .from('customer')
      .select('id')
      .eq('id', body.customer_id)
      .single()

    if (customerError || !customer) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Cliente no encontrado',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      )
    }

    // Validate required fields
    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'El nombre del plan es requerido',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      )
    }

    // Validate meals if provided
    const meals: Array<{ day_of_week: DayOfWeek; meal_type: MealType; meal_description: string; nutritional_plan_id?: string }> = []

    if (body.meals && typeof body.meals === 'object') {
      for (const [day, mealTypes] of Object.entries(body.meals)) {
        // Validate day of week
        if (!VALID_DAYS.includes(day as DayOfWeek)) {
          return NextResponse.json<ApiError>(
            {
              success: false,
              error: `Invalid day of week: ${day}`,
              code: 'VALIDATION_ERROR',
            },
            { status: 400 }
          )
        }

        if (mealTypes && typeof mealTypes === 'object') {
          for (const [mealType, description] of Object.entries(mealTypes as Record<string, string>)) {
            // Validate meal type
            if (!VALID_MEAL_TYPES.includes(mealType as MealType)) {
              return NextResponse.json<ApiError>(
                {
                  success: false,
                  error: `Invalid meal type: ${mealType}`,
                  code: 'VALIDATION_ERROR',
                },
                { status: 400 }
              )
            }

            // Validate meal description
            if (typeof description !== 'string' || description.trim() === '') {
              return NextResponse.json<ApiError>(
                {
                  success: false,
                  error: `Meal description cannot be empty for ${day} - ${mealType}`,
                  code: 'VALIDATION_ERROR',
                },
                { status: 400 }
              )
            }

            meals.push({
              day_of_week: day as DayOfWeek,
              meal_type: mealType as MealType,
              meal_description: description.trim(),
            })
          }
        }
      }
    }

    // Create the plan
    const { data: plan, error: planError } = await supabase
      .from('nutritional_plan')
      .insert({
        name: body.name.trim(),
        description: body.description?.trim() || null,
        customer_id: body.customer_id,
      })
      .select(`
        *,
        customer (*)
      `)
      .single()

    if (planError || !plan) throw planError

    // Create meal entries if any
    let mealEntries: MealEntry[] = []
    if (meals.length > 0) {
      const mealsWithPlanId = meals.map(meal => ({
        ...meal,
        nutritional_plan_id: plan.id,
      }))

      const { data: insertedMeals, error: mealsError } = await supabase
        .from('meal_entry')
        .insert(mealsWithPlanId)
        .select()

      if (mealsError) throw mealsError
      mealEntries = insertedMeals || []
    }

    return NextResponse.json<ApiResponse<NutritionalPlan>>(
      {
        success: true,
        data: { ...plan, meal_entries: mealEntries },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating plan:', error)
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: 'Failed to create nutritional plan',
        code: 'DATABASE_ERROR',
      },
      { status: 500 }
    )
  }
}
