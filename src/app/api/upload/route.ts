import { NextRequest, NextResponse } from "next/server";
import path from "path"; // Still useful for getting extension
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

// Local file system functions (ensureDirExists, writeFile, stat, unlink) are no longer needed for Vercel deployment.
// We will upload directly to Supabase Storage.

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Mime types remain relevant for client-side and initial validation
const ALLOWED_PROFILE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_RESUME_TYPES = ["application/pdf"];
const ALLOWED_PROJECT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_CERTIFICATE_FILE_TYPES = ["application/pdf"]; // PDF only for certificates

// Helper to get bucket name based on file type
function getBucketName(fileType: string): string | null {
  switch (fileType) {
    case "profile": return "profile-images";
    case "resume": return "resumes";
    case "project": return "project-images";
    case "certificate": return "certificate-files";
    default: return null;
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }); },
        remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: "", ...options }); },
      },
    }
  );

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    return NextResponse.json({ error: "Not authenticated", details: sessionError?.message }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const fileType = formData.get("type") as string | null;
    const currentFileUrl = formData.get("currentFileUrl") as string | null; // This will be a Supabase public URL

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const validFileTypes = ["profile", "resume", "project", "certificate"];
    if (!fileType || !validFileTypes.includes(fileType)) {
      return NextResponse.json({ error: `Invalid file type specified. Must be one of: ${validFileTypes.join(", ")}.` }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: `File size exceeds the limit of ${MAX_FILE_SIZE_MB}MB.` }, { status: 400 });
    }

    let allowedMimeTypes: string[] = [];
    let expectedTypeDescription = "";
    
    if (fileType === "profile") {
      allowedMimeTypes = ALLOWED_PROFILE_TYPES;
      expectedTypeDescription = "an image (JPEG, PNG, GIF, WebP)";
    } else if (fileType === "resume") {
      allowedMimeTypes = ALLOWED_RESUME_TYPES;
      expectedTypeDescription = "a PDF";
    } else if (fileType === "project") {
      allowedMimeTypes = ALLOWED_PROJECT_IMAGE_TYPES;
      expectedTypeDescription = "an image (JPEG, PNG, GIF, WebP)";
    } else if (fileType === "certificate") {
      allowedMimeTypes = ALLOWED_CERTIFICATE_FILE_TYPES;
      expectedTypeDescription = "a PDF file";
    }

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: `Invalid file format. Expected ${expectedTypeDescription}. Received ${file.type}` }, { status: 400 });
    }
    
    const bucketName = getBucketName(fileType);
    if (!bucketName) {
      return NextResponse.json({ error: "Internal server error: Invalid file type for bucket mapping." }, { status: 500 });
    }

    // Delete old file from Supabase Storage if currentFileUrl is provided
    if (currentFileUrl) {
      try {
        const oldFileUrlObject = new URL(currentFileUrl);
        const oldPathParts = oldFileUrlObject.pathname.split('/');
        // Path is like /storage/v1/object/public/bucket-name/file-path
        const oldBucketNameIndex = oldPathParts.indexOf(bucketName); 
        if (oldBucketNameIndex !== -1 && oldBucketNameIndex < oldPathParts.length -1) {
          const oldFilePathInBucket = oldPathParts.slice(oldBucketNameIndex + 1).join('/');
          if (oldFilePathInBucket) {
            console.log(`Attempting to delete old file from Supabase Storage: bucket='${bucketName}', path='${oldFilePathInBucket}'`);
            const { error: deleteError } = await supabase.storage.from(bucketName).remove([oldFilePathInBucket]);
            if (deleteError) {
              console.warn(`Supabase: Could not delete old file ${oldFilePathInBucket} from bucket ${bucketName}:`, deleteError.message);
            } else {
              console.log(`Supabase: Successfully deleted old file ${oldFilePathInBucket} from bucket ${bucketName}`);
            }
          }
        } else {
           console.warn(`Supabase: Could not parse old file path from URL: ${currentFileUrl} for bucket ${bucketName}`);
        }
      } catch (e) {
        console.warn(`Error processing old Supabase file URL for deletion: ${currentFileUrl}`, e);
      }
    }

    const extension = path.extname(file.name).toLowerCase();
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeUserId = session.user.id.replace(/[^a-zA-Z0-9-_]/g, "");
    // Store files in a folder structure like: {fileType}/{userId}/{filename} for better organization if desired
    // For simplicity here, just prefixing with fileType and userId:
    const filenameInBucket = `${fileType}/${safeUserId}/${fileType}-${safeUserId}-${uniqueSuffix}${extension}`;

    console.log(`Attempting to upload to Supabase Storage: bucket='${bucketName}', path='${filenameInBucket}'`);
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filenameInBucket, file, { cacheControl: '3600', upsert: false }); // upsert: false to avoid overwriting by mistake if path somehow collides

    if (uploadError) {
      console.error(`Supabase upload error to bucket ${bucketName}:`, uploadError);
      if (uploadError.message.toLowerCase().includes('bucket not found')) {
           return NextResponse.json({ error: `Supabase Storage error: Bucket '${bucketName}' not found. Please ensure it is created in your Supabase project.` }, { status: 500 });
      }
      throw new Error(`Supabase upload error: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filenameInBucket);
    if (!publicUrlData || !publicUrlData.publicUrl) {
      throw new Error('Could not get public URL for the uploaded file from Supabase Storage.');
    }
    
    console.log(`File uploaded successfully to Supabase Storage. URL: ${publicUrlData.publicUrl}`);
    return NextResponse.json(
      { message: "File uploaded successfully to Supabase Storage!", url: publicUrlData.publicUrl },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error("File upload API error:", error);
    let errorMessage = "Error uploading file.";
    if (error instanceof Error) {
      errorMessage = error.message || "An unexpected error occurred during file upload.";
    }
    return NextResponse.json({ error: "Error uploading file.", details: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  console.log("DELETE /api/upload (Supabase file deletion) reached with method:", request.method);
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }); },
        remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: "", ...options }); },
      },
    }
  );

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    return NextResponse.json({ error: "Not authenticated", details: sessionError?.message }, { status: 401 });
  }

  try {
    const { fileUrl, type } = await request.json(); // fileUrl is a Supabase public URL, type helps determine bucket

    if (!fileUrl || !type) {
      return NextResponse.json({ error: 'Missing fileUrl or type in request body' }, { status: 400 });
    }
    
    const bucketName = getBucketName(type);
    if (!bucketName) {
      return NextResponse.json({ error: `Invalid file type '${type}' for deletion.` }, { status: 400 });
    }

    const urlObject = new URL(fileUrl);
    const pathParts = urlObject.pathname.split('/');
    // Example Supabase URL: https://<project_ref>.supabase.co/storage/v1/object/public/<bucket-name>/<file-path-in-bucket>
    // We need to extract <file-path-in-bucket>
    const bucketNameIndex = pathParts.indexOf(bucketName);

    if (bucketNameIndex === -1 || bucketNameIndex >= pathParts.length - 1) {
      console.error("Could not extract file path from Supabase URL:", fileUrl, "Bucket name:", bucketName, "Path parts:", pathParts);
      return NextResponse.json({ error: 'Could not determine file path from URL to delete from Supabase Storage.' }, { status: 400 });
    }
    const filePathInBucket = pathParts.slice(bucketNameIndex + 1).join('/');

    if (!filePathInBucket) {
      return NextResponse.json({ error: 'Empty file path extracted from Supabase URL for deletion.' }, { status: 400 });
    }

    console.log(`Attempting to delete from Supabase Storage: bucket='${bucketName}', path='${filePathInBucket}'`);
    const { error: deleteError } = await supabase.storage.from(bucketName).remove([filePathInBucket]);

    if (deleteError) {
      console.error(`Supabase Storage: Could not delete file ${filePathInBucket} from bucket ${bucketName}:`, deleteError.message);
      // If file not found, it's effectively deleted from our perspective.
      if (deleteError.message.toLowerCase().includes('not found')) {
        return NextResponse.json({ message: 'File not found in Supabase Storage, considered deleted.' }, { status: 200 });
      }
      throw new Error(`Failed to delete file from Supabase Storage: ${deleteError.message}`);
    }
    
    console.log(`File deleted successfully from Supabase Storage: bucket='${bucketName}', path='${filePathInBucket}'`);
    return NextResponse.json({ message: 'File deleted successfully from Supabase Storage' }, { status: 200 });
  } catch (error: any) {
    console.error('DELETE /api/upload (Supabase file) error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete file from Supabase Storage.' }, { status: 500 });
  }
}
