"use client";

import React from "react";
import { format, differenceInDays, differenceInMonths, differenceInYears } from "date-fns";
import { Calendar as CalendarIcon, Heart, HeartOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

export interface SurvivalStatusData {
  isAlive: "Yes" | "No" | "";
  lastContactDate: Date | undefined;
  deathDate: Date | undefined;
  deathReason: "Breast cancer" | "Other" | "";
}

interface SurvivalStatusStepPanelProps {
  data: SurvivalStatusData;
  onChange: (updater: (prev: SurvivalStatusData) => SurvivalStatusData) => void;
  diagnosisDate?: Date;
}

export function SurvivalStatusStepPanel({ data, onChange, diagnosisDate }: SurvivalStatusStepPanelProps) {
  const getIntervalString = (start: Date, end: Date) => {
    const days = differenceInDays(end, start);
    if (days < 0) return "";
    if (days < 14) return `${days} days`;
    const weeks = Math.floor(days / 7);
    if (weeks < 8) return `${weeks} weeks`;
    const months = differenceInMonths(end, start);
    if (months < 12) return `${months} months`;
    const years = differenceInYears(end, start);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return `${years} years`;
    return `${years} years, ${remainingMonths} months`;
  };
  const [isLastContactCalOpen, setIsLastContactCalOpen] = React.useState(false);
  const [isDeathCalOpen, setIsDeathCalOpen] = React.useState(false);
  const toggleCheckbox = (field: keyof SurvivalStatusData, value: string) => {
    onChange((prev) => {
      const updated = {
        ...prev,
        [field]: prev[field] === value ? "" : value,
      };

      // Reset death details if patient is marked as alive
      if (field === "isAlive" && value === "Yes" && prev.isAlive !== "Yes") {
        updated.deathDate = undefined;
        updated.deathReason = "";
      }
      return updated;
    });
  };

  const handleDateChange = (field: "lastContactDate" | "deathDate", date: Date | undefined) => {
    onChange((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const showDeathDetails = data.isAlive === "No";

  return (
    <div className="flex flex-col gap-6 max-w-4xl p-3 sm:p-6 w-full animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400">
          {data.isAlive === "No" ? (
            <HeartOff className="h-5 w-5 text-red-600 dark:text-red-400" />
          ) : (
            <Heart className="h-5 w-5 text-rose-600 dark:text-rose-400" />
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">7. Survival Status</h2>
          <p className="text-xs text-muted-foreground">Patient long-term survival, last contact tracking, and mortality details</p>
        </div>
      </div>

      {/* Patient Survival Status Card */}
      <div className="border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden bg-card text-card-foreground shadow-xs">
        {/* Card Title */}
        <div className="bg-[#f5f5f5] dark:bg-zinc-800 px-4 py-2.5 font-bold text-sm text-zinc-800 dark:text-zinc-200 border-b border-zinc-300 dark:border-zinc-700">
          Patient survival status
        </div>

        {/* Row 1: Is the patient alive */}
        <div className="p-4 flex flex-col md:flex-row md:items-center gap-4 border-b border-zinc-300 dark:border-zinc-700">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 md:w-80 shrink-0">
            Is the patient alive:
          </span>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="alive-yes"
                checked={data.isAlive === "Yes"}
                onCheckedChange={() => toggleCheckbox("isAlive", "Yes")}
                className="rounded border-zinc-300 dark:border-zinc-700"
              />
              <label htmlFor="alive-yes" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">
                Yes
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="alive-no"
                checked={data.isAlive === "No"}
                onCheckedChange={() => toggleCheckbox("isAlive", "No")}
                className="rounded border-zinc-300 dark:border-zinc-700"
              />
              <label htmlFor="alive-no" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">
                No
              </label>
            </div>
          </div>
        </div>

        {/* Row 2: Date of last contact */}
        <div className="p-4 flex flex-col md:flex-row md:items-center gap-4 border-b border-zinc-300 dark:border-zinc-700">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 md:w-80 shrink-0">
            Date of last contact:
          </span>
          <div className="flex items-center gap-2">
            <Popover open={isLastContactCalOpen} onOpenChange={setIsLastContactCalOpen}>
              <PopoverTrigger
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-48 justify-start text-left font-normal h-9 text-xs rounded-lg border-zinc-300 dark:border-zinc-700 cursor-pointer",
                  !data.lastContactDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                {data.lastContactDate ? format(data.lastContactDate, "dd MMM yyyy") : <span>Pick a date</span>}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50 bg-background" align="start">
                <Calendar
                  mode="single"
                  selected={data.lastContactDate}
                  onSelect={(date) => {
                    handleDateChange("lastContactDate", date);
                    setIsLastContactCalOpen(false);
                  }}
                  captionLayout="dropdown"
                  startMonth={new Date(1900, 0)}
                  endMonth={new Date()}
                  disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>

            {data.lastContactDate && diagnosisDate && (
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold ml-2">
                (Survival duration: {getIntervalString(diagnosisDate, data.lastContactDate)})
              </span>
            )}
          </div>
        </div>

        {/* Row 3: Date of death (Conditional/Disabled) */}
        <div
          className={cn(
            "p-4 flex flex-col md:flex-row md:items-center gap-4 border-b border-zinc-300 dark:border-zinc-700 transition-opacity duration-200",
            !showDeathDetails && "opacity-40"
          )}
        >
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 md:w-80 shrink-0">
            Date of death:
          </span>
          <div className="flex items-center gap-2">
            <Popover open={isDeathCalOpen} onOpenChange={setIsDeathCalOpen}>
              <PopoverTrigger
                disabled={!showDeathDetails}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-48 justify-start text-left font-normal h-9 text-xs rounded-lg border-zinc-300 dark:border-zinc-700 cursor-pointer",
                  !data.deathDate && "text-muted-foreground",
                  !showDeathDetails && "cursor-not-allowed bg-zinc-50 dark:bg-zinc-900/50"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                {data.deathDate ? format(data.deathDate, "dd MMM yyyy") : <span>Pick a date</span>}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50 bg-background" align="start">
                <Calendar
                  mode="single"
                  selected={data.deathDate}
                  onSelect={(date) => {
                    handleDateChange("deathDate", date);
                    setIsDeathCalOpen(false);
                  }}
                  captionLayout="dropdown"
                  startMonth={new Date(1900, 0)}
                  endMonth={new Date()}
                  disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>

            {data.deathDate && diagnosisDate && (
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold ml-2">
                (Survival duration: {getIntervalString(diagnosisDate, data.deathDate)})
              </span>
            )}
          </div>
        </div>

        {/* Row 4: Reason for death (Conditional/Disabled) */}
        <div
          className={cn(
            "p-4 flex flex-col md:flex-row md:items-center gap-4 transition-opacity duration-200",
            !showDeathDetails && "opacity-40"
          )}
        >
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 md:w-80 shrink-0">
            Reason for death:
          </span>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="reason-cancer"
                disabled={!showDeathDetails}
                checked={data.deathReason === "Breast cancer"}
                onCheckedChange={() => toggleCheckbox("deathReason", "Breast cancer")}
                className={cn("rounded border-zinc-300 dark:border-zinc-700", !showDeathDetails && "cursor-not-allowed")}
              />
              <label htmlFor="reason-cancer" className={cn("text-xs font-medium text-zinc-800 dark:text-zinc-200 select-none", showDeathDetails ? "cursor-pointer" : "cursor-not-allowed")}>
                Breast cancer
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="reason-other"
                disabled={!showDeathDetails}
                checked={data.deathReason === "Other"}
                onCheckedChange={() => toggleCheckbox("deathReason", "Other")}
                className={cn("rounded border-zinc-300 dark:border-zinc-700", !showDeathDetails && "cursor-not-allowed")}
              />
              <label htmlFor="reason-other" className={cn("text-xs font-medium text-zinc-800 dark:text-zinc-200 select-none", showDeathDetails ? "cursor-pointer" : "cursor-not-allowed")}>
                Other
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
