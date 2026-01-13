import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import type {
  ApiResponse,
  NutritionalPlan,
  MealEntry,
  DayOfWeek,
  MealType,
  ApiError,
} from '@/lib/types'

const VALID_DAYS: DayOfWeek[] = [
  'LUNES',
  'MARTES',
  'MIERCOLES',
  'JUEVES',
  'VIERNES',
  'SABADO',
  'DOMINGO',
]
const VALID_MEAL_TYPES: MealType[] = ['DESAYUNO', 'COLACION_1', 'ALMUERZO', 'COLACION_2', 'CENA']

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/plans/[id] - Get a single nutritional plan
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient()
    const { id } = await params

    const { data: plan, error } = await supabase
      .from('nutritional_plan')
      .select(
        `
        *,
        customer (*),
        meal_entries:meal_entry (*)
      `
      )
      .eq('id', id)
      .single()

    if (error || !plan) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Plan nutricional no encontrado',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse<NutritionalPlan>>({
      success: true,
      data: plan,
    })
  } catch (error) {
    console.error('Error fetching plan:', error)
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: 'Failed to fetch nutritional plan',
        code: 'DATABASE_ERROR',
      },
      { status: 500 }
    )
  }
}

// PUT /api/plans/[id] - Update a nutritional plan
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient()
    const { id } = await params
    const body = await request.json()

    // Check if plan exists
    const { data: existingPlan, error: findError } = await supabase
      .from('nutritional_plan')
      .select('*')
      .eq('id', id)
      .single()

    if (findError || !existingPlan) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Nutritional plan not found',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      )
    }

    // Validate name if provided
    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || body.name.trim() === '') {
        return NextResponse.json<ApiError>(
          {
            success: false,
            error: 'Plan name cannot be empty',
            code: 'VALIDATION_ERROR',
          },
          { status: 400 }
        )
      }
    }

    // Prepare meal entries for update
    const meals: Array<{
      day_of_week: DayOfWeek
      meal_type: MealType
      meal_description: string
      nutritional_plan_id: string
    }> = []

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
          for (const [mealType, description] of Object.entries(
            mealTypes as Record<string, string>
          )) {
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
              nutritional_plan_id: id,
            })
          }
        }
      }
    }

    // Delete existing meal entries if new meals are provided
    if (body.meals) {
      await supabase.from('meal_entry').delete().eq('nutritional_plan_id', id)
    }

    // Update the plan
    const { data: updatedPlan, error: updateError } = await supabase
      .from('nutritional_plan')
      .update({
        name: body.name?.trim() ?? existingPlan.name,
        description:
          body.description !== undefined
            ? body.description?.trim() || null
            : existingPlan.description,
      })
      .eq('id', id)
      .select(
        `
        *,
        customer (*)
      `
      )
      .single()

    if (updateError) throw updateError

    // Insert new meal entries if any
    let mealEntries: MealEntry[] = []
    if (meals.length > 0) {
      const { data: insertedMeals, error: mealsError } = await supabase
        .from('meal_entry')
        .insert(meals)
        .select()

      if (mealsError) throw mealsError
      mealEntries = insertedMeals || []
    }

    return NextResponse.json<ApiResponse<NutritionalPlan>>({
      success: true,
      data: { ...updatedPlan, meal_entries: mealEntries },
    })
  } catch (error) {
    console.error('Error updating plan:', error)
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: 'Failed to update nutritional plan',
        code: 'DATABASE_ERROR',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/plans/[id] - Delete a nutritional plan
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient()
    const { id } = await params

    // Check if plan exists
    const { data: existingPlan, error: findError } = await supabase
      .from('nutritional_plan')
      .select('id')
      .eq('id', id)
      .single()

    if (findError || !existingPlan) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Nutritional plan not found',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      )
    }

    // Delete the plan (cascade will delete meal entries)
    const { error: deleteError } = await supabase.from('nutritional_plan').delete().eq('id', id)

    if (deleteError) throw deleteError

    return NextResponse.json<ApiResponse<null>>({
      success: true,
    })
  } catch (error) {
    console.error('Error deleting plan:', error)
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: 'Failed to delete nutritional plan',
        code: 'DATABASE_ERROR',
      },
      { status: 500 }
    )
  }
}
