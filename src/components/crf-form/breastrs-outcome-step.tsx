"use client";

import React from "react";
import { Award } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface BreastRSOutcomeData {
  result: string;
}

interface BreastRSOutcomeStepPanelProps {
  data: BreastRSOutcomeData;
  onChange: (updater: (prev: BreastRSOutcomeData) => BreastRSOutcomeData) => void;
}

export function BreastRSOutcomeStepPanel({ data, onChange }: BreastRSOutcomeStepPanelProps) {
  const handleFieldChange = (value: string) => {
    onChange((prev) => ({
      ...prev,
      result: value,
    }));
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl p-3 sm:p-6 w-full animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400">
          <Award className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">8. BreastRS Outcome</h2>
          <p className="text-xs text-muted-foreground">OncoPredikt® BreastRS score analysis outcome report</p>
        </div>
      </div>

      {/* Outcome Card */}
      <div className="border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden bg-card text-card-foreground shadow-xs">
        {/* Card Title */}
        <div className="bg-[#f5f5f5] dark:bg-zinc-800 px-4 py-2.5 font-bold text-sm text-zinc-800 dark:text-zinc-200 border-b border-zinc-300 dark:border-zinc-700">
          OncoPredikt® BreastRS outcome
        </div>

        {/* Row 1: Result */}
        <div className="p-4 flex flex-col md:flex-row md:items-center gap-4">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 md:w-20 shrink-0">
            Result:
          </span>
          <Input
            placeholder="Enter outcome result details"
            value={data.result}
            onChange={(e) => handleFieldChange(e.target.value)}
            className="h-9 text-xs flex-1 rounded-lg border-zinc-300 dark:border-zinc-700"
          />
        </div>
      </div>
    </div>
  );
}
