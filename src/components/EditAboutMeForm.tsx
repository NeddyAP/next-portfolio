'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Database, Json } from '@/types/supabase';
import EditHobbiesForm, { type Hobby } from './EditHobbiesForm';
// Skillset and Tools forms are no longer managed here
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  // DialogFooter, // Not used directly for this sub-form
} from "@/components/ui/dialog";

type AboutMeRow = Database['public']['Tables']['about_me']['Row'];

interface EditAboutMeFormProps {
  currentData: AboutMeRow | null;
  onSave: () => void;
  onCancel: () => void; // To close the drawer/sheet
}

interface QuoteData {
  text: string;
  author: string;
}

export default function EditAboutMeForm({ currentData, onSave, onCancel }: EditAboutMeFormProps) {
  const [bio, setBio] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [quoteText, setQuoteText] = useState('');
  const [quoteAuthor, setQuoteAuthor] = useState('');
  const [hobbies, setHobbies] = useState<Hobby[] | null>(null);
  // Skillset and Tools state are no longer managed here

  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isHobbiesDialogOpen, setIsHobbiesDialogOpen] = useState(false);
  // Skillset and Tools dialog states are no longer managed here
  const { toast } = useToast();

  useEffect(() => {
    if (currentData) {
      setBio(currentData.bio || '');
      setContactEmail(currentData.contact_email || '');
      setGithubUrl(currentData.github_url || '');
      setLinkedinUrl(currentData.linkedin_url || '');
      setProfileImageUrl(currentData.profile_image_url || '');
      setProfileImageFile(null);
      setResumeUrl(currentData.resume_url || '');
      setResumeFile(null);
      
      const currentQuote = currentData.quote as unknown as QuoteData | null;
      setQuoteText(currentQuote?.text || '');
      setQuoteAuthor(currentQuote?.author || '');

      // Initialize hobbies
      if (currentData.hobbies && Array.isArray(currentData.hobbies)) {
        const validHobbies = currentData.hobbies.reduce((acc: Hobby[], h: unknown) => {
          if (typeof h === 'object' && h !== null && 'name' in h && typeof (h as { name: unknown }).name === 'string') {
            const hobbyCandidate: Hobby = { name: (h as { name: string }).name };
            if ('icon_name' in h && typeof (h as { icon_name: unknown }).icon_name === 'string') {
              hobbyCandidate.icon_name = (h as { icon_name: string }).icon_name;
            }
            acc.push(hobbyCandidate);
          }
          return acc;
        }, []);
        setHobbies(validHobbies);
      } else {
        setHobbies([]);
      }

      // Skillset and Tools initialization are no longer managed here
    }
  }, [currentData]);

  const handleFileUpload = async (file: File, type: 'profile' | 'resume') => {
    const setLoading = type === 'profile' ? setIsUploadingProfile : setIsUploadingResume;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    if (type === 'profile' && profileImageUrl) {
      formData.append('currentFileUrl', profileImageUrl);
    } else if (type === 'resume' && resumeUrl) {
      formData.append('currentFileUrl', resumeUrl);
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Important if your API route checks auth
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to upload ${type} file.`);
      }

      const result = await response.json();
      if (type === 'profile') {
        setProfileImageUrl(result.url);
        setProfileImageFile(null); // Clear the file input state after successful upload
      } else {
        setResumeUrl(result.url);
        setResumeFile(null); // Clear the file input state
      }
      toast({
        title: 'Upload Successful',
        description: `${type === 'profile' ? 'Profile image' : 'Resume'} uploaded. Save changes to persist.`,
      });
    } catch (error: unknown) {
      let errorMessage = `An error occurred while uploading the ${type} file.`;
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: 'Upload Error',
        description: errorMessage,
        variant: 'destructive',
      });
      // Optionally clear the file input if upload fails, or allow retry
      if (type === 'profile') setProfileImageFile(null);
      else setResumeFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'resume') => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'profile') {
        setProfileImageFile(file);
      } else {
        setResumeFile(file);
      }
      handleFileUpload(file, type);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Ensure currentData and its user_id are available
    if (!currentData?.user_id) {
        toast({
            title: 'Error',
            description: 'Cannot update: Missing User ID.',
            variant: 'destructive',
        });
        setIsLoading(false);
        return;
    }

    const updatedData: Partial<AboutMeRow> & { user_id: string } = {
      user_id: currentData.user_id, // user_id will be used to identify the record
      bio,
      contact_email: contactEmail,
      github_url: githubUrl,
      linkedin_url: linkedinUrl,
      profile_image_url: profileImageUrl,
      resume_url: resumeUrl,
      // Construct quote JSON, ensure it's null if both fields are empty, or an object otherwise
      quote: (quoteText.trim() || quoteAuthor.trim())
             ? { text: quoteText, author: quoteAuthor }
             : null,
      hobbies: hobbies as Json,
      // Skillset and Tools are no longer part of this form's submission
    };

    // Remove fields that are empty strings to avoid overwriting with empty if not intended
    // Or, ensure API handles empty strings as "do not update" vs "set to empty/null"
    // For simplicity here, we send them, and API can decide.
    // If a field should be explicitly set to null when empty, handle that here or in API.
    // Example: if (!githubUrl) updatedData.github_url = null; (if schema allows null)

    try {
      const response = await fetch('/api/about-me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
        credentials: 'include', // Ensure cookies are sent
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update About Me data');
      }

      toast({
        title: 'Success',
        description: 'About Me information updated successfully.',
      });
      onSave(); // Call onSave which should include closing the drawer and refreshing data
    } catch (error: unknown) {
      let errorMessage = 'An unexpected error occurred.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentData) {
    return <div className="p-4">Loading data...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself..."
          rows={5}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactEmail">Contact Email</Label>
        <Input
          id="contactEmail"
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          placeholder="your.email@example.com"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="githubUrl">GitHub URL</Label>
        <Input
          id="githubUrl"
          type="url"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="https://github.com/yourusername"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
        <Input
          id="linkedinUrl"
          type="url"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
          placeholder="https://linkedin.com/in/yourusername"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="profileImageFile">Profile Image</Label>
        <Input
          id="profileImageFile"
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, 'profile')}
          disabled={isLoading || isUploadingProfile}
        />
        {isUploadingProfile && <p className="text-sm text-muted-foreground">Uploading profile image...</p>}
        {profileImageUrl && !profileImageFile && (
          <p className="text-sm text-muted-foreground">Current image: <a href={profileImageUrl} target="_blank" rel="noopener noreferrer" className="underline">{profileImageUrl.split('/').pop()}</a></p>
        )}
         {profileImageFile && <p className="text-sm text-muted-foreground">Selected: {profileImageFile.name}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="resumeFile">Resume (PDF)</Label>
        <Input
          id="resumeFile"
          type="file"
          accept=".pdf"
          onChange={(e) => handleFileChange(e, 'resume')}
          disabled={isLoading || isUploadingResume}
        />
        {isUploadingResume && <p className="text-sm text-muted-foreground">Uploading resume...</p>}
        {resumeUrl && !resumeFile && (
          <p className="text-sm text-muted-foreground">Current resume: <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="underline">{resumeUrl.split('/').pop()}</a></p>
        )}
        {resumeFile && <p className="text-sm text-muted-foreground">Selected: {resumeFile.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="quoteText">Quote Text</Label>
        <Textarea
          id="quoteText"
          value={quoteText}
          onChange={(e) => setQuoteText(e.target.value)}
          placeholder="Your favorite quote..."
          rows={3}
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="quoteAuthor">Quote Author</Label>
        <Input
          id="quoteAuthor"
          type="text"
          value={quoteAuthor}
          onChange={(e) => setQuoteAuthor(e.target.value)}
          placeholder="Author of the quote"
          disabled={isLoading}
        />
      </div>

      {/* Hobbies Edit Section */}
      <div className="space-y-2">
        <Label>Hobbies</Label>
        <div className="flex items-center space-x-2">
          <div className="flex-grow p-2 border rounded-md min-h-[40px] bg-muted text-sm">
            {hobbies && hobbies.length > 0 ? hobbies.map(h => h.name).join(', ') : <span className="text-muted-foreground">No hobbies set</span>}
          </div>
          <Dialog open={isHobbiesDialogOpen} onOpenChange={setIsHobbiesDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" disabled={isLoading}>Edit Hobbies</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Hobbies</DialogTitle>
                <DialogDescription>
                  Add, remove, or update your hobbies. Click save when you&apos;re done.
                </DialogDescription>
              </DialogHeader>
              <EditHobbiesForm
                currentHobbies={hobbies}
                onSave={(updatedHobbies) => {
                  setHobbies(updatedHobbies);
                  setIsHobbiesDialogOpen(false);
                  toast({ title: "Hobbies Updated", description: "Hobbies list staged. Save main form to persist." });
                }}
                onCancel={() => setIsHobbiesDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Skillset and Tools edit sections removed from this form */}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
