# Active Context

## Current Work Focus
- Implementing Admin CRUD (Create, Read, Update, Delete) operations for portfolio sections.
- Completed "About Me", "Experience", and "Portfolio" section CRUD.
- Implemented CRUD for "Certificates" section.

## Recent Changes
- **Admin CRUD for "Certificates" Section:**
    - Created `src/components/EditCertificateForm.tsx` using `useState` for form field management.
        - Handles creating new certificates and updating existing ones.
        - Includes fields for title, issuing organization, issue date, credential ID, credential URL, certificate image/PDF upload, and display order.
        - File uploads (images/PDFs) are handled via a call to `/api/upload` with `type: 'certificate'`.
        - Communicates with Supabase via `supabaseBrowserClient` for insert/update operations.
    - Updated `src/app/api/upload/route.ts` to support `'certificate'` file type, allowing image and PDF uploads, and defining a storage path `uploads/certificate-files`.
    - Modified `src/components/Certificate.tsx`:
        - Integrated `EditCertificateForm` using a `Sheet` component for adding/editing certificates.
        - Added an "Add New Certificate" button (`<PlusCircle />`) visible to authenticated users.
        - Added "Edit" (`<Edit />`) and "Delete" (`<Trash2 />`) buttons to each certificate card (within the slider), visible to authenticated users.
        - Implemented a `Dialog` component for delete confirmation.
        - `handleAddNew`, `handleEdit`, `handleDeleteInitiate`, `handleDeleteConfirm`, and `handleSaveSuccess` functions manage the CRUD UI flow.
        - Data is refreshed using `router.refresh()` after save or delete.
        - Displays certificate files using `next/image` for images and `PDFViewer` for PDFs.
        - Sorted certificates by `display_order` then by `issue_date` (desc) and `title`.
        - Slider settings adjusted for single items (no infinite scroll/autoplay).
- **Admin CRUD for "Portfolio" Section (Completed):**
    - `EditProjectForm.tsx` and `Portfolio.tsx` provide full CRUD, including image uploads.
- **Admin CRUD for "Experience" Section (Completed):**
    - `EditExperienceForm.tsx` and `Experience.tsx` provide full CRUD.
- **Admin CRUD for "About Me" (Completed):**
    - `EditAboutMeForm.tsx` and `AboutMe.tsx` provide update functionality.

## Next Steps
- **Test "Certificates" Section CRUD:** Thoroughly test login, add (including image and PDF upload), edit (including file change), save, delete, and data refresh flow for the "Certificates" section.
- **Address Deprecation:** Plan to migrate from `@supabase/auth-helpers-nextjs` to `@supabase/ssr` for auth handling in API routes (`/api/about-me`, `/api/upload`).
- **Contact Section Supabase Integration:** Revisit if dynamic functionality is needed.
- **Review and Refine:** Once all CRUD is implemented and tested, review the overall admin experience and code for consistency and potential improvements.

## Active Decisions and Considerations
- **File Uploads:** The `/api/upload` endpoint now handles 'profile', 'resume', 'project', and 'certificate' types, storing them in distinct subdirectories within `public/uploads/`.
- **Displaying Certificate Files:** `Certificate.tsx` now conditionally renders an `<img>` tag (via `next/image`) or the `PDFViewer` based on the file extension of `certificate_image_url`.

## Important Patterns and Preferences (Reinforced)
- **Iterative CRUD Implementation:** Section by section.
- **Component-Based Editing:** Dedicated form components within `Sheet` components.
- **Client-Side Supabase Operations for CRUD:** Standard for CUD operations.
- **API Route for File Uploads:** Centralized handling.
- **Path Revalidation/Refresh:** `router.refresh()`.

## Learnings and Project Insights
- **Unified File Upload API:** The `/api/upload` route is proving flexible enough to handle various file types and associated logic (like deleting old files) for different sections by using a `type` parameter.
