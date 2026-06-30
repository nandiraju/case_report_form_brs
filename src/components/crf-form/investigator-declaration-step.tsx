"use client";

import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export interface InvestigatorDeclarationData {
  signature: string;
  date: Date | undefined;
}

interface InvestigatorDeclarationStepPanelProps {
  data: InvestigatorDeclarationData;
  onChange: (updater: (prev: InvestigatorDeclarationData) => InvestigatorDeclarationData) => void;
}

export function InvestigatorDeclarationStepPanel({ data, onChange }: InvestigatorDeclarationStepPanelProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  
  const handleFieldChange = (value: string) => {
    onChange((prev) => ({
      ...prev,
      signature: value,
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    onChange((prev) => ({
      ...prev,
      date,
    }));
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl p-3 sm:p-6 w-full animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400">
          <ClipboardCheck className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">9. Investigator Declaration</h2>
          <p className="text-xs text-muted-foreground">CRF validation exam and investigator sign-off</p>
        </div>
      </div>

      {/* Declaration Card */}
      <div className="border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden bg-card text-card-foreground shadow-xs">
        {/* Card Title */}
        <div className="bg-[#f5f5f5] dark:bg-zinc-800 px-4 py-2.5 font-bold text-sm text-zinc-800 dark:text-zinc-200 border-b border-zinc-300 dark:border-zinc-700">
          INVESTIGATOR DECLARATION:
        </div>

        {/* Row 1: Signature and Date */}
        <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-6 border-b border-zinc-300 dark:border-zinc-700">
          <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 md:w-40 shrink-0">
              Investigator's Signature:
            </span>
            <Input
              placeholder="Type your full name to sign"
              value={data.signature}
              onChange={(e) => handleFieldChange(e.target.value)}
              className="h-9 text-xs flex-1 rounded-lg border-zinc-300 dark:border-zinc-700 font-mono italic"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 shrink-0">
              Date:
            </span>
            <div className="flex items-center gap-2">
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-44 justify-start text-left font-normal h-9 text-xs rounded-lg border-zinc-300 dark:border-zinc-700 cursor-pointer",
                    !data.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                  {data.date ? format(data.date, "dd MMM yyyy") : <span>Pick a date</span>}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50 bg-background" align="start">
                  <Calendar
                    mode="single"
                    selected={data.date}
                    onSelect={(date) => {
                      handleDateChange(date);
                      setIsCalendarOpen(false);
                    }}
                    captionLayout="dropdown"
                    startMonth={new Date(1900, 0)}
                    endMonth={new Date()}
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>

            </div>
          </div>
        </div>

        {/* Row 2: Declaration Text */}
        <div className="bg-zinc-50 dark:bg-zinc-900/10 p-4 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-semibold italic">
          I hereby declare that I have carefully examined all entries. All information entered by myself is, to the best of my knowledge, complete and accurate as of this date.
        </div>
      </div>
    </div>
  );
}
