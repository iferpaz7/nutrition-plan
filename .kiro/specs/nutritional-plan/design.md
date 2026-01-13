# Design Document: Nutritional Plan CRUD System

## Overview

A full-stack web application built with Next.js 16, TypeScript, and Supabase for managing weekly nutritional plans for customers/patients. The system provides a complete CRUD interface with shadcn/ui components and a nutritional color palette, supporting customer management with physical data, BMI calculations, and health information.

## Architecture

### Technology Stack
- **Frontend**: Next.js 16.1.1 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: Supabase (PostgreSQL) with @supabase/ssr
- **UI Components**: shadcn/ui component library
- **Styling**: Tailwind CSS with nutritional color palette
- **Export**: SheetJS (xlsx) for Excel export functionality
- **Notifications**: Sonner for toast notifications

### Application Structure
```
nutritional-plan/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── plans/
│   │   │   │   ├── route.ts          # GET, POST /api/plans
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts      # GET, PUT, DELETE /api/plans/[id]
│   │   │   └── customers/
│   │   │       ├── route.ts          # GET (with search), POST /api/customers
│   │   │       └── [id]/
│   │   │           └── route.ts      # GET, PUT, DELETE /api/customers/[id]
│   │   ├── plans/
│   │   │   ├── page.tsx              # Plans list view
│   │   │   ├── new/
│   │   │   │   └── page.tsx          # Create plan (with customer selection)
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # View plan
│   │   │       └── edit/
│   │   │           └── page.tsx      # Edit plan form
│   │   ├── customers/
│   │   │   ├── page.tsx              # Customers list view
│   │   │   ├── new/
│   │   │   │   └── page.tsx          # Create customer
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # View customer with plans
│   │   │       ├── edit/
│   │   │       │   └── page.tsx      # Edit customer
│   │   │       └── plans/
│   │   │           └── new/
│   │   │               └── page.tsx  # Create plan for customer
│   │   ├── layout.tsx                # Root layout with Toaster
│   │   ├── page.tsx                  # Home page redirect
│   │   └── globals.css               # Global styles with color palette
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── sonner.tsx
│   │   ├── PlanGrid.tsx              # Weekly meal grid component
│   │   ├── PlanForm.tsx              # Plan creation/editing with customer search
│   │   ├── PlanCard.tsx              # Plan summary card
│   │   ├── CustomerForm.tsx          # Customer form with all fields
│   │   ├── CustomerCard.tsx          # Customer summary card
│   │   ├── ExportButton.tsx          # Excel export functionality
│   │   └── DeleteCustomerButton.tsx  # Delete with confirmation
│   ├── lib/
│   │   ├── types.ts                  # TypeScript type definitions
│   │   └── utils.ts                  # Utility functions (cn, getImcClassification)
│   └── utils/
│       └── supabase/
│           ├── client.ts             # Browser Supabase client
│           ├── server.ts             # Server Supabase client
│           └── middleware.ts         # Session update helper
├── middleware.ts                     # Next.js middleware for Supabase
├── supabase-schema.sql               # Complete database schema
└── public/                           # Static assets
```

### Design System & Color Palette

#### Nutritional Color Palette
The application uses a carefully selected color palette inspired by fresh, healthy foods:

```css
:root {
  /* Primary Colors - Fresh Greens */
  --primary: 142 76% 36%;          /* Fresh spinach green */
  --primary-foreground: 355 100% 97%;

  /* Secondary Colors - Vibrant Orange */
  --secondary: 25 95% 53%;         /* Carrot orange */
  --secondary-foreground: 210 40% 2%;

  /* Accent Colors - Berry Purple */
  --accent: 270 95% 75%;           /* Blueberry purple */
  --accent-foreground: 210 40% 2%;

  /* Neutral Colors - Natural Tones */
  --background: 36 39% 88%;        /* Warm cream */
  --foreground: 84 6% 10%;         /* Dark charcoal */
  
  /* Destructive Colors - Tomato Red */
  --destructive: 0 84% 60%;        /* Tomato red */
  --destructive-foreground: 355 100% 97%;
}
```

