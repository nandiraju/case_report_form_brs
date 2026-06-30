"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, ShieldAlert, CheckCircle2 } from "lucide-react";

export interface ExclusionCriteriaData {
  dcisOnly: "Yes" | "No" | "";
  metastatic: "Yes" | "No" | "";
  inflammatory: "Yes" | "No" | "";
  priorBreastCancer: "Yes" | "No" | "";
  insufficientData: "Yes" | "No" | "";
  insufficientTissue: "Yes" | "No" | "";
  neoadjuvantTherapy: "Yes" | "No" | "";
}

interface ExclusionCriteriaStepPanelProps {
  data: ExclusionCriteriaData;
  onChange: (updater: (prev: ExclusionCriteriaData) => ExclusionCriteriaData) => void;
}

export function ExclusionCriteriaStepPanel({ data, onChange }: ExclusionCriteriaStepPanelProps) {
  const toggleCriteria = (field: keyof ExclusionCriteriaData, value: "Yes" | "No") => {
    onChange((prev) => ({
      ...prev,
      [field]: prev[field] === value ? "" : value,
    }));
  };

  const hasYesAnswer = Object.values(data).some((val) => val === "Yes");
  const isFullyEligible = Object.values(data).every((val) => val === "No");

  const CRITERIA_ITEMS = [
    {
      key: "dcisOnly" as keyof ExclusionCriteriaData,
      num: 1,
      text: "Ductal carcinoma in situ (DCIS) without invasive component",
    },
    {
      key: "metastatic" as keyof ExclusionCriteriaData,
      num: 2,
      text: "Metastatic disease at initial diagnosis",
    },
    {
      key: "inflammatory" as keyof ExclusionCriteriaData,
      num: 3,
      text: "Inflammatory breast cancer",
    },
    {
      key: "priorBreastCancer" as keyof ExclusionCriteriaData,
      num: 4,
      text: "Prior history of ipsilateral or contralateral breast cancer",
    },
    {
      key: "insufficientData" as keyof ExclusionCriteriaData,
      num: 5,
      text: "Lack of sufficient clinical or follow-up data",
    },
    {
      key: "insufficientTissue" as keyof ExclusionCriteriaData,
      num: 6,
      text: "Insufficient quantity or quality of FFPE tissue for analysis",
    },
    {
      key: "neoadjuvantTherapy" as keyof ExclusionCriteriaData,
      num: 7,
      text: "Patients who received neoadjuvant systemic therapy (to ensure evaluation on untreated primary tumor)",
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl p-3 sm:p-6 w-full animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">5. Exclusion Criteria</h2>
          <p className="text-xs text-muted-foreground">Exclusion screening checklist for clinical study entry</p>
        </div>
      </div>

      {/* Exclusion Checklist Table */}
      <div className="border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden bg-card text-card-foreground shadow-xs">
        {/* Table Header */}
        <div className="grid grid-cols-[48px_1fr_80px_80px] bg-[#f5f5f5] dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-b border-zinc-300 dark:border-zinc-700 font-bold text-xs uppercase tracking-wider">
          <div className="p-3 text-center border-r border-zinc-300 dark:border-zinc-700">No</div>
          <div className="p-3 border-r border-zinc-300 dark:border-zinc-700">Exclusion Criteria</div>
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
                  className="rounded border-zinc-300 dark:border-zinc-700 size-4.5 cursor-pointer text-red-600 focus-visible:ring-red-600 data-[state=checked]:bg-red-600 data-[state=checked]:text-white"
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
            If answer to any of the Exclusion criteria is <span className="underline text-destructive font-bold">"Yes"</span>, do <span className="underline text-destructive font-bold">NOT</span> include the Patient in the study and complete the End of study page.
          </span>
        </div>
      </div>

      {/* Dynamic Screen Warnings */}
      {hasYesAnswer && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20 flex gap-3 items-start animate-in slide-in-from-top-2 duration-300">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-bold text-red-800 dark:text-red-300">Patient Ineligible</h4>
            <p className="text-xs text-red-700 dark:text-red-400 leading-normal">
              One or more exclusion criteria have been answered as <strong>"Yes"</strong>. The patient does not qualify for the study. Please do not enroll this patient.
            </p>
          </div>
        </div>
      )}

      {isFullyEligible && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-950/20 flex gap-3 items-start animate-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-bold text-green-800 dark:text-green-300">Exclusion Criteria Clear</h4>
            <p className="text-xs text-green-700 dark:text-green-400 leading-normal">
              All exclusion criteria have been answered as <strong>"No"</strong>. The patient is eligible for study enrollment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
