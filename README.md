# Personal Portfolio Website

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), enhanced with Supabase for backend services and authentication. It serves as a personal portfolio to showcase skills, projects, and experiences.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Library:** [React](https://reactjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn/ui](https://ui.shadcn.com/)
- **Backend & Auth:** [Supabase](https://supabase.io/) (PostgreSQL Database, Authentication)
- **Linting:** ESLint
- **Package Manager:** npm
- **Fonts:** [Geist Sans and Geist Mono](https://vercel.com/font)

## Features

- **Dynamic Content:** Sections like "About Me", "Experience", "Portfolio", "Certificates", and "Contact" fetch data dynamically from Supabase.
- **Admin CRUD Operations:** Authenticated users can perform Create, Read, Update, and Delete operations on various sections:
    - About Me: Update functionality.
    - Skills, Tools, Hobbies: Full CRUD.
    - Experience: Full CRUD.
    - Projects: Full CRUD with image uploads.
    - Certificates: Full CRUD with image/PDF uploads.
- **File Management:**
    - Uploads for profile images, project images, resumes, and certificate files.
    - Centralized file handling via an API route (`/api/upload`).
    - Automatic deletion of old files upon update.
- **Authentication:**
    - User login/logout functionality using Supabase Auth.
    - Protected routes and actions for admin capabilities.
- **Responsive Design:** Adapts to various screen sizes.
- **Theming:** Supports dark and light modes.
- **Memory Bank:** Internal documentation system to track project progress and context.

## Getting Started

### Prerequisites

- Node.js (version recommended by Next.js)
- npm (or yarn/pnpm/bun)
- A Supabase project set up.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/neddyap/next-portfolio
    cd https://github.com/neddyap/next-portfolio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    # or
    # bun install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
    You can find these in your Supabase project settings.

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    # or
    # pnpm dev
    # or
    # bun dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Key Dependencies

- `@supabase/supabase-js`: For interacting with Supabase.
- `next`: The React framework for production.
- `react`, `react-dom`: For building user interfaces.
- `tailwindcss`: For utility-first CSS styling.
- `lucide-react`: For icons.

## Learn More

To learn more about the technologies used, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Supabase Documentation](https://supabase.com/docs) - learn about Supabase features and API.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about Tailwind CSS.
- [Shadcn/ui Documentation](https://ui.shadcn.com/docs) - learn about Shadcn/ui components.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
