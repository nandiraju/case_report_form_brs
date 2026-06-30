"use client";

import React, { useState, useEffect, useRef } from "react";
import { differenceInYears } from "date-fns";
import { CRFHeader } from "@/components/crf-form/header";
import { CRFSidebar } from "@/components/crf-form/sidebar";
import {
  DemographicsStepPanel,
  type DemographicsData,
} from "@/components/crf-form/demographics-step";
import {
  DiseaseHistoryStepPanel,
  type DiseaseHistoryData,
} from "@/components/crf-form/disease-history-step";
import {
  TreatmentAdministeredStepPanel,
  type TreatmentAdministeredData,
} from "@/components/crf-form/treatment-administered-step";
import {
  InclusionCriteriaStepPanel,
  type InclusionCriteriaData,
} from "@/components/crf-form/inclusion-criteria-step";
import {
  ExclusionCriteriaStepPanel,
  type ExclusionCriteriaData,
} from "@/components/crf-form/exclusion-criteria-step";
import {
  DiseaseProgressionStepPanel,
  type DiseaseProgressionData,
} from "@/components/crf-form/disease-progression-step";
import {
  SurvivalStatusStepPanel,
  type SurvivalStatusData,
} from "@/components/crf-form/survival-status-step";
import {
  BreastRSOutcomeStepPanel,
  type BreastRSOutcomeData,
} from "@/components/crf-form/breastrs-outcome-step";
import {
  InvestigatorDeclarationStepPanel,
  type InvestigatorDeclarationData,
} from "@/components/crf-form/investigator-declaration-step";
import { ReviewStepPanel } from "@/components/crf-form/review-step";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChevronRight, ChevronLeft, RotateCcw, Check, Info, AlertTriangle, Printer } from "lucide-react";
import { gsap } from "gsap";

const _DEFAULT_DOB = new Date(1968, 4, 15); // 15 May 1968
const DEFAULT_DEMOGRAPHICS: DemographicsData = {
  dob: _DEFAULT_DOB,
  age: String(new Date().getFullYear() - _DEFAULT_DOB.getFullYear() -
    (new Date() < new Date(new Date().getFullYear(), 4, 15) ? 1 : 0)),
  race: {
    americanIndian: false,
    pacificIslander: false,
    black: false,
    asian: true,
    white: false,
    other: false,
    otherSpecify: "",
  },
  menopausalStatus: "Post-Menopausal",
};

const DEFAULT_DISEASE_HISTORY: DiseaseHistoryData = {
  diagnosisDate: new Date(2022, 0, 15), // 15 Jan 2022
  erStatus: "Positive",
  prStatus: "Positive",
  her2Status: "Negative",
  ki67: "18",
  histopathologicalType: "Invasive ductal carcinoma",
  tumorSize: "2.1",
  ptnm: "pT2 pN1a cM0 (Stage IIB)",
  nodalStatus: "Positive 1-3",
  tumorGrade: "Grade 3",
  oncotypeDate: new Date(2022, 1, 2), // 02 Feb 2022
  oncotypeResult: "24",
};

const DEFAULT_TREATMENT_ADMINISTERED: TreatmentAdministeredData = {
  types: {
    chemo: true,
    radio: false,
    hormonal: true,
    surgery: false,
  },
  chemoRows: [
    {
      id: "1",
      agent: "Docetaxel + Cyclophosphamide (TC)",
      cycles: "4",
      dose: "Docetaxel 75 mg/m² + Cyclophosphamide 600 mg/m²",
      lastCycleDate: new Date(2022, 5, 20), // 20 Jun 2022
      setting: "Adjuvant",
    }
  ],
  hormonalRows: [],
  radioRows: [],
  surgeryRows: [],
};

const DEFAULT_INCLUSION_CRITERIA: InclusionCriteriaData = {
  ecogStatus: "",
  earlyStage: "",
  hormonePositive: "",
  her2Negative: "",
  ffpeAvailable: "",
  clinicalDataAvailable: "",
};

const DEFAULT_EXCLUSION_CRITERIA: ExclusionCriteriaData = {
  dcisOnly: "",
  metastatic: "",
  inflammatory: "",
  priorBreastCancer: "",
  insufficientData: "",
  insufficientTissue: "",
  neoadjuvantTherapy: "",
};

