import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DayOfWeek, MealType } from '@prisma/client'
import type { ApiResponse, NutritionalPlan, ApiError } from '@/lib/types'

// GET /api/plans - List all nutritional plans
export async function GET() {
  try {
    const plans = await prisma.nutritionalPlan.findMany({
      include: {
        mealEntries: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json<ApiResponse<NutritionalPlan[]>>({
      success: true,
      data: plans,
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
    const body = await request.json()

    // Validate required fields
    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: 'Plan name is required',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      )
    }

    // Validate meals if provided
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

    // Create the plan with meal entries
    const plan = await prisma.nutritionalPlan.create({
      data: {
        name: body.name.trim(),
        description: body.description?.trim() || null,
        mealEntries: {
          create: meals,
        },
      },
      include: {
        mealEntries: true,
      },
    })

    return NextResponse.json<ApiResponse<NutritionalPlan>>(
      {
        success: true,
        data: plan,
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
