"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun, PanelLeft, PanelRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CRFHeaderProps {
  sidebarPosition?: "left" | "right";
  onToggleSidebarPosition?: () => void;
}

export function CRFHeader({ sidebarPosition = "left", onToggleSidebarPosition }: CRFHeaderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Initialize theme from document on mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("crf_theme", newTheme);
  };

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("crf_theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6 relative">
        {/* Left Side: Branding */}
        <div className="flex items-center gap-4">
          <img
            src={theme === "dark" ? "/logo-sphere.png" : "/logo.png"}
            alt="1Cell.Ai Logo"
            className="h-10 w-auto object-contain"
          />
        </div>

        {/* Center Title */}
        <h1 className="absolute left-1/2 -translate-x-1/2 text-sm font-bold tracking-widest text-foreground/80 uppercase select-none">
          Case Report Form
        </h1>

        {/* Right Side: Controls */}
        <div className="flex items-center gap-1.5">
          {/* Sidebar Position Toggle */}
          {onToggleSidebarPosition && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebarPosition}
              className="h-9 w-9 rounded-lg cursor-pointer text-muted-foreground hover:text-foreground"
              title={sidebarPosition === "left" ? "Move sidebar to right" : "Move sidebar to left"}
            >
              {sidebarPosition === "left" ? (
                <PanelRight className="h-4 w-4" />
              ) : (
                <PanelLeft className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-lg cursor-pointer text-muted-foreground hover:text-foreground"
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