const DEFAULT_DISEASE_PROGRESSION: DiseaseProgressionData = [];

const DEFAULT_SURVIVAL_STATUS: SurvivalStatusData = {
  isAlive: "",
  lastContactDate: undefined,
  deathDate: undefined,
  deathReason: "",
};

const DEFAULT_BREASTRS_OUTCOME: BreastRSOutcomeData = {
  result: "",
};

const DEFAULT_INVESTIGATOR_DECLARATION: InvestigatorDeclarationData = {
  signature: "",
  date: undefined,
};

export default function Home() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [displayStep, setDisplayStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [demographicsData, setDemographicsData] = useState<DemographicsData>(DEFAULT_DEMOGRAPHICS);
  const [diseaseHistoryData, setDiseaseHistoryData] = useState<DiseaseHistoryData>(DEFAULT_DISEASE_HISTORY);
  const [treatmentAdministeredData, setTreatmentAdministeredData] = useState<TreatmentAdministeredData>(DEFAULT_TREATMENT_ADMINISTERED);
  const [inclusionCriteriaData, setInclusionCriteriaData] = useState<InclusionCriteriaData>(DEFAULT_INCLUSION_CRITERIA);
  const [exclusionCriteriaData, setExclusionCriteriaData] = useState<ExclusionCriteriaData>(DEFAULT_EXCLUSION_CRITERIA);
  const [diseaseProgressionData, setDiseaseProgressionData] = useState<DiseaseProgressionData>(DEFAULT_DISEASE_PROGRESSION);
  const [survivalStatusData, setSurvivalStatusData] = useState<SurvivalStatusData>(DEFAULT_SURVIVAL_STATUS);
  const [breastRSOutcomeData, setBreastRSOutcomeData] = useState<BreastRSOutcomeData>(DEFAULT_BREASTRS_OUTCOME);
  const [investigatorDeclarationData, setInvestigatorDeclarationData] = useState<InvestigatorDeclarationData>(DEFAULT_INVESTIGATOR_DECLARATION);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [sidebarPosition, setSidebarPosition] = useState<"left" | "right">("left");
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Toast notifications state
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showNotification = (message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ message, type });
  };

  // GSAP slide & fade transitions when the active step updates
  useEffect(() => {
    if (activeStep !== displayStep) {
      const isForward = activeStep > displayStep;
      const el = containerRef.current;
      if (!el) return;

      // Fade out
      gsap.to(el, {
        opacity: 0,
        x: isForward ? -30 : 30,
        duration: 0.15,
        ease: "power2.in",
        onComplete: () => {
          // Change form panel content
          setDisplayStep(activeStep);
          
          // Slide in from opposite direction
          gsap.fromTo(el,
            { opacity: 0, x: isForward ? 30 : -30 },
            { opacity: 1, x: 0, duration: 0.25, ease: "power2.out" }
          );
        }
      });
    }
  }, [activeStep, displayStep]);

  // Footer Actions
  const handleDiscardChanges = () => {
    setShowDiscardDialog(true);
  };

  const confirmDiscard = () => {
    clearLocalStorage();
    resetAllFormStates();
    setShowDiscardDialog(false);
    showNotification("All CRF form changes discarded. Reset to initial default draft.", "info");
  };

  const [hasHydrated, setHasHydrated] = useState(false);

  // Load initial data from localStorage on mount
  useEffect(() => {
    try {
      const savedDemographics = localStorage.getItem("crf_demographics_data");
      if (savedDemographics) {
        const parsed = JSON.parse(savedDemographics);
        if (parsed.dob) {
          parsed.dob = new Date(parsed.dob);
          // Recalculate age from DOB in case stored age is stale or "0"
          if (!parsed.age || parsed.age === "0") {
            const dob = parsed.dob as Date;
            let age = new Date().getFullYear() - dob.getFullYear();
            const m = new Date().getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && new Date().getDate() < dob.getDate())) age--;
            parsed.age = String(age >= 0 ? age : 0);
          }
        }
        setDemographicsData(parsed);
      }

      const savedDiseaseHistory = localStorage.getItem("crf_disease_history_data");
      if (savedDiseaseHistory) {
        const parsed = JSON.parse(savedDiseaseHistory);
        if (parsed.diagnosisDate) parsed.diagnosisDate = new Date(parsed.diagnosisDate);
        if (parsed.oncotypeDate) parsed.oncotypeDate = new Date(parsed.oncotypeDate);
        setDiseaseHistoryData(parsed);
      }

      const savedTreatment = localStorage.getItem("crf_treatment_administered_data");
      if (savedTreatment) {
        const parsed = JSON.parse(savedTreatment);
        if (parsed.chemoRows) {
          parsed.chemoRows = parsed.chemoRows.map((r: any) => ({
            ...r,
            lastCycleDate: r.lastCycleDate ? new Date(r.lastCycleDate) : undefined,
          }));
        }
        if (parsed.hormonalRows) {
          parsed.hormonalRows = parsed.hormonalRows.map((r: any) => ({
            ...r,
            lastCycleDate: r.lastCycleDate ? new Date(r.lastCycleDate) : undefined,
          }));
        }
        if (parsed.radioRows) {
          parsed.radioRows = parsed.radioRows.map((r: any) => ({
            ...r,
            lastCycleDate: r.lastCycleDate ? new Date(r.lastCycleDate) : undefined,
          }));
        }
        if (parsed.surgeryRows) {
          parsed.surgeryRows = parsed.surgeryRows.map((r: any) => ({
            ...r,
            date: r.date ? new Date(r.date) : undefined,
          }));
        }
        setTreatmentAdministeredData(parsed);
      }

      const savedInclusion = localStorage.getItem("crf_inclusion_criteria_data");
      if (savedInclusion) setInclusionCriteriaData(JSON.parse(savedInclusion));

      const savedExclusion = localStorage.getItem("crf_exclusion_criteria_data");
      if (savedExclusion) setExclusionCriteriaData(JSON.parse(savedExclusion));

      const savedProgression = localStorage.getItem("crf_disease_progression_data");
      if (savedProgression) {
        const parsed = JSON.parse(savedProgression);
        const mapped = parsed.map((r: any) => ({
          ...r,
          testDate: r.testDate ? new Date(r.testDate) : undefined,
        }));
        setDiseaseProgressionData(mapped);
      }

      const savedSurvival = localStorage.getItem("crf_survival_status_data");
      if (savedSurvival) {
        const parsed = JSON.parse(savedSurvival);
        if (parsed.lastContactDate) parsed.lastContactDate = new Date(parsed.lastContactDate);
        if (parsed.deathDate) parsed.deathDate = new Date(parsed.deathDate);
        setSurvivalStatusData(parsed);
      }

      const savedBreastRS = localStorage.getItem("crf_breastrs_outcome_data");
      if (savedBreastRS) setBreastRSOutcomeData(JSON.parse(savedBreastRS));

      const savedDecl = localStorage.getItem("crf_investigator_declaration_data");
      if (savedDecl) {
        const parsed = JSON.parse(savedDecl);
        if (parsed.date) parsed.date = new Date(parsed.date);
        setInvestigatorDeclarationData(parsed);
      }

      const savedActiveStep = localStorage.getItem("crf_active_step");
      if (savedActiveStep) {
        const parsedStep = Number(savedActiveStep);
        setActiveStep(parsedStep);
        setDisplayStep(parsedStep);
      }

      const savedCompleted = localStorage.getItem("crf_completed_steps");
      if (savedCompleted) setCompletedSteps(JSON.parse(savedCompleted));
    } catch (e) {
      console.error("Failed to load draft from localStorage", e);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  // Save effects
  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem("crf_demographics_data", JSON.stringify(demographicsData));
  }, [demographicsData, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem("crf_disease_history_data", JSON.stringify(diseaseHistoryData));
  }, [diseaseHistoryData, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem("crf_treatment_administered_data", JSON.stringify(treatmentAdministeredData));
  }, [treatmentAdministeredData, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem("crf_inclusion_criteria_data", JSON.stringify(inclusionCriteriaData));
  }, [inclusionCriteriaData, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem("crf_exclusion_criteria_data", JSON.stringify(exclusionCriteriaData));
  }, [exclusionCriteriaData, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem("crf_disease_progression_data", JSON.stringify(diseaseProgressionData));
  }, [diseaseProgressionData, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem("crf_survival_status_data", JSON.stringify(survivalStatusData));
  }, [survivalStatusData, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem("crf_breastrs_outcome_data", JSON.stringify(breastRSOutcomeData));
  }, [breastRSOutcomeData, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem("crf_investigator_declaration_data", JSON.stringify(investigatorDeclarationData));
  }, [investigatorDeclarationData, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem("crf_active_step", String(activeStep));
  }, [activeStep, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem("crf_completed_steps", JSON.stringify(completedSteps));
  }, [completedSteps, hasHydrated]);

  // Auto-calculate age whenever DOB changes
  useEffect(() => {
    if (!hasHydrated) return;
    if (demographicsData.dob) {
      const dobDate = typeof demographicsData.dob === "string"
        ? new Date(demographicsData.dob)
        : demographicsData.dob;
      if (!isNaN(dobDate.getTime())) {
        const age = differenceInYears(new Date(), dobDate);
        const ageStr = age >= 0 ? String(age) : "";
        if (demographicsData.age !== ageStr) {
          setDemographicsData((prev) => ({ ...prev, age: ageStr }));
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demographicsData.dob, hasHydrated]);

  const clearLocalStorage = () => {
    localStorage.removeItem("crf_demographics_data");
    localStorage.removeItem("crf_disease_history_data");
    localStorage.removeItem("crf_treatment_administered_data");
    localStorage.removeItem("crf_inclusion_criteria_data");
    localStorage.removeItem("crf_exclusion_criteria_data");
    localStorage.removeItem("crf_disease_progression_data");
    localStorage.removeItem("crf_survival_status_data");
    localStorage.removeItem("crf_breastrs_outcome_data");
    localStorage.removeItem("crf_investigator_declaration_data");
    localStorage.removeItem("crf_active_step");
    localStorage.removeItem("crf_completed_steps");
  };

  const resetAllFormStates = () => {
    setDemographicsData(DEFAULT_DEMOGRAPHICS);
    setDiseaseHistoryData(DEFAULT_DISEASE_HISTORY);
    setTreatmentAdministeredData(DEFAULT_TREATMENT_ADMINISTERED);
    setInclusionCriteriaData(DEFAULT_INCLUSION_CRITERIA);
    setExclusionCriteriaData(DEFAULT_EXCLUSION_CRITERIA);
    setDiseaseProgressionData(DEFAULT_DISEASE_PROGRESSION);
    setSurvivalStatusData(DEFAULT_SURVIVAL_STATUS);
    setBreastRSOutcomeData(DEFAULT_BREASTRS_OUTCOME);
    setInvestigatorDeclarationData(DEFAULT_INVESTIGATOR_DECLARATION);
    setActiveStep(1);
    setDisplayStep(1);
    setCompletedSteps([]);
  };

  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep((prev) => prev - 1);
      showNotification(`Navigated back to Step ${activeStep - 1}.`, "info");
    }
  };

  const handleNextStep = () => {
    if (!completedSteps.includes(activeStep)) {
      setCompletedSteps((prev) => [...prev, activeStep]);
    }
    
    if (activeStep === 1) {
      setActiveStep(2);
      showNotification("Demographics step completed. Navigated to Step 2: Disease History.", "success");
    } else if (activeStep === 2) {
      setActiveStep(3);
      showNotification("Disease History step completed. Navigated to Step 3: Treatment Administered.", "success");
    } else if (activeStep === 3) {
      setActiveStep(4);
      showNotification("Treatment Administered step completed. Navigated to Step 4: Inclusion Criteria.", "success");
    } else if (activeStep === 4) {
      setActiveStep(5);
      showNotification("Inclusion Criteria step completed. Navigated to Step 5: Exclusion Criteria.", "success");
    } else if (activeStep === 5) {
      setActiveStep(6);
      showNotification("Exclusion Criteria step completed. Navigated to Step 6: Disease Progression.", "success");
    } else if (activeStep === 6) {
      setActiveStep(7);
      showNotification("Disease Progression step completed. Navigated to Step 7: Survival Status.", "success");
    } else if (activeStep === 7) {
      setActiveStep(8);
      showNotification("Survival Status step completed. Navigated to Step 8: BreastRS Outcome.", "success");
    } else if (activeStep === 8) {
      setActiveStep(9);
      showNotification("BreastRS Outcome step completed. Navigated to Step 9: Investigator Declaration.", "success");
    } else if (activeStep === 9) {
      setActiveStep(10);
      showNotification("Investigator Declaration completed. Navigated to Step 10: Final Review.", "success");
    } else {
      if (!investigatorDeclarationData.signature || !investigatorDeclarationData.date) {
        showNotification("Please enter Investigator signature and date in Step 9 before submitting.", "error");
        setActiveStep(9);
        return;
      }
      clearLocalStorage();
      resetAllFormStates();
      showNotification("All CRF form steps completed and submitted successfully! Draft cleared.", "success");
    }
  };

  // Render Step Panels
  const renderActiveStepPanel = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        return <DemographicsStepPanel data={demographicsData} onChange={setDemographicsData} />;
      case 2:
        return <DiseaseHistoryStepPanel data={diseaseHistoryData} onChange={setDiseaseHistoryData} dob={demographicsData.dob} />;
      case 3:
        return <TreatmentAdministeredStepPanel data={treatmentAdministeredData} onChange={setTreatmentAdministeredData} diagnosisDate={diseaseHistoryData.diagnosisDate} />;
      case 4:
        return <InclusionCriteriaStepPanel data={inclusionCriteriaData} onChange={setInclusionCriteriaData} />;
      case 5:
        return <ExclusionCriteriaStepPanel data={exclusionCriteriaData} onChange={setExclusionCriteriaData} />;
      case 6:
        return <DiseaseProgressionStepPanel data={diseaseProgressionData} onChange={setDiseaseProgressionData} />;
      case 7:
        return <SurvivalStatusStepPanel data={survivalStatusData} onChange={setSurvivalStatusData} diagnosisDate={diseaseHistoryData.diagnosisDate} />;
      case 8:
        return <BreastRSOutcomeStepPanel data={breastRSOutcomeData} onChange={setBreastRSOutcomeData} />;
      case 9:
        return <InvestigatorDeclarationStepPanel data={investigatorDeclarationData} onChange={setInvestigatorDeclarationData} />;
      case 10:
        return (
          <ReviewStepPanel
            demographics={demographicsData}
            diseaseHistory={diseaseHistoryData}
            treatment={treatmentAdministeredData}
            inclusion={inclusionCriteriaData}
            exclusion={exclusionCriteriaData}
            progression={diseaseProgressionData}
            survival={survivalStatusData}
            breastRS={breastRSOutcomeData}
            declaration={investigatorDeclarationData}
            onNavigateToStep={setActiveStep}
            onPrintClick={() => setIsPrintMode(true)}
          />
        );
      default:
        return null;
    }
  };

  if (isPrintMode) {
    return (
      <div className="min-h-screen w-full bg-white text-zinc-900 p-8 flex flex-col items-center overflow-y-auto">
        {/* Floating print actions bar */}
        <div className="w-full max-w-4xl flex items-center justify-between mb-8 pb-4 border-b border-zinc-200 print:hidden">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="1Cell.Ai Logo" className="h-8 w-auto object-contain" />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 text-xs font-semibold h-9 rounded-lg px-4 shadow-sm cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              Print to PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsPrintMode(false)}
              className="text-xs font-semibold h-9 rounded-lg px-4 border-zinc-300 hover:bg-zinc-100 cursor-pointer bg-transparent text-zinc-700 hover:text-zinc-900"
            >
              Exit Preview
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full max-w-4xl bg-white text-zinc-900">
          <ReviewStepPanel
            demographics={demographicsData}
            diseaseHistory={diseaseHistoryData}
            treatment={treatmentAdministeredData}
            inclusion={inclusionCriteriaData}
            exclusion={exclusionCriteriaData}
            progression={diseaseProgressionData}
            survival={survivalStatusData}
            breastRS={breastRSOutcomeData}
            declaration={investigatorDeclarationData}
            onNavigateToStep={setActiveStep}
            hideEditLinks={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background font-sans transition-colors duration-200">
      {/* Header */}
      <CRFHeader
        sidebarPosition={sidebarPosition}
        onToggleSidebarPosition={() => setSidebarPosition((p) => p === "left" ? "right" : "left")}
        onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Main Panel Content */}
      <div className={`flex flex-1 overflow-hidden ${sidebarPosition === "right" ? "flex-row-reverse" : ""}`}>
        {/* Sidebar (Desktop) */}
        <div className="hidden lg:flex shrink-0">
          <CRFSidebar
            activeStep={activeStep}
            completedSteps={completedSteps}
            onStepClick={setActiveStep}
            position={sidebarPosition}
          />
        </div>

        {/* Sidebar (Mobile Overlay) */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity" 
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Sidebar drawer content */}
            <div className={`relative w-80 max-w-xs h-full bg-background flex flex-col z-50 shadow-2xl transition-transform duration-200 ${
              sidebarPosition === "right" ? "ml-auto" : "mr-auto"
            }`}>
              <div className="p-4 border-b border-border flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/40">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">CRF NAVIGATION</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="h-8 w-8 p-0 rounded-lg cursor-pointer"
                >
                  ✕
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto flex">
                <CRFSidebar
                  activeStep={activeStep}
                  completedSteps={completedSteps}
                  onStepClick={(step) => {
                    setActiveStep(step);
                    setIsMobileMenuOpen(false);
                  }}
                  position={sidebarPosition}
                />
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 flex flex-col justify-between overflow-hidden bg-background/60">
          {/* Scrollable container for forms */}
          <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-8 flex justify-center items-start">
            <div ref={containerRef} className="w-full max-w-4xl flex justify-center">
              {renderActiveStepPanel(displayStep)}
            </div>
          </div>

          {/* Footer Actions */}
          <footer className="border-t border-border bg-background p-4 flex items-center justify-between px-4 sm:px-8 shrink-0 z-45 shadow-md">
            <div>
              <Button
                variant="outline"
                onClick={handleDiscardChanges}
                className="flex items-center gap-1.5 text-xs font-semibold h-9 rounded-lg border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 cursor-pointer px-3 sm:px-4"
                title="Discard Changes"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Discard Changes</span>
              </Button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {activeStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  className="flex items-center gap-1 text-xs font-semibold h-9 rounded-lg px-3 sm:px-4 border-border hover:bg-muted/40 cursor-pointer"
                  title="Previous Step"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mt-0.5" />
                  <span className="hidden sm:inline">Previous Step</span>
                </Button>
              )}


              <Button
                onClick={handleNextStep}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 text-xs font-semibold h-9 rounded-lg px-3 sm:px-4 shadow-sm cursor-pointer"
                title={activeStep === 10 ? "Submit CRF" : "Next Step"}
              >
                <span className="hidden sm:inline">{activeStep === 10 ? "Submit CRF" : "Next Step"}</span>
                <span className="inline sm:hidden">{activeStep === 10 ? "Submit" : "Next"}</span>
                <ChevronRight className="h-3.5 w-3.5 mt-0.5 ml-0.5" />
              </Button>
            </div>
          </footer>
        </main>
      </div>

      {/* Discard Confirmation Dialog */}
      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/30">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <AlertDialogTitle className="text-base">Discard all changes?</AlertDialogTitle>
                <AlertDialogDescription className="text-xs mt-1">
                  This will permanently reset the entire CRF form to its default state and clear all saved progress. This action cannot be undone.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2">
            <AlertDialogCancel className="text-xs h-9 cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDiscard}
              className="bg-red-600 hover:bg-red-700 text-white text-xs h-9 cursor-pointer"
            >
              Yes, discard all changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 right-6 z-50 flex items-center gap-2.5 rounded-lg border border-border bg-background px-4 py-3 shadow-lg animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400">
            {toast.type === "success" ? (
              <Check className="h-3.5 w-3.5 stroke-[2.5px]" />
            ) : (
              <Info className="h-3.5 w-3.5" />
            )}
          </div>
          <span className="text-xs font-medium text-foreground">
            {toast.message}
          </span>
        </div>
      )}
    </div>
  );
}
