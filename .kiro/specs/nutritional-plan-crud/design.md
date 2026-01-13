# Design Document: Nutritional Plan CRUD System

## Overview

A full-stack web application built with Next.js 16, TypeScript, Prisma ORM, and SQLite for managing weekly nutritional plans. The system provides a complete CRUD interface with shadcn/ui components and a beautiful nutritional color palette that maintains the visual aesthetics while improving usability and accessibility.

## Architecture

### Technology Stack
- **Frontend**: Next.js 16 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: SQLite with Prisma ORM
- **UI Components**: shadcn/ui component library
- **Styling**: Tailwind CSS with nutritional color palette
- **Export**: SheetJS (xlsx) for Excel export functionality

### Application Structure
```
nutritional-plan-crud/
├── app/
│   ├── api/
│   │   └── plans/
│   │       ├── route.ts          # GET, POST /api/plans
│   │       └── [id]/
│   │           └── route.ts      # GET, PUT, DELETE /api/plans/[id]
│   ├── plans/
│   │   ├── page.tsx              # Plans list view
│   │   ├── create/
│   │   │   └── page.tsx          # Create plan form
│   │   └── [id]/
│   │       ├── page.tsx          # View plan
│   │       └── edit/
│   │           └── page.tsx      # Edit plan form
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── toast.tsx
│   │   ├── PlanGrid.tsx          # Weekly meal grid component
│   │   ├── PlanForm.tsx          # Plan creation/editing form
│   │   ├── PlanCard.tsx          # Plan summary card
│   │   └── ExportButton.tsx      # Excel export functionality
│   ├── lib/
│   │   ├── prisma.ts             # Prisma client singleton
│   │   ├── types.ts              # TypeScript type definitions
│   │   └── utils.ts              # Utility functions (cn, etc.)
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page with plans overview
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Database seeding script
├── components.json               # shadcn/ui configuration
└── public/                       # Static assets
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
  
  /* Card & Surface Colors */
  --card: 36 46% 82%;        ht beige */
  --card-foreground: 84 6% 10%;
  
  /* Muted Colors - Soft Greens */
  --muted: 84 6% 86%;              /* Sage green */
  --muted-foreground: 84 6% 40%;
  
  /* Border & Input Colors */
  --border: 84 6% 80%;             /* Light sage */
  --input: 84 6% 80%;
  
  /* Destructive Colors - Tomato Red */
  --destructive: 0 84% 60%;        /* Tomato red */
  --destructive-foreground: 355 100% 97%;
}
```

#### shadcn/ui Integration
- **Components**: Pre-built, accessible components with consistent styling
- **Theming**: Custom nutritional color palette applied to all components
- **Accessibility**: WCAG 2.1 AA compliant color contrasts
- **Responsiveness**: Mobile-first responsive design patterns

## Components and Interfaces

### Database Schema (Prisma)

```prisma
model NutritionalPlan {
  id          String      @id @default(cuid())
  name        String
  description String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  mealEntries MealEntry[]
}

model MealEntry {
  id               String          @id @default(cuid())
  dayOfWeek        DayOfWeek
  mealType         MealType
  mealDescription  String
  nutritionalPlan  NutritionalPlan @relation(fields: [nutritionalPlanId], references: [id], onDelete: Cascade)
  nutritionalPlanId String
  
  @@unique([nutritionalPlanId, dayOfWeek, mealType])
}

enum DayOfWeek {
  LUNES
  MARTES
  MIERCOLES
  JUEVES
  VIERNES
  SABADO
  DOMINGO
}

enum MealType {
  DESAYUNO
  COLACION_1
  ALMUERZO
  COLACION_2
  MERIENDA
  CENA
}
```

### TypeScript Interfaces

