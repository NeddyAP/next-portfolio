"use client"; // Required for useState, useEffect, useAuth

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { socialLinks, footerConfig } from "@/data/footerData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginForm } from "@/components/LoginForm";
import { useAuth } from "@/contexts/AuthContext";

export default function Footer() {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const { user, isLoading: authIsLoading } = useAuth();

  // Close dialog when login is successful
  useEffect(() => {
    if (user && isLoginDialogOpen) {
      setIsLoginDialogOpen(false);
    }
  }, [user, isLoginDialogOpen]);

  // Prevent dialog from opening if user is already logged in or auth is loading
  const handleTriggerClick = (e: React.MouseEvent) => {
    if (user || authIsLoading) {
      e.preventDefault(); // Prevent dialog from opening
      // Optionally, you could navigate to an admin dashboard or do nothing
    } else {
      setIsLoginDialogOpen(true);
    }
  };

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className=" items-center justify-center gap-4 md:h-24 flex-col flex">
          <div className="flex items-center space-x-1">
            {" "}
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Button
                  key={link.name}
                  variant="ghost"
                  size="icon"
                  asChild
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.name}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">
                      {link.name}
                    </span>
                  </a>
                </Button>
              );
            })}
          </div>
          <p className="text-center text-sm leading-loose text-muted-foreground">
            {new Date().getFullYear()}{" "}
            <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
              <DialogTrigger asChild>
                <button
                  onClick={handleTriggerClick}
                  className="hover:underline focus:outline-none focus:ring-1 focus:ring-ring rounded-sm px-0.5" // Basic styling for clickable text
                  aria-label="Admin Login"
                  title={user ? "Logged in" : "Admin Login"} // Dynamic title
                  disabled={authIsLoading} // Disable if auth is loading
                >
                  {footerConfig.copyrightName}
                </button>
              </DialogTrigger>
              {!user && !authIsLoading && ( // Only render content if not logged in and auth not loading
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Admin Login</DialogTitle>
                    <DialogDescription>
                      Enter your credentials to access the editing features.
                    </DialogDescription>
                  </DialogHeader>
                  <LoginForm />
                </DialogContent>
              )}
            </Dialog>
            ©️. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
