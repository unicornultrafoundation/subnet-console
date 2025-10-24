"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

// Import step components
import BasicInfoStep from "@/components/deploy/steps/BasicInfoStep";
import ConfigurationStep from "@/components/deploy/steps/ConfigurationStep";
import ReviewStep from "@/components/deploy/steps/ReviewStep";
import BiddingStep from "@/components/deploy/steps/BiddingStep";
import DeployStep from "@/components/deploy/steps/DeployStep";
import ProgressIndicator from "@/components/deploy/ProgressIndicator";
import ApplicationSelectionModal from "@/components/deploy/ApplicationSelectionModal";

// Import types
import { Service, Application } from "@/types";

const STEPS = [
  { id: 0, title: "Basic Info", description: "Deployment details" },
  { id: 1, title: "Configuration", description: "Service configuration" },
  { id: 2, title: "Review", description: "Review settings" },
  { id: 3, title: "Bidding", description: "Request bids" },
  { id: 4, title: "Deploy", description: "Deploy application" },
];

export default function DeployPage() {
  // State management
  const [currentStep, setCurrentStep] = useState(0);
  const [hasChosenMethod, setHasChosenMethod] = useState(false);
  
  // Basic info state
  const [deploymentName, setDeploymentName] = useState("");
  const [description, setDescription] = useState("");
  const [maxPrice, setMaxPrice] = useState("10");
  
  // Application state
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  
  // Services state
  const [services, setServices] = useState<Service[]>([]);
  
  // Resource totals
  const [totalCpu, setTotalCpu] = useState(0);
  const [totalMemory, setTotalMemory] = useState(0);
  const [totalStorage, setTotalStorage] = useState(0);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  
  // Bidding state
  const [isBidAccepted, setIsBidAccepted] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [bidPrice, setBidPrice] = useState("");
  const [isEditingBid, setIsEditingBid] = useState(false);
  
  // Validation errors
  const [errors, setErrors] = useState<string[]>([]);

  // Load applications on mount
  useEffect(() => {
    const savedApps = JSON.parse(localStorage.getItem('applications') || '[]');
    setApplications(savedApps);
    
    // Check URL parameters for app selection
    const urlParams = new URLSearchParams(window.location.search);
    const appId = urlParams.get('app');
    const mode = urlParams.get('mode');
    
    if (appId && mode === 'application') {
      const app = savedApps.find((a: Application) => a.id === appId);
      if (app) {
        setSelectedApplication(app);
        setServices(app.services || []);
        setHasChosenMethod(true);
      }
    }
  }, []);

  // Calculate resource totals
  useEffect(() => {
    const totals = services.reduce(
      (acc, service) => {
        const cpu = parseInt((service.resources.cpu as any)?.units || "0");
        const memory = parseInt((service.resources.memory as any)?.units || "0");
        const storage = parseInt((service.resources.storage as any)?.units || "0");
        
        return {
          cpu: acc.cpu + cpu * (service.replicas || 1),
          memory: acc.memory + memory * (service.replicas || 1),
          storage: acc.storage + storage * (service.replicas || 1),
        };
      },
      { cpu: 0, memory: 0, storage: 0 }
    );
    
    setTotalCpu(totals.cpu);
    setTotalMemory(totals.memory);
    setTotalStorage(totals.storage);
    
    // Calculate estimated price (simplified)
    const totalEstimatedPrice = (totals.cpu * 0.1 + totals.memory * 0.05 + totals.storage * 0.02) * 24;
    setEstimatedPrice(totalEstimatedPrice);
  }, [services]);

  // Navigation handlers
  const handleNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Application selection handlers
  const handleApplicationSelect = (application: Application) => {
    setSelectedApplication(application);
    setServices(application.services || []);
    setHasChosenMethod(true);
  };

  const handleApplicationSelectFromModal = (application: Application) => {
    setSelectedApplication(application);
    setServices(application.services || []);
    setIsApplicationModalOpen(false);
  };

  // Service handlers
  const handleUpdateService = (index: number, updatedService: Service) => {
    const newServices = [...services];
    newServices[index] = updatedService;
    setServices(newServices);
  };

  const handleAddService = () => {
    const newService: Service = {
      id: `service-${Date.now()}`,
      name: `Service ${services.length + 1}`,
      image: "",
      replicas: 1,
      resources: {
        cpu: { units: "1" },
        memory: { units: "1" },
        storage: { units: "1" },
        gpu: { units: "0" },
      },
      volumes: [],
      expose: [],
      env: [],
    };
    setServices([...services, newService]);
  };

  const handleRemoveService = (index: number) => {
    const newServices = services.filter((_, i) => i !== index);
    setServices(newServices);
  };

  // Bidding handlers
  const handleMaxPriceChange = (price: string) => {
    setMaxPrice(price);
  };

  const handleBidPriceChange = (price: string) => {
    setBidPrice(price);
  };

  const handleAcceptBid = (providerId: string, price: string) => {
    setSelectedProvider(providerId);
    setBidPrice(price);
    setIsBidAccepted(true);
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            deploymentName={deploymentName}
            description={description}
            maxPrice={maxPrice}
            onDeploymentNameChange={setDeploymentName}
            onDescriptionChange={setDescription}
            onMaxPriceChange={handleMaxPriceChange}
            errors={errors}
            onClearErrors={() => setErrors([])}
          />
        );
      
      case 1:
        return (
          <ConfigurationStep
            applications={applications}
            selectedApplication={selectedApplication}
            services={services}
            onApplicationSelect={handleApplicationSelect}
            onUpdateService={handleUpdateService}
            onAddService={handleAddService}
            onRemoveService={handleRemoveService}
            onOpenApplicationModal={() => setIsApplicationModalOpen(true)}
            errors={errors}
            onClearErrors={() => setErrors([])}
          />
        );
      
      case 2:
        return (
          <ReviewStep
            deploymentName={deploymentName}
            description={description}
            maxPrice={maxPrice}
            services={services}
            totalCpu={totalCpu}
            totalMemory={totalMemory}
            totalStorage={totalStorage}
            estimatedPrice={estimatedPrice}
            onMaxPriceChange={handleMaxPriceChange}
          />
        );
      
      case 3:
        return (
          <BiddingStep
            services={services}
            maxPrice={maxPrice}
            bidPrice={bidPrice}
            isBidAccepted={isBidAccepted}
            selectedProvider={selectedProvider}
            isEditingBid={isEditingBid}
            onBidPriceChange={handleBidPriceChange}
            onAcceptBid={handleAcceptBid}
            onEditBid={() => setIsEditingBid(true)}
            onSaveBid={() => setIsEditingBid(false)}
            onClearErrors={() => setErrors([])}
          />
        );
      
      case 4:
        return (
          <DeployStep
            deploymentName={deploymentName}
            services={services}
            selectedProvider={selectedProvider}
            bidPrice={bidPrice}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Deploy Application
          </h1>
          <p className="text-lg text-gray-600">
            Deploy your application to the Subnet network
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <ProgressIndicator
            currentStep={currentStep}
            steps={STEPS}
            onStepClick={(step) => setCurrentStep(step)}
          />
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="subnet-card">
            <CardBody className="p-8">
              {renderCurrentStep()}
            </CardBody>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              startContent={<ArrowLeft size={20} />}
              onPress={handlePrevStep}
              isDisabled={currentStep === 0}
            >
              Previous
            </Button>

            <div className="flex gap-4">
              {currentStep === STEPS.length - 1 ? (
                <Button
                  color="success"
                  endContent={<CheckCircle size={20} />}
                  size="lg"
                >
                  Deploy Complete
                </Button>
              ) : (
                <Button
                  color="primary"
                  endContent={<ArrowRight size={20} />}
                  onPress={handleNextStep}
                  size="lg"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Application Selection Modal */}
        <ApplicationSelectionModal
          isOpen={isApplicationModalOpen}
          onClose={() => setIsApplicationModalOpen(false)}
          applications={applications}
          onSelectApplication={handleApplicationSelectFromModal}
        />
      </div>
    </div>
  );
}
