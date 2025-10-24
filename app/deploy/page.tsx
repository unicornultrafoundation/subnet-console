"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { ArrowLeft, ArrowRight, CheckCircle, User, Settings, Eye, DollarSign, Play } from "lucide-react";

// Import step components
import BasicInfoStep from "@/components/deploy/steps/BasicInfoStep";
import ConfigurationStep from "@/components/deploy/steps/ConfigurationStep";
import ReviewStep from "@/components/deploy/steps/ReviewStep";
import BiddingStep from "@/components/deploy/steps/BiddingStep";
import DeployStep from "@/components/deploy/steps/DeployStep";
import ProgressIndicator from "@/components/deploy/ProgressIndicator";
import ApplicationSelectionModal from "@/components/deploy/ApplicationSelectionModal";
import DeploymentSummary from "@/components/deploy/DeploymentSummary";

// Import types
// import { Service, Application } from "@/types";

// Define types locally for now
interface Service {
  id: string;
  name: string;
  image: string;
  replicas: number;
  resources: {
    cpu: { units: string };
    memory: { units: string };
    storage: { units: string };
    gpu: { units: string };
  };
  volumes: any[];
  expose: any[];
  env: string[];
}

interface Application {
  id: string;
  name: string;
  services: Service[];
}

const STEPS = [
  { id: 0, title: "Basic Info", description: "Deployment details", icon: User },
  { id: 1, title: "Configuration", description: "Service configuration", icon: Settings },
  { id: 2, title: "Review", description: "Review settings", icon: Eye },
  { id: 3, title: "Bidding", description: "Request bids", icon: DollarSign },
  { id: 4, title: "Deploy", description: "Deploy application", icon: Play },
];

