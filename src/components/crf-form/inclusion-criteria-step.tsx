"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, FileText, CheckCircle2 } from "lucide-react";

export interface InclusionCriteriaData {
  ecogStatus: "Yes" | "No" | "";
  earlyStage: "Yes" | "No" | "";
  hormonePositive: "Yes" | "No" | "";
  her2Negative: "Yes" | "No" | "";
  ffpeAvailable: "Yes" | "No" | "";
  clinicalDataAvailable: "Yes" | "No" | "";
}

interface InclusionCriteriaStepPanelProps {
  data: InclusionCriteriaData;
  onChange: (updater: (prev: InclusionCriteriaData) => InclusionCriteriaData) => void;
}

export function InclusionCriteriaStepPanel({ data, onChange }: InclusionCriteriaStepPanelProps) {
  const toggleCriteria = (field: keyof InclusionCriteriaData, value: "Yes" | "No") => {
    onChange((prev) => ({
      ...prev,
      [field]: prev[field] === value ? "" : value,
    }));
  };

  const hasNoAnswer = Object.values(data).some((val) => val === "No");
  const isFullyEligible = Object.values(data).every((val) => val === "Yes");

  const CRITERIA_ITEMS = [
    {
      key: "ecogStatus" as keyof InclusionCriteriaData,
      num: 1,
      text: "ECOG Performance Status 0-2",
    },
    {
      key: "earlyStage" as keyof InclusionCriteriaData,
      num: 2,
      text: "Early-stage disease (e.g., Stage I, II, or operable Stage III)",
    },
    {
      key: "hormonePositive" as keyof InclusionCriteriaData,
      num: 3,
      text: "Hormone Receptor-Positive (ER+ and/or PR+ by IHC, per ASCO/CAP guidelines)",
    },
    {
      key: "her2Negative" as keyof InclusionCriteriaData,
      num: 4,
      text: "HER2-Negative (by IHC and/or FISH, per ASCO/CAP guidelines)",
    },
    {
      key: "ffpeAvailable" as keyof InclusionCriteriaData,
      num: 5,
      text: "Availability of archival FFPE tumor tissue block / H&E slide / scanned image (primary tumor)",
    },
    {
      key: "clinicalDataAvailable" as keyof InclusionCriteriaData,
      num: 6,
      text: "Availability of comprehensive clinical data, including tumor characteristics (size, grade, nodal status), treatment received (surgery, radiation, chemotherapy, endocrine therapy), and long-term follow-up data on recurrence and survival",
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl p-3 sm:p-6 w-full animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">4. Inclusion Criteria</h2>
          <p className="text-xs text-muted-foreground">Inclusion screening checklist for clinical study entry</p>
        </div>
      </div>

      {/* Eligibility Checklist Table */}
      <div className="border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden bg-card text-card-foreground shadow-xs">
        {/* Table Header */}
        <div className="grid grid-cols-[48px_1fr_80px_80px] bg-[#f5f5f5] dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-b border-zinc-300 dark:border-zinc-700 font-bold text-xs uppercase tracking-wider">
          <div className="p-3 text-center border-r border-zinc-300 dark:border-zinc-700">No.</div>
          <div className="p-3 border-r border-zinc-300 dark:border-zinc-700">Inclusion Criteria</div>
          <div className="p-3 text-center border-r border-zinc-300 dark:border-zinc-700">Yes</div>
          <div className="p-3 text-center">No</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-zinc-300 dark:divide-zinc-700">
          {CRITERIA_ITEMS.map((item) => (
            <div key={item.key} className="grid grid-cols-[48px_1fr_80px_80px] items-stretch min-h-12">
              <div className="p-3 text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 border-r border-zinc-300 dark:border-zinc-700 flex items-center justify-center bg-muted/5">
                {item.num}.
              </div>
              <div className="p-3 text-xs text-zinc-800 dark:text-zinc-200 border-r border-zinc-300 dark:border-zinc-700 flex items-center font-medium leading-relaxed">
                {item.text}
              </div>
              <div className="p-3 border-r border-zinc-300 dark:border-zinc-700 flex items-center justify-center bg-muted/10">
                <Checkbox
                  id={`yes-${item.key}`}
                  checked={data[item.key] === "Yes"}
                  onCheckedChange={() => toggleCriteria(item.key, "Yes")}
                  className="rounded border-zinc-300 dark:border-zinc-700 size-4.5 cursor-pointer"
                />
              </div>
              <div className="p-3 flex items-center justify-center bg-muted/10">
                <Checkbox
                  id={`no-${item.key}`}
                  checked={data[item.key] === "No"}
                  onCheckedChange={() => toggleCriteria(item.key, "No")}
                  className="rounded border-zinc-300 dark:border-zinc-700 size-4.5 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Paper Form Footer Guideline */}
        <div className="bg-zinc-100 dark:bg-zinc-800/40 p-4 border-t border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-start gap-2 leading-relaxed">
          <span className="text-zinc-500 shrink-0">☞</span>
          <span>
            If answer to any of the Inclusion criteria is <span className="underline text-destructive font-bold">"No"</span>, do <span className="underline text-destructive font-bold">NOT</span> include the Patient in the study and complete the End of study page.
          </span>
        </div>
      </div>

      {/* Dynamic Screen Warnings */}
      {hasNoAnswer && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20 flex gap-3 items-start animate-in slide-in-from-top-2 duration-300">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-bold text-red-800 dark:text-red-300">Patient Ineligible</h4>
            <p className="text-xs text-red-700 dark:text-red-400 leading-normal">
              One or more inclusion criteria have been answered as <strong>"No"</strong>. The patient does not qualify for the study. Please do not enroll this patient.
            </p>
          </div>
        </div>
      )}

      {isFullyEligible && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-950/20 flex gap-3 items-start animate-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-bold text-green-800 dark:text-green-300">Eligibility Criteria Satisfied</h4>
            <p className="text-xs text-green-700 dark:text-green-400 leading-normal">
              All inclusion criteria have been answered as <strong>"Yes"</strong>. The patient is eligible for study enrollment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
