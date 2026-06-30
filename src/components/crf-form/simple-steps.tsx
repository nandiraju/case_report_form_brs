"use client";

import React from "react";
import { CheckCircle2, User, Activity, Heart, ShieldAlert, Award, FileCheck } from "lucide-react";

interface StepPanelProps {
  step: number;
}

export function EligibilityStepPanel() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl p-6">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">1. Eligibility Screening</h2>
          <p className="text-xs text-muted-foreground">Screening criteria confirmation for study enrollment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-border rounded-xl p-5 bg-card flex flex-col gap-4">
          <h3 className="font-semibold text-sm text-foreground">Inclusion Criteria</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5 text-xs text-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span>Age ≥ 18 years at the time of screening</span>
            </li>
            <li className="flex items-start gap-2.5 text-xs text-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span>Histologically confirmed invasive breast carcinoma</span>
            </li>
            <li className="flex items-start gap-2.5 text-xs text-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span>ER and/or PR positive receptor status</span>
            </li>
          </ul>
        </div>

        <div className="border border-border rounded-xl p-5 bg-card flex flex-col gap-4">
          <h3 className="font-semibold text-sm text-foreground">Exclusion Criteria</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5 text-xs text-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span>No evidence of distant metastasis (stage IV disease)</span>
            </li>
            <li className="flex items-start gap-2.5 text-xs text-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span>No prior chemotherapy or radiation therapy for this primary tumor</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-emerald-50/50 border border-emerald-200/50 dark:bg-emerald-950/10 dark:border-emerald-900/30 rounded-xl p-4 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 font-bold text-xs">
          OK
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">Patient Eligible for OncoPredikt Study</span>
          <span className="text-[10px] text-emerald-700/80 dark:text-emerald-500/80">Approved by Dr. Sarah Jenkins on 12 Jan 2022</span>
        </div>
      </div>
    </div>
  );
}


export function PlaceholderStepPanel({ title, stepNumber, icon: Icon }: { title: string; stepNumber: number; icon: React.ComponentType<any> }) {
  return (
    <div className="flex flex-col gap-6 max-w-4xl p-6">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{stepNumber}. {title}</h2>
          <p className="text-xs text-muted-foreground">Section is pending data initialization</p>
        </div>
      </div>

      <div className="border border-dashed border-border rounded-xl p-10 bg-muted/10 flex flex-col items-center justify-center text-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/40 text-muted-foreground">
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex flex-col gap-1 max-w-sm">
          <h3 className="font-semibold text-sm text-foreground">Step is currently inactive</h3>
          <p className="text-xs text-muted-foreground">
            This section will become editable once the pathology and treatment stages are verified. Complete the prior sections first.
          </p>
        </div>
      </div>
    </div>
  );
}

export function DiseaseProgressionPanel() {
  return <PlaceholderStepPanel title="Disease Progression" stepNumber={5} icon={Activity} />;
}

export function SurvivalStatusPanel() {
  return <PlaceholderStepPanel title="Survival Status" stepNumber={6} icon={Heart} />;
}

export function OncoPrediktBRSPanel() {
  return <PlaceholderStepPanel title="OncoPredikt BRS" stepNumber={7} icon={Award} />;
}

export function ReviewSignOffPanel() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl p-6">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <FileCheck className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">8. Review & Sign-off</h2>
          <p className="text-xs text-muted-foreground">Final data validation and clinical sign-off</p>
        </div>
      </div>

      <div className="border border-border rounded-xl p-6 bg-card flex flex-col gap-4">
        <h3 className="font-semibold text-sm text-foreground">Clinical Validation Summary</h3>
        <div className="flex items-start gap-3 bg-blue-50/50 border border-blue-200/50 dark:bg-blue-950/10 dark:border-blue-900/30 rounded-lg p-4">
          <ShieldAlert className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-blue-800 dark:text-blue-400">Review Pending Changes</span>
            <span className="text-[10px] text-blue-700/80 dark:text-blue-500/80">
              Please double check all pathology parameters and treatment cycles before applying your digital signature. Once signed off, this record will be frozen.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
