# Requirements Document

## Introduction

A complete CRUD (Create, Read, Update, Delete) system for managing weekly nutritional plans for clients/patients. The system allows nutritionists to create, edit, and manage meal plans for each day of the week across different meal types, with full customer management including physical data, health information, and BMI calculations. Data is persisted using Supabase (PostgreSQL).

## Glossary

- **Customer**: A client/patient with personal, physical, and medical information
- **Nutritional_Plan**: A complete weekly meal plan containing meals for all days and meal types, assigned to a customer
- **Meal_Entry**: A specific meal item for a particular day and meal type
- **Meal_Type**: Categories of meals (Desayuno, Colación 1, Almuerzo, Colación 2, Cena)
- **Day_Of_Week**: Days from Monday to Sunday (Lunes to Domingo)
- **IMC**: Índice de Masa Corporal (Body Mass Index) - calculated automatically
- **Supabase**: Cloud PostgreSQL database with real-time capabilities

## Requirements

### Requirement 1: Customer Management

**User Story:** As a nutritionist, I want to manage customer profiles, so that I can track their information and create personalized meal plans.

#### Acceptance Criteria

1. WHEN creating a customer, THE System SHALL require cédula (ID card), nombre, and apellido
2. WHEN creating a customer, THE System SHALL optionally accept email, teléfono, género, and fecha de nacimiento
3. WHEN creating a customer, THE System SHALL optionally accept physical data: peso, altura, % grasa corporal
4. WHEN weight and height are provided, THE System SHALL calculate IMC automatically using database triggers
5. WHEN birth date is provided, THE System SHALL calculate age automatically using database triggers
6. WHEN creating a customer, THE System SHALL optionally accept activity level and goal (perder peso, mantener, ganar, etc.)
7. WHEN creating a customer, THE System SHALL optionally accept medical info: alergias, condiciones médicas, medicamentos, restricciones dietéticas
8. THE System SHALL display IMC classification (bajo peso, normal, sobrepeso, obesidad I/II/III) with color coding
9. THE System SHALL allow searching customers by cédula, nombre, or apellido

### Requirement 2: Create Nutritional Plans

**User Story:** As a nutritionist, I want to create weekly meal plans for customers, so that I can organize complete nutritional programs.

#### Acceptance Criteria

1. WHEN creating a plan, THE System SHALL require selecting or creating a customer
2. WHEN creating a plan, THE System SHALL allow inline customer creation without leaving the page
3. WHEN a user creates a new nutritional plan, THE System SHALL generate a plan with all 7 days and 5 meal types
4. WHEN creating a plan, THE System SHALL allow setting a plan name, description, and status
5. WHEN creating a plan, THE System SHALL optionally accept nutritional targets: daily calories, proteins, carbs, fats, fiber, water
6. WHEN creating a plan, THE System SHALL optionally accept start and end dates
7. WHEN a plan is created, THE System SHALL persist it to the Supabase database immediately
8. THE System SHALL assign unique UUIDs to each nutritional plan

### Requirement 3: Read and Display Nutritional Plans

**User Story:** As a user, I want to view existing nutritional plans, so that I can review and select meal plans to use or modify.

#### Acceptance Criteria

1. WHEN a user requests to view plans, THE System SHALL display all saved nutritional plans with customer info
2. WHEN displaying a plan, THE System SHALL show the complete weekly grid with all meal types
3. WHEN viewing plans, THE System SHALL display plan metadata (name, description, status, dates, targets)
4. THE System SHALL format the display in a clear weekly calendar layout
5. WHEN no plans exist, THE System SHALL display an appropriate empty state message
6. THE System SHALL show plan status with color coding (borrador, activo, pausado, completado, cancelado)

### Requirement 4: Update Nutritional Plans

**User Story:** As a nutritionist, I want to modify existing meal plans, so that I can adjust nutritional programs based on client needs.

#### Acceptance Criteria

1. WHEN a user selects a plan to edit, THE System SHALL load all current meal entries for modification
2. WHEN updating meal entries, THE System SHALL validate input and prevent empty meal descriptions
3. WHEN changes are made, THE System SHALL persist updates to the Supabase database immediately
4. WHEN editing plan metadata, THE System SHALL allow updating name, description, status, dates, and targets
5. THE System SHALL maintain data integrity during update operations

### Requirement 5: Delete Nutritional Plans

**User Story:** As a user, I want to delete outdated meal plans, so that I can keep my plan library organized and current.

#### Acceptance Criteria

1. WHEN a user requests to delete a plan, THE System SHALL prompt for confirmation
2. WHEN deletion is confirmed, THE System SHALL remove the plan and all associated meal entries from the database
3. WHEN a plan is deleted, THE System SHALL update the display to reflect the removal
4. THE System SHALL prevent accidental deletions through confirmation dialogs
5. WHEN deleting a customer, THE System SHALL cascade delete all associated plans

### Requirement 6: Data Persistence with Supabase

**User Story:** As a system administrator, I want reliable cloud data storage, so that nutritional plans are preserved and accessible from anywhere.

#### Acceptance Criteria

1. THE System SHALL use Supabase (PostgreSQL) for all data persistence operations
2. THE System SHALL use @supabase/ssr for server-side rendering compatibility
3. WHEN performing CRUD operations, THE System SHALL handle database errors gracefully
4. THE System SHALL maintain referential integrity between customers, plans, and meal entries
5. THE System SHALL use Row Level Security (RLS) policies for data protection
6. THE System SHALL use database triggers for automatic calculations (IMC, age)

### Requirement 7: Web Interface with Modern Framework

**User Story:** As a user, I want an intuitive web interface, so that I can easily manage nutritional plans through a browser.

#### Acceptance Criteria

1. THE System SHALL provide a responsive web interface using Next.js 16 App Router
2. WHEN displaying the meal grid, THE System SHALL maintain the visual layout from the original design
3. WHEN performing CRUD operations, THE System SHALL provide immediate visual feedback with toast notifications
4. THE System SHALL support both desktop and mobile device interactions
5. WHEN loading data, THE System SHALL display appropriate loading states
6. THE System SHALL use shadcn/ui components with nutritional color palette

### Requirement 8: Export Functionality

**User Story:** As a nutritionist, I want to export meal plans, so that I can share them with clients or use them offline.

#### Acceptance Criteria

1. WHEN a user requests export, THE System SHALL generate an Excel file with the meal plan
2. WHEN exporting, THE System SHALL maintain the original formatting and styling
3. THE System SHALL include all meal entries in the exported file
4. WHEN export is complete, THE System SHALL trigger automatic file download
5. THE System SHALL handle export errors gracefully and inform users of any issues
