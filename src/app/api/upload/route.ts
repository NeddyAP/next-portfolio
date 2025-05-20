import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, stat, unlink } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr"; // Keep for auth, not for storage ops

async function ensureDirExists(dirPath: string) {
  try {
    await stat(dirPath);
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "ENOENT"
    ) {
      await mkdir(dirPath, { recursive: true });
    } else {
      throw error;
    }
  }
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const ALLOWED_PROFILE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_RESUME_TYPES = ["application/pdf"];
const ALLOWED_PROJECT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_CERTIFICATE_FILE_TYPES = ["application/pdf"]; // PDF only for certificates

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient( // Used for session/auth only
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
    const currentFileUrl = formData.get("currentFileUrl") as string | null; // Expecting local path e.g., /uploads/type/file.ext

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
    let relativeUploadDir = "";

    if (fileType === "profile") {
      allowedMimeTypes = ALLOWED_PROFILE_TYPES;
      expectedTypeDescription = "an image (JPEG, PNG, GIF, WebP)";
      relativeUploadDir = "uploads/profile-images";
    } else if (fileType === "resume") {
      allowedMimeTypes = ALLOWED_RESUME_TYPES;
      expectedTypeDescription = "a PDF";
      relativeUploadDir = "uploads/resumes";
    } else if (fileType === "project") {
      allowedMimeTypes = ALLOWED_PROJECT_IMAGE_TYPES;
      expectedTypeDescription = "an image (JPEG, PNG, GIF, WebP)";
      relativeUploadDir = "uploads/project-images";
    } else if (fileType === "certificate") {
      allowedMimeTypes = ALLOWED_CERTIFICATE_FILE_TYPES;
      expectedTypeDescription = "a PDF file"; // Updated description
      relativeUploadDir = "uploads/certificate-files"; // Local path for certificates
    }

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: `Invalid file format. Expected ${expectedTypeDescription}. Received ${file.type}` }, { status: 400 });
    }
    
    if (!relativeUploadDir) {
        return NextResponse.json({ error: "Internal server error: Upload directory not configured for this file type." }, { status: 500 });
    }

    // ALL UPLOADS ARE LOCAL
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const extension = path.extname(file.name).toLowerCase();
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeUserId = session.user.id.replace(/[^a-zA-Z0-9-_]/g, "");
    const filename = `${fileType}-${safeUserId}-${uniqueSuffix}${extension}`;
    
    const uploadDir = path.join(process.cwd(), "public", relativeUploadDir);
    await ensureDirExists(uploadDir);
    const localFilePath = path.join(uploadDir, filename);

    // Delete old local file if currentFileUrl (local path) is provided
    if (currentFileUrl) {
      try {
        const oldFileLocalPath = path.join(process.cwd(), "public", currentFileUrl.startsWith("/") ? currentFileUrl.substring(1) : currentFileUrl);
        await stat(oldFileLocalPath); // Check if file exists
        await unlink(oldFileLocalPath);
        console.log(`Successfully deleted old local file: ${oldFileLocalPath}`);
      } catch (e: any) {
        if (e.code !== 'ENOENT') {
          console.warn(`Could not delete old local file ${currentFileUrl}:`, e.message);
        }
      }
    }

    await writeFile(localFilePath, buffer);
    const publicUrl = `/${relativeUploadDir}/${filename}`; // Local public URL

    return NextResponse.json(
      { message: "File uploaded successfully locally!", url: publicUrl },
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
  // This DELETE handler is for LOCAL FILES for ALL types
  console.log("DELETE /api/upload (local file deletion) reached with method:", request.method);
  const cookieStore = await cookies();
  const supabase = createServerClient( // Used for session/auth only
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
    const { fileUrl, type } = await request.json(); // fileUrl is a local path like /uploads/type/file.ext

    if (!fileUrl) { // Type might not be strictly necessary if fileUrl is a full local path
      return NextResponse.json({ error: 'Missing fileUrl in request body' }, { status: 400 });
    }
    
    // Construct the full local path to the file
    // Ensure fileUrl starts with a slash and is relative to 'public'
    const localPathToDelete = path.join(process.cwd(), "public", fileUrl.startsWith("/") ? fileUrl.substring(1) : fileUrl);

    console.log(`Attempting to delete local file: ${localPathToDelete} (type: ${type || 'N/A'})`);

    try {
      await stat(localPathToDelete); // Check if file exists
      await unlink(localPathToDelete);
      console.log(`Successfully deleted local file: ${localPathToDelete}`);
      return NextResponse.json({ message: 'File deleted successfully locally' }, { status: 200 });
    } catch (e: any) {
      if (e.code === 'ENOENT') {
        console.log(`Local file not found, considered deleted: ${localPathToDelete}`);
        return NextResponse.json({ message: 'File not found locally, considered deleted.' }, { status: 200 });
      }
      console.error(`Error deleting local file ${localPathToDelete}:`, e.message);
      throw new Error(`Failed to delete local file: ${e.message}`);
    }
  } catch (error: any) {
    console.error('DELETE /api/upload (local file) error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete local file.' }, { status: 500 });
  }
}
