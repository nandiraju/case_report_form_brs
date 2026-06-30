"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Trash2, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface ProgressionRow {
  id: string;
  testDate: Date | undefined;
  testPerformed: string;
  results: string;
  comment: string;
}

export type DiseaseProgressionData = ProgressionRow[];

interface DiseaseProgressionStepPanelProps {
  data: DiseaseProgressionData;
  onChange: (updater: (prev: DiseaseProgressionData) => DiseaseProgressionData) => void;
}

export function DiseaseProgressionStepPanel({ data, onChange }: DiseaseProgressionStepPanelProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  // Local state for the add-row form
  const [form, setForm] = useState<Omit<ProgressionRow, "id">>({
    testDate: undefined,
    testPerformed: "",
    results: "",
    comment: "",
  });

  const handleAddRow = () => {
    if (!form.testDate || !form.testPerformed || !form.results) return;
    onChange((prev) => [
      ...prev,
      {
        ...form,
        id: Math.random().toString(36).substr(2, 9),
      },
    ]);
    setForm({
      testDate: undefined,
      testPerformed: "",
      results: "",
      comment: "",
    });
  };

  const removeRow = (id: string) => {
    onChange((prev) => prev.filter((row) => row.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl p-3 sm:p-6 w-full animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400">
          <LineChart className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">6. Disease Progression</h2>
          <p className="text-xs text-muted-foreground">Breast cancer disease progression tracking and test history</p>
        </div>
      </div>

      {/* Disease Progression Card */}
      <div className="border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden bg-card text-card-foreground shadow-xs">
        {/* Card Title */}
        <div className="bg-[#f5f5f5] dark:bg-zinc-800 px-4 py-2.5 font-bold text-sm text-zinc-800 dark:text-zinc-200 border-b border-zinc-300 dark:border-zinc-700">
          Disease progression (Breast Cancer Progression)
        </div>

        {/* Table Content */}
        <div className="p-4 flex flex-col gap-4">
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-x-auto bg-background">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-40 text-xs font-bold text-foreground border-r border-zinc-200 dark:border-zinc-800">Date of test</TableHead>
                  <TableHead className="text-xs font-bold text-foreground border-r border-zinc-200 dark:border-zinc-800">Test performed<br /><span className="text-[10px] text-muted-foreground font-normal">(e.g. CT/MRI/PET/Clinical)</span></TableHead>
                  <TableHead className="text-xs font-bold text-foreground border-r border-zinc-200 dark:border-zinc-800">Results</TableHead>
                  <TableHead className="text-xs font-bold text-foreground border-r border-zinc-200 dark:border-zinc-800">Comment</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center p-6 text-xs text-muted-foreground">
                      No disease progression rows added yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="text-xs font-semibold text-foreground border-r border-zinc-200 dark:border-zinc-800">
                        {row.testDate ? format(row.testDate, "dd MMM yyyy") : ""}
                      </TableCell>
                      <TableCell className="text-xs text-foreground font-semibold border-r border-zinc-200 dark:border-zinc-800">{row.testPerformed}</TableCell>
                      <TableCell className="text-xs text-foreground border-r border-zinc-200 dark:border-zinc-800">{row.results}</TableCell>
                      <TableCell className="text-xs text-foreground border-r border-zinc-200 dark:border-zinc-800">{row.comment}</TableCell>
                      <TableCell className="text-center">
                        <button
                          onClick={() => removeRow(row.id)}
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

          {/* Inline Adder Form */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-3 bg-muted/10">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Date of test</span>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full justify-start text-left font-normal h-8 text-xs rounded-lg border-zinc-300 dark:border-zinc-700 cursor-pointer",
                    !form.testDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  {form.testDate ? format(form.testDate, "dd MMM yyyy") : <span>Pick Date</span>}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50 bg-background" align="start">
                  <Calendar
                    mode="single"
                    selected={form.testDate}
                    onSelect={(date) => {
                      setForm((prev) => ({ ...prev, testDate: date }));
                      setIsCalendarOpen(false);
                    }}
                    captionLayout="dropdown"
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Test performed</span>
              <Input
                placeholder="e.g. Chest CT scan"
                value={form.testPerformed}
                onChange={(e) => setForm((prev) => ({ ...prev, testPerformed: e.target.value }))}
                className="h-8 text-xs"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Results</span>
              <Input
                placeholder="e.g. New liver lesions"
                value={form.results}
                onChange={(e) => setForm((prev) => ({ ...prev, results: e.target.value }))}
                className="h-8 text-xs"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Comment</span>
              <div className="flex items-center gap-1.5">
                <Input
                  placeholder="Optional notes"
                  value={form.comment}
                  onChange={(e) => setForm((prev) => ({ ...prev, comment: e.target.value }))}
                  className="h-8 text-xs flex-1"
                />
                <Button size="icon" className="size-8 cursor-pointer shrink-0" onClick={handleAddRow}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