```typescript
interface NutritionalPlan {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  mealEntries: MealEntry[];
}

interface MealEntry {
  id: string;
  dayOfWeek: DayOfWeek;
  mealType: MealType;
  mealDescription: string;
  nutritionalPlanId: string;
}

interface PlanFormData {
  name: string;
  description?: string;
  meals: Record<string, Record<string, string>>; // dayOfWeek -> mealType -> description
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### API Endpoints

#### GET /api/plans
- Returns all nutritional plans with basic metadata
- Response: `ApiResponse<NutritionalPlan[]>`

#### POST /api/plans
- Creates a new nutritional plan
- Body: `PlanFormData`
- Response: `ApiResponse<NutritionalPlan>`

#### GET /api/plans/[id]
- Returns a specific plan with all meal entries
- Response: `ApiResponse<NutritionalPlan>`

#### PUT /api/plans/[id]
- Updates an existing plan
- Body: `PlanFormData`
- Response: `ApiResponse<NutritionalPlan>`

#### DELETE /api/plans/[id]
- Deletes a plan and all associated meal entries
- Response: `ApiResponse<{ deleted: boolean }>`

### React Components

#### PlanGrid Component
```typescript
interface PlanGridProps {
  plan: NutritionalPlan;
  editable?: boolean;
  onMealChange?: (dayOfWeek: DayOfWeek, mealType: MealType, description: string) => void;
}
```
Renders the weekly meal grid with the same visual styling as the original HTML design.

#### PlanForm Component
```typescript
interface PlanFormProps {
  initialData?: Partial<PlanFormData>;
  onSubmit: (data: PlanFormData) => Promise<void>;
  isEditing?: boolean;
}
```
Handles plan creation and editing with form validation.

#### ExportButton Component
```typescript
interface ExportButtonProps {
  plan: NutritionalPlan;
  className?: string;
}
```
Generates and downloads Excel files using the SheetJS library.

## Data Models

### Meal Grid Structure
The application organizes meals in a 7x6 grid:
- **Rows**: 7 days of the week (Lunes to Domingo)
- **Columns**: 6 meal types (Desayuno, Colación, Almuerzo, Colación, Merienda, Cena)

### Data Flow
1. **Create**: Form data → API validation → Prisma transaction → Database
2. **Read**: Database → Prisma query → API response → React component
3. **Update**: Form data → API validation → Prisma update → Database
4. **Delete**: API request → Prisma cascade delete → Database cleanup

## Error Handling

### Database Errors
- Connection failures: Graceful degradation with user-friendly messages
- Constraint violations: Validation feedback for duplicate entries
- Transaction failures: Rollback with detailed error reporting

### API Error Responses
```typescript
interface ApiError {
  success: false;
  error: string;
  code?: 'VALIDATION_ERROR' | 'NOT_FOUND' | 'DATABASE_ERROR' | 'INTERNAL_ERROR';
}
```

### Client-Side Error Handling
- Form validation with real-time feedback
- Network error recovery with retry mechanisms
- Loading states and error boundaries for better UX

## Testing Strategy

The application will use a dual testing approach combining unit tests and property-based tests to ensure comprehensive coverage and correctness.

### Unit Testing
- **API Routes**: Test CRUD operations with mock data
- **Components**: Test rendering and user interactions with React Testing Library
- **Database Operations**: Test Prisma queries with test database
- **Form Validation**: Test input validation and error handling
- **Export Functionality**: Test Excel generation with sample data

### Property-Based Testing
Property-based tests will validate universal properties across all inputs using a JavaScript property testing library (fast-check). Each test will run a minimum of 100 iterations to ensure comprehensive coverage.

**Testing Library**: fast-check for JavaScript/TypeScript property-based testing
**Configuration**: Minimum 100 iterations per property test
**Tagging**: Each test tagged with format: **Feature: nutritional-plan-crud, Property {number}: {property_text}**

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Complete Plan Structure
*For any* nutritional plan created by the system, it should contain exactly 42 meal entries (7 days × 6 meal types) with unique day-meal type combinations
**Validates: Requirements 1.1**

### Property 2: Plan Metadata Persistence
*For any* plan created with name and description, retrieving the plan from the database should return the same name and description values
**Validates: Requirements 1.2, 1.3, 3.3, 3.4**

### Property 3: Meal Description Validation
*For any* meal entry creation or update attempt with empty or whitespace-only descriptions, the system should reject the operation and maintain the current state
**Validates: Requirements 1.4, 3.2**

### Property 4: Unique Plan Identifiers
*For any* set of nutritional plans created by the system, all plan IDs should be unique across the entire collection
**Validates: Requirements 1.5**

### Property 5: Complete Plan Display
*For any* nutritional plan retrieved from the database, the display should include all plan metadata and all 42 meal entries organized by day and meal type
**Validates: Requirements 2.1, 2.2, 2.3, 3.1**

### Property 6: Cascade Deletion Integrity
*For any* nutritional plan deleted from the system, both the plan and all associated meal entries should be completely removed from the database
**Validates: Requirements 4.2, 4.3**

### Property 7: Database Error Handling
*For any* database operation that fails, the system should handle the error gracefully and provide meaningful error messages without crashing
**Validates: Requirements 5.3, 5.5**

### Property 8: Referential Integrity
*For any* meal entry, it should always be associated with a valid nutritional plan, and orphaned meal entries should not exist in the database
**Validates: Requirements 5.4**

### Property 9: Export Completeness and Formatting
*For any* nutritional plan exported to Excel, the resulting file should contain all meal entries with proper formatting and structure matching the original design
**Validates: Requirements 7.1, 7.2, 7.3, 7.5**