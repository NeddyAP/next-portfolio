import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase'; // Assuming Database types are needed

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_URL");
}
if (!supabaseAnonKey) {
  throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

// Renaming to supabaseBrowserClient or similar could be an option if a generic client is needed elsewhere,
// but for client-side auth components, this should be the one.
// If page.tsx (server component) uses this for data fetching, it will break.
// page.tsx should initialize its own server client.
// For now, let's assume this client is primarily for AuthContext and client components.
// Renamed to avoid confusion with server-side clients.
export const supabaseBrowserClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
