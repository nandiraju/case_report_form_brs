"use client";

import React from "react";
import { format } from "date-fns";
import { 
  ClipboardCheck, 
  User, 
  Stethoscope, 
  Pill, 
  ShieldCheck, 
  LineChart, 
  Heart, 
  Award, 
  FileCheck,
  Edit2,
  Printer
} from "lucide-react";
import { DemographicsData } from "./demographics-step";
import { DiseaseHistoryData } from "./disease-history-step";
import { TreatmentAdministeredData } from "./treatment-administered-step";
import { InclusionCriteriaData } from "./inclusion-criteria-step";
import { ExclusionCriteriaData } from "./exclusion-criteria-step";
import { DiseaseProgressionData } from "./disease-progression-step";
import { SurvivalStatusData } from "./survival-status-step";
import { BreastRSOutcomeData } from "./breastrs-outcome-step";
import { InvestigatorDeclarationData } from "./investigator-declaration-step";

interface ReviewStepPanelProps {
  demographics: DemographicsData;
  diseaseHistory: DiseaseHistoryData;
  treatment: TreatmentAdministeredData;
  inclusion: InclusionCriteriaData;
  exclusion: ExclusionCriteriaData;
  progression: DiseaseProgressionData;
  survival: SurvivalStatusData;
  breastRS: BreastRSOutcomeData;
  declaration: InvestigatorDeclarationData;
  onNavigateToStep: (step: number) => void;
  hideEditLinks?: boolean;
  onPrintClick?: () => void;
}

