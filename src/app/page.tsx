import Experience from "@/components/Experience";
import AboutMe from "@/components/AboutMe";
import Contact from "@/components/Contact";
import HeroSection from "@/components/HeroSection";
import Portfolio from "@/components/Portfolio";
import Certificate from "@/components/Certificate";
// Removed: import { supabase } from "@/lib/supabaseClient";
import { Database } from "@/types/supabase"; // Import Supabase types
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// Define a type for the fetched about_me data
type AboutMeData = Database["public"]["Tables"]["about_me"]["Row"];
// Define a type for the fetched experiences data
type ExperienceData = Database["public"]["Tables"]["experiences"]["Row"];
// Define a type for the fetched certificates data
type CertificateData = Database["public"]["Tables"]["certificates"]["Row"];
// Define a type for the fetched projects data
type ProjectsData = Database["public"]["Tables"]["projects"]["Row"];

// This is your main user ID, ensure it's correct
const MAIN_USER_ID = "78e2efe2-19a1-4050-9431-993c071eddae";

// Removed unused createSupabaseServerClientForPage function.

// Helper function to create a Supabase server client for page.tsx.
// This is used by the data fetching functions in this Server Component.
// Cookie modifications are disabled to prevent "Cookies can only be modified in a Server Action or Route Handler" errors
const getSupabaseServerClientForPage = async () => {
  const cookieStore = await cookies(); // Await here, as TS infers cookies() as Promise
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {
          // No-op: Cookie modifications are not allowed in Server Components
          // This prevents the "Cookies can only be modified in a Server Action or Route Handler" error
        },
        remove() {
          // No-op: Cookie modifications are not allowed in Server Components
          // This prevents the "Cookies can only be modified in a Server Action or Route Handler" error
        },
      },
    }
  );
};


async function getAboutMeData(): Promise<AboutMeData | null> {
  const supabase = await getSupabaseServerClientForPage(); // Await the helper
  const { data, error } = await supabase
    .from("about_me")
    .select("*")
    .eq("user_id", MAIN_USER_ID) // Fetch data for the specific user
    .single(); // Expecting only one row for the user

  if (error) {
    console.error("Error fetching about_me data:", error);
    return null;
  }
  return data;
}

async function getExperienceData(): Promise<ExperienceData[] | null> {
  const supabase = await getSupabaseServerClientForPage(); // Await the helper
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("user_id", MAIN_USER_ID);
  // Optionally, order by display_order or start_date here if not handled in component
  // .order("display_order", { ascending: true, nullsFirst: false })
  // .order("start_date", { ascending: false });

  if (error) {
    console.error("Error fetching experiences data:", error);
    return null;
  }
  return data;
}

async function getCertificateData(): Promise<CertificateData[] | null> {
  const supabase = await getSupabaseServerClientForPage(); // Await the helper
  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .eq("user_id", MAIN_USER_ID)
    .order("issue_date", { ascending: false }); // Optional: order by issue date

  if (error) {
    console.error("Error fetching certificates data:", error);
    return null;
  }
  return data;
}

async function getProjectsData(): Promise<ProjectsData[] | null> {
  const supabase = await getSupabaseServerClientForPage(); // Await the helper
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", MAIN_USER_ID)
    .order("display_order", { ascending: true, nullsFirst: false });

  if (error) {
    console.error("Error fetching projects data:", error);
    return null;
  }
  return data;
}

export default async function Home() {
	// Make the component async
	// Fetch data in parallel
	const [aboutMeData, experienceData, certificateData, projectsData] =
		await Promise.all([
			getAboutMeData(),
			getExperienceData(),
			getCertificateData(),
			getProjectsData(),
		]);

	return (
		<div className="relative min-h-screen">
			{/* Removed py-16 md:py-24, added pb-16 md:pb-24 */}
<div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-24 space-y-32 md:space-y-48 pb-16 md:pb-24 relative z-[1]">
<HeroSection aboutData={aboutMeData} />
<AboutMe aboutData={aboutMeData} />{" "}
{/* Pass fetched data as prop, removed onAboutMeUpdate */}
<Experience experienceData={experienceData} />{" "}
{/* Pass fetched data as prop */}
				<Certificate certificateData={certificateData} />{" "}
				{/* Pass fetched data as prop */}
				<Portfolio projectsData={projectsData || []} />{" "}
				{/* Pass fetched data as prop, ensure fallback to empty array */}
				<Contact aboutData={aboutMeData} />
			</div>
		</div>
	);
}
