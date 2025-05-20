"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, Download, LogOut } from "lucide-react"; // LogIn icon removed
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
// Dialog components are no longer needed here if login dialog is fully moved
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogDescription,
// } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
// LoginForm import removed
import { navItems, resumePath, siteConfig } from "@/data/navbarData";
import { supabaseBrowserClient } from "@/lib/supabaseClient";

export default function Navbar() {
  const { setTheme, theme } = useTheme();
  const { user, signOut, isLoading: authIsLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // isLoginDialogOpen state removed
  const [dynamicResumeUrl, setDynamicResumeUrl] = useState<string | null>(null);
  const [isLoadingResumeUrl, setIsLoadingResumeUrl] = useState(true);

  useEffect(() => {
    setMounted(true);

    const fetchResumeUrl = async () => {
      setIsLoadingResumeUrl(true);
      try {
        const { data, error } = await supabaseBrowserClient
          .from("about_me")
          .select("resume_url")
          .limit(1)
          .single();

        if (error) {
          console.error("Error fetching resume URL:", error);
          setDynamicResumeUrl(resumePath);
        } else if (data && data.resume_url) {
          setDynamicResumeUrl(data.resume_url);
        } else {
          setDynamicResumeUrl(resumePath);
        }
      } catch (e) {
        console.error("Exception fetching resume URL:", e);
        setDynamicResumeUrl(resumePath);
      } finally {
        setIsLoadingResumeUrl(false);
      }
    };

    fetchResumeUrl();

    const handleScrollEvent = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScrollEvent);
    handleScrollEvent();

    return () => window.removeEventListener("scroll", handleScrollEvent);
  }, []);

  const handleLinkScroll = (
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
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // useEffect for closing login dialog removed

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
          <div className="flex items-center space-x-2 sm:space-x-4 ml-auto">
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
              size="sm"
              disabled={isLoadingResumeUrl || !dynamicResumeUrl}
            >
              <Download className="mr-2 h-4 w-4" />
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

            {/* Auth Button: Only Logout button if user is logged in */}
            {!authIsLoading && (
              <>
                {user && (
                  <Button variant="ghost" size="icon" onClick={signOut} title="Logout">
                    <LogOut className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Logout</span>
                  </Button>
                )}
                {/* Login trigger and dialog removed from here */}
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
                className="bg-slate-900 bg-opacity-85 w-[250px] sm:w-[300px]"
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
                  {/* Auth buttons in mobile menu */}
                  {!authIsLoading && (
                    <>
                      {user && (
                        <Button variant="outline" onClick={signOut} className="w-full mt-2">
                          <LogOut className="mr-2 h-4 w-4" /> Logout
                        </Button>
                      )}
                      {/* Login button removed from mobile menu */}
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
