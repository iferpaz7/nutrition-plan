# Implementation Plan: Nutritional Plan CRUD System

## Overview

Implementation of a complete CRUD system for managing weekly nutritional plans and customers using Next.js 16, TypeScript, Supabase, and shadcn/ui components with a nutritional color palette.

## Tasks

- [x] 1. Project Setup and Configuration
  - [x] Configure Next.js 16 with App Router
  - [x] Configure Tailwind CSS with nutritional color palette
  - [x] Set up shadcn/ui component library
  - [x] Install and configure Supabase client (@supabase/ssr, @supabase/supabase-js)
  - _Requirements: 6.1, 6.2, 7.1, 7.6_

- [x] 2. Database Schema and Supabase Setup
  - [x] 2.1 Create Supabase schema SQL file
    - Define customer, nutritional_plan, meal_entry tables
    - Set up enums for gender, activity_level, goal_type, plan_status, day_of_week, meal_type
    - Configure relationships and constraints with CASCADE delete
    - Create triggers for automatic IMC and age calculation
    - Enable Row Level Security (RLS)
    - _Requirements: 1.4, 1.5, 6.5, 6.6_

  - [x] 2.2 Create Supabase client utilities
    - Create server.ts for SSR client
    - Create client.ts for browser client
    - Create middleware.ts for session handling
    - _Requirements: 6.2_

  - [x] 2.3 Create TypeScript type definitions
    - Define all interfaces and enums
    - Create getImcClassification helper function
    - _Requirements: 1.8_

- [x] 3. Customer API Routes Implementation
  - [x] 3.1 Implement GET /api/customers endpoint
    - Support search query parameter
    - Include nutritional_plans relation
    - _Requirements: 1.9_

  - [x] 3.2 Implement POST /api/customers endpoint
    - Validate required fields (id_card, first_name, last_name)
    - Handle all optional fields
    - _Requirements: 1.1, 1.2, 1.3, 1.6, 1.7_

  - [x] 3.3 Implement GET /api/customers/[id] endpoint
    - Include nutritional_plans with meal_entries
    - _Requirements: 3.1_

  - [x] 3.4 Implement PUT /api/customers/[id] endpoint
    - Handle partial updates
    - _Requirements: 4.4_

  - [x] 3.5 Implement DELETE /api/customers/[id] endpoint
    - Cascade delete to plans
    - _Requirements: 5.5_

- [x] 4. Plans API Routes Implementation
  - [x] 4.1 Implement GET /api/plans endpoint
    - Include customer info
    - _Requirements: 3.1_

  - [x] 4.2 Implement POST /api/plans endpoint
    - Validate customer_id
    - Create plan with meal entries
    - _Requirements: 2.1, 2.3, 2.4, 2.7_

  - [x] 4.3 Implement GET /api/plans/[id] endpoint
    - Include customer and meal_entries
    - _Requirements: 3.2, 3.3_

  - [x] 4.4 Implement PUT /api/plans/[id] endpoint
    - Update plan and meal entries
    - _Requirements: 4.1, 4.3, 4.4_

  - [x] 4.5 Implement DELETE /api/plans/[id] endpoint
    - Cascade delete meal entries
    - _Requirements: 5.2_

- [x] 5. shadcn/ui Components Setup
  - [x] 5.1 Install base components
    - button, card, dialog, input, label, textarea, table
    - _Requirements: 7.6_

  - [x] 5.2 Create Select component
    - Native select with shadcn styling
    - _Requirements: 7.6_

  - [x] 5.3 Configure Sonner for toast notifications
    - _Requirements: 7.3_

- [x] 6. Core React Components Implementation
  - [x] 6.1 Create PlanGrid component
    - Build weekly meal grid with Table
    - Support view and edit modes
    - 7 days × 5 meal types
    - _Requirements: 3.2, 3.4, 7.2_

  - [x] 6.2 Create PlanForm component
    - Customer search with debounce
    - Inline customer creation dialog
    - Plan name, description fields
    - Integration with PlanGrid
    - _Requirements: 2.1, 2.2, 2.4_

  - [x] 6.3 Create PlanCard component
    - Plan summary with status badge
    - Customer name display
    - Action buttons
    - _Requirements: 3.3, 3.6_

  - [x] 6.4 Create CustomerForm component
    - Personal data section (required fields)
    - Physical data section (weight, height, body fat)
    - Objectives section (activity level, goal, calories)
    - Medical info section (allergies, conditions, medications, restrictions)
    - Notes section
    - _Requirements: 1.1, 1.2, 1.3, 1.6, 1.7_

  - [x] 6.5 Create CustomerCard component
    - Customer summary
    - Plans count
    - _Requirements: 3.1_

  - [x] 6.6 Create DeleteCustomerButton component
    - Confirmation dialog
    - _Requirements: 5.1, 5.4_

- [x] 7. Customer Page Components
  - [x] 7.1 Create customers list page
    - Display all customers with cards
    - _Requirements: 3.1_

  - [x] 7.2 Create customer creation page
    - Full CustomerForm
    - _Requirements: 1.1, 1.2, 1.3, 1.6, 1.7_

  - [x] 7.3 Create customer view page
    - Personal info section
    - Physical data with IMC classification
    - Objectives section
    - Medical info with color-coded cards
    - Notes section
    - List of customer's plans
    - _Requirements: 1.8, 3.1_

  - [x] 7.4 Create customer edit page
    - Pre-filled CustomerForm
    - _Requirements: 4.4_

- [x] 8. Plan Page Components
  - [x] 8.1 Create plans list page
    - Display all plans with customer info
    - _Requirements: 3.1_

  - [x] 8.2 Create plan creation page
    - Customer search and selection
    - Inline customer creation
    - _Requirements: 2.1, 2.2_

  - [x] 8.3 Create plan view page
    - Complete plan with meal grid
    - _Requirements: 3.2, 3.3, 3.4_

  - [x] 8.4 Create plan edit page
    - Pre-filled PlanForm
    - _Requirements: 4.1, 4.4_

  - [x] 8.5 Create customer-specific plan creation page
    - Create plan for specific customer
    - _Requirements: 2.1_

- [x] 9. Delete Functionality
  - [x] 9.1 Implement delete confirmation dialogs
    - For customers and plans
    - _Requirements: 5.1, 5.3, 5.4_

  - [x] 9.2 Implement cascade delete behavior
    - Customer → Plans → Meal Entries
    - _Requirements: 5.2, 5.5_

- [x] 10. Export Functionality
  - [x] 10.1 Create ExportButton component
    - Excel export using SheetJS
    - Maintain formatting
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 11. Supabase Integration
  - [x] 11.1 Create Next.js middleware
    - Session update on requests
    - _Requirements: 6.2_

  - [x] 11.2 Configure environment variables
    - NEXT_PUBLIC_SUPABASE_URL
    - NEXT_PUBLIC_SUPABASE_ANON_KEY
    - _Requirements: 6.1_

- [x] 12. Final Polish
  - [x] 12.1 TypeScript validation
    - No errors with npx tsc --noEmit
    - _Requirements: 7.1_

  - [x] 12.2 Responsive design verification
    - Mobile and desktop layouts
    - _Requirements: 7.4_

## Deployment Checklist

- [ ] 13. Production Deployment
  - [ ] 13.1 Execute supabase-schema.sql in Supabase SQL Editor
  - [ ] 13.2 Connect GitHub repo to Netlify
  - [ ] 13.3 Configure environment variables in Netlify
  - [ ] 13.4 Configure Supabase URL in Authentication settings
  - [ ] 13.5 Test production deployment
  - [ ] 13.6 Verify all CRUD operations work in production
