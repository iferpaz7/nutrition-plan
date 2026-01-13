import { render, screen } from '@testing-library/react'
import { PlanGrid, DAYS, MEAL_TYPES } from '@/components/PlanGrid'
import type { MealEntry } from '@/lib/types'

const mockMealEntries: MealEntry[] = [
  {
    id: '1',
    nutritional_plan_id: 'plan-1',
    day_of_week: 'LUNES',
    meal_type: 'DESAYUNO',
    meal_description: '2 huevos revueltos con espinacas',
    calories: 420,
    protein_grams: 22,
    carbs_grams: 28,
    fat_grams: 24,
    fiber_grams: 3,
    portion_size: null,
    preparation_notes: null,
  },
  {
    id: '2',
    nutritional_plan_id: 'plan-1',
    day_of_week: 'LUNES',
    meal_type: 'ALMUERZO',
    meal_description: 'Pechuga de pollo a la plancha',
    calories: 520,
    protein_grams: 45,
    carbs_grams: 48,
    fat_grams: 14,
    fiber_grams: 5,
    portion_size: null,
    preparation_notes: null,
  },
  {
    id: '3',
    nutritional_plan_id: 'plan-1',
    day_of_week: 'MARTES',
    meal_type: 'DESAYUNO',
    meal_description: 'Avena con plátano',
    calories: 380,
    protein_grams: 12,
    carbs_grams: 58,
    fat_grams: 14,
    fiber_grams: 6,
    portion_size: null,
    preparation_notes: null,
  },
]

describe('PlanGrid', () => {
  it('renders all days of the week', () => {
    render(<PlanGrid meals={[]} />)
    
    DAYS.forEach(day => {
      expect(screen.getByText(day.label)).toBeInTheDocument()
    })
  })

  it('renders all meal types in header', () => {
    render(<PlanGrid meals={[]} />)
    
    MEAL_TYPES.forEach(mealType => {
      // Some labels may appear multiple times, use getAllByText
      const elements = screen.getAllByText(mealType.label)
      expect(elements.length).toBeGreaterThan(0)
    })
  })

  it('renders meal descriptions correctly', () => {
    render(<PlanGrid meals={mockMealEntries} />)
    
    expect(screen.getByText('2 huevos revueltos con espinacas')).toBeInTheDocument()
    expect(screen.getByText('Pechuga de pollo a la plancha')).toBeInTheDocument()
    expect(screen.getByText('Avena con plátano')).toBeInTheDocument()
  })

  it('shows placeholder for empty cells', () => {
    render(<PlanGrid meals={[]} />)
    
    // Empty cells should show "-"
    const placeholders = screen.getAllByText('-')
    expect(placeholders.length).toBeGreaterThan(0)
  })

  it('renders correctly with empty meals array', () => {
    render(<PlanGrid meals={[]} />)
    
    expect(screen.getByText('Lunes')).toBeInTheDocument()
    expect(screen.getByText('Desayuno')).toBeInTheDocument()
  })

  it('renders table structure correctly', () => {
    render(<PlanGrid meals={mockMealEntries} />)
    
    // Check table header exists
    expect(screen.getByText('Día')).toBeInTheDocument()
  })

  it('applies correct number of rows for all days', () => {
    render(<PlanGrid meals={[]} />)
    
    // 7 days of the week
    expect(screen.getByText('Lunes')).toBeInTheDocument()
    expect(screen.getByText('Martes')).toBeInTheDocument()
    expect(screen.getByText('Miércoles')).toBeInTheDocument()
    expect(screen.getByText('Jueves')).toBeInTheDocument()
    expect(screen.getByText('Viernes')).toBeInTheDocument()
    expect(screen.getByText('Sábado')).toBeInTheDocument()
    expect(screen.getByText('Domingo')).toBeInTheDocument()
  })
})

describe('DAYS constant', () => {
  it('contains all 7 days', () => {
    expect(DAYS).toHaveLength(7)
  })

  it('has correct day keys', () => {
    const dayKeys = DAYS.map(d => d.key)
    expect(dayKeys).toContain('LUNES')
    expect(dayKeys).toContain('MARTES')
    expect(dayKeys).toContain('MIERCOLES')
    expect(dayKeys).toContain('JUEVES')
    expect(dayKeys).toContain('VIERNES')
    expect(dayKeys).toContain('SABADO')
    expect(dayKeys).toContain('DOMINGO')
  })
})

describe('MEAL_TYPES constant', () => {
  it('contains all 5 meal types', () => {
    expect(MEAL_TYPES).toHaveLength(5)
  })

  it('has correct meal type keys', () => {
    const mealKeys = MEAL_TYPES.map(m => m.key)
    expect(mealKeys).toContain('DESAYUNO')
    expect(mealKeys).toContain('COLACION_1')
    expect(mealKeys).toContain('ALMUERZO')
    expect(mealKeys).toContain('COLACION_2')
    expect(mealKeys).toContain('CENA')
  })
})