export default function DeployPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
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
  const [selectedBid, setSelectedBid] = useState<string>("");
  const [bids, setBids] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("any");
  
  // Validation errors
  const [errors, setErrors] = useState<string[]>([]);

  // Load applications on mount
  useEffect(() => {
    const savedApps = JSON.parse(localStorage.getItem('applications') || '[]');
    setApplications(savedApps);
    
    // Check URL parameters for app selection
    const appId = searchParams.get('app');
    const mode = searchParams.get('mode');
    
    if (appId && mode === 'application') {
      const app = savedApps.find((a: Application) => a.id === appId);
      if (app) {
        setSelectedApplication(app);
        setServices(app.services || []);
        setHasChosenMethod(true);
      }
    }
  }, [searchParams]);

  // Mock bids for testing
  useEffect(() => {
    const mockBids = [
      {
        id: "bid-1",
        provider: {
          id: "provider-1",
          name: "Provider Alpha",
          region: "us-east-1",
          rating: 4.8,
          uptime: "99.9%",
          activeDeployments: "1,247",
          capacity: "87%",
          responseTime: "< 5min",
          successRate: "99.2%",
          features: ["High Performance", "24/7 Support", "Auto Scaling", "Backup", "DDoS Protection"],
        },
        price: "25.50",
        specs: {
          cpu: totalCpu,
          memory: `${totalMemory}Gi`,
          storage: `${totalStorage}Gi`,
        },
      },
      {
        id: "bid-2", 
        provider: {
          id: "provider-2",
          name: "Provider Beta",
          region: "eu-west-1",
          rating: 4.6,
          uptime: "99.7%",
          activeDeployments: "892",
          capacity: "92%",
          responseTime: "< 3min",
          successRate: "98.8%",
          features: ["Cost Effective", "Fast Deployment", "Monitoring", "SSL Certificate"],
        },
        price: "22.75",
        specs: {
          cpu: totalCpu,
          memory: `${totalMemory}Gi`,
          storage: `${totalStorage}Gi`,
        },
      },
      {
        id: "bid-3",
        provider: {
          id: "provider-3", 
          name: "Provider Gamma",
          region: "asia-pacific",
          rating: 4.9,
          uptime: "99.95%",
          activeDeployments: "2,156",
          capacity: "78%",
          responseTime: "< 2min",
          successRate: "99.5%",
          features: ["Enterprise Grade", "Global CDN", "DDoS Protection", "SSL Certificate", "Load Balancing"],
        },
        price: "28.00",
        specs: {
          cpu: totalCpu,
          memory: `${totalMemory}Gi`,
          storage: `${totalStorage}Gi`,
        },
      },
    ];
    setBids(mockBids);
  }, [totalCpu, totalMemory, totalStorage]);

  // Calculate resource totals
  useEffect(() => {
    const totals = services.reduce(
      (acc, service) => {
        const cpu = parseInt((service.resources.cpu as any)?.units || "0");
        
        // Handle memory - usually {size: "1Gi"} format
        let memory = 0;
        if ((service.resources.memory as any)?.size) {
          memory = parseFloat((service.resources.memory as any).size.replace(/[^\d.]/g, "") || "0");
        } else if ((service.resources.memory as any)?.units) {
          memory = parseInt((service.resources.memory as any).units || "0");
        }
        
        // Handle storage - usually an array with {size: "1Gi"} format
        let storage = 0;
        if (Array.isArray(service.resources.storage) && service.resources.storage.length > 0) {
          storage = parseFloat((service.resources.storage[0] as any)?.size?.replace(/[^\d.]/g, "") || "0");
        } else if ((service.resources.storage as any)?.size) {
          storage = parseFloat((service.resources.storage as any).size.replace(/[^\d.]/g, "") || "0");
        } else if ((service.resources.storage as any)?.units) {
          storage = parseInt((service.resources.storage as any).units || "0");
        }
        
        return {
          cpu: acc.cpu + cpu * (service.replicas || 1),
          memory: acc.memory + memory * (service.replicas || 1),
          storage: acc.storage + storage * (service.replicas || 1),
        };
      },
      { cpu: 0, memory: 0, storage: 0 }
    );
    
    console.log("Final totals:", totals);
    setTotalCpu(totals.cpu);
    setTotalMemory(totals.memory);
    setTotalStorage(totals.storage);
    
    // Calculate estimated price (simplified)
    const totalEstimatedPrice = (totals.cpu * 0.1 + totals.memory * 0.05 + totals.storage * 0.02) * 24;
    setEstimatedPrice(parseFloat(totalEstimatedPrice.toFixed(2)));
  }, [services]);

  // Navigation handlers
  const handleNextStep = () => {
    // Validate Basic Info step
    if (currentStep === 0) {
      const validationErrors = [];
      
      if (!deploymentName.trim()) {
        validationErrors.push("Deployment name is required");
      }
      
      if (!maxPrice.trim()) {
        validationErrors.push("Max price is required");
      } else {
        const price = parseFloat(maxPrice);
        if (isNaN(price) || price <= 0) {
          validationErrors.push("Max price must be a valid positive number");
        }
      }
      
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return; // Don't proceed if there are validation errors
      }
      
      // Clear errors if validation passes
      setErrors([]);
    }
    
    // Validate Configuration step
    if (currentStep === 1) {
      const validationErrors = [];
      
      // Check if at least one service exists
      if (services.length === 0) {
        validationErrors.push("At least one service is required");
        setErrors(validationErrors);
        return;
      }
      
      // Validate each service
      services.forEach((service, index) => {
        const serviceNum = index + 1;
        
        // Service name - Required
        if (!service.name || !service.name.trim()) {
          validationErrors.push(`Service ${serviceNum}: Service name is required`);
        }
        
        // Docker image - Required
        if (!service.image || !service.image.trim()) {
          validationErrors.push(`Service ${serviceNum}: Docker image is required`);
        }
        
        // CPU resources - Required
        const cpuUnits = parseFloat(service.resources.cpu.units || "0");
        if (!service.resources.cpu.units || cpuUnits <= 0) {
          validationErrors.push(`Service ${serviceNum}: CPU units must be greater than 0`);
        }
        
        // Memory resources - Required
        let memorySize = 0;
        if (service.resources.memory.size) {
          memorySize = parseFloat(service.resources.memory.size.replace(/[^\d.]/g, "") || "0");
        } else if (service.resources.memory.units) {
          memorySize = parseFloat(service.resources.memory.units || "0");
        }
        
        if (memorySize <= 0) {
          validationErrors.push(`Service ${serviceNum}: Memory size must be greater than 0`);
        }
        
        // Storage resources - Optional but validate if present
        let storageValid = true;
        if (Array.isArray(service.resources.storage) && service.resources.storage.length > 0) {
          const storageSize = parseFloat(service.resources.storage[0].size.replace(/[^\d.]/g, "") || "0");
          storageValid = storageSize > 0;
        } else if (service.resources.storage.size) {
          const storageSize = parseFloat(service.resources.storage.size.replace(/[^\d.]/g, "") || "0");
          storageValid = storageSize > 0;
        }
        
        if (!storageValid) {
          validationErrors.push(`Service ${serviceNum}: Storage size must be greater than 0`);
        }
        
        // Volumes validation
        if (service.volumes && service.volumes.length > 0) {
          service.volumes.forEach((volume, volIndex) => {
            if (!volume.name.trim()) {
              validationErrors.push(`Service ${serviceNum}, Volume ${volIndex + 1}: Name is required`);
            }
            if (!volume.mount.trim()) {
              validationErrors.push(`Service ${serviceNum}, Volume ${volIndex + 1}: Mount path is required`);
            }
            if (!volume.size || parseFloat(volume.size) <= 0) {
              validationErrors.push(`Service ${serviceNum}, Volume ${volIndex + 1}: Size must be greater than 0`);
            }
          });
        }
        
        // Ports validation
        if (service.expose && service.expose.length > 0) {
          service.expose.forEach((port, portIndex) => {
            if (!port.port || port.port <= 0) {
              validationErrors.push(`Service ${serviceNum}, Port ${portIndex + 1}: Port number must be greater than 0`);
            }
            if (!port.as || port.as <= 0) {
              validationErrors.push(`Service ${serviceNum}, Port ${portIndex + 1}: External port must be greater than 0`);
            }
          });
        }
      });
      
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return; // Don't proceed if there are validation errors
      }
      
      // Clear errors if validation passes
      setErrors([]);
    }
    
    // Validate Bidding step
    if (currentStep === 3) {
      const validationErrors = [];
      
      // Check if any bids are available
      if (!bids || bids.length === 0) {
        validationErrors.push("No provider bids available. Please request bids first.");
        setErrors(validationErrors);
        return;
      }
      
      // Check if a bid is selected
      if (!selectedProvider || selectedProvider.trim() === "") {
        validationErrors.push("Please select a provider bid to continue");
        setErrors(validationErrors);
        return;
      }
      
      // Clear errors if validation passes
      setErrors([]);
    }
    
    // Validate Review step - auto request bids when going to Bidding step
    if (currentStep === 2) {
      // Auto request bids when moving from Review to Bidding
      if (bids.length === 0) {
        // Simulate requesting bids
        console.log("Auto requesting bids from providers...");
        // Bids will be set by the mock useEffect
      }
    }
    
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    // Don't allow going back from Bidding step (step 3) to Configuration step (step 1)
    if (currentStep === 3) {
      return; // Block going back from Bidding to Configuration
    }
    
    // Don't allow going back from Deploy step (step 4) to Bidding step (step 3)
    if (currentStep === 4) {
      return; // Block going back from Deploy to Bidding
    }
    
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Application selection handlers
  const handleApplicationSelect = (application: Application) => {
    setSelectedApplication(application);
    setServices(application.services || []);
    setHasChosenMethod(true);
    if (errors.length > 0) {
      setErrors([]);
    }
    
    // Update URL with app selection
    const params = new URLSearchParams(searchParams.toString());
    params.set('app', application.id);
    params.set('mode', 'application');
    router.push(`?${params.toString()}`);
  };

  const handleApplicationSelectFromModal = (application: Application) => {
    setSelectedApplication(application);
    setServices(application.services || []);
    setIsApplicationModalOpen(false);
    if (errors.length > 0) {
      setErrors([]);
    }
    
    // Update URL with app selection
    const params = new URLSearchParams(searchParams.toString());
    params.set('app', application.id);
    params.set('mode', 'application');
    router.push(`?${params.toString()}`);
  };

  // Clear validation errors when user starts typing
  const handleDeploymentNameChange = (value: string) => {
    setDeploymentName(value);
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPrice(value);
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  // Service handlers
  const handleUpdateService = (index: number, updatedService: Service) => {
    const newServices = [...services];
    newServices[index] = updatedService;
    setServices(newServices);
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleAddService = () => {
    const newService: Service = {
      id: `service-${Date.now()}`,
      name: `Service ${services.length + 1}`,
      image: "",
      replicas: 1,
      resources: {
        cpu: { units: "1" },
        memory: { size: "1Gi" },
        storage: [{ size: "1Gi" }],
        gpu: { units: "0" },
      },
      volumes: [],
      expose: [],
      env: [],
    };
    setServices([...services, newService]);
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleRemoveService = (index: number) => {
    const newServices = services.filter((_, i) => i !== index);
    setServices(newServices);
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  // Bidding handlers
  const handleBidPriceChange = (price: string) => {
    setBidPrice(price);
  };

  const handleAcceptBid = (providerId: string, price: string) => {
    setSelectedProvider(providerId);
    setBidPrice(price);
    setIsBidAccepted(true);
    if (errors.length > 0) {
      setErrors([]);
    }
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
            onDeploymentNameChange={handleDeploymentNameChange}
            onDescriptionChange={handleDescriptionChange}
            onMaxPriceChange={handleMaxPriceChange}
            validationErrors={errors}
          />
        );
      
      case 1:
        return (
          <ConfigurationStep
            applications={applications}
            deploymentMode="application"
            favouriteApps={[]}
            selectedApplication={selectedApplication}
            services={services}
            onApplicationSelect={handleApplicationSelect}
            onUpdateService={handleUpdateService}
            onAddService={handleAddService}
            onRemoveService={handleRemoveService}
            onMaxPriceChange={handleMaxPriceChange}
            validationErrors={errors}
          />
        );
      
      case 2:
        return (
          <ReviewStep
            deploymentName={deploymentName}
            description={description}
            maxPrice={maxPrice}
            services={services}
            totalCpu={totalCpu.toString()}
            totalMemory={totalMemory.toString()}
            totalStorage={totalStorage.toString()}
            estimatedPrice={estimatedPrice.toFixed(2)}
          />
        );
      
      case 3:
        return (
          <BiddingStep
            isBidAccepted={isBidAccepted}
            bids={bids}
            selectedBid={selectedProvider || ""}
            isSubmitting={false}
            totalCpu={totalCpu.toString()}
            totalMemory={totalMemory.toString()}
            totalStorage={totalStorage.toString()}
            maxPrice={maxPrice}
            estimatedPrice={estimatedPrice.toString()}
            services={services}
            selectedRegion="any"
            isEditingBidPrice={isEditingBid}
            editedBidPrice={bidPrice}
            favouriteProviders={[]}
            validationErrors={errors}
            onRequestBids={() => {}}
            onAcceptBid={() => {}}
            onSelectBid={(bidId) => {
              setSelectedProvider(bidId);
              setIsBidAccepted(true);
              if (errors.length > 0) {
                setErrors([]);
              }
            }}
            onToggleFavouriteProvider={() => {}}
            onEditBidPrice={() => setIsEditingBid(true)}
            onSaveBidPrice={() => setIsEditingBid(false)}
            onCancelBidPriceEdit={() => setIsEditingBid(false)}
            onEstimatedPriceClick={() => {}}
            onEditedBidPriceChange={handleBidPriceChange}
          />
        );
      
      case 4:
        return (
          <DeployStep
            isSubmitting={false}
            onDeploy={() => {}}
          />
        );
      
      default:
        return null;
    }
  };

  // Check if Previous button should be disabled
  const isPrevDisabled = () => {
    // Disable Previous button from Bidding step (step 3) and Deploy step (step 4)
    return currentStep === 3 || currentStep === 4;
  };

  // Check if Next button should be disabled
  const isNextDisabled = () => {
    // Bidding step - disable if no bids or no selection
    if (currentStep === 3) {
      return !bids || bids.length === 0 || !selectedProvider || selectedProvider.trim() === "";
    }
    
    // Other steps - always enabled
    return false;
  };

  // If no application is selected, show application selection UI
  if (!selectedApplication || !selectedApplication.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Deploy Application
            </h1>
            <p className="text-lg text-gray-600">
              Choose an application to deploy to the Subnet network
            </p>
          </div>

          {/* Application Selection */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Select Application to Deploy
              </h2>
              <div className="text-center">
                <Button
                  color="primary"
                  size="lg"
                  onClick={() => setIsApplicationModalOpen(true)}
                  className="px-8 py-3"
                >
                  Choose Application
                </Button>
              </div>
            </div>
          </div>

          {/* Application Selection Modal */}
          <ApplicationSelectionModal
            isOpen={isApplicationModalOpen}
            onClose={() => setIsApplicationModalOpen(false)}
            onSelectApplication={handleApplicationSelectFromModal}
          />
        </div>
      </div>
    );
  }

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
            currentTab={currentStep}
            tabs={STEPS.map(step => ({
              id: step.id.toString(),
              title: step.title,
              icon: step.icon
            }))}
          />
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8 items-start">
            {/* Main Content */}
            <div className="flex-1">
              {renderCurrentStep()}

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="ghost"
                  startContent={<ArrowLeft size={20} />}
                  onPress={handlePrevStep}
                  isDisabled={isPrevDisabled()}
                  className={isPrevDisabled() ? "opacity-50 cursor-not-allowed" : ""}
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
                      isDisabled={isNextDisabled()}
                      className={isNextDisabled() ? "opacity-50 cursor-not-allowed" : ""}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-8 h-[calc(100vh-4rem)] overflow-y-auto">
                <DeploymentSummary
                  deploymentName={deploymentName}
                  description={description}
                  maxPrice={maxPrice}
                  selectedRegion={selectedRegion}
                  deploymentMode="application"
                  selectedTemplate={null}
                  services={services}
                  totalCpu={totalCpu}
                  totalMemory={`${totalMemory}Gi`}
                  totalStorage={`${totalStorage}Gi`}
                  totalGpu={0}
                  selectedBid={selectedBid}
                  bids={bids}
                  onMaxPriceChange={handleMaxPriceChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Application Selection Modal */}
        <ApplicationSelectionModal
          isOpen={isApplicationModalOpen}
          onClose={() => setIsApplicationModalOpen(false)}
          onSelectApplication={handleApplicationSelectFromModal}
        />
      </div>
    </div>
  );
}
