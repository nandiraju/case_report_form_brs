"use client";

import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export interface DemographicsData {
  dob: Date | undefined;
  age: string;
  race: {
    americanIndian: boolean;
    pacificIslander: boolean;
    black: boolean;
    asian: boolean;
    white: boolean;
    other: boolean;
    otherSpecify: string;
  };
  menopausalStatus: string;
}

interface DemographicsStepPanelProps {
  data: DemographicsData;
  onChange: (updater: (prev: DemographicsData) => DemographicsData) => void;
}



export function DemographicsStepPanel({ data, onChange }: DemographicsStepPanelProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const dob = React.useMemo(() => {
    if (!data.dob) return undefined;
    const d = typeof data.dob === "string" ? new Date(data.dob) : data.dob;
    return isNaN(d.getTime()) ? undefined : d;
  }, [data.dob]);

  // Handle DOB change — calculate age immediately
  const handleDateChange = (date: Date | undefined) => {
    let age = "";
    if (date) {
      const today = new Date();
      let years = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
        years--;
      }
      age = years >= 0 ? String(years) : "0";
    }
    onChange((prev) => ({
      ...prev,
      dob: date,
      age: age,
    }));
  };

  const handleRaceChange = (key: keyof DemographicsData["race"], value: boolean | string) => {
    onChange((prev) => ({
      ...prev,
      race: {
        ...prev.race,
        [key]: value,
      },
    }));
  };

  const handleMenopausalChange = (status: string) => {
    onChange((prev) => ({
      ...prev,
      menopausalStatus: prev.menopausalStatus === status ? "" : status,
    }));
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl p-3 sm:p-6 w-full">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">1. Demographics</h2>
          <p className="text-xs text-muted-foreground">General patient baseline demographics</p>
        </div>
      </div>

      {/* Demographics Card Styled to mimic paper form */}
      <div className="border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden bg-card text-card-foreground shadow-xs">
        {/* Card Title */}
        <div className="bg-zinc-200 dark:bg-zinc-800 px-4 py-2.5 font-bold text-sm text-zinc-800 dark:text-zinc-200 border-b border-zinc-300 dark:border-zinc-700">
          Demography
        </div>

        {/* Row 1: Date of Birth and Age */}
        <div className="flex flex-col sm:flex-row border-b border-zinc-300 dark:border-zinc-700">
          {/* Date of Birth Field */}
          <div className="flex-1 p-4 flex flex-col md:flex-row md:items-center gap-4">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 md:w-28 shrink-0">
              Date of birth:
            </span>
            <div className="flex items-center gap-2">
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-48 justify-start text-left font-normal h-9 text-xs rounded-lg border-zinc-300 dark:border-zinc-700 cursor-pointer",
                    !dob && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                  {dob ? format(dob, "dd MMM yyyy") : <span>Pick a date</span>}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50 bg-background" align="start">
                  <Calendar
                    mode="single"
                    selected={dob}
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

          {/* Age Field */}
          <div className="p-4 sm:border-l border-zinc-300 dark:border-zinc-700 w-full sm:w-60 flex items-center gap-4">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 shrink-0">
              Age:
            </span>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Age"
                value={data.age || ""}
                onChange={(e) => {
                  onChange((prev) => ({
                    ...prev,
                    age: e.target.value,
                  }));
                }}
                className="h-9 w-16 text-center font-mono text-sm font-semibold rounded-lg border-zinc-300 dark:border-zinc-700 bg-background text-foreground"
              />
              <span className="text-xs text-muted-foreground font-medium">
                years
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: Race */}
        <div className="p-4 border-b border-zinc-300 dark:border-zinc-700 flex flex-col md:flex-row items-start gap-4">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 md:w-28 shrink-0 mt-0.5">
            Race:
          </span>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {/* Column 1 */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="race-indian"
                  checked={data.race.americanIndian}
                  onCheckedChange={(checked) => handleRaceChange("americanIndian", !!checked)}
                  className="rounded border-zinc-300 dark:border-zinc-700 mt-0.5"
                />
                <label
                  htmlFor="race-indian"
                  className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none leading-normal"
                >
                  American Indian/Alaskan native
                </label>
              </div>

              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="race-hawaiian"
                  checked={data.race.pacificIslander}
                  onCheckedChange={(checked) => handleRaceChange("pacificIslander", !!checked)}
                  className="rounded border-zinc-300 dark:border-zinc-700 mt-0.5"
                />
                <label
                  htmlFor="race-hawaiian"
                  className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none leading-normal"
                >
                  Native Hawaiian/other pacific islander
                </label>
              </div>

              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="race-black"
                  checked={data.race.black}
                  onCheckedChange={(checked) => handleRaceChange("black", !!checked)}
                  className="rounded border-zinc-300 dark:border-zinc-700 mt-0.5"
                />
                <label
                  htmlFor="race-black"
                  className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none leading-normal"
                >
                  Black or African American
                </label>
              </div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="race-asian"
                  checked={data.race.asian}
                  onCheckedChange={(checked) => handleRaceChange("asian", !!checked)}
                  className="rounded border-zinc-300 dark:border-zinc-700 mt-0.5"
                />
                <label
                  htmlFor="race-asian"
                  className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none leading-normal"
                >
                  Asian
                </label>
              </div>

              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="race-white"
                  checked={data.race.white}
                  onCheckedChange={(checked) => handleRaceChange("white", !!checked)}
                  className="rounded border-zinc-300 dark:border-zinc-700 mt-0.5"
                />
                <label
                  htmlFor="race-white"
                  className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none leading-normal"
                >
                  White
                </label>
              </div>

              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="race-other"
                  checked={data.race.other}
                  onCheckedChange={(checked) => handleRaceChange("other", !!checked)}
                  className="rounded border-zinc-300 dark:border-zinc-700 mt-0.5"
                />
                <div className="flex flex-col gap-1.5 flex-1 -mt-0.5">
                  <label
                    htmlFor="race-other"
                    className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none leading-none"
                  >
                    Other <span className="text-[10px] text-muted-foreground font-normal">(Specify)</span>
                  </label>
                  {data.race.other && (
                    <Input
                      placeholder="Please specify"
                      value={data.race.otherSpecify}
                      onChange={(e) => handleRaceChange("otherSpecify", e.target.value)}
                      className="h-8 text-xs rounded-lg border-zinc-300 dark:border-zinc-700 mt-1"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Menopausal Status */}
        <div className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 md:w-28 shrink-0">
            Menopausal Status:
          </span>
          <div className="flex-1 flex flex-row flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
              <Checkbox
                id="meno-pre"
                checked={data.menopausalStatus === "Pre-Menopausal"}
                onCheckedChange={() => handleMenopausalChange("Pre-Menopausal")}
                className="rounded border-zinc-300 dark:border-zinc-700"
              />
              <label
                htmlFor="meno-pre"
                className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none"
              >
                Pre-Menopausal
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="meno-post"
                checked={data.menopausalStatus === "Post-Menopausal"}
                onCheckedChange={() => handleMenopausalChange("Post-Menopausal")}
                className="rounded border-zinc-300 dark:border-zinc-700"
              />
              <label
                htmlFor="meno-post"
                className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none"
              >
                Post-Menopausal
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="meno-unk"
                checked={data.menopausalStatus === "Unknown"}
                onCheckedChange={() => handleMenopausalChange("Unknown")}
                className="rounded border-zinc-300 dark:border-zinc-700"
              />
              <label
                htmlFor="meno-unk"
                className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none"
              >
                Unknown
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
