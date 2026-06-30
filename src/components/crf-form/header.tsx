"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun, PanelLeft, PanelRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CRFHeaderProps {
  sidebarPosition?: "left" | "right";
  onToggleSidebarPosition?: () => void;
  onToggleMobileMenu?: () => void;
}

export function CRFHeader({ sidebarPosition = "left", onToggleSidebarPosition, onToggleMobileMenu }: CRFHeaderProps) {
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
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left Side: Branding & Form Name */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onToggleMobileMenu && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleMobileMenu}
              className="h-9 w-9 rounded-lg lg:hidden cursor-pointer text-muted-foreground hover:text-foreground"
              title="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <img
            src={theme === "dark" ? "/logo-sphere.png" : "/logo.png"}
            alt="1Cell.Ai Logo"
            className="h-8 w-auto object-contain"
          />
          <span className="text-[10px] sm:text-xs font-bold tracking-wider text-muted-foreground uppercase select-none border-l border-border/80 pl-2.5 sm:pl-3 ml-0.5 sm:ml-1 hidden min-[360px]:inline-block">
            Case Report Form
          </span>
        </div>

        {/* Right Side: Controls (Packed Tight) */}
        <div className="flex items-center gap-1 sm:gap-1.5">
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