#### IMC Classification Colors
```typescript
// BMI color coding
< 18.5  → text-blue-500    (Bajo peso)
18.5-25 → text-green-500   (Normal)
25-30   → text-yellow-500  (Sobrepeso)
30-35   → text-orange-500  (Obesidad I)
35-40   → text-red-500     (Obesidad II)
≥ 40    → text-red-700     (Obesidad III)
```

## Components and Interfaces

### Database Schema (Supabase/PostgreSQL)

```sql
-- Enums
CREATE TYPE gender AS ENUM ('MASCULINO', 'FEMENINO', 'OTRO');
CREATE TYPE activity_level AS ENUM ('SEDENTARIO', 'LIGERO', 'MODERADO', 'ACTIVO', 'MUY_ACTIVO');
CREATE TYPE goal_type AS ENUM ('PERDER_PESO', 'MANTENER_PESO', 'GANAR_PESO', 'GANAR_MUSCULO', 'MEJORAR_SALUD');
CREATE TYPE plan_status AS ENUM ('BORRADOR', 'ACTIVO', 'PAUSADO', 'COMPLETADO', 'CANCELADO');
CREATE TYPE day_of_week AS ENUM ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO');
CREATE TYPE meal_type AS ENUM ('DESAYUNO', 'COLACION_1', 'ALMUERZO', 'COLACION_2', 'CENA');

-- Customer table
CREATE TABLE customer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Personal data (required: id_card, first_name, last_name)
  id_card TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  cell_phone TEXT,
  gender gender,
  birth_date DATE,
  
  -- Physical data
  age INTEGER,                    -- Auto-calculated from birth_date
  weight DECIMAL(5,2),            -- kg
  height DECIMAL(3,2),            -- meters
  imc DECIMAL(4,2),               -- Auto-calculated (weight/height²)
  body_fat_percentage DECIMAL(4,2),
  
  -- Nutritional info
  activity_level activity_level DEFAULT 'MODERADO',
  goal goal_type DEFAULT 'MANTENER_PESO',
  daily_calorie_target INTEGER,
  
  -- Medical info
  allergies TEXT,
  medical_conditions TEXT,
  medications TEXT,
  dietary_restrictions TEXT,
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Nutritional Plan table
CREATE TABLE nutritional_plan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status plan_status DEFAULT 'BORRADOR',
  start_date DATE,
  end_date DATE,
  
  -- Nutritional targets
  daily_calories INTEGER,
  protein_grams INTEGER,
  carbs_grams INTEGER,
  fat_grams INTEGER,
  fiber_grams INTEGER,
  water_liters DECIMAL(3,1),
  
  notes TEXT,
  customer_id UUID NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meal Entry table
CREATE TABLE meal_entry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week day_of_week NOT NULL,
  meal_type meal_type NOT NULL,
  meal_description TEXT NOT NULL,
  
  -- Nutritional info per meal (optional)
  calories INTEGER,
  protein_grams DECIMAL(5,1),
  carbs_grams DECIMAL(5,1),
  fat_grams DECIMAL(5,1),
  fiber_grams DECIMAL(5,1),
  portion_size TEXT,
  preparation_notes TEXT,
  
  nutritional_plan_id UUID NOT NULL REFERENCES nutritional_plan(id) ON DELETE CASCADE,
  UNIQUE(nutritional_plan_id, day_of_week, meal_type)
);

-- Triggers for auto-calculations
CREATE TRIGGER calculate_customer_imc
  BEFORE INSERT OR UPDATE OF weight, height ON customer
  FOR EACH ROW EXECUTE FUNCTION calculate_imc();

CREATE TRIGGER calculate_customer_age
  BEFORE INSERT OR UPDATE OF birth_date ON customer
  FOR EACH ROW EXECUTE FUNCTION calculate_age_from_birthdate();
```

### TypeScript Interfaces