export function ReviewStepPanel({
  demographics,
  diseaseHistory,
  treatment,
  inclusion,
  exclusion,
  progression,
  survival,
  breastRS,
  declaration,
  onNavigateToStep,
  hideEditLinks = false,
  onPrintClick,
}: ReviewStepPanelProps) {

  const formatDateVal = (d: any) => {
    if (!d) return "—";
    const date = typeof d === "string" ? new Date(d) : d;
    return isNaN(date.getTime()) ? "—" : format(date, "dd MMM yyyy");
  };

  const renderSectionHeader = (title: string, stepNum: number, Icon: any) => (
    <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">{title}</h3>
      </div>
      {!hideEditLinks && (
        <button
          onClick={() => onNavigateToStep(stepNum)}
          className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          <Edit2 className="h-3 w-3" />
          Edit Step {stepNum}
        </button>
      )}
    </div>
  );

  // Helper for displaying boolean values
  const formatBool = (val: string | boolean) => {
    if (val === true || val === "Yes" || val === "true") return <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Yes</span>;
    if (val === false || val === "No" || val === "false") return <span className="text-rose-600 dark:text-rose-400 font-semibold">No</span>;
    return <span className="text-muted-foreground/60">—</span>;
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl p-3 sm:p-6 w-full animate-in fade-in duration-200">
      {/* Header */}
      {!hideEditLinks && (
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">10. Final Review & Submit</h2>
              <p className="text-xs text-muted-foreground">Verify all Case Report Form sections prior to final submission</p>
            </div>
          </div>

          {onPrintClick && (
            <button
              onClick={onPrintClick}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-foreground text-xs font-semibold rounded-lg shadow-xs cursor-pointer select-none transition-colors duration-150"
            >
              <Printer className="h-4 w-4" />
              Print / PDF View
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {/* Step 1: Demographics */}
        <div className="bg-card text-card-foreground border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 shadow-xs">
          {renderSectionHeader("1. Patient Demographics", 1, User)}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="block text-muted-foreground font-medium mb-0.5">Date of Birth</span>
              <span className="font-semibold text-foreground">{formatDateVal(demographics.dob)}</span>
            </div>
            <div>
              <span className="block text-muted-foreground font-medium mb-0.5">Age</span>
              <span className="font-semibold text-foreground">{demographics.age || "—"} years</span>
            </div>
            <div>
              <span className="block text-muted-foreground font-medium mb-0.5">Menopausal Status</span>
              <span className="font-semibold text-foreground capitalize">{demographics.menopausalStatus || "—"}</span>
            </div>
            <div className="sm:col-span-3">
              <span className="block text-muted-foreground font-medium mb-1">Race</span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(demographics.race).map(([key, val]) => {
                  if (key === "otherSpecify") return null;
                  if (!val) return null;
                  const labelMap: Record<string, string> = {
                    americanIndian: "American Indian/Alaska Native",
                    pacificIslander: "Native Hawaiian/Pacific Islander",
                    black: "Black/African American",
                    asian: "Asian",
                    white: "White",
                    other: `Other (${demographics.race.otherSpecify || "Not Specified"})`,
                  };
                  return (
                    <span key={key} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 border border-border text-foreground">
                      {labelMap[key] || key}
                    </span>
                  );
                })}
                {!Object.values(demographics.race).some(Boolean) && (
                  <span className="text-muted-foreground/60">—</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Disease History */}
        <div className="bg-card text-card-foreground border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 shadow-xs">
          {renderSectionHeader("2. Disease History & Pathology", 2, Stethoscope)}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="block text-muted-foreground font-medium mb-0.5">Diagnosis Date</span>
              <span className="font-semibold text-foreground">{formatDateVal(diseaseHistory.diagnosisDate)}</span>
            </div>
            <div>
              <span className="block text-muted-foreground font-medium mb-0.5">Histopathological Type</span>
              <span className="font-semibold text-foreground">{diseaseHistory.histopathologicalType || "—"}</span>
            </div>
            <div>
              <span className="block text-muted-foreground font-medium mb-0.5">Tumor Size (cm)</span>
              <span className="font-semibold text-foreground">{diseaseHistory.tumorSize || "—"} cm</span>
            </div>
            <div>
              <span className="block text-muted-foreground font-medium mb-0.5">ER Status</span>
              <span className="font-semibold text-foreground capitalize">{diseaseHistory.erStatus || "—"}</span>
            </div>
            <div>
              <span className="block text-muted-foreground font-medium mb-0.5">PR Status</span>
              <span className="font-semibold text-foreground capitalize">{diseaseHistory.prStatus || "—"}</span>
            </div>
            <div>
              <span className="block text-muted-foreground font-medium mb-0.5">HER2 Status</span>
              <span className="font-semibold text-foreground capitalize">{diseaseHistory.her2Status || "—"}</span>
            </div>
            <div>
              <span className="block text-muted-foreground font-medium mb-0.5">Ki-67 Index</span>
              <span className="font-semibold text-foreground">{diseaseHistory.ki67 ? `${diseaseHistory.ki67}%` : "—"}</span>
            </div>
            <div>
              <span className="block text-muted-foreground font-medium mb-0.5">pTNM Stage</span>
              <span className="font-semibold text-foreground uppercase">{diseaseHistory.ptnm || "—"}</span>
            </div>
            <div>
              <span className="block text-muted-foreground font-medium mb-0.5">Nodal Status</span>
              <span className="font-semibold text-foreground">{diseaseHistory.nodalStatus || "—"}</span>
            </div>
            <div>
              <span className="block text-muted-foreground font-medium mb-0.5">Tumor Grade</span>
              <span className="font-semibold text-foreground">{diseaseHistory.tumorGrade || "—"}</span>
            </div>
            <div>
              <span className="block text-muted-foreground font-medium mb-0.5">Oncotype DX Date</span>
              <span className="font-semibold text-foreground">{formatDateVal(diseaseHistory.oncotypeDate)}</span>
            </div>
            <div>
              <span className="block text-muted-foreground font-medium mb-0.5">Oncotype DX Recurrence Score</span>
              <span className="font-semibold text-foreground">{diseaseHistory.oncotypeResult || "—"}</span>
            </div>
          </div>
        </div>

        {/* Step 3: Treatment Administered */}
        <div className="bg-card text-card-foreground border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 shadow-xs">
          {renderSectionHeader("3. Treatment Administered", 3, Pill)}
          <div className="flex flex-col gap-4 text-xs">
            <div>
              <span className="block text-muted-foreground font-medium mb-1.5">Administered Modalities</span>
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5 font-medium">
                  {formatBool(treatment.types.chemo)} Chemotherapy
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  {formatBool(treatment.types.hormonal)} Hormonal Therapy
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  {formatBool(treatment.types.radio)} Radiotherapy
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  {formatBool(treatment.types.surgery)} Surgery
                </span>
              </div>
            </div>

            {/* Chemotherapy Rows */}
            {treatment.types.chemo && treatment.chemoRows.length > 0 && (
              <div className="mt-2">
                <span className="block text-muted-foreground font-semibold mb-1 text-[10px] uppercase tracking-wider">Chemotherapy Detail</span>
                <div className="border border-border rounded overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-100 dark:bg-zinc-800/60 font-semibold border-b border-border text-[10px]">
                        <th className="p-2">Agent</th>
                        <th className="p-2">Setting</th>
                        <th className="p-2">Cycles</th>
                        <th className="p-2">Dose</th>
                        <th className="p-2">Last Cycle Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {treatment.chemoRows.map((row) => (
                        <tr key={row.id}>
                          <td className="p-2 font-medium">{row.agent || "—"}</td>
                          <td className="p-2">{row.setting || "—"}</td>
                          <td className="p-2">{row.cycles || "—"}</td>
                          <td className="p-2">{row.dose || "—"}</td>
                          <td className="p-2">{formatDateVal(row.lastCycleDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Hormonal Therapy Rows */}
            {treatment.types.hormonal && treatment.hormonalRows.length > 0 && (
              <div className="mt-2">
                <span className="block text-muted-foreground font-semibold mb-1 text-[10px] uppercase tracking-wider">Hormonal Therapy Detail</span>
                <div className="border border-border rounded overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-100 dark:bg-zinc-800/60 font-semibold border-b border-border text-[10px]">
                        <th className="p-2">Agent</th>
                        <th className="p-2">Setting</th>
                        <th className="p-2">Cycles</th>
                        <th className="p-2">Dose</th>
                        <th className="p-2">Last Cycle Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {treatment.hormonalRows.map((row) => (
                        <tr key={row.id}>
                          <td className="p-2 font-medium">{row.agent || "—"}</td>
                          <td className="p-2">{row.setting || "—"}</td>
                          <td className="p-2">{row.cycles || "—"}</td>
                          <td className="p-2">{row.dose || "—"}</td>
                          <td className="p-2">{formatDateVal(row.lastCycleDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Radiotherapy Rows */}
            {treatment.types.radio && treatment.radioRows.length > 0 && (
              <div className="mt-2">
                <span className="block text-muted-foreground font-semibold mb-1 text-[10px] uppercase tracking-wider">Radiotherapy Detail</span>
                <div className="border border-border rounded overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-100 dark:bg-zinc-800/60 font-semibold border-b border-border text-[10px]">
                        <th className="p-2">Type</th>
                        <th className="p-2">Setting</th>
                        <th className="p-2">Organs</th>
                        <th className="p-2">Dose</th>
                        <th className="p-2">Last Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {treatment.radioRows.map((row) => (
                        <tr key={row.id}>
                          <td className="p-2 font-medium">{row.type || "—"}</td>
                          <td className="p-2">{row.setting || "—"}</td>
                          <td className="p-2">{row.organs || "—"}</td>
                          <td className="p-2">{row.dose || "—"}</td>
                          <td className="p-2">{formatDateVal(row.lastCycleDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Surgery Rows */}
            {treatment.types.surgery && treatment.surgeryRows.length > 0 && (
              <div className="mt-2">
                <span className="block text-muted-foreground font-semibold mb-1 text-[10px] uppercase tracking-wider">Surgery Detail</span>
                <div className="border border-border rounded overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-100 dark:bg-zinc-800/60 font-semibold border-b border-border text-[10px]">
                        <th className="p-2">Surgery Name</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {treatment.surgeryRows.map((row) => (
                        <tr key={row.id}>
                          <td className="p-2 font-medium">{row.name || "—"}</td>
                          <td className="p-2">{formatDateVal(row.date)}</td>
                          <td className="p-2">{row.details || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 4 & 5: Inclusion & Exclusion Criteria */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Inclusion */}
          <div className="bg-card text-card-foreground border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 shadow-xs">
            {renderSectionHeader("4. Inclusion Criteria", 4, ShieldCheck)}
            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground">ECOG Performance Status ≤ 1</span>
                <span>{formatBool(inclusion.ecogStatus)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground">Early-stage breast cancer</span>
                <span>{formatBool(inclusion.earlyStage)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground">Hormone receptor positive (HR+)</span>
                <span>{formatBool(inclusion.hormonePositive)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground">HER2 receptor negative (HER2-)</span>
                <span>{formatBool(inclusion.her2Negative)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground">FFPE tumor tissue block available</span>
                <span>{formatBool(inclusion.ffpeAvailable)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Completed clinical follow-up data</span>
                <span>{formatBool(inclusion.clinicalDataAvailable)}</span>
              </div>
            </div>
          </div>

          {/* Exclusion */}
          <div className="bg-card text-card-foreground border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 shadow-xs">
            {renderSectionHeader("5. Exclusion Criteria", 5, ShieldCheck)}
            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground">DCIS only (no invasive component)</span>
                <span>{formatBool(exclusion.dcisOnly)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground">Metastatic breast cancer (Stage IV)</span>
                <span>{formatBool(exclusion.metastatic)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground">Inflammatory breast cancer</span>
                <span>{formatBool(exclusion.inflammatory)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground">Prior history of breast cancer</span>
                <span>{formatBool(exclusion.priorBreastCancer)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground">Insufficient clinical/demographic data</span>
                <span>{formatBool(exclusion.insufficientData)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground">Insufficient tumor tissue / low yield</span>
                <span>{formatBool(exclusion.insufficientTissue)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Neoadjuvant systemic therapy</span>
                <span>{formatBool(exclusion.neoadjuvantTherapy)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 6: Disease Progression */}
        <div className="bg-card text-card-foreground border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 shadow-xs">
          {renderSectionHeader("6. Disease Progression", 6, LineChart)}
          {progression.length > 0 ? (
            <div className="border border-border rounded overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-100 dark:bg-zinc-800/60 font-semibold border-b border-border text-[10px]">
                    <th className="p-2">Test Date</th>
                    <th className="p-2">Test Performed</th>
                    <th className="p-2">Results</th>
                    <th className="p-2">Comments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {progression.map((row) => (
                    <tr key={row.id}>
                      <td className="p-2">{formatDateVal(row.testDate)}</td>
                      <td className="p-2 font-medium">{row.testPerformed || "—"}</td>
                      <td className="p-2">{row.results || "—"}</td>
                      <td className="p-2 text-muted-foreground">{row.comment || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 border border-dashed border-border rounded-lg text-xs text-muted-foreground/80">
              No progression events reported
            </div>
          )}
        </div>

        {/* Step 7 & 8: Survival Status & BreastRS Outcome */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Survival Status */}
          <div className="bg-card text-card-foreground border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 shadow-xs">
            {renderSectionHeader("7. Survival Status", 7, Heart)}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="block text-muted-foreground font-medium mb-0.5">Survival Status</span>
                <span className="font-semibold text-foreground">
                  {survival.isAlive === "Yes" ? (
                    <span className="text-emerald-600 dark:text-emerald-400">Alive</span>
                  ) : survival.isAlive === "No" ? (
                    <span className="text-rose-600 dark:text-rose-400">Deceased</span>
                  ) : (
                    "—"
                  )}
                </span>
              </div>
              {survival.isAlive === "Yes" && (
                <div>
                  <span className="block text-muted-foreground font-medium mb-0.5">Last Contact Date</span>
                  <span className="font-semibold text-foreground">{formatDateVal(survival.lastContactDate)}</span>
                </div>
              )}
              {survival.isAlive === "No" && (
                <>
                  <div>
                    <span className="block text-muted-foreground font-medium mb-0.5">Date of Death</span>
                    <span className="font-semibold text-foreground">{formatDateVal(survival.deathDate)}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-muted-foreground font-medium mb-0.5">Cause of Death</span>
                    <span className="font-semibold text-foreground">{survival.deathReason || "—"}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* BreastRS Outcome */}
          <div className="bg-card text-card-foreground border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 shadow-xs">
            {renderSectionHeader("8. BreastRS Outcome", 8, Award)}
            <div className="text-xs">
              <span className="block text-muted-foreground font-medium mb-1">OncoPredikt® BreastRS Result</span>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-border rounded-lg font-mono text-foreground font-semibold">
                {breastRS.result || "No outcome details entered"}
              </div>
            </div>
          </div>
        </div>

        {/* Step 9: Investigator Declaration */}
        <div className="bg-card text-card-foreground border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 shadow-xs">
          {renderSectionHeader("9. Investigator Declaration", 9, FileCheck)}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="block text-muted-foreground font-medium mb-0.5">Signed By (Signature Name)</span>
              <span className="font-semibold text-foreground text-sm font-serif italic border-b border-border/80 pb-0.5 inline-block min-w-48">
                {declaration.signature || <span className="text-rose-500 font-sans not-italic text-xs">Signature Missing</span>}
              </span>
            </div>
            <div>
              <span className="block text-muted-foreground font-medium mb-0.5">Declaration Date</span>
              <span className="font-semibold text-foreground">
                {declaration.date ? (
                  formatDateVal(declaration.date)
                ) : (
                  <span className="text-rose-500 text-xs font-semibold">Date Missing</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
