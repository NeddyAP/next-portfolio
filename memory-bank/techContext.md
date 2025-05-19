# Tech Context

## Technologies Used
- **Programming Language:** TypeScript
- **Framework:** Next.js
- **UI Library:** React
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **Linting:** ESLint
- **Package Manager:** npm
- **Fonts:** Geist Sans and Geist Mono
- **Database & Auth (New):** Supabase (PostgreSQL database and Authentication services).
    - Client Library: `@supabase/supabase-js`.

## Development Setup
- **IDE:** Visual Studio Code
- **Local Development Server:** `npm run dev`
- **Build Process:** `npm run build`
- **Dependencies:** Managed via `package.json`. `@supabase/supabase-js` will be a key new dependency.
- **Environment Variables (New):** `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` will be required.

## Technical Constraints
- **Browser Compatibility:** Modern browsers.
- **Performance:** Dynamic data fetching from Supabase. Caching and efficient querying will be important.
- **Accessibility:** WCAG guidelines for editor UI.
- **Security (Leveraging Supabase):**
    - Supabase Auth handles secure user credential management.
    - Row Level Security (RLS) in Supabase should be configured for data access control.
    - API routes in Next.js must correctly handle user sessions and permissions when interacting with Supabase.

## Dependencies
- **Core:** `next`, `react`, `react-dom`
- **Styling:** `tailwindcss`, `postcss`, `autoprefixer`
- **UI (Shadcn/ui related):** `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`
- **New Key Dependency:**
    - `@supabase/supabase-js`: For interacting with Supabase database and auth.
- **Form Handling (Optional but Recommended):** `react-hook-form` or `formik` for editor forms.
- **Other existing potential dependencies:** State management, animation, date formatting.

## Tool Usage Patterns
- **Component Creation:** New React components for drawers, forms, login modal.
- **Styling:** Tailwind CSS.
- **Data Handling (Supabase):**
    - All portfolio content and user data managed via API routes interacting with Supabase using `@supabase/supabase-js`.
    - Supabase dashboard used for schema definition, table creation, and RLS policies.
- **API Route Development (Next.js):** For auth (login/signup/logout via Supabase) and CRUD operations.
- **Type Definitions:** Expanded for Supabase table structures and API payloads.
- **Utility Functions:** For Supabase client setup, auth helpers.
