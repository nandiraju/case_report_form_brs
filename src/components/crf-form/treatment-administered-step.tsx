"use client";

import React, { useState } from "react";
import { format, differenceInDays, differenceInMonths } from "date-fns";
import { Calendar as CalendarIcon, Plus, Trash2, Pill, Activity, ShieldCheck, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Row types
export interface ChemoRow {
  id: string;
  agent: string;
  cycles: string;
  dose: string;
  lastCycleDate: Date | undefined;
  setting: string;
}

export interface HormonalRow {
  id: string;
  agent: string;
  cycles: string;
  dose: string;
  lastCycleDate: Date | undefined;
  setting: string;
}

export interface RadioRow {
  id: string;
  type: string;
  organs: string;
  cycles: string;
  dose: string;
  lastCycleDate: Date | undefined;
  setting: string;
}

export interface SurgeryRow {
  id: string;
  name: string;
  date: Date | undefined;
  details: string;
}

export interface TreatmentAdministeredData {
  types: {
    chemo: boolean;
    radio: boolean;
    hormonal: boolean;
    surgery: boolean;
  };
  chemoRows: ChemoRow[];
  hormonalRows: HormonalRow[];
  radioRows: RadioRow[];
  surgeryRows: SurgeryRow[];
}

interface TreatmentAdministeredStepPanelProps {
  data: TreatmentAdministeredData;
  onChange: (updater: (prev: TreatmentAdministeredData) => TreatmentAdministeredData) => void;
  diagnosisDate?: Date;
}

export function TreatmentAdministeredStepPanel({ data, onChange, diagnosisDate }: TreatmentAdministeredStepPanelProps) {
  const getIntervalString = (start: Date, end: Date) => {
    const days = differenceInDays(end, start);
    if (days < 0) return "";
    if (days < 14) return `${days} days`;
    const weeks = Math.floor(days / 7);
    if (weeks < 8) return `${weeks} weeks`;
    const months = differenceInMonths(end, start);
    return `${months} months`;
  };
  // Local state for the add-row forms
  const [isChemoCalOpen, setIsChemoCalOpen] = useState(false);
  const [isHormonalCalOpen, setIsHormonalCalOpen] = useState(false);
  const [isRadioCalOpen, setIsRadioCalOpen] = useState(false);
  const [isSurgeryCalOpen, setIsSurgeryCalOpen] = useState(false);

  const [chemoForm, setChemoForm] = useState<Omit<ChemoRow, "id">>({ agent: "", cycles: "", dose: "", lastCycleDate: undefined, setting: "" });
  const [hormonalForm, setHormonalForm] = useState<Omit<HormonalRow, "id">>({ agent: "", cycles: "", dose: "", lastCycleDate: undefined, setting: "" });
  const [radioForm, setRadioForm] = useState<Omit<RadioRow, "id">>({ type: "", organs: "", cycles: "", dose: "", lastCycleDate: undefined, setting: "" });
  const [surgeryForm, setSurgeryForm] = useState<Omit<SurgeryRow, "id">>({ name: "", date: undefined, details: "" });

  const toggleType = (key: keyof TreatmentAdministeredData["types"]) => {
    onChange((prev) => ({
      ...prev,
      types: {
        ...prev.types,
        [key]: !prev.types[key],
      },
    }));
  };

  const handleAddChemo = () => {
    if (!chemoForm.agent || !chemoForm.cycles || !chemoForm.dose || !chemoForm.lastCycleDate || !chemoForm.setting) return;
    onChange((prev) => ({
      ...prev,
      chemoRows: [...prev.chemoRows, { ...chemoForm, id: Math.random().toString(36).substr(2, 9) }],
    }));
    setChemoForm({ agent: "", cycles: "", dose: "", lastCycleDate: undefined, setting: "" });
  };

  const handleAddHormonal = () => {
    if (!hormonalForm.agent || !hormonalForm.cycles || !hormonalForm.dose || !hormonalForm.lastCycleDate || !hormonalForm.setting) return;
    onChange((prev) => ({
      ...prev,
      hormonalRows: [...prev.hormonalRows, { ...hormonalForm, id: Math.random().toString(36).substr(2, 9) }],
    }));
    setHormonalForm({ agent: "", cycles: "", dose: "", lastCycleDate: undefined, setting: "" });
  };

  const handleAddRadio = () => {
    if (!radioForm.type || !radioForm.organs || !radioForm.cycles || !radioForm.dose || !radioForm.lastCycleDate || !radioForm.setting) return;
    onChange((prev) => ({
      ...prev,
      radioRows: [...prev.radioRows, { ...radioForm, id: Math.random().toString(36).substr(2, 9) }],
    }));
    setRadioForm({ type: "", organs: "", cycles: "", dose: "", lastCycleDate: undefined, setting: "" });
  };

  const handleAddSurgery = () => {
    if (!surgeryForm.name || !surgeryForm.date || !surgeryForm.details) return;
    onChange((prev) => ({
      ...prev,
      surgeryRows: [...prev.surgeryRows, { ...surgeryForm, id: Math.random().toString(36).substr(2, 9) }],
    }));
    setSurgeryForm({ name: "", date: undefined, details: "" });
  };

  const removeRow = (type: "chemoRows" | "hormonalRows" | "radioRows" | "surgeryRows", id: string) => {
    onChange((prev) => ({
      ...prev,
      [type]: prev[type].filter((row) => row.id !== id),
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
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">3. Treatment Administered</h2>
          <p className="text-xs text-muted-foreground">Oncology treatment administered history</p>
        </div>
      </div>

      {/* Main card */}
      <div className="border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden bg-card text-card-foreground shadow-xs">
        {/* Card Title */}
        <div className="bg-zinc-200 dark:bg-zinc-800 px-4 py-2.5 font-bold text-sm text-zinc-800 dark:text-zinc-200 border-b border-zinc-300 dark:border-zinc-700">
          Treatment administered
        </div>

        {/* Row 1: Treatment Administered Selectors */}
        <div className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4 border-b border-zinc-300 dark:border-zinc-700">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 md:w-48 shrink-0">
            Treatment administered:
          </span>
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2.5">
              <Checkbox
                id="tx-chemo"
                checked={data.types.chemo}
                onCheckedChange={() => toggleType("chemo")}
                className="rounded border-zinc-300 dark:border-zinc-700"
              />
              <label htmlFor="tx-chemo" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">
                Chemotherapy
              </label>
            </div>
            <div className="flex items-center gap-2.5">
              <Checkbox
                id="tx-hormonal"
                checked={data.types.hormonal}
                onCheckedChange={() => toggleType("hormonal")}
                className="rounded border-zinc-300 dark:border-zinc-700"
              />
              <label htmlFor="tx-hormonal" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">
                Hormonal / Immunotherapy
              </label>
            </div>
            <div className="flex items-center gap-2.5">
              <Checkbox
                id="tx-radio"
                checked={data.types.radio}
                onCheckedChange={() => toggleType("radio")}
                className="rounded border-zinc-300 dark:border-zinc-700"
              />
              <label htmlFor="tx-radio" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">
                Radiotherapy
              </label>
            </div>
            <div className="flex items-center gap-2.5">
              <Checkbox
                id="tx-surgery"
                checked={data.types.surgery}
                onCheckedChange={() => toggleType("surgery")}
                className="rounded border-zinc-300 dark:border-zinc-700"
              />
              <label htmlFor="tx-surgery" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">
                Surgery
              </label>
            </div>
          </div>
        </div>

        {/* 1. Chemotherapy Sub-form */}
        {data.types.chemo && (
          <div className="p-4 border-b border-zinc-300 dark:border-zinc-700 flex flex-col gap-4 bg-muted/5">
            <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-bold text-xs uppercase tracking-wider">
              <Pill className="h-4.5 w-4.5 text-blue-600 shrink-0" />
              Chemotherapy
            </div>

            {/* Table */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-background">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-xs font-bold text-foreground">Chemotherapeutic agent</TableHead>
                    <TableHead className="w-24 text-center text-xs font-bold text-foreground">Number of cycles</TableHead>
                    <TableHead className="text-xs font-bold text-foreground">Dose</TableHead>
                    <TableHead className="text-xs font-bold text-foreground">Date of last cycle</TableHead>
                    <TableHead className="text-xs font-bold text-foreground">Setting</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.chemoRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center p-6 text-xs text-muted-foreground">
                        No chemotherapy rows added yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.chemoRows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="text-xs font-semibold text-foreground">{row.agent}</TableCell>
                        <TableCell className="text-center text-xs font-semibold">{row.cycles}</TableCell>
                        <TableCell className="text-xs text-foreground">{row.dose}</TableCell>
                        <TableCell className="text-xs text-foreground">
                          <div>{row.lastCycleDate ? format(row.lastCycleDate, "dd MMM yyyy") : ""}</div>
                          {row.lastCycleDate && diagnosisDate && (
                            <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                              ({getIntervalString(diagnosisDate, row.lastCycleDate)} after diagnosis)
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-foreground font-semibold">{row.setting}</TableCell>
                        <TableCell className="text-center">
                          <button
                            onClick={() => removeRow("chemoRows", row.id)}
                            className="text-destructive hover:text-destructive/80 p-1 rounded-md hover:bg-destructive/10 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Inline Mini Adder */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-3 bg-muted/10">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Agent</span>
                <Input
                  placeholder="e.g. Paclitaxel"
                  value={chemoForm.agent}
                  onChange={(e) => setChemoForm((prev) => ({ ...prev, agent: e.target.value }))}
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Cycles</span>
                <Input
                  placeholder="e.g. 4"
                  value={chemoForm.cycles}
                  onChange={(e) => setChemoForm((prev) => ({ ...prev, cycles: e.target.value }))}
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Dose</span>
                <Input
                  placeholder="e.g. 80 mg/m²"
                  value={chemoForm.dose}
                  onChange={(e) => setChemoForm((prev) => ({ ...prev, dose: e.target.value }))}
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Last Cycle</span>
                <Popover open={isChemoCalOpen} onOpenChange={setIsChemoCalOpen}>
                  <PopoverTrigger
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full justify-start text-left font-normal h-8 text-xs rounded-lg border-zinc-300 dark:border-zinc-700 cursor-pointer",
                      !chemoForm.lastCycleDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    {chemoForm.lastCycleDate ? format(chemoForm.lastCycleDate, "dd MMM yyyy") : <span>Pick Date</span>}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50 bg-background" align="start">
                    <Calendar
                      mode="single"
                      selected={chemoForm.lastCycleDate}
                      onSelect={(date) => {
                        setChemoForm((prev) => ({ ...prev, lastCycleDate: date }));
                        setIsChemoCalOpen(false);
                      }}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Setting</span>
                <div className="flex items-center gap-1.5">
                  <Select value={chemoForm.setting} onValueChange={(val) => setChemoForm((prev) => ({ ...prev, setting: val || "" }))}>
                    <SelectTrigger className="h-8 text-xs flex-1">
                      <SelectValue placeholder="Setting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Adjuvant" className="text-xs">Adjuvant</SelectItem>
                      <SelectItem value="Neoadjuvant" className="text-xs">Neoadjuvant</SelectItem>
                      <SelectItem value="Metastatic" className="text-xs">Metastatic</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="icon" className="size-8 cursor-pointer shrink-0" onClick={handleAddChemo}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Hormonal therapy / Immunotherapy Sub-form */}
        {data.types.hormonal && (
          <div className="p-4 border-b border-zinc-300 dark:border-zinc-700 flex flex-col gap-4 bg-muted/5">
            <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="h-4.5 w-4.5 text-blue-600 shrink-0" />
              Hormonal therapy / Immunotherapy
            </div>

            {/* Table */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-background">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-xs font-bold text-foreground">Hormonal / Immunotherapy agent</TableHead>
                    <TableHead className="w-24 text-center text-xs font-bold text-foreground">Number of cycles</TableHead>
                    <TableHead className="text-xs font-bold text-foreground">Dose</TableHead>
                    <TableHead className="text-xs font-bold text-foreground">Date of last cycle</TableHead>
                    <TableHead className="text-xs font-bold text-foreground">Setting</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.hormonalRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center p-6 text-xs text-muted-foreground">
                        No hormonal/immunotherapy rows added yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.hormonalRows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="text-xs font-semibold text-foreground">{row.agent}</TableCell>
                        <TableCell className="text-center text-xs font-semibold">{row.cycles}</TableCell>
                        <TableCell className="text-xs text-foreground">{row.dose}</TableCell>
                        <TableCell className="text-xs text-foreground">
                          <div>{row.lastCycleDate ? format(row.lastCycleDate, "dd MMM yyyy") : ""}</div>
                          {row.lastCycleDate && diagnosisDate && (
                            <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                              ({getIntervalString(diagnosisDate, row.lastCycleDate)} after diagnosis)
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-foreground font-semibold">{row.setting}</TableCell>
                        <TableCell className="text-center">
                          <button
                            onClick={() => removeRow("hormonalRows", row.id)}
                            className="text-destructive hover:text-destructive/80 p-1 rounded-md hover:bg-destructive/10 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Inline Mini Adder */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-3 bg-muted/10">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Agent</span>
                <Input
                  placeholder="e.g. Tamoxifen"
                  value={hormonalForm.agent}
                  onChange={(e) => setHormonalForm((prev) => ({ ...prev, agent: e.target.value }))}
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Cycles</span>
                <Input
                  placeholder="e.g. 24"
                  value={hormonalForm.cycles}
                  onChange={(e) => setHormonalForm((prev) => ({ ...prev, cycles: e.target.value }))}
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Dose</span>
                <Input
                  placeholder="e.g. 20 mg daily"
                  value={hormonalForm.dose}
                  onChange={(e) => setHormonalForm((prev) => ({ ...prev, dose: e.target.value }))}
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Last Cycle</span>
                <Popover open={isHormonalCalOpen} onOpenChange={setIsHormonalCalOpen}>
                  <PopoverTrigger
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full justify-start text-left font-normal h-8 text-xs rounded-lg border-zinc-300 dark:border-zinc-700 cursor-pointer",
                      !hormonalForm.lastCycleDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    {hormonalForm.lastCycleDate ? format(hormonalForm.lastCycleDate, "dd MMM yyyy") : <span>Pick Date</span>}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50 bg-background" align="start">
                    <Calendar
                      mode="single"
                      selected={hormonalForm.lastCycleDate}
                      onSelect={(date) => {
                        setHormonalForm((prev) => ({ ...prev, lastCycleDate: date }));
                        setIsHormonalCalOpen(false);
                      }}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Setting</span>
                <div className="flex items-center gap-1.5">
                  <Select value={hormonalForm.setting} onValueChange={(val) => setHormonalForm((prev) => ({ ...prev, setting: val || "" }))}>
                    <SelectTrigger className="h-8 text-xs flex-1">
                      <SelectValue placeholder="Setting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Adjuvant" className="text-xs">Adjuvant</SelectItem>
                      <SelectItem value="Neoadjuvant" className="text-xs">Neoadjuvant</SelectItem>
                      <SelectItem value="Metastatic" className="text-xs">Metastatic</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="icon" className="size-8 cursor-pointer shrink-0" onClick={handleAddHormonal}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Radiotherapy Sub-form */}
        {data.types.radio && (
          <div className="p-4 border-b border-zinc-300 dark:border-zinc-700 flex flex-col gap-4 bg-muted/5">
            <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-bold text-xs uppercase tracking-wider">
              <Activity className="h-4.5 w-4.5 text-blue-600 shrink-0" />
              Radiotherapy
            </div>

            {/* Table */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-background">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-xs font-bold text-foreground">Type</TableHead>
                    <TableHead className="text-xs font-bold text-foreground">Organs irradiated</TableHead>
                    <TableHead className="w-24 text-center text-xs font-bold text-foreground">Number of cycles</TableHead>
                    <TableHead className="text-xs font-bold text-foreground">Dose</TableHead>
                    <TableHead className="text-xs font-bold text-foreground">Date of last cycle</TableHead>
                    <TableHead className="text-xs font-bold text-foreground">Setting</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.radioRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center p-6 text-xs text-muted-foreground">
                        No radiotherapy rows added yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.radioRows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="text-xs font-semibold text-foreground">{row.type}</TableCell>
                        <TableCell className="text-xs text-foreground font-semibold">{row.organs}</TableCell>
                        <TableCell className="text-center text-xs font-semibold">{row.cycles}</TableCell>
                        <TableCell className="text-xs text-foreground">{row.dose}</TableCell>
                        <TableCell className="text-xs text-foreground">
                          <div>{row.lastCycleDate ? format(row.lastCycleDate, "dd MMM yyyy") : ""}</div>
                          {row.lastCycleDate && diagnosisDate && (
                            <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                              ({getIntervalString(diagnosisDate, row.lastCycleDate)} after diagnosis)
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-foreground font-semibold">{row.setting}</TableCell>
                        <TableCell className="text-center">
                          <button
                            onClick={() => removeRow("radioRows", row.id)}
                            className="text-destructive hover:text-destructive/80 p-1 rounded-md hover:bg-destructive/10 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Inline Mini Adder */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 items-end border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-3 bg-muted/10">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Type</span>
                <Input
                  placeholder="e.g. EBRT"
                  value={radioForm.type}
                  onChange={(e) => setRadioForm((prev) => ({ ...prev, type: e.target.value }))}
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Organs</span>
                <Input
                  placeholder="e.g. Whole breast"
                  value={radioForm.organs}
                  onChange={(e) => setRadioForm((prev) => ({ ...prev, organs: e.target.value }))}
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Cycles</span>
                <Input
                  placeholder="e.g. 25"
                  value={radioForm.cycles}
                  onChange={(e) => setRadioForm((prev) => ({ ...prev, cycles: e.target.value }))}
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Dose</span>
                <Input
                  placeholder="e.g. 50 Gy"
                  value={radioForm.dose}
                  onChange={(e) => setRadioForm((prev) => ({ ...prev, dose: e.target.value }))}
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Last Cycle</span>
                <Popover open={isRadioCalOpen} onOpenChange={setIsRadioCalOpen}>
                  <PopoverTrigger
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full justify-start text-left font-normal h-8 text-xs rounded-lg border-zinc-300 dark:border-zinc-700 cursor-pointer",
                      !radioForm.lastCycleDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    {radioForm.lastCycleDate ? format(radioForm.lastCycleDate, "dd MMM yyyy") : <span>Pick Date</span>}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50 bg-background" align="start">
                    <Calendar
                      mode="single"
                      selected={radioForm.lastCycleDate}
                      onSelect={(date) => {
                        setRadioForm((prev) => ({ ...prev, lastCycleDate: date }));
                        setIsRadioCalOpen(false);
                      }}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Setting</span>
                <div className="flex items-center gap-1.5">
                  <Select value={radioForm.setting} onValueChange={(val) => setRadioForm((prev) => ({ ...prev, setting: val || "" }))}>
                    <SelectTrigger className="h-8 text-xs flex-1">
                      <SelectValue placeholder="Setting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Adjuvant" className="text-xs">Adjuvant</SelectItem>
                      <SelectItem value="Neoadjuvant" className="text-xs">Neoadjuvant</SelectItem>
                      <SelectItem value="Palliative" className="text-xs">Palliative</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="icon" className="size-8 cursor-pointer shrink-0" onClick={handleAddRadio}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Surgery Sub-form */}
        {data.types.surgery && (
          <div className="p-4 flex flex-col gap-4 bg-muted/5">
            <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-bold text-xs uppercase tracking-wider">
              <Scissors className="h-4.5 w-4.5 text-blue-600 shrink-0" />
              Surgery
            </div>

            {/* Table */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-background">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-xs font-bold text-foreground">Name of surgery</TableHead>
                    <TableHead className="text-xs font-bold text-foreground">Date</TableHead>
                    <TableHead className="text-xs font-bold text-foreground">Details</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.surgeryRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center p-6 text-xs text-muted-foreground">
                        No surgery rows added yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.surgeryRows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="text-xs font-semibold text-foreground">{row.name}</TableCell>
                        <TableCell className="text-xs text-foreground font-semibold">
                          <div>{row.date ? format(row.date, "dd MMM yyyy") : ""}</div>
                          {row.date && diagnosisDate && (
                            <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                              ({getIntervalString(diagnosisDate, row.date)} after diagnosis)
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-foreground">{row.details}</TableCell>
                        <TableCell className="text-center">
                          <button
                            onClick={() => removeRow("surgeryRows", row.id)}
                            className="text-destructive hover:text-destructive/80 p-1 rounded-md hover:bg-destructive/10 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Inline Mini Adder */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-3 bg-muted/10">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Name of surgery</span>
                <Input
                  placeholder="e.g. Lumpectomy"
                  value={surgeryForm.name}
                  onChange={(e) => setSurgeryForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Date</span>
                <Popover open={isSurgeryCalOpen} onOpenChange={setIsSurgeryCalOpen}>
                  <PopoverTrigger
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full justify-start text-left font-normal h-8 text-xs rounded-lg border-zinc-300 dark:border-zinc-700 cursor-pointer",
                      !surgeryForm.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    {surgeryForm.date ? format(surgeryForm.date, "dd MMM yyyy") : <span>Pick Date</span>}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50 bg-background" align="start">
                    <Calendar
                      mode="single"
                      selected={surgeryForm.date}
                      onSelect={(date) => {
                        setSurgeryForm((prev) => ({ ...prev, date }));
                        setIsSurgeryCalOpen(false);
                      }}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Details</span>
                <div className="flex items-center gap-1.5">
                  <Input
                    placeholder="e.g. Sentinel lymph node biopsy"
                    value={surgeryForm.details}
                    onChange={(e) => setSurgeryForm((prev) => ({ ...prev, details: e.target.value }))}
                    className="h-8 text-xs flex-1"
                  />
                  <Button size="icon" className="size-8 cursor-pointer shrink-0" onClick={handleAddSurgery}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
