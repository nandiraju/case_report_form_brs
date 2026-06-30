"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Pill } from "lucide-react";

export interface Regimen {
  id: string;
  agent: string;
  cycles: number;
  dose: string;
  lastCycleDate: string;
  setting: string;
}

interface TreatmentStepPanelProps {
  regimens: Regimen[];
  onAddRegimen: (regimen: Omit<Regimen, "id">) => void;
  onDeleteRegimen: (id: string) => void;
}

export function TreatmentStepPanel({
  regimens,
  onAddRegimen,
  onDeleteRegimen,
}: TreatmentStepPanelProps) {
  const [agent, setAgent] = useState("");
  const [cycles, setCycles] = useState<number | "">("");
  const [dose, setDose] = useState("");
  const [lastCycleDate, setLastCycleDate] = useState("");
  const [setting, setSetting] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent || !cycles || !dose || !lastCycleDate || !setting) return;
    
    onAddRegimen({
      agent,
      cycles: Number(cycles),
      dose,
      lastCycleDate,
      setting,
    });

    // Reset form
    setAgent("");
    setCycles("");
    setDose("");
    setLastCycleDate("");
    setSetting("");
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl p-6">
      {/* Step Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400">
          <Pill className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">4. Treatment</h2>
          <p className="text-xs text-muted-foreground">Manage oncology regimens, cycles, doses, and cycle timelines</p>
        </div>
      </div>

      {/* Regimen List Table */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20">
          <h3 className="font-semibold text-sm text-foreground">Active Oncology Regimens</h3>
        </div>
        
        {regimens.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No oncology regimens added yet. Use the form below to add a regimen.
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead>Agent / Regimen</TableHead>
                <TableHead className="w-20 text-center">Cycles</TableHead>
                <TableHead>Dose</TableHead>
                <TableHead>Date of Last Cycle</TableHead>
                <TableHead>Setting</TableHead>
                <TableHead className="w-12 text-center"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regimens.map((regimen, index) => (
                <TableRow key={regimen.id}>
                  <TableCell className="text-center font-medium text-xs text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-semibold text-xs text-foreground">
                    {regimen.agent}
                  </TableCell>
                  <TableCell className="text-center text-xs font-semibold">
                    {regimen.cycles}
                  </TableCell>
                  <TableCell className="text-xs text-foreground">
                    {regimen.dose}
                  </TableCell>
                  <TableCell className="text-xs text-foreground">
                    {regimen.lastCycleDate}
                  </TableCell>
                  <TableCell className="text-xs text-foreground font-semibold">
                    {regimen.setting}
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => onDeleteRegimen(regimen.id)}
                      className="text-destructive hover:text-destructive/80 p-1 rounded-md hover:bg-destructive/10 cursor-pointer transition-colors"
                      title="Delete Regimen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add Regimen Form */}
      <form onSubmit={handleSubmit} className="border border-border rounded-xl p-5 bg-card flex flex-col gap-4 shadow-sm">
        <h3 className="font-semibold text-sm text-foreground">Add New Regimen</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Agent / Regimen */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">
              Agent / Regimen *
            </label>
            <Input
              required
              placeholder="e.g. Docetaxel + Cyclophosphamide (TC)"
              value={agent}
              onChange={(e) => setAgent(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* Dose */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">
              Dose *
            </label>
            <Input
              required
              placeholder="e.g. Docetaxel 75 mg/m² + Cyclophosphamide 600 mg/m²"
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* Cycles */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">
              Cycles *
            </label>
            <Input
              required
              type="number"
              min={1}
              placeholder="e.g. 4"
              value={cycles}
              onChange={(e) => setCycles(e.target.value === "" ? "" : Number(e.target.value))}
              className="h-9 text-xs"
            />
          </div>

          {/* Setting */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">
              Setting *
            </label>
            <Select value={setting} onValueChange={(val) => setSetting(val || "")} required>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select setting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="(Neo)Adjuvant" className="text-xs">(Neo)Adjuvant</SelectItem>
                <SelectItem value="Adjuvant" className="text-xs">Adjuvant</SelectItem>
                <SelectItem value="Neoadjuvant" className="text-xs">Neoadjuvant</SelectItem>
                <SelectItem value="Metastatic" className="text-xs">Metastatic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date of Last Cycle */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">
              Date of Last Cycle *
            </label>
            <Input
              required
              type="text"
              placeholder="e.g. 20 Jun 2022"
              value={lastCycleDate}
              onChange={(e) => setLastCycleDate(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <Button
            type="submit"
            size="sm"
            className="flex items-center gap-2 h-9 text-xs font-semibold px-4 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Regimen
          </Button>
        </div>
      </form>
    </div>
  );
}
