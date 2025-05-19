# Active Context

## Current Work Focus
- Continuing Supabase integration for remaining portfolio sections.
- Next section for consideration: Contact (if dynamic).

## Recent Changes
- **Portfolio Component Integration with Supabase:**
    - Verified `projects` table schema in `src/types/supabase.ts` against local data structure (`src/data/portfolioData.ts`).
    - Updated `scripts/migrateData.mjs`:
        - Modified `migrateProjects` function to correctly map local project data to Supabase schema (including `image_url`, `project_link`, `source_code_link`, `display_order`).
        - Implemented `upsert` with a fallback to `insert` for `projects` data, improving idempotency and error handling for missing unique constraints.
    - Successfully ran the migration script (`node scripts/migrateData.mjs`), populating the `projects` table.
    - Refactored `src/components/Portfolio.tsx` to:
        - Accept `projectsData` (typed via Supabase types) as a prop.
        - Remove direct import of local data.
        - Map over `projectsData` using correct field names (`image_url`, `project_link`, `source_code_link`).
        - Handle cases where `project_link` or `source_code_link` might be null.
    - Updated `src/app/page.tsx` to:
        - Define `ProjectsData` type and `getProjectsData` async function.
        - Fetch project data from Supabase in parallel with other data.
        - Pass fetched `projectsData` to the `Portfolio` component.
    - Row Level Security (RLS) policy for public read access on `projects` table confirmed to be in place (user confirmed existing policy "Enable READ access for anonymous users").
- **Certificate Component Integration with Supabase (Previous):**
    - Defined and created the `certificates` table in Supabase.
    - Resolved column name mismatches.
    - Updated `scripts/migrateData.mjs` for certificates.
    - Successfully ran the migration script for certificates.
    - Refactored `src/components/Certificate.tsx`.
    - Updated `src/app/page.tsx` for certificates.
    - Updated RLS policy on the `certificates` table.
- **`iconMap.tsx` Update (Previous):**
    - Added `LuGraduationCap`, `LuBriefcase`, `MdWorkOutline` icons.
    - Corrected import names.
- **Previous (Auth related - on hold):**
    - Created `LoginForm` component.
    - Added `Label` and `Dialog` components.
    - Updated `Navbar.tsx` for login/logout.

## Next Steps
- **Address other sections for Supabase integration (Contact, etc.)**
    - Determine if the Contact section needs to be dynamic (e.g., storing messages in Supabase).
    - If so, define schema, update migration script, refactor component, and update `page.tsx`.
- **Revisit Authentication and Editing UI:**
    - User to test the login/logout functionality.
    - If auth works, proceed to design and implement in-page editing UI (drawers, forms).

## Active Decisions and Considerations
- **Data Source:** Migrating all dynamic content from local TypeScript files to Supabase.
- **RLS Policies:** Publicly viewable data (like certificates, projects, experiences, about me) requires RLS policies allowing read access for anonymous users (e.g., `USING (true)`).
- **Authentication:** Username/password authentication via Supabase Auth is planned for content editing features (currently on hold for UI implementation).

## Important Patterns and Preferences (Emerging)
- **Documentation First:** Maintaining the Memory Bank is crucial.
- **Iterative Integration:** Migrating sections to Supabase one by one.
- **Schema Consistency:** Ensuring Supabase table column names, TypeScript types (`src/types/supabase.ts`), and migration scripts (`scripts/migrateData.mjs`) are perfectly aligned to avoid "column not found" errors.
- **Server-Side Data Fetching:** Using async Server Components in Next.js (`src/app/page.tsx`) to fetch data from Supabase.

## Learnings and Project Insights
- **RLS is Key:** Row Level Security policies are critical for controlling data access in Supabase. Anonymous access for public data needs explicit `SELECT ... USING (true)` policies.
- **Schema Cache/Mismatch:** Supabase client errors like "Could not find the 'column_name' column ... in the schema cache" are often due to discrepancies between the actual database schema and the client's/script's expectation of column names. Careful verification of SQL, types, and migration scripts is necessary.
- **Migration Script Idempotency:** The migration script now uses `upsert` for `about_me` and `projects` (with fallback to `insert` for projects if `upsert` constraint fails). `experiences` and `certificates` still use `insert`, which may cause errors if re-run without clearing data or implementing `upsert`.
- The project is a Next.js portfolio website utilizing Tailwind CSS and Shadcn/ui.
- The project has a well-defined component structure.
