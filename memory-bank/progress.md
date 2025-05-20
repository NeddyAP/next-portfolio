# Progress

## What Works
- **Core Website Structure:** Next.js application with components for Hero, About Me, Portfolio, Experience, Certificates, Contact.
- **Styling:** Tailwind CSS and Shadcn/ui integrated.
- **Data Display (All Dynamic Sections Migrated to Supabase):**
    - **About Me:** Data fetched from Supabase.
    - **Experience:** Data fetched from Supabase.
    - **Certificates:** Data fetched from Supabase.
    - **Portfolio:** Data fetched from Supabase.
    - Contact section still uses local data or is static.
- **Supabase Integration:**
    - Supabase client setup, environment variables, tables, migration script, RLS policies.
- **Authentication:**
    - Login/Logout UI and session management functional.
- **Admin Editing - "About Me" (CRUD Complete):**
    - Edit button, `EditAboutMeForm.tsx` in `Sheet`, API route for updates, file uploads via `/api/upload`.
- **Admin Editing - "Experience" (CRUD Complete):**
    - Add/Edit/Delete buttons, `EditExperienceForm.tsx` in `Sheet`, `Dialog` for delete, client-side Supabase CUD.
- **Admin Editing - "Portfolio" (CRUD Complete):**
    - Add/Edit/Delete buttons, `EditProjectForm.tsx` in `Sheet`, `Dialog` for delete, client-side Supabase CUD, image uploads via `/api/upload` (type 'project').
- **Admin Editing - "Certificates" (CRUD Complete):**
    - Add/Edit/Delete buttons in `Certificate.tsx`.
    - `EditCertificateForm.tsx` in `Sheet` for adding/editing certificates (handles image/PDF uploads via `/api/upload` with `type: 'certificate'`).
    - `Dialog` for delete confirmation.
    - Client-side Supabase CUD operations.
    - `Certificate.tsx` displays images or PDFs.
- **File Upload API (`/api/upload/route.ts`):**
    - Supports 'profile', 'resume', 'project', and 'certificate' types.
    - Handles file storage in distinct subdirectories.
    - Manages deletion of old files on update.
- **Navigation, Responsiveness, Theming, Memory Bank:** All functional and maintained.

## What's Left to Build / Enhance
- **Thorough Testing:**
    - Test all CRUD operations for "Certificates" section (login, add with image/PDF, edit with file change, save, delete, data refresh).
- **Address `@supabase/auth-helpers-nextjs` Deprecation:**
    - Plan and execute migration to `@supabase/ssr` for API routes (`/api/about-me`, `/api/upload`) for server-side auth.
- **Supabase Integration for Contact Section:**
    - Evaluate if dynamic functionality (storing messages) is needed. If so, implement.
- **Review and Refine:**
    - Overall admin experience.
    - Code consistency and potential improvements.
    - UI/UX polish.
- **Deployment Setup Review:**
    - Ensure Supabase environment variables and configurations are correctly set for deployment.
- **Memory Bank Refinement:** Continuously update.
- **Other Potential Enhancements (Post-CRUD):**
    - Blog section.
    - Animations/micro-interactions.
    - SEO improvements.

## Current Status
- **Phase:** Implementing Admin CRUD features.
- **Current Activity:** Completed CRUD for "Certificates" section. All main content sections now have CRUD.
- **Next Major Task:** Test "Certificates" CRUD. Then, address API route auth deprecation and consider Contact section integration.
- **Blockers:** None currently.

## Known Issues
- **`@supabase/auth-helpers-nextjs` Deprecation:** Affects `/api/about-me` and `/api/upload`. This is the next significant technical debt to address.
- **Migration Script Idempotency:** Low-priority cleanup for `scripts/migrateData.mjs`.
- **Schema Mismatches (General Risk):** Ongoing.

## Evolution of Project Decisions
- **Initial Decision (Implied):** Modern portfolio with Next.js, TypeScript, Tailwind, Shadcn/ui.
- **Memory Bank Decision:** Comprehensive documentation.
- **Enhancement Path Chosen:** Supabase backend migration.
- **Current Enhancement:** In-page visual editor (CRUD per section) with Supabase Auth.
    - UI Pattern: Edit buttons, `Sheet` for Create/Update, `Dialog` for Delete.
    - Mutation Handling:
        - "About Me": Next.js API Route (`/api/about-me`).
        - "Experience", "Portfolio", "Certificates": Client-side `supabaseBrowserClient` for CUD.
        - File Uploads: Centralized `/api/upload` route for all file types.
