"use client";

import React from "react";
import { format, differenceInYears, differenceInDays, differenceInMonths } from "date-fns";
import { Calendar as CalendarIcon, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export interface DiseaseHistoryData {
  diagnosisDate: Date | undefined;
  erStatus: string;
  prStatus: string;
  her2Status: string;
  ki67: string;
  histopathologicalType: string;
  tumorSize: string;
  ptnm: string;
  nodalStatus: string;
  tumorGrade: string;
  oncotypeDate: Date | undefined;
  oncotypeResult: string;
}

interface DiseaseHistoryStepPanelProps {
  data: DiseaseHistoryData;
  onChange: (updater: (prev: DiseaseHistoryData) => DiseaseHistoryData) => void;
  dob?: Date;
}

export function DiseaseHistoryStepPanel({ data, onChange, dob }: DiseaseHistoryStepPanelProps) {
  const [isDiagnosisCalOpen, setIsDiagnosisCalOpen] = React.useState(false);
  const [isOncotypeCalOpen, setIsOncotypeCalOpen] = React.useState(false);

  const getIntervalString = (start: Date, end: Date) => {
    const days = differenceInDays(end, start);
    if (days < 0) return "";
    if (days < 14) return `${days} days`;
    const weeks = Math.floor(days / 7);
    if (weeks < 8) return `${weeks} weeks`;
    const months = differenceInMonths(end, start);
    return `${months} months`;
  };
  
  const handleDateChange = (field: "diagnosisDate" | "oncotypeDate", date: Date | undefined) => {
    onChange((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleFieldChange = (field: keyof DiseaseHistoryData, value: string) => {
    onChange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleCheckbox = (field: keyof DiseaseHistoryData, value: string) => {
    onChange((prev) => ({
      ...prev,
      [field]: prev[field] === value ? "" : value,
    }));
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl p-6 w-full animate-in fade-in duration-200">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">2. Disease History</h2>
          <p className="text-xs text-muted-foreground">General patient disease baseline history</p>
        </div>
      </div>

      {/* Disease History Card Styled to mimic paper form */}
      <div className="border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden bg-card text-card-foreground shadow-xs">
        {/* Card Title */}
        <div className="bg-zinc-200 dark:bg-zinc-800 px-4 py-2.5 font-bold text-sm text-zinc-800 dark:text-zinc-200 border-b border-zinc-300 dark:border-zinc-700">
          Disease history
        </div>

        {/* Row 1: Date of diagnosis */}
        <div className="p-4 flex flex-col md:flex-row md:items-center gap-4 border-b border-zinc-300 dark:border-zinc-700">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 md:w-80 shrink-0">
            Date of diagnosis of breast cancer disease:
          </span>
          <div className="flex items-center gap-2">
            <Popover open={isDiagnosisCalOpen} onOpenChange={setIsDiagnosisCalOpen}>
              <PopoverTrigger
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-48 justify-start text-left font-normal h-9 text-xs rounded-lg border-zinc-300 dark:border-zinc-700 cursor-pointer",
                  !data.diagnosisDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                {data.diagnosisDate ? format(data.diagnosisDate, "dd MMM yyyy") : <span>Pick a date</span>}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50 bg-background" align="start">
                <Calendar
                  mode="single"
                  selected={data.diagnosisDate}
                  onSelect={(date) => {
                    handleDateChange("diagnosisDate", date);
                    setIsDiagnosisCalOpen(false);
                  }}
                  captionLayout="dropdown"
                  startMonth={new Date(1900, 0)}
                  endMonth={new Date()}
                  disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>

            {data.diagnosisDate && dob && (
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold ml-2">
                (Age at diagnosis: {differenceInYears(data.diagnosisDate, dob)} years)
              </span>
            )}
          </div>
        </div>

        {/* Row 2: Receptor status */}
        <div className="p-4 border-b border-zinc-300 dark:border-zinc-700 flex flex-col gap-4">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 shrink-0">
            Receptor status:
          </span>

          <div className="flex flex-col gap-4 pl-4">
            {/* ER Status */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 w-20 shrink-0">
                ER:
              </span>
              <div className="flex flex-row flex-wrap gap-5 items-center">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="er-pos"
                    checked={data.erStatus === "Positive"}
                    onCheckedChange={() => toggleCheckbox("erStatus", "Positive")}
                    className="rounded border-zinc-300 dark:border-zinc-700"
                  />
                  <label htmlFor="er-pos" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">Positive</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="er-neg"
                    checked={data.erStatus === "Negative"}
                    onCheckedChange={() => toggleCheckbox("erStatus", "Negative")}
                    className="rounded border-zinc-300 dark:border-zinc-700"
                  />
                  <label htmlFor="er-neg" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">Negative</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="er-ihc"
                    checked={data.erStatus === "Inconclusive by IHC"}
                    onCheckedChange={() => toggleCheckbox("erStatus", "Inconclusive by IHC")}
                    className="rounded border-zinc-300 dark:border-zinc-700"
                  />
                  <label htmlFor="er-ihc" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">Inconclusive by IHC</label>
                </div>
              </div>
            </div>

            {/* PR Status */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 w-20 shrink-0">
                PR:
              </span>
              <div className="flex flex-row flex-wrap gap-5 items-center">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="pr-pos"
                    checked={data.prStatus === "Positive"}
                    onCheckedChange={() => toggleCheckbox("prStatus", "Positive")}
                    className="rounded border-zinc-300 dark:border-zinc-700"
                  />
                  <label htmlFor="pr-pos" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">Positive</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="pr-neg"
                    checked={data.prStatus === "Negative"}
                    onCheckedChange={() => toggleCheckbox("prStatus", "Negative")}
                    className="rounded border-zinc-300 dark:border-zinc-700"
                  />
                  <label htmlFor="pr-neg" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">Negative</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="pr-ihc"
                    checked={data.prStatus === "Inconclusive by IHC"}
                    onCheckedChange={() => toggleCheckbox("prStatus", "Inconclusive by IHC")}
                    className="rounded border-zinc-300 dark:border-zinc-700"
                  />
                  <label htmlFor="pr-ihc" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">Inconclusive by IHC</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="pr-nd"
                    checked={data.prStatus === "Not done"}
                    onCheckedChange={() => toggleCheckbox("prStatus", "Not done")}
                    className="rounded border-zinc-300 dark:border-zinc-700"
                  />
                  <label htmlFor="pr-nd" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">Not done</label>
                </div>
              </div>
            </div>

            {/* HER2 Status */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 w-20 shrink-0">
                HER2:
              </span>
              <div className="flex flex-row flex-wrap gap-5 items-center">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="her2-pos"
                    checked={data.her2Status === "Positive"}
                    onCheckedChange={() => toggleCheckbox("her2Status", "Positive")}
                    className="rounded border-zinc-300 dark:border-zinc-700"
                  />
                  <label htmlFor="her2-pos" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">Positive</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="her2-neg"
                    checked={data.her2Status === "Negative"}
                    onCheckedChange={() => toggleCheckbox("her2Status", "Negative")}
                    className="rounded border-zinc-300 dark:border-zinc-700"
                  />
                  <label htmlFor="her2-neg" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">Negative</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="her2-eq"
                    checked={data.her2Status === "Equivocal"}
                    onCheckedChange={() => toggleCheckbox("her2Status", "Equivocal")}
                    className="rounded border-zinc-300 dark:border-zinc-700"
                  />
                  <label htmlFor="her2-eq" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">Equivocal</label>
                </div>
              </div>
            </div>

            {/* Ki67 Status */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 w-20 shrink-0">
                Ki67 status:
              </span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  placeholder="e.g. 18"
                  value={data.ki67}
                  onChange={(e) => handleFieldChange("ki67", e.target.value)}
                  className="h-9 w-24 text-xs rounded-lg border-zinc-300 dark:border-zinc-700"
                />
                <span className="text-xs text-muted-foreground font-semibold">
                  %
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Histopathological type */}
        <div className="p-4 border-b border-zinc-300 dark:border-zinc-700 flex flex-col md:flex-row md:items-center gap-4">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 md:w-36 shrink-0">
            Histopathological type:
          </span>
          <Input
            placeholder="e.g. Invasive ductal carcinoma"
            value={data.histopathologicalType}
            onChange={(e) => handleFieldChange("histopathologicalType", e.target.value)}
            className="h-9 text-xs flex-1 rounded-lg border-zinc-300 dark:border-zinc-700"
          />
        </div>

        {/* Row 4: Tumor size and pTNM */}
        <div className="flex flex-col sm:flex-row border-b border-zinc-300 dark:border-zinc-700">
          {/* Tumor Size */}
          <div className="flex-1 p-4 flex items-center gap-4">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 w-24 shrink-0">
              Tumor size:
            </span>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.1"
                placeholder="e.g. 2.1"
                value={data.tumorSize}
                onChange={(e) => handleFieldChange("tumorSize", e.target.value)}
                className="h-9 w-24 text-xs rounded-lg border-zinc-300 dark:border-zinc-700 text-center font-mono"
              />
              <span className="text-xs text-muted-foreground font-medium">
                cms
              </span>
            </div>
          </div>

          {/* pTNM */}
          <div className="p-4 sm:border-l border-zinc-300 dark:border-zinc-700 flex-1 flex items-center gap-4">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 w-16 shrink-0">
              pTNM:
            </span>
            <Input
              placeholder="e.g. pT2 pN1a cM0 (Stage IIB)"
              value={data.ptnm}
              onChange={(e) => handleFieldChange("ptnm", e.target.value)}
              className="h-9 text-xs flex-1 rounded-lg border-zinc-300 dark:border-zinc-700"
            />
          </div>
        </div>

        {/* Row 5: Nodal status */}
        <div className="p-4 border-b border-zinc-300 dark:border-zinc-700 flex flex-col md:flex-row items-start gap-4">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 md:w-36 shrink-0 mt-0.5">
            Nodal status:
          </span>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {/* Column 1 */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <Checkbox
                  id="nodal-neg"
                  checked={data.nodalStatus === "Negative"}
                  onCheckedChange={() => toggleCheckbox("nodalStatus", "Negative")}
                  className="rounded border-zinc-300 dark:border-zinc-700"
                />
                <label htmlFor="nodal-neg" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">
                  Negative
                </label>
              </div>

              <div className="flex items-center gap-2.5">
                <Checkbox
                  id="nodal-pos13"
                  checked={data.nodalStatus === "Positive 1-3"}
                  onCheckedChange={() => toggleCheckbox("nodalStatus", "Positive 1-3")}
                  className="rounded border-zinc-300 dark:border-zinc-700"
                />
                <label htmlFor="nodal-pos13" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">
                  Positive 1-3
                </label>
              </div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="nodal-micro"
                  checked={data.nodalStatus === "Micromets pNmi (0.2-2.0mm)"}
                  onCheckedChange={() => toggleCheckbox("nodalStatus", "Micromets pNmi (0.2-2.0mm)")}
                  className="rounded border-zinc-300 dark:border-zinc-700 mt-0.5"
                />
                <label htmlFor="nodal-micro" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none leading-normal">
                  Micromets <span className="text-[10px] text-muted-foreground font-normal">pNmi (0.2-2.0mm)</span>
                </label>
              </div>

              <div className="flex items-center gap-2.5">
                <Checkbox
                  id="nodal-pos49"
                  checked={data.nodalStatus === "Positive 4-9"}
                  onCheckedChange={() => toggleCheckbox("nodalStatus", "Positive 4-9")}
                  className="rounded border-zinc-300 dark:border-zinc-700"
                />
                <label htmlFor="nodal-pos49" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">
                  Positive 4-9
                </label>
              </div>

              <div className="flex items-center gap-2.5">
                <Checkbox
                  id="nodal-unk"
                  checked={data.nodalStatus === "Unknown"}
                  onCheckedChange={() => toggleCheckbox("nodalStatus", "Unknown")}
                  className="rounded border-zinc-300 dark:border-zinc-700"
                />
                <label htmlFor="nodal-unk" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">
                  Unknown
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Row 6: Tumor grade */}
        <div className="p-4 border-b border-zinc-300 dark:border-zinc-700 flex flex-col md:flex-row items-start md:items-center gap-4">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 md:w-36 shrink-0">
            Tumor grade:
          </span>
          <div className="flex-1 flex flex-row flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
              <Checkbox
                id="grade-1"
                checked={data.tumorGrade === "Grade 1"}
                onCheckedChange={() => toggleCheckbox("tumorGrade", "Grade 1")}
                className="rounded border-zinc-300 dark:border-zinc-700"
              />
              <label htmlFor="grade-1" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">
                Grade 1
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="grade-2"
                checked={data.tumorGrade === "Grade 2"}
                onCheckedChange={() => toggleCheckbox("tumorGrade", "Grade 2")}
                className="rounded border-zinc-300 dark:border-zinc-700"
              />
              <label htmlFor="grade-2" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">
                Grade 2
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="grade-3"
                checked={data.tumorGrade === "Grade 3"}
                onCheckedChange={() => toggleCheckbox("tumorGrade", "Grade 3")}
                className="rounded border-zinc-300 dark:border-zinc-700"
              />
              <label htmlFor="grade-3" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">
                Grade 3
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="grade-unk"
                checked={data.tumorGrade === "Unknown"}
                onCheckedChange={() => toggleCheckbox("tumorGrade", "Unknown")}
                className="rounded border-zinc-300 dark:border-zinc-700"
              />
              <label htmlFor="grade-unk" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">
                Unknown
              </label>
            </div>
          </div>
        </div>

        {/* Row 7: Date of OncotypeDx test */}
        <div className="p-4 flex flex-col md:flex-row md:items-center gap-4 border-b border-zinc-300 dark:border-zinc-700">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 md:w-80 shrink-0">
            Date of OncotypeDx test:
          </span>
          <div className="flex items-center gap-2">
            <Popover open={isOncotypeCalOpen} onOpenChange={setIsOncotypeCalOpen}>
              <PopoverTrigger
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-48 justify-start text-left font-normal h-9 text-xs rounded-lg border-zinc-300 dark:border-zinc-700 cursor-pointer",
                  !data.oncotypeDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                {data.oncotypeDate ? format(data.oncotypeDate, "dd MMM yyyy") : <span>Pick a date</span>}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50 bg-background" align="start">
                <Calendar
                  mode="single"
                  selected={data.oncotypeDate}
                  onSelect={(date) => {
                    handleDateChange("oncotypeDate", date);
                    setIsOncotypeCalOpen(false);
                  }}
                  captionLayout="dropdown"
                  startMonth={new Date(1900, 0)}
                  endMonth={new Date()}
                  disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>

            {data.oncotypeDate && data.diagnosisDate && (
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold ml-2">
                ({getIntervalString(data.diagnosisDate, data.oncotypeDate)} after diagnosis)
              </span>
            )}
          </div>
        </div>

        {/* Row 8: Result of OncotypeDx test */}
        <div className="p-4 flex flex-col md:flex-row md:items-center gap-4">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 md:w-48 shrink-0">
            Result of OncotypeDx test:
          </span>
          <Input
            placeholder="e.g. 24"
            value={data.oncotypeResult}
            onChange={(e) => handleFieldChange("oncotypeResult", e.target.value)}
            className="h-9 text-xs flex-1 rounded-lg border-zinc-300 dark:border-zinc-700"
          />
        </div>
      </div>
    </div>
  );
}
