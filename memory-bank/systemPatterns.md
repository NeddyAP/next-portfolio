# System Patterns

## System Architecture
- **Frontend Framework:** Next.js (React framework)
- **Styling:** Tailwind CSS for utility-first CSS.
- **UI Components:** Shadcn/ui for pre-built, accessible components.
- **Deployment:** Vercel (assumed, common for Next.js projects).
- **Version Control:** Git (assumed, standard practice).

## Key Technical Decisions
- **Component-Based Architecture:** UI built with React components, extending to custom editor UI.
- **Dynamic Data Rendering:** Content fetched dynamically from Supabase (PostgreSQL) via Next.js API routes.
- **TypeScript:** For static typing.
- **Data Management (New - Supabase):**
    - Portfolio content and user profiles stored in Supabase (PostgreSQL).
    - Supabase client library (`@supabase/supabase-js`) used for database interactions within API routes.
- **Authentication (New - Supabase Auth):**
    - Username/password authentication handled by Supabase Auth.
    - Next.js API routes will interface with Supabase Auth for login/signup/logout.

## Design Patterns in Use
- **Provider Pattern:** `ThemeProvider`. An `AuthProvider` (likely using React Context) will manage Supabase auth state and user sessions.
- **Container/Presentational Components:** For editor UI.
- **Modular Styling:** Tailwind CSS.
- **API Route Handlers:** For backend logic, interacting with Supabase.
- **Service Layer (Potential):** A dedicated service layer for Supabase interactions might be created to keep API routes cleaner (e.g., `src/services/supabaseService.ts`).

## Component Relationships
- `src/app/layout.tsx`: Root layout, will include `AuthProvider`.
- `src/app/page.tsx`: Main page, fetches data dynamically, includes edit triggers.
- **New Editing Components:**
    - `LoginModal.tsx` (or similar) for Supabase Auth.
    - `EditDrawer.tsx`.
    - Form components (e.g., `ProjectForm.tsx`).
- Sectional Components (`AboutMe.tsx`, etc.): Fetch data from Supabase, show "edit" buttons based on auth state.
- UI Components (`src/components/ui/`): Used in editor forms and drawers.

## Critical Implementation Paths
- **Supabase Setup & Integration:** Configuring Supabase project, client, environment variables.
- **Database Schema Design:** Defining tables and relationships in Supabase.
- **Authentication Flow (Supabase Auth):**
    - Signup, login, logout using Supabase client and Next.js API routes.
    - Session management (Supabase handles much of this).
    - Protecting API routes and client-side edit UIs.
- **Data Flow for Editing (CRUD with Supabase):**
    - Fetching data into forms.
    - Submitting form data to API routes that call Supabase.
    - UI updates post-save.
- **Database Interaction (Supabase Client):** Using `@supabase/supabase-js` for all database operations.
- **Navigation and Routing:** Next.js App Router.
- **Theming:** `ThemeProvider`.
- **Responsiveness:** Tailwind CSS.
