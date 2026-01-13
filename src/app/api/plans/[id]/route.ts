import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DayOfWeek, MealType } from '@prisma/client'
import type { ApiResponse, NutritionalPlan, ApiError } from '@/lib/types'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/plans/[id] - Get a single nutritional plan
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const plan = await prisma.nutritionalPlan.findUnique({
      where: { id },
      include: {
        mealEntries: true,
        customer: true,
      },
    })

    if (!plan) {
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
    const { id } = await params
    const body = await request.json()

    // Check if plan exists
    const existingPlan = await prisma.nutritionalPlan.findUnique({
      where: { id },
      include: { mealEntries: true },
    })

    if (!existingPlan) {
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
    const meals: Array<{ dayOfWeek: DayOfWeek; mealType: MealType; mealDescription: string }> = []

    if (body.meals && typeof body.meals === 'object') {
      for (const [day, mealTypes] of Object.entries(body.meals)) {
        // Validate day of week
        if (!Object.values(DayOfWeek).includes(day as DayOfWeek)) {
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
            if (!Object.values(MealType).includes(mealType as MealType)) {
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
              dayOfWeek: day as DayOfWeek,
              mealType: mealType as MealType,
              mealDescription: description.trim(),
            })
          }
        }
      }
    }

    // Update plan in a transaction
    const updatedPlan = await prisma.$transaction(async (tx) => {
      // Delete existing meal entries if new meals are provided
      if (body.meals) {
        await tx.mealEntry.deleteMany({
          where: { nutritionalPlanId: id },
        })
      }

      // Update the plan
      return tx.nutritionalPlan.update({
        where: { id },
        data: {
          name: body.name?.trim() ?? existingPlan.name,
          description: body.description !== undefined 
            ? (body.description?.trim() || null) 
            : existingPlan.description,
          mealEntries: body.meals ? {
            create: meals,
          } : undefined,
        },
        include: {
          mealEntries: true,
          customer: true,
        },
      })
    })

    return NextResponse.json<ApiResponse<NutritionalPlan>>({
      success: true,
      data: updatedPlan,
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
    const { id } = await params

    // Check if plan exists
    const existingPlan = await prisma.nutritionalPlan.findUnique({
      where: { id },
    })

    if (!existingPlan) {
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
    await prisma.nutritionalPlan.delete({
      where: { id },
    })

    return NextResponse.json<ApiResponse<{ deleted: boolean }>>({
      success: true,
      data: { deleted: true },
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
