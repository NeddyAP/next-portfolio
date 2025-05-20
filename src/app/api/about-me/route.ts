import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers'; // Removed ReadonlyRequestCookies import
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { Database } from '@/types/supabase';

export async function PUT(request: Request) {
  const cookieStore = await cookies(); // Ensure await is used, as per previous TS error fixes

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: CookieOptions) {
          // Use .delete() as RequestCookies has .delete() not .remove()
          // The options might need to be adapted if Supabase's CookieOptions
          // doesn't directly map to Next.js's delete options.
          // For now, let's assume options are compatible or delete can take them.
          // Next.js `delete` can take just `name` or `name, options` or an object.
          // Supabase `CookieOptions` includes path, domain, maxAge, etc.
          // These are compatible with Next.js `cookie.set` options.
          // For `delete`, Next.js `cookies().delete(name, { path, domain... })` is common.
          // The `delete` method can take a name string or an options object.
          // To use path/domain from Supabase options, we need to pass an object.
          cookieStore.delete({
            name,
            path: options.path,
            domain: options.domain,
            secure: options.secure,
            httpOnly: options.httpOnly,
            sameSite: options.sameSite as 'lax' | 'strict' | 'none' | undefined,
          });
        },
      },
    }
  );

  // Check if user is authenticated
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('API about-me: Supabase getSession error:', sessionError);
    return NextResponse.json({ message: 'Error fetching session: ' + sessionError.message }, { status: 500 });
  }
  
  console.log('API about-me: Fetched session:', session ? { userId: session.user.id, authenticated: true } : 'No session');

  if (!session) {
    console.log('API about-me: No active session, returning 401 Unauthorized.');
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const requestBody = await request.json();
    const { 
      user_id, 
      bio, 
      contact_email,
      github_url,
      linkedin_url,
      profile_image_url,
      resume_url,
      quote,
      hobbies, // Add hobbies here
      skillset, // Add skillset here
      tools // Add tools here
    } = requestBody;
    
    console.log('API about-me: Request body:', requestBody);
    console.log('API about-me: Authenticated user ID from session:', session.user.id);
    console.log('API about-me: User ID from request body:', user_id);

    // Validate that the user_id from the request body matches the authenticated user's ID
    if (user_id !== session.user.id) {
      console.log('API about-me: User ID mismatch. Session User ID:', session.user.id, 'Request User ID:', user_id);
      return NextResponse.json({ message: 'Forbidden: User ID mismatch' }, { status: 403 });
    }

    // Prepare only the fields that are meant to be updated by this form
    const updateData: Partial<Database['public']['Tables']['about_me']['Row']> = {};
    if (bio !== undefined) updateData.bio = bio;
    if (contact_email !== undefined) updateData.contact_email = contact_email;
    if (github_url !== undefined) updateData.github_url = github_url;
    if (linkedin_url !== undefined) updateData.linkedin_url = linkedin_url;
    if (profile_image_url !== undefined) updateData.profile_image_url = profile_image_url;
    if (resume_url !== undefined) updateData.resume_url = resume_url;
    if (quote !== undefined) updateData.quote = quote;
    if (hobbies !== undefined) updateData.hobbies = hobbies;
    if (skillset !== undefined) updateData.skillset = skillset; // Add skillset to updateData
    if (tools !== undefined) updateData.tools = tools; // Add tools to updateData

    if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ message: 'No data provided for update' }, { status: 400 });
    }
    
    const { data, error } = await supabase
      .from('about_me')
      .update(updateData)
      .eq('user_id', user_id); // Ensure we update the record for the correct user

    if (error) {
      console.error('Supabase error updating about_me:', error);
      return NextResponse.json({ message: error.message || 'Failed to update data' }, { status: 500 });
    }

    // Revalidate the path to refresh data on the client side
    revalidatePath('/'); // Revalidate the home page
    // If you have more specific pages or use tags, revalidate them accordingly.
    // e.g., revalidateTag('about_me_data');

    return NextResponse.json({ message: 'About Me data updated successfully', data }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error processing PUT request for about_me:', error);
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
