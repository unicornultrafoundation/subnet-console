import { useState, useEffect } from "react";
import type { NewNodeForm } from "../components/AddNodeModal";

export function useWizardSteps(newNodeForm: NewNodeForm) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = newNodeForm.target === "host" ? 3 : 4; // Host has one less step (no connection)

  // Update step when target changes
  useEffect(() => {
    if (newNodeForm.target === "host" && currentStep === 2) {
      // If switching to host and we're on connection step, go to node config
      setCurrentStep(2);
    } else if (newNodeForm.target === "remote" && currentStep === 2) {
      // If switching to remote and we're on step 2, stay on step 2 (connection)
      // No change needed
    }
  }, [newNodeForm.target, currentStep]);

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetStep = () => {
    setCurrentStep(1);
  };

  return {
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    resetStep,
    setCurrentStep,
  };
}