```typescript
// Enums
export type Gender = 'MASCULINO' | 'FEMENINO' | 'OTRO';
export type ActivityLevel = 'SEDENTARIO' | 'LIGERO' | 'MODERADO' | 'ACTIVO' | 'MUY_ACTIVO';
export type GoalType = 'PERDER_PESO' | 'MANTENER_PESO' | 'GANAR_PESO' | 'GANAR_MUSCULO' | 'MEJORAR_SALUD';
export type PlanStatus = 'BORRADOR' | 'ACTIVO' | 'PAUSADO' | 'COMPLETADO' | 'CANCELADO';
export type DayOfWeek = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';
export type MealType = 'DESAYUNO' | 'COLACION_1' | 'ALMUERZO' | 'COLACION_2' | 'CENA';

// Customer interface
export interface Customer {
  id: string;
  id_card: string;
  first_name: string;
  last_name: string;
  email: string | null;
  cell_phone: string | null;
  gender: Gender | null;
  birth_date: string | null;
  age: number | null;
  weight: number | null;
  height: number | null;
  imc: number | null;
  body_fat_percentage: number | null;
  activity_level: ActivityLevel | null;
  goal: GoalType | null;
  daily_calorie_target: number | null;
  allergies: string | null;
  medical_conditions: string | null;
  medications: string | null;
  dietary_restrictions: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  nutritional_plans?: NutritionalPlan[];
}

// Nutritional Plan interface
export interface NutritionalPlan {
  id: string;
  name: string;
  description: string | null;
  status: PlanStatus;
  start_date: string | null;
  end_date: string | null;
  daily_calories: number | null;
  protein_grams: number | null;
  carbs_grams: number | null;
  fat_grams: number | null;
  fiber_grams: number | null;
  water_liters: number | null;
  notes: string | null;
  customer_id: string;
  customer?: Customer;
  meal_entries?: MealEntry[];
  created_at: string;
  updated_at: string;
}

// Meal Entry interface
export interface MealEntry {
  id: string;
  day_of_week: DayOfWeek;
  meal_type: MealType;
  meal_description: string;
  calories: number | null;
  protein_grams: number | null;
  carbs_grams: number | null;
  fat_grams: number | null;
  fiber_grams: number | null;
  portion_size: string | null;
  preparation_notes: string | null;
  nutritional_plan_id: string;
}

// Helper function
export function getImcClassification(imc: number | null): { label: string; color: string };
```

### API Endpoints

#### Customers
- `GET /api/customers` - List all customers (supports `?search=` query param)
- `POST /api/customers` - Create a new customer
- `GET /api/customers/[id]` - Get customer with their plans
- `PUT /api/customers/[id]` - Update customer
- `DELETE /api/customers/[id]` - Delete customer (cascades to plans)

#### Plans
- `GET /api/plans` - List all plans with customer info
- `POST /api/plans` - Create a new plan
- `GET /api/plans/[id]` - Get plan with meal entries
- `PUT /api/plans/[id]` - Update plan
- `DELETE /api/plans/[id]` - Delete plan (cascades to meal entries)

## Key Features

### 1. Customer Search & Inline Creation
When creating a plan, users can:
- Search existing customers by cédula, nombre, or apellido
- View search results in a dropdown
- Select a customer to assign the plan
- Create a new customer inline via dialog without leaving the page

### 2. Automatic Calculations
Database triggers automatically calculate:
- **IMC (BMI)**: `weight / (height * height)` - updated when weight or height changes
- **Age**: Calculated from birth_date - updated when birth_date changes

### 3. Medical Information Display
Customer detail page displays medical information with color-coded sections:
- 🔴 Allergies (red background)
- 🟡 Dietary Restrictions (yellow background)
- 🟣 Medical Conditions (purple background)
- 🔵 Medications (blue background)

### 4. Plan Status Management
Plans have a status lifecycle:
- `BORRADOR` (Draft) - Initial state
- `ACTIVO` (Active) - Currently in use
- `PAUSADO` (Paused) - Temporarily suspended
- `COMPLETADO` (Completed) - Successfully finished
- `CANCELADO` (Cancelled) - Abandoned

## Deployment

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Netlify Deployment
1. Connect GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables in Netlify dashboard
5. Configure Supabase URL in Authentication → URL Configuration
