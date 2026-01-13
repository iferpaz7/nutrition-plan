# Implementation Plan: Nutritional Plan CRUD System

## Overview

Implementation of a complete CRUD system for managing weekly nutritional plans using Next.js 15, TypeScript, Prisma ORM, SQLite, and shadcn/ui components with a beautiful nutritional color palette.

## Tasks

- [-] 1. Project Setup and Configuration
  - Initialize Next.js 15 project with TypeScript and App Router
  - Configure Tailwind CSS with nutritional color palette
  - Set up shadcn/ui component library
  - Install and configure Prisma with SQLite
  - _Requirements: 5.1, 5.2, 6.1_

- [ ] 2. Database Schema and Models
  - [ ] 2.1 Create Prisma schema for nutritional plans and meal entries
    - Define NutritionalPlan and MealEntry models
    - Set up enums for DayOfWeek and MealType
    - Configure relationships and constraints
    - _Requirements: 1.1, 1.5, 5.4_

  - [ ]* 2.2 Write property test for complete plan structure
    - **Property 1: Complete Plan Structure**
    - **Validates: Requirements 1.1**

  - [ ] 2.3 Initialize database and run migrations
    - Generate Prisma client
    - Create database file and apply schema
    - _Requirements: 5.2_

  - [ ]* 2.4 Write property test for unique plan identifiers
    - **Property 4: Unique Plan Identifiers**
    - **Validates: Requirements 1.5**

- [ ] 3. Core API Routes Implementation
  - [ ] 3.1 Implement GET /api/plans endpoint
    - Create route handler for listing all plans
    - Include error handling and validation
    - _Requirements: 2.1_

  - [ ] 3.2 Implement POST /api/plans endpoint
    - Create route handler for plan creation
    - Validate input data and meal descriptions
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ]* 3.3 Write property test for plan metadata persistence
    - **Property 2: Plan Metadata Persistence**
    - **Validates: Requirements 1.2, 1.3, 3.3, 3.4**

  - [ ]* 3.4 Write property test for meal description validation
    - **Property 3: Meal Description Validation**
    - **Validates: Requirements 1.4, 3.2**

  - [ ] 3.5 Implement GET /api/plans/[id] endpoint
    - Create route handler for single plan retrieval
    - Include meal entries in response
    - _Requirements: 2.2, 2.3, 3.1_

  - [ ] 3.6 Implement PUT /api/plans/[id] endpoint
    - Create route handler for plan updates
    - Validate updates and maintain data integrity
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ] 3.7 Implement DELETE /api/plans/[id] endpoint
    - Create route handler for plan deletion
    - Ensure cascade deletion of meal entries
    - _Requirements: 4.2_

  - [ ]* 3.8 Write property test for cascade deletion integrity
    - **Property 6: Cascade Deletion Integrity**
    - **Validates: Requirements 4.2, 4.3**

- [ ] 4. Checkpoint - API Testing
  - Ensure all API routes work correctly, ask the user if questions arise.

- [ ] 5. shadcn/ui Components Setup
  - [ ] 5.1 Install and configure shadcn/ui base components
    - Set up button, card, input, table, dialog, toast components
    - Apply nutritional color palette theme
    - _Requirements: 6.1, 6.2_

  - [ ] 5.2 Create utility functions and type definitions
    - Set up cn utility function for class merging
    - Define TypeScript interfaces for components
    - _Requirements: 6.1_

- [ ] 6. Core React Components Implementation
  - [ ] 6.1 Create PlanGrid component
    - Build weekly meal grid with shadcn/ui Table
    - Support both view and edit modes
    - Apply nutritional color styling
    - _Requirements: 2.2, 2.4, 6.2_

  - [ ] 6.2 Create PlanForm component
    - Build form for plan creation and editing
    - Include validation and error handling
    - Use shadcn/ui form components
    - _Requirements: 1.2, 3.4, 6.3_

  - [ ] 6.3 Create PlanCard component
    - Build plan summary cards for list view
    - Include metadata display and action buttons
    - _Requirements: 2.3, 6.2_

  - [ ]* 6.4 Write property test for complete plan display
    - **Property 5: Complete Plan Display**
    - **Validates: Requirements 2.1, 2.2, 2.3, 3.1**

- [ ] 7. Page Components Implementation
  - [ ] 7.1 Create home page with plans overview
    - Display list of all nutritional plans
    - Handle empty state when no plans exist
    - _Requirements: 2.1, 2.5_

  - [ ] 7.2 Create plan creation page
    - Implement form for new plan creation
    - Handle form submission and navigation
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ] 7.3 Create plan view page
    - Display complete plan with meal grid
    - Include navigation and action buttons
    - _Requirements: 2.2, 2.3, 2.4_

  - [ ] 7.4 Create plan edit page
    - Load existing plan data for editing
    - Handle updates and form validation
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 8. Delete Functionality and Confirmation
  - [ ] 8.1 Implement delete confirmation dialog
    - Create confirmation modal using shadcn/ui Dialog
    - Handle delete operations with proper feedback
    - _Requirements: 4.1, 4.3, 4.4_

  - [ ]* 8.2 Write unit test for deletion error handling
    - Test error scenarios and user feedback
    - _Requirements: 4.5_

- [ ] 9. Export Functionality
  - [ ] 9.1 Create ExportButton component
    - Implement Excel export using SheetJS
    - Maintain original formatting and styling
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ]* 9.2 Write property test for export completeness
    - **Property 9: Export Completeness and Formatting**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.5**

- [ ] 10. Error Handling and Database Operations
  - [ ] 10.1 Implement comprehensive error handling
    - Add error boundaries and toast notifications
    - Handle database connection issues gracefully
    - _Requirements: 5.3, 5.5_

  - [ ]* 10.2 Write property test for database error handling
    - **Property 7: Database Error Handling**
    - **Validates: Requirements 5.3, 5.5**

  - [ ]* 10.3 Write property test for referential integrity
    - **Property 8: Referential Integrity**
    - **Validates: Requirements 5.4**

- [ ] 11. Integration and Final Testing
  - [ ] 11.1 Wire all components together
    - Connect API routes with React components
    - Ensure proper data flow and state management
    - _Requirements: All requirements_

  - [ ]* 11.2 Write integration tests for end-to-end flows
    - Test complete CRUD workflows
    - Verify component interactions
    - _Requirements: All requirements_

- [ ] 12. Final Checkpoint - Complete System Testing
  - Ensure all tests pass and system works end-to-end, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties using fast-check library
- Unit tests validate specific examples and edge cases
- All components use shadcn/ui with nutritional color palette for consistent styling