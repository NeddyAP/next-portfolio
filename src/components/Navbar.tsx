"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, Download, LogIn, LogOut } from "lucide-react"; // Added LogIn, LogOut
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  // DialogFooter, // Removed as it's unused
} from "@/components/ui/dialog"; // Added Dialog components
import { useAuth } from "@/contexts/AuthContext"; // Added useAuth
import { LoginForm } from "@/components/LoginForm"; // Added LoginForm
import { navItems, resumePath, siteConfig } from "@/data/navbarData"; // resumePath will be replaced by dynamic one
import { supabaseBrowserClient } from "@/lib/supabaseClient"; // Import Supabase client

export default function Navbar() {
  const { setTheme, theme } = useTheme();
  const { user, signOut, isLoading: authIsLoading } = useAuth(); // Get user and signOut from AuthContext
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false); // State for login dialog
  const [dynamicResumeUrl, setDynamicResumeUrl] = useState<string | null>(null);
  const [isLoadingResumeUrl, setIsLoadingResumeUrl] = useState(true);

  useEffect(() => {
    setMounted(true);

    const fetchResumeUrl = async () => {
      setIsLoadingResumeUrl(true);
      try {
        // Assuming there's one 'about_me' entry or we take the first one.
        // Adjust if a specific user's resume is needed and user context is available for query.
        const { data, error } = await supabaseBrowserClient
          .from("about_me")
          .select("resume_url")
          .limit(1) // Fetches the first record
          .single(); // Assumes a single record or you want the first one

        if (error) {
          console.error("Error fetching resume URL:", error);
          setDynamicResumeUrl(resumePath); // Fallback to static path on error
        } else if (data && data.resume_url) {
          setDynamicResumeUrl(data.resume_url);
        } else {
          setDynamicResumeUrl(resumePath); // Fallback if no URL found
        }
      } catch (e) {
        console.error("Exception fetching resume URL:", e);
        setDynamicResumeUrl(resumePath); // Fallback
      } finally {
        setIsLoadingResumeUrl(false);
      }
    };

    fetchResumeUrl();

    const handleScrollEvent = () => { // Renamed to avoid conflict with function name
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScrollEvent);
    handleScrollEvent(); // Initial check

    return () => window.removeEventListener("scroll", handleScrollEvent);
  }, []);

  const handleLinkScroll = ( // Renamed to avoid conflict with state setter
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    element?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    // Close sheet if open (assuming Sheet closes on link click)
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Close dialog when login is successful (user object becomes available)
  useEffect(() => {
    if (user && isLoginDialogOpen) {
      setIsLoginDialogOpen(false);
    }
  }, [user, isLoginDialogOpen]);

  return (
    <nav
      className={`
        sticky top-0 z-50 w-full transition-all duration-300 ease-in-out 
        ${
          scrolled
            ? "bg-background/80 backdrop-blur-lg shadow-lg"
            : "bg-background/30 backdrop-blur-md shadow-md"
        }
      `}
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold hover:text-primary transition-colors"
          >
            {siteConfig.name}
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-4 ml-auto"> {/* Adjusted spacing for smaller screens */}
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleLinkScroll(e, item.href)}
                  className="relative text-sm font-medium transition-colors hover:text-primary after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <Button
              onClick={() => {
                if (dynamicResumeUrl) {
                  window.open(dynamicResumeUrl, "_blank");
                }
              }}
              className="hidden md:flex"
              size="sm" // Adjusted size
              disabled={isLoadingResumeUrl || !dynamicResumeUrl}
            >
              <Download className="mr-2 h-4 w-4" /> {/* Added margin */}
              {isLoadingResumeUrl ? "Loading..." : "Resume"}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-transparent"
              title="Toggle theme"
            >
              {mounted && (
                <>
                  {theme === "light" ? (
                    <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
                  ) : (
                    <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
                  )}
                </>
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Auth Button / Dialog */}
            {!authIsLoading && (
              <>
                {user ? (
                  <Button variant="ghost" size="icon" onClick={signOut} title="Logout">
                    <LogOut className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Logout</span>
                  </Button>
                ) : (
                  <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" title="Login">
                        <LogIn className="h-[1.2rem] w-[1.2rem]" />
                        <span className="sr-only">Login</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Admin Login</DialogTitle>
                        <DialogDescription>
                          Enter your credentials to access the editing features.
                        </DialogDescription>
                      </DialogHeader>
                      <LoginForm />
                    </DialogContent>
                  </Dialog>
                )}
              </>
            )}

            {/* Mobile Menu Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  title="Open menu"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-slate-900 bg-opacity-85 w-[250px] sm:w-[300px]" // Adjusted width
              >
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={(e) => {
                        handleLinkScroll(e, item.href);
                        // Consider closing the sheet here: find a way to get Sheet's setOpen if needed
                      }}
                      className="text-sm font-medium transition-all hover:text-primary hover:translate-x-2"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Button
                    onClick={() => {
                      if (dynamicResumeUrl) {
                        window.open(dynamicResumeUrl, "_blank");
                      }
                    }}
                    className="w-full mt-4"
                    disabled={isLoadingResumeUrl || !dynamicResumeUrl}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isLoadingResumeUrl ? "Loading..." : "Resume"}
                  </Button>
                  {!authIsLoading && (
                    <>
                      {user ? (
                        <Button variant="outline" onClick={signOut} className="w-full mt-2">
                          <LogOut className="mr-2 h-4 w-4" /> Logout
                        </Button>
                      ) : (
                        // For mobile, trigger the same dialog.
                        // To embed LoginForm directly in Sheet, you'd pass setIsLoginDialogOpen(false) to LoginForm
                        // and LoginForm would call it on successful login.
                        // Or, simply use the DialogTrigger as done for desktop.
                        <Button
                          variant="outline"
                          onClick={() => setIsLoginDialogOpen(true)}
                          className="w-full mt-2"
                        >
                          <LogIn className="mr-2 h-4 w-4" /> Login
                        </Button>
                      )}
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
