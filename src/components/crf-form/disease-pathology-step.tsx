"use client";

import React, { useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, Info, Maximize2, Minimize2, Plus } from "lucide-react";
import { Regimen } from "./treatment-step";

export interface DiseasePathologyData {
  diagnosisDate: string;
  diagnosisSource: string;
  erStatus: string;
  prStatus: string;
  her2Status: string;
  ki67: string;
  histopathologicalType: string;
  tumorGrade: string;
  tumorSize: string;
  nodalStatus: string;
  ptnm: string;
  priorGenomicDate: string;
  priorGenomicResult: string;
  priorGenomicLab: string;
  priorGenomicReportSource: string;
}

interface DiseasePathologyStepProps {
  data: DiseasePathologyData;
  onChange: (field: keyof DiseasePathologyData, value: string) => void;
  regimens: Regimen[];
  onAddRegimenClick: () => void;
}

const ALL_SECTIONS = ["diagnosis", "receptor", "tumor", "nodal", "genomic", "treatment"];

export function DiseasePathologyStep({
  data,
  onChange,
  regimens,
  onAddRegimenClick,
}: DiseasePathologyStepProps) {
  const [openSections, setOpenSections] = useState<string[]>(ALL_SECTIONS);

  const handleExpandAll = () => {
    setOpenSections(ALL_SECTIONS);
  };

  const handleCollapseAll = () => {
    setOpenSections([]);
  };

  const isAllExpanded = openSections.length === ALL_SECTIONS.length;

  return (
    <div className="flex flex-col gap-6 w-full p-6 max-w-5xl">
      {/* Title & Accordion Controls */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-foreground">3. Disease & Pathology</h2>
          <button className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title="Info">
            <Info className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Expand/Collapse All Button */}
        {isAllExpanded ? (
          <button
            onClick={handleCollapseAll}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
          >
            <Minimize2 className="h-3.5 w-3.5" />
            Collapse all
          </button>
        ) : (
          <button
            onClick={handleExpandAll}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            Expand all
          </button>
        )}
      </div>

      <Accordion
        multiple
        value={openSections}
        onValueChange={(val) => setOpenSections(val as string[])}
        className="w-full space-y-4"
      >
        {/* 1. Diagnosis */}
        <AccordionItem
          value="diagnosis"
          className="border border-border rounded-xl bg-card shadow-2xs overflow-hidden"
        >
          <AccordionTrigger className="w-full flex items-center justify-between px-5 py-3.5 hover:no-underline font-semibold text-foreground text-sm bg-muted/10 cursor-pointer">
            <span className="flex items-center gap-2">Diagnosis</span>
          </AccordionTrigger>
          <AccordionContent className="p-5 border-t border-border bg-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date of Diagnosis */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Date of diagnosis <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Input
                    required
                    placeholder="e.g. 15 Jan 2022"
                    value={data.diagnosisDate}
                    onChange={(e) => onChange("diagnosisDate", e.target.value)}
                    className="h-9 text-xs pr-9"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Source */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Source
                </label>
                <Select
                  value={data.diagnosisSource}
                  onValueChange={(val) => onChange("diagnosisSource", val || "")}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pathology report" className="text-xs">Pathology report</SelectItem>
                    <SelectItem value="Biopsy report" className="text-xs">Biopsy report</SelectItem>
                    <SelectItem value="Surgical specimen" className="text-xs">Surgical specimen</SelectItem>
                    <SelectItem value="Other" className="text-xs">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 2. Receptor Status */}
        <AccordionItem
          value="receptor"
          className="border border-border rounded-xl bg-card shadow-2xs overflow-hidden"
        >
          <AccordionTrigger className="w-full flex items-center justify-between px-5 py-3.5 hover:no-underline font-semibold text-foreground text-sm bg-muted/10 cursor-pointer">
            <span>Receptor Status</span>
          </AccordionTrigger>
          <AccordionContent className="p-5 border-t border-border bg-card">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* ER Status */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  ER status <span className="text-destructive">*</span>
                </label>
                <RadioGroup
                  value={data.erStatus}
                  onValueChange={(val) => onChange("erStatus", val)}
                  className="flex flex-row gap-4 mt-1"
                >
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="Positive" id="er-pos" />
                    <label htmlFor="er-pos" className="text-xs font-semibold text-foreground cursor-pointer select-none">Positive</label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="Negative" id="er-neg" />
                    <label htmlFor="er-neg" className="text-xs font-semibold text-foreground cursor-pointer select-none">Negative</label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="Inconclusive" id="er-inc" />
                    <label htmlFor="er-inc" className="text-xs font-semibold text-foreground cursor-pointer select-none">Inconclusive</label>
                  </div>
                </RadioGroup>
              </div>

              {/* PR Status */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  PR status <span className="text-destructive">*</span>
                </label>
                <RadioGroup
                  value={data.prStatus}
                  onValueChange={(val) => onChange("prStatus", val)}
                  className="flex flex-wrap gap-4 mt-1"
                >
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="Positive" id="pr-pos" />
                    <label htmlFor="pr-pos" className="text-xs font-semibold text-foreground cursor-pointer select-none">Positive</label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="Negative" id="pr-neg" />
                    <label htmlFor="pr-neg" className="text-xs font-semibold text-foreground cursor-pointer select-none">Negative</label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="Inconclusive" id="pr-inc" />
                    <label htmlFor="pr-inc" className="text-xs font-semibold text-foreground cursor-pointer select-none">Inconclusive</label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="Not done" id="pr-nd" />
                    <label htmlFor="pr-nd" className="text-xs font-semibold text-foreground cursor-pointer select-none">Not done</label>
                  </div>
                </RadioGroup>
              </div>

              {/* HER2 Status */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  HER2 status <span className="text-destructive">*</span>
                </label>
                <RadioGroup
                  value={data.her2Status}
                  onValueChange={(val) => onChange("her2Status", val)}
                  className="flex flex-row gap-4 mt-1"
                >
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="Positive" id="her2-pos" />
                    <label htmlFor="her2-pos" className="text-xs font-semibold text-foreground cursor-pointer select-none">Positive</label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="Negative" id="her2-neg" />
                    <label htmlFor="her2-neg" className="text-xs font-semibold text-foreground cursor-pointer select-none">Negative</label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="Equivocal" id="her2-eq" />
                    <label htmlFor="her2-eq" className="text-xs font-semibold text-foreground cursor-pointer select-none">Equivocal</label>
                  </div>
                </RadioGroup>
              </div>

              {/* Ki-67 (%) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Ki-67 (%) <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Input
                    required
                    type="number"
                    min={0}
                    max={100}
                    placeholder="e.g. 18"
                    value={data.ki67}
                    onChange={(e) => onChange("ki67", e.target.value)}
                    className="h-9 text-xs pr-8"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-semibold text-muted-foreground pointer-events-none">
                    %
                  </span>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 3. Tumor Characteristics */}
        <AccordionItem
          value="tumor"
          className="border border-border rounded-xl bg-card shadow-2xs overflow-hidden"
        >
          <AccordionTrigger className="w-full flex items-center justify-between px-5 py-3.5 hover:no-underline font-semibold text-foreground text-sm bg-muted/10 cursor-pointer">
            <span>Tumor Characteristics</span>
          </AccordionTrigger>
          <AccordionContent className="p-5 border-t border-border bg-card">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Histopathological Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Histopathological type <span className="text-destructive">*</span>
                </label>
                <Select
                  value={data.histopathologicalType}
                  onValueChange={(val) => onChange("histopathologicalType", val || "")}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Invasive ductal carcinoma" className="text-xs">
                      Invasive ductal carcinoma
                    </SelectItem>
                    <SelectItem value="Invasive lobular carcinoma" className="text-xs">
                      Invasive lobular carcinoma
                    </SelectItem>
                    <SelectItem value="Mixed ductal/lobular carcinoma" className="text-xs">
                      Mixed ductal/lobular carcinoma
                    </SelectItem>
                    <SelectItem value="Other" className="text-xs">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tumor Grade */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Tumor grade <span className="text-destructive">*</span>
                </label>
                <RadioGroup
                  value={data.tumorGrade}
                  onValueChange={(val) => onChange("tumorGrade", val)}
                  className="flex flex-row gap-4 mt-1"
                >
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="1" id="tg-1" />
                    <label htmlFor="tg-1" className="text-xs font-semibold text-foreground cursor-pointer select-none">1</label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="2" id="tg-2" />
                    <label htmlFor="tg-2" className="text-xs font-semibold text-foreground cursor-pointer select-none">2</label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="3" id="tg-3" />
                    <label htmlFor="tg-3" className="text-xs font-semibold text-foreground cursor-pointer select-none">3</label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="Unknown" id="tg-unk" />
                    <label htmlFor="tg-unk" className="text-xs font-semibold text-foreground cursor-pointer select-none">Unknown</label>
                  </div>
                </RadioGroup>
              </div>

              {/* Tumor Size (cm) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Tumor size (cm) <span className="text-destructive">*</span>
                </label>
                <Input
                  required
                  type="number"
                  step="0.1"
                  placeholder="e.g. 2.1"
                  value={data.tumorSize}
                  onChange={(e) => onChange("tumorSize", e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 4. Nodal Status */}
        <AccordionItem
          value="nodal"
          className="border border-border rounded-xl bg-card shadow-2xs overflow-hidden"
        >
          <AccordionTrigger className="w-full flex items-center justify-between px-5 py-3.5 hover:no-underline font-semibold text-foreground text-sm bg-muted/10 cursor-pointer">
            <span>Nodal Status</span>
          </AccordionTrigger>
          <AccordionContent className="p-5 border-t border-border bg-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nodal Status */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Nodal status <span className="text-destructive">*</span>
                </label>
                <RadioGroup
                  value={data.nodalStatus}
                  onValueChange={(val) => onChange("nodalStatus", val)}
                  className="flex flex-wrap gap-4 mt-1"
                >
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="Negative" id="ns-neg" />
                    <label htmlFor="ns-neg" className="text-xs font-semibold text-foreground cursor-pointer select-none">Negative</label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="Positive 1-3" id="ns-pos13" />
                    <label htmlFor="ns-pos13" className="text-xs font-semibold text-foreground cursor-pointer select-none">Positive 1–3</label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="Positive 4-9" id="ns-pos49" />
                    <label htmlFor="ns-pos49" className="text-xs font-semibold text-foreground cursor-pointer select-none">Positive 4–9</label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="Unknown" id="ns-unk" />
                    <label htmlFor="ns-unk" className="text-xs font-semibold text-foreground cursor-pointer select-none">Unknown</label>
                  </div>
                </RadioGroup>
              </div>

              {/* pTNM */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  pTNM <span className="text-destructive">*</span>
                </label>
                <Select
                  value={data.ptnm}
                  onValueChange={(val) => onChange("ptnm", val || "")}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pT2 pN1a cM0 (Stage IIB)" className="text-xs">
                      pT2 pN1a cM0 (Stage IIB)
                    </SelectItem>
                    <SelectItem value="pT1 pN0 cM0 (Stage IA)" className="text-xs">
                      pT1 pN0 cM0 (Stage IA)
                    </SelectItem>
                    <SelectItem value="pT2 pN0 cM0 (Stage IB)" className="text-xs">
                      pT2 pN0 cM0 (Stage IB)
                    </SelectItem>
                    <SelectItem value="pT3 pN1 cM0 (Stage IIIA)" className="text-xs">
                      pT3 pN1 cM0 (Stage IIIA)
                    </SelectItem>
                    <SelectItem value="Other" className="text-xs">Other Stage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 5. Prior Genomic Test */}
        <AccordionItem
          value="genomic"
          className="border border-border rounded-xl bg-card shadow-2xs overflow-hidden"
        >
          <AccordionTrigger className="w-full flex items-center justify-between px-5 py-3.5 hover:no-underline font-semibold text-foreground text-sm bg-muted/10 cursor-pointer">
            <span>Prior Genomic Test</span>
          </AccordionTrigger>
          <AccordionContent className="p-5 border-t border-border bg-card">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  OncotypeDx test date
                </label>
                <div className="relative">
                  <Input
                    placeholder="e.g. 02 Feb 2022"
                    value={data.priorGenomicDate}
                    onChange={(e) => onChange("priorGenomicDate", e.target.value)}
                    className="h-9 text-xs pr-9"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Recurrence Score */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  OncotypeDx result (Recurrence Score)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 24"
                  value={data.priorGenomicResult}
                  onChange={(e) => onChange("priorGenomicResult", e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              {/* Laboratory */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Laboratory
                </label>
                <Select
                  value={data.priorGenomicLab}
                  onValueChange={(val) => onChange("priorGenomicLab", val || "")}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select laboratory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Genomic Health" className="text-xs">Genomic Health</SelectItem>
                    <SelectItem value="Exact Sciences" className="text-xs">Exact Sciences</SelectItem>
                    <SelectItem value="Foundation Medicine" className="text-xs">Foundation Medicine</SelectItem>
                    <SelectItem value="Other" className="text-xs">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Report Source */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Report source
                </label>
                <Select
                  value={data.priorGenomicReportSource}
                  onValueChange={(val) => onChange("priorGenomicReportSource", val || "")}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lab report" className="text-xs">Lab report</SelectItem>
                    <SelectItem value="Physician records" className="text-xs">Physician records</SelectItem>
                    <SelectItem value="Patient provided" className="text-xs">Patient provided</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 6. Treatment (Preview) */}
        <AccordionItem
          value="treatment"
          className="border border-border rounded-xl bg-card shadow-2xs overflow-hidden animate-none!"
        >
          <AccordionTrigger className="w-full flex items-center justify-between px-5 py-3.5 hover:no-underline font-semibold text-foreground text-sm bg-muted/10 cursor-pointer">
            <div className="flex flex-col md:flex-row md:items-center gap-2 text-left">
              <span>Treatment (Preview)</span>
              <span className="text-[10px] font-normal text-blue-600 hover:underline" onClick={(e) => {
                e.stopPropagation();
                onAddRegimenClick();
              }}>
                Detailed entry in Step 4 - Treatment
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-5 border-t border-border bg-card">
            <div className="flex flex-col gap-4">
              {regimens.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                  No treatments active. Click "Add regimen" below or navigate to Step 4.
                </div>
              ) : (
                <div className="border border-border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/20">
                      <TableRow>
                        <TableHead className="w-12 text-center">#</TableHead>
                        <TableHead>Agent / Regimen</TableHead>
                        <TableHead className="w-16 text-center">Cycles</TableHead>
                        <TableHead>Dose</TableHead>
                        <TableHead>Date of Last Cycle</TableHead>
                        <TableHead>Setting</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {regimens.map((regimen, index) => (
                        <TableRow key={regimen.id}>
                          <TableCell className="text-center font-medium text-xs text-muted-foreground">{index + 1}</TableCell>
                          <TableCell className="font-semibold text-xs text-foreground">{regimen.agent}</TableCell>
                          <TableCell className="text-center text-xs font-semibold">{regimen.cycles}</TableCell>
                          <TableCell className="text-xs text-foreground">{regimen.dose}</TableCell>
                          <TableCell className="text-xs text-foreground">{regimen.lastCycleDate}</TableCell>
                          <TableCell className="text-xs text-foreground font-semibold">{regimen.setting}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAddRegimenClick}
                  className="flex items-center gap-1.5 h-8.5 rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-900/50 dark:hover:bg-blue-950/20 text-xs font-semibold cursor-pointer"
                >
                  <Plus className="h-4.5 w-4.5" />
                  Add regimen
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
