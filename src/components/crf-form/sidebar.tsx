"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, Plus, FileSignature, ClipboardCheck } from "lucide-react";
import { gsap } from "gsap";

interface SidebarProps {
  activeStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
  position?: "left" | "right";
}

interface StepItem {
  id: number;
  title: string;
  isSignOff?: boolean;
  isReview?: boolean;
}

const STEPS: StepItem[] = [
  { id: 1, title: "Demographics" },
  { id: 2, title: "Disease History" },
  { id: 3, title: "Treatment Administered" },
  { id: 4, title: "Inclusion Criteria" },
  { id: 5, title: "Exclusion Criteria" },
  { id: 6, title: "Disease Progression" },
  { id: 7, title: "Survival Status" },
  { id: 8, title: "BreastRS Outcome" },
  { id: 9, title: "Investigator Declaration", isSignOff: true },
  { id: 10, title: "Final Review", isReview: true },
];

export function CRFSidebar({ activeStep, completedSteps, onStepClick, position = "left" }: SidebarProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const isFirstRender = useRef(true);

  // Animate highlight to active step
  useEffect(() => {
    const list = listRef.current;
    const highlight = highlightRef.current;
    const activeButton = stepRefs.current.get(activeStep);

    if (!list || !highlight || !activeButton) return;

    const listRect = list.getBoundingClientRect();
    const btnRect = activeButton.getBoundingClientRect();

    const targetY = btnRect.top - listRect.top;
    const targetHeight = btnRect.height;

    if (isFirstRender.current) {
      // Instant position on first render (no animation)
      gsap.set(highlight, {
        y: targetY,
        height: targetHeight,
        opacity: 1,
      });
      isFirstRender.current = false;
    } else {
      // Smooth slide animation
      gsap.to(highlight, {
        y: targetY,
        height: targetHeight,
        opacity: 1,
        duration: 0.35,
        ease: "power3.out",
      });
    }
  }, [activeStep]);

  return (
    <aside className={cn(
      "w-80 bg-background flex flex-col justify-between p-6 shrink-0 overflow-y-auto",
      position === "left" ? "border-r border-border" : "border-l border-border"
    )}>
      {/* Steps List */}
      <div ref={listRef} className="flex flex-col gap-2 relative">
        {/* Sliding highlight */}
        <div
          ref={highlightRef}
          className="absolute inset-x-0 rounded-lg bg-blue-50/80 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/30 pointer-events-none opacity-0 z-0"
          style={{ willChange: "transform" }}
        />

        {STEPS.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isActive = activeStep === step.id;
          
          let statusText = "Not started";
          if (isActive) {
            statusText = "In progress";
          } else if (isCompleted) {
            statusText = "Completed";
          }

          return (
            <button
              key={step.id}
              ref={(el) => {
                if (el) stepRefs.current.set(step.id, el);
              }}
              onClick={() => onStepClick(step.id)}
              className={cn(
                "group flex w-full items-start gap-4 rounded-lg p-3 text-left transition-colors relative outline-none hover:bg-muted/50 cursor-pointer z-10",
              )}
            >
              {/* Step indicator circle */}
              <div className="flex items-center justify-center shrink-0 mt-0.5">
                {isCompleted ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm">
                    <Check className="h-3.5 w-3.5 stroke-[3px]" />
                  </div>
                ) : isActive ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500 text-white font-semibold text-xs shadow-md">
                    {step.id}
                  </div>
                ) : step.isReview ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-muted-foreground/30 text-muted-foreground bg-background">
                    <ClipboardCheck className="h-3.5 w-3.5" />
                  </div>
                ) : step.isSignOff ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-muted-foreground/30 text-muted-foreground bg-background">
                    <FileSignature className="h-3.5 w-3.5" />
                  </div>
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-muted-foreground/30 text-muted-foreground bg-background">
                    <Plus className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>

              {/* Step title and status */}
              <div className="flex flex-col gap-0.5">
                <span
                  className={cn(
                    "text-xs font-semibold leading-tight",
                    isActive
                      ? "text-blue-700 dark:text-blue-400"
                      : isCompleted
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {step.id}. {step.title}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-medium leading-none",
                    isActive
                      ? "text-blue-600/80 dark:text-blue-400/80"
                      : isCompleted
                      ? "text-emerald-600/80 dark:text-emerald-400/80"
                      : "text-muted-foreground/60"
                  )}
                >
                  {statusText}
                </span>
              </div>
            </button>
          );
        })}
      </div>

    </aside>
  );
}
