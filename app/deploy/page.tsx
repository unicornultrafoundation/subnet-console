"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import {
  Play,
  DollarSign,
  Cpu,
  HardDrive,
  MemoryStick,
  Gpu,
  Settings,
  Code,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Heart,
} from "lucide-react";

// Import components
import TemplateSelection from "@/components/deploy/TemplateSelection";
import TemplateModal from "@/components/deploy/TemplateModal";
import BasicInfo from "@/components/deploy/BasicInfo";
import Configuration from "@/components/deploy/Configuration";
import ProgressIndicator from "@/components/deploy/ProgressIndicator";
import DeploymentSummary from "@/components/deploy/DeploymentSummary";

// interface SDLTemplate {
//   version: string;
//   services: {
//     [key: string]: {
//       image: string;
//       command?: string[];
//       args?: string[];
//       env?: { key: string; value: string }[];
//       volumes?: { mount: string; size: string }[];
//       expose?: { port: number; as: number; to: { global: boolean }[] }[];
//       resources: {
//         cpu: { units: string };
//         memory: { size: string };
//         storage: { size: string }[];
//         gpu?: { model: string };
//       };
//     };
//   };
//   profiles: {
//     compute: {
//       [key: string]: {
//         resources: {
//           cpu: { units: string };
//           memory: { size: string };
//           storage: { size: string }[];
//           gpu?: { model: string };
//         };
//       };
//     };
//     placement: {
//       [key: string]: {
//         pricing: {
//           [key: string]: {
//             denom: string;
//             amount: string;
//           };
//         };
//         signedBy: { allOf: string[] };
//         attributes: any[];
//       };
//     };
//   };
//   deployment: {
//     [key: string]: {
//       [key: string]: {
//         profile: string;
//         count: number;
//       };
//     };
//   };
// }

interface Service {
  name: string;
  image: string;
  command: string[];
  args: string[];
  env: { key: string; value: string }[];
  volumes: { mount: string; size: string }[];
  expose: { port: number; as: number; to: { global: boolean }[] }[];
  resources: {
    cpu: { units: string };
    memory: { size: string };
    storage: { size: string }[];
    gpu?: { model: string };
  };
}

interface Application {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  resources: {
    cpu: string;
    memory: string;
    storage: string;
  };
}

function DeployPageContent() {
  const router = useRouter();

  // State management
  const [deploymentName, setDeploymentName] = useState("");
  const [description, setDescription] = useState("");
  const [maxPrice, setMaxPrice] = useState("1.0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deploymentMode, setDeploymentMode] = useState<
    "template" | "application"
  >("template");
  const [selectedApp, setSelectedApp] = useState<string>("");
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedBid, setSelectedBid] = useState<string>("");
  const [bids, setBids] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("any");
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [hasChosenMethod, setHasChosenMethod] = useState(false);
  const [isBidAccepted, setIsBidAccepted] = useState(false);

  // Debug effect
  useEffect(() => {
    console.log("hasChosenMethod changed:", hasChosenMethod);
    console.log("currentTab changed:", currentTab);
    console.log("selectedBid changed:", selectedBid);
  }, [hasChosenMethod, currentTab, selectedBid]);
  const [templateFilter, setTemplateFilter] = useState({
    provider: "",
    name: "",
    category: "",
    showFavourites: false,
  });
  const [favouriteApps, setFavouriteApps] = useState<string[]>([]);
  const [favouriteProviders, setFavouriteProviders] = useState<string[]>([]);

  // Mock data
  const regions = [
    { id: "any", name: "Any Region", description: "No preference" },
    { id: "north-america", name: "North America", description: "US, Canada" },
    { id: "europe", name: "Europe", description: "EU, UK, Switzerland" },
    {
      id: "asia-pacific",
      name: "Asia Pacific",
      description: "Singapore, Japan, Australia",
    },
    {
      id: "south-america",
      name: "South America",
      description: "Brazil, Argentina",
    },
    { id: "africa", name: "Africa", description: "South Africa, Nigeria" },
  ];

  const templates = [
    {
      id: "web-app",
      name: "Web Application",
      description: "Standard web application with database",
      category: "Web",
      provider: "Subnet Labs",
      icon: "🌐",
      services: 2,
      estimatedCost: "0.5-2 SCU/hour",
      features: ["Load Balancer", "Database", "Auto-scaling"],
    },
    {
      id: "api-service",
      name: "API Service",
      description: "RESTful API with authentication",
      category: "API",
      provider: "CloudTech",
      icon: "🔌",
      services: 1,
      estimatedCost: "0.2-1 SCU/hour",
      features: ["JWT Auth", "Rate Limiting", "Monitoring"],
    },
    {
      id: "ml-training",
      name: "ML Training",
      description: "Machine learning model training",
      category: "AI/ML",
      provider: "AI Solutions",
      icon: "🤖",
      services: 1,
      estimatedCost: "2-10 SCU/hour",
      features: ["GPU Support", "Data Storage", "Model Serving"],
    },
    {
      id: "blockchain-node",
      name: "Blockchain Node",
      description: "Full blockchain node with RPC",
      category: "Blockchain",
      provider: "CryptoCore",
      icon: "⛓️",
      services: 1,
      estimatedCost: "1-5 SCU/hour",
      features: ["RPC API", "P2P Network", "Storage"],
    },
    {
      id: "game-server",
      name: "Game Server",
      description: "Multiplayer game server",
      category: "Gaming",
      provider: "GameTech",
      icon: "🎮",
      services: 2,
      estimatedCost: "1-8 SCU/hour",
      features: ["Real-time", "Matchmaking", "Anti-cheat"],
    },
    {
      id: "data-analytics",
      name: "Data Analytics",
      description: "Big data processing pipeline",
      category: "Data",
      provider: "DataFlow",
      icon: "📊",
      services: 3,
      estimatedCost: "3-15 SCU/hour",
      features: ["Spark", "Kafka", "Dashboard"],
    },
    {
      id: "wordpress",
      name: "WordPress Site",
      description: "Content management system",
      category: "Web",
      provider: "WebCraft",
      icon: "📝",
      services: 2,
      estimatedCost: "0.3-1.5 SCU/hour",
      features: ["CMS", "Database", "CDN"],
    },
    {
      id: "ecommerce",
      name: "E-commerce Platform",
      description: "Online store with payment processing",
      category: "Web",
      provider: "ShopTech",
      icon: "🛒",
      services: 3,
      estimatedCost: "1-5 SCU/hour",
      features: ["Payment Gateway", "Inventory", "Analytics"],
    },
    {
      id: "iot-platform",
      name: "IoT Platform",
      description: "Internet of Things data collection",
      category: "IoT",
      provider: "IoT Solutions",
      icon: "📡",
      services: 2,
      estimatedCost: "0.8-3 SCU/hour",
      features: ["MQTT Broker", "Time Series DB", "Dashboard"],
    },
    {
      id: "microservices",
      name: "Microservices API",
      description: "Distributed microservices architecture",
      category: "API",
      provider: "MicroTech",
      icon: "🔧",
      services: 4,
      estimatedCost: "2-8 SCU/hour",
      features: ["Service Mesh", "Load Balancer", "Monitoring"],
    },
  ];

  const applications: Application[] = [
    {
      id: "web-app-1",
      name: "React Web App",
      description: "Modern React application with Node.js backend",
      category: "Web",
      image: "nginx:latest",
      resources: { cpu: "1", memory: "1Gi", storage: "10Gi" },
    },
    {
      id: "api-service-1",
      name: "REST API",
      description: "Express.js REST API with MongoDB",
      category: "API",
      image: "node:18-alpine",
      resources: { cpu: "0.5", memory: "512Mi", storage: "5Gi" },
    },
    {
      id: "ml-training-1",
      name: "ML Training Job",
      description: "PyTorch training job with GPU support",
      category: "AI/ML",
      image: "pytorch/pytorch:latest",
      resources: { cpu: "4", memory: "8Gi", storage: "50Gi" },
    },
  ];

  const [services, setServices] = useState<Service[]>([]);

  // Tabs configuration
  const tabs = [
    { id: "basic", title: "Basic Info", icon: Settings },
    { id: "config", title: "Configuration", icon: Code },
    { id: "review", title: "Review", icon: CheckCircle },
    { id: "bidding", title: "Bidding", icon: DollarSign },
    { id: "deploy", title: "Deploy", icon: Play },
  ];

  // Handlers
  const handleNextTab = () => {
    console.log("Next tab clicked, current tab:", currentTab);
    if (currentTab < tabs.length - 1) {
      setCurrentTab(currentTab + 1);
    }
  };

  const handlePrevTab = () => {
    if (isBidAccepted) {
      // Prevent navigating back once a bid has been accepted
      return;
    }
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1);
    }
  };

  const handleTemplateSelect = (template: any) => {
    console.log("Template selected:", template);
    setSelectedTemplate(template);
    setDeploymentMode("application");
    setIsTemplateModalOpen(false);
    setHasChosenMethod(true);
    setDeploymentName(
      `${template.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
    );

    // Auto-populate services based on template
    const templateServices: Service[] = [
      {
        name: template.name.toLowerCase().replace(/\s+/g, "-"),
        image: "nginx:latest", // Default image, can be customized
        command: ["nginx", "-g", "daemon off;"],
        args: [],
        env: [
          { key: "NODE_ENV", value: "production" },
          { key: "PORT", value: "3000" },
        ],
        volumes: [{ mount: "/app/data", size: "1Gi" }],
        expose: [{ port: 3000, as: 3000, to: [{ global: true }] }],
        resources: {
          cpu: { units: "1" },
          memory: { size: "1Gi" },
          storage: [{ size: "10Gi" }],
        },
      },
    ];

    setServices(templateServices);

    // Auto advance to next step
    setTimeout(() => {
      console.log("Auto advancing to tab 0");
      setCurrentTab(0);
    }, 100);
  };

  const handleCustomTemplateSelect = () => {
    console.log("Custom template selected");
    setDeploymentMode("template");
    setHasChosenMethod(true);
    setSelectedTemplate(null);
    // Auto advance to next step
    setTimeout(() => {
      console.log("Auto advancing to tab 0 (custom)");
      setCurrentTab(0);
    }, 100);
  };

  const handleApplicationSelect = (appId: string) => {
    setSelectedApp(appId);
    const app = applications.find((a) => a.id === appId);

    if (app) {
      setServices([
        {
          name: app.name.toLowerCase().replace(/\s+/g, "-"),
          image: app.image,
          command: [
            "sh",
            "-c",
            'echo "Starting application..." && sleep infinity',
          ],
          args: [],
          env: [
            { key: "NODE_ENV", value: "production" },
            { key: "PORT", value: "3000" },
          ],
          volumes: [{ mount: "/app/data", size: "1Gi" }],
          expose: [{ port: 3000, as: 3000, to: [{ global: true }] }],
          resources: {
            cpu: { units: app.resources.cpu },
            memory: { size: app.resources.memory },
            storage: [{ size: app.resources.storage }],
          },
        },
      ]);
    }
  };

  const handleAddService = () => {
    const newService: Service = {
      name: `service-${services.length + 1}`,
      image: "nginx:latest",
      command: ["nginx", "-g", "daemon off;"],
      args: [],
      env: [],
      volumes: [],
      expose: [{ port: 80, as: 80, to: [{ global: true }] }],
      resources: {
        cpu: { units: "1" },
        memory: { size: "1Gi" },
        storage: [{ size: "10Gi" }],
      },
    };

    setServices([...services, newService]);
  };

  const handleRemoveService = (serviceName: string) => {
    setServices(services.filter((s) => s.name !== serviceName));
  };

  const handleUpdateService = (
    serviceName: string,
    field: string,
    value: any,
  ) => {
    setServices(
      services.map((s) => {
        if (s.name === serviceName) {
          if (field === "cpu") {
            return {
              ...s,
              resources: { ...s.resources, cpu: { units: value } },
            };
          } else if (field === "memory") {
            return {
              ...s,
              resources: { ...s.resources, memory: { size: value } },
            };
          } else if (field === "storage") {
            return {
              ...s,
              resources: { ...s.resources, storage: [{ size: value }] },
            };
          } else if (field === "env") {
            return { ...s, env: value };
          } else if (field === "volumes") {
            return { ...s, volumes: value };
          } else if (field === "expose") {
            return { ...s, expose: value };
          } else {
            return { ...s, [field]: value };
          }
        }

        return s;
      }),
    );
  };

  const toggleFavouriteApp = (appId: string) => {
    setFavouriteApps((prev) =>
      prev.includes(appId)
        ? prev.filter((id) => id !== appId)
        : [...prev, appId],
    );
  };

  const toggleFavouriteProvider = (providerId: string) => {
    setFavouriteProviders((prev) =>
      prev.includes(providerId)
        ? prev.filter((id) => id !== providerId)
        : [...prev, providerId],
    );
  };

  const toggleFavouriteTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);

    if (template) {
      toggleFavouriteProvider(template.provider);
    }
  };

  const handleRequestBids = async () => {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setBids([
        {
          id: "bid-1",
          provider: {
            id: "provider-1",
            name: "Quantum Computing Solutions",
            location: "San Francisco, CA",
            reputation: 4.8,
            uptime: 99.9,
          },
          price: "2.5",
          resources: { cpu: "4", memory: "8Gi", storage: "100Gi" },
          estimatedTime: "5-10 minutes",
          features: ["High Performance", "Green Energy", "Compliance Ready"],
        },
        {
          id: "bid-2",
          provider: {
            id: "provider-2",
            name: "CloudTech Infrastructure",
            location: "Singapore",
            reputation: 4.6,
            uptime: 99.7,
          },
          price: "1.8",
          resources: { cpu: "4", memory: "8Gi", storage: "100Gi" },
          estimatedTime: "3-8 minutes",
          features: ["Low Latency", "24/7 Support", "Auto Scaling"],
        },
        {
          id: "bid-3",
          provider: {
            id: "provider-3",
            name: "Edge Computing Network",
            location: "Frankfurt, Germany",
            reputation: 4.9,
            uptime: 99.95,
          },
          price: "3.2",
          resources: { cpu: "4", memory: "8Gi", storage: "100Gi" },
          estimatedTime: "2-5 minutes",
          features: ["Premium Hardware", "DDoS Protection", "Backup Systems"],
        },
      ]);
    } catch (error) {
      console.error("Failed to request bids:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptBid = async () => {
    console.log("Accept bid clicked, selectedBid:", selectedBid);
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Bid accepted, advancing to next tab");
      setIsBidAccepted(true);
      // Move directly to the Deploy tab and lock earlier steps
      const deployIndex = tabs.findIndex((t) => t.id === "deploy");

      if (deployIndex !== -1) {
        setCurrentTab(deployIndex);
      } else {
        handleNextTab();
      }
    } catch (error) {
      console.error("Failed to accept bid:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeploy = async () => {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      router.push("/deployments");
    } catch (error) {
      console.error("Failed to deploy:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate totals
  const totalCpu = services.reduce(
    (sum, service) => sum + parseFloat(service.resources.cpu.units),
    0,
  );
  const totalMemory = services.reduce((sum, service) => {
    const memory = service.resources.memory.size;
    const value = parseFloat(memory.replace(/[^\d.]/g, ""));

    return sum + value;
  }, 0);
  const totalStorage = services.reduce((sum, service) => {
    const storage = service.resources.storage[0]?.size || "0Gi";
    const value = parseFloat(storage.replace(/[^\d.]/g, ""));

    return sum + value;
  }, 0);
  const totalGpu = services.reduce(
    (sum, service) => sum + (service.resources.gpu ? 1 : 0),
    0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <div className="flex gap-8 max-w-7xl mx-auto px-6 py-8">
        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              isIconOnly
              className="text-default-500 hover:text-primary"
              variant="light"
              onClick={() => router.back()}
            >
              <ArrowLeft size={24} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Deploy Application</h1>
              <p className="text-default-600 mt-1">
                Configure and deploy your application to Subnet Network
              </p>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {!hasChosenMethod ? (
              <TemplateSelection
                deploymentMode={deploymentMode}
                hasChosenMethod={hasChosenMethod}
                selectedTemplate={selectedTemplate}
                onCustomTemplateSelect={handleCustomTemplateSelect}
                onTemplateModalOpen={() => setIsTemplateModalOpen(true)}
              />
            ) : (
              // Deployment Steps
              <>
                <ProgressIndicator currentTab={currentTab} tabs={tabs} />

                {currentTab === 0 && (
                  <BasicInfo
                    deploymentName={deploymentName}
                    description={description}
                    maxPrice={maxPrice}
                    regions={regions}
                    selectedRegion={selectedRegion}
                    onDeploymentNameChange={setDeploymentName}
                    onDescriptionChange={setDescription}
                    onMaxPriceChange={setMaxPrice}
                    onRegionChange={setSelectedRegion}
                  />
                )}

                {currentTab === 1 && (
                  <Configuration
                    applications={applications}
                    deploymentMode={deploymentMode}
                    favouriteApps={favouriteApps}
                    selectedApp={selectedApp}
                    selectedTemplate={selectedTemplate}
                    services={services}
                    onAddService={handleAddService}
                    onApplicationSelect={handleApplicationSelect}
                    onRemoveService={handleRemoveService}
                    onToggleFavouriteApp={toggleFavouriteApp}
                    onUpdateService={handleUpdateService}
                  />
                )}

                {currentTab === 2 && (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="text-primary" size={32} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">
                          Review Your Deployment
                        </h2>
                        <p className="text-default-600 mt-2">
                          Please review all settings before proceeding to
                          request bids from providers.
                        </p>
                      </div>
                    </div>

                    {/* Deployment Summary */}
                    <Card className="subnet-card">
                      <CardHeader className="flex items-center gap-2">
                        <Settings className="text-primary" size={20} />
                        <h3 className="text-xl font-semibold">
                          Deployment Summary
                        </h3>
                      </CardHeader>
                      <CardBody className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-default-700 text-lg">
                            Basic Information
                          </h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-default-600">Name:</span>
                                <span className="font-semibold">
                                  {deploymentName || "Not specified"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-default-600">Mode:</span>
                                <Chip color="primary" size="sm" variant="flat">
                                  {deploymentMode === "template"
                                    ? "Template Builder"
                                    : "Application"}
                                </Chip>
                              </div>
                              {selectedTemplate && (
                                <div className="flex justify-between">
                                  <span className="text-default-600">
                                    Template:
                                  </span>
                                  <span className="font-medium text-sm">
                                    {selectedTemplate.name}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-default-600">
                                  Max Price:
                                </span>
                                <span className="font-semibold text-primary">
                                  {maxPrice} SCU/hour
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-default-600">
                                  Region:
                                </span>
                                <span className="font-semibold">
                                  {regions.find((r) => r.id === selectedRegion)
                                    ?.name || selectedRegion}
                                </span>
                              </div>
                              {description && (
                                <div className="flex justify-between">
                                  <span className="text-default-600">
                                    Description:
                                  </span>
                                  <span className="font-medium text-sm">
                                    {description}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <Divider />

                        {/* Resources Summary */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-default-700 text-lg">
                            Resource Requirements
                          </h4>
                          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-primary/5 p-4 rounded-lg text-center">
                              <Cpu
                                className="text-primary mx-auto mb-2"
                                size={24}
                              />
                              <div className="text-2xl font-bold text-primary">
                                {totalCpu}
                              </div>
                              <div className="text-sm text-default-600">
                                CPU Units
                              </div>
                            </div>
                            <div className="bg-success/5 p-4 rounded-lg text-center">
                              <MemoryStick
                                className="text-success mx-auto mb-2"
                                size={24}
                              />
                              <div className="text-2xl font-bold text-success">
                                {totalMemory}Gi
                              </div>
                              <div className="text-sm text-default-600">
                                Memory
                              </div>
                            </div>
                            <div className="bg-warning/5 p-4 rounded-lg text-center">
                              <HardDrive
                                className="text-warning mx-auto mb-2"
                                size={24}
                              />
                              <div className="text-2xl font-bold text-warning">
                                {totalStorage}Gi
                              </div>
                              <div className="text-sm text-default-600">
                                Storage
                              </div>
                            </div>
                            {totalGpu > 0 && (
                              <div className="bg-danger/5 p-4 rounded-lg text-center">
                                <Gpu
                                  className="text-danger mx-auto mb-2"
                                  size={24}
                                />
                                <div className="text-2xl font-bold text-danger">
                                  {totalGpu}
                                </div>
                                <div className="text-sm text-default-600">
                                  GPU Units
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <Divider />

                        {/* Services Details */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-default-700 text-lg">
                            Services Configuration
                          </h4>
                          {services.length === 0 ? (
                            <div className="text-center py-8 bg-default-50 rounded-lg">
                              <Code
                                className="text-default-300 mx-auto mb-4"
                                size={48}
                              />
                              <p className="text-default-500">
                                No services configured
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {services.map((service, index) => (
                                <Card
                                  key={index}
                                  className="border border-default-200"
                                >
                                  <CardBody className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                      <h5 className="font-semibold text-lg">
                                        {service.name}
                                      </h5>
                                      <Chip
                                        color="primary"
                                        size="sm"
                                        variant="flat"
                                      >
                                        Service {index + 1}
                                      </Chip>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="text-default-600">
                                          Image:
                                        </span>
                                        <span className="font-medium ml-2">
                                          {service.image}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-default-600">
                                          CPU:
                                        </span>
                                        <span className="font-medium ml-2">
                                          {service.resources.cpu.units} units
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-default-600">
                                          Memory:
                                        </span>
                                        <span className="font-medium ml-2">
                                          {service.resources.memory.size}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-default-600">
                                          Storage:
                                        </span>
                                        <span className="font-medium ml-2">
                                          {service.resources.storage[0]?.size ||
                                            "N/A"}
                                        </span>
                                      </div>
                                    </div>
                                    {service.env.length > 0 && (
                                      <div className="mt-3">
                                        <span className="text-default-600 text-sm">
                                          Environment Variables:
                                        </span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {service.env.map((env, envIndex) => (
                                            <Chip
                                              key={envIndex}
                                              color="default"
                                              size="sm"
                                              variant="flat"
                                            >
                                              {env.key}={env.value}
                                            </Chip>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    {service.expose.length > 0 && (
                                      <div className="mt-3">
                                        <span className="text-default-600 text-sm">
                                          Ports:
                                        </span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {service.expose.map(
                                            (port, portIndex) => (
                                              <Chip
                                                key={portIndex}
                                                color="secondary"
                                                size="sm"
                                                variant="flat"
                                              >
                                                {port.port}→{port.as}
                                              </Chip>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </CardBody>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                )}

                {currentTab === 3 && (
                  <div className="space-y-6">
                    {/* Request Bids Section (hidden when bid accepted) */}
                    {!isBidAccepted && (
                      <Card className="subnet-card">
                        <CardHeader className="flex items-center gap-2">
                          <DollarSign className="text-primary" size={20} />
                          <h2 className="text-xl font-semibold">
                            Request Bids from Providers
                          </h2>
                        </CardHeader>
                        <CardBody className="space-y-4">
                          <div className="bg-primary/5 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">
                              Deployment Requirements
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-default-600">CPU:</span>{" "}
                                {totalCpu} units
                              </div>
                              <div>
                                <span className="text-default-600">
                                  Memory:
                                </span>{" "}
                                {totalMemory}Gi
                              </div>
                              <div>
                                <span className="text-default-600">
                                  Storage:
                                </span>{" "}
                                {totalStorage}Gi
                              </div>
                              <div>
                                <span className="text-default-600">
                                  Max Price:
                                </span>{" "}
                                {maxPrice} SCU/hour
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <Button
                              color="primary"
                              disabled={isSubmitting}
                              isLoading={isSubmitting}
                              startContent={<DollarSign size={16} />}
                              onClick={handleRequestBids}
                            >
                              {isSubmitting
                                ? "Requesting Bids..."
                                : "Request Bids from Providers"}
                            </Button>

                            {bids.length > 0 && (
                              <Chip color="success" variant="flat">
                                {bids.length} bids received
                              </Chip>
                            )}
                          </div>
                        </CardBody>
                      </Card>
                    )}

                    {/* Provider Bids */}
                    {bids.length > 0 && (
                      <Card className="subnet-card">
                        <CardHeader className="flex items-center gap-2">
                          <CheckCircle className="text-primary" size={20} />
                          <h2 className="text-xl font-semibold">
                            Provider Bids
                          </h2>
                        </CardHeader>
                        <CardBody className="space-y-4">
                          {isBidAccepted && (
                            <div className="text-success text-sm bg-success/10 p-3 rounded-md">
                              Bid accepted. Bidding step is locked. Proceed to
                              deploy.
                            </div>
                          )}
                          <div className="grid gap-4">
                            {bids.map((bid) => (
                              <div
                                key={bid.id}
                                className={`cursor-pointer transition-all rounded-lg border p-4 ${
                                  selectedBid === bid.id
                                    ? "border-2 border-primary bg-primary/5"
                                    : "border-default-200 hover:border-primary/50"
                                }`}
                                role="button"
                                style={{ pointerEvents: "auto", zIndex: 1 }}
                                tabIndex={0}
                                onClick={() => {
                                  console.log("Bid card clicked:", bid.id);
                                  setSelectedBid(bid.id);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setSelectedBid(bid.id);
                                  }
                                }}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h3 className="text-lg font-semibold">
                                        {bid.provider.name}
                                      </h3>
                                      <Chip
                                        color="primary"
                                        size="sm"
                                        variant="flat"
                                      >
                                        {bid.provider.reputation}★
                                      </Chip>
                                      <Chip
                                        color="success"
                                        size="sm"
                                        variant="flat"
                                      >
                                        {bid.provider.uptime}% uptime
                                      </Chip>
                                      <Button
                                        isIconOnly
                                        className="text-default-400 hover:text-danger ml-auto"
                                        size="sm"
                                        variant="light"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleFavouriteProvider(
                                            bid.provider.id,
                                          );
                                        }}
                                      >
                                        <Heart
                                          className={
                                            favouriteProviders.includes(
                                              bid.provider.id,
                                            )
                                              ? "text-danger fill-danger"
                                              : ""
                                          }
                                          size={16}
                                        />
                                      </Button>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm mb-3">
                                      <div className="flex items-center gap-1">
                                        <span className="text-default-600">
                                          Location:
                                        </span>
                                        <span>{bid.provider.location}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <span className="text-default-600">
                                          Price:
                                        </span>
                                        <span className="font-semibold text-primary">
                                          {bid.price} SCU/hour
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <span className="text-default-600">
                                          Est. Time:
                                        </span>
                                        <span>{bid.estimatedTime}</span>
                                      </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                      {bid.features.map(
                                        (feature: string, index: number) => (
                                          <Chip
                                            key={index}
                                            color="default"
                                            size="sm"
                                            variant="flat"
                                          >
                                            {feature}
                                          </Chip>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Debug Info */}
                          <div className="text-xs text-default-500 mb-4">
                            Debug: Selected Bid: {selectedBid || "None"} | Bids
                            Count: {bids.length} | Is Submitting:{" "}
                            {isSubmitting ? "Yes" : "No"}
                          </div>

                          {/* Always show Accept Bid button for testing */}
                          <div className="flex justify-end gap-2">
                            <Button
                              color="secondary"
                              variant="bordered"
                              onClick={() => {
                                console.log("Force select first bid");
                                if (bids.length > 0) {
                                  setSelectedBid(bids[0].id);
                                }
                              }}
                            >
                              Select First Bid
                            </Button>

                            {selectedBid && (
                              <Button
                                color="primary"
                                disabled={isSubmitting}
                                isLoading={isSubmitting}
                                startContent={<CheckCircle size={16} />}
                                onClick={handleAcceptBid}
                              >
                                {isSubmitting
                                  ? "Accepting Bid..."
                                  : "Accept Selected Bid"}
                              </Button>
                            )}
                          </div>
                        </CardBody>
                      </Card>
                    )}
                  </div>
                )}

                {currentTab === 4 && (
                  <Card className="subnet-card">
                    <CardHeader className="flex items-center gap-2">
                      <Play className="text-primary" size={20} />
                      <h2 className="text-xl font-semibold">Ready to Deploy</h2>
                    </CardHeader>
                    <CardBody className="space-y-6">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                          <Play className="text-primary" size={32} />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            Deploy Your Application
                          </h3>
                          <p className="text-default-600">
                            Your deployment is ready. Click the button below to
                            start the deployment process.
                          </p>
                        </div>
                      </div>

                      <div className="bg-success/5 p-4 rounded-lg">
                        <h4 className="font-semibold text-success mb-2">
                          Deployment Summary
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Application:</span>
                            <span className="font-medium">
                              {deploymentName}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Provider:</span>
                            <span className="font-medium">
                              {
                                bids.find((b) => b.id === selectedBid)?.provider
                                  .name
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Price:</span>
                            <span className="font-medium text-primary">
                              {bids.find((b) => b.id === selectedBid)?.price}{" "}
                              SCU/hour
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Resources:</span>
                            <span className="font-medium">
                              {totalCpu} CPU, {totalMemory}Gi RAM,{" "}
                              {totalStorage}Gi Storage
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <Button
                          color="primary"
                          disabled={isSubmitting || !deploymentName.trim()}
                          isLoading={isSubmitting}
                          size="lg"
                          startContent={<Play size={16} />}
                          onClick={handleDeploy}
                        >
                          {isSubmitting
                            ? "Creating Deployment..."
                            : "Deploy Application"}
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                )}

                {/* Navigation Buttons - Only show when method is chosen */}
                {hasChosenMethod && (
                  <div className="flex justify-between mt-8">
                    <Button
                      disabled={currentTab === 0 || isBidAccepted}
                      startContent={<ArrowLeft size={16} />}
                      variant="bordered"
                      onClick={handlePrevTab}
                    >
                      Previous
                    </Button>

                    <div className="flex gap-2">
                      {currentTab < tabs.length - 1 ? (
                        <Button
                          color="primary"
                          disabled={
                            currentTab === tabs.length - 1 || isBidAccepted
                          }
                          endContent={<ArrowRight size={16} />}
                          onClick={handleNextTab}
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          color="primary"
                          disabled={isSubmitting || !deploymentName.trim()}
                          isLoading={isSubmitting}
                          startContent={<Play size={16} />}
                          onClick={handleDeploy}
                        >
                          {isSubmitting
                            ? "Creating Deployment..."
                            : "Deploy Application"}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Sidebar - Only show when method is chosen */}
        {hasChosenMethod && (
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-8 h-fit max-h-[calc(100vh-2rem)] overflow-y-auto">
              <DeploymentSummary
                bids={bids}
                deploymentMode={deploymentMode}
                deploymentName={deploymentName}
                description={description}
                maxPrice={maxPrice}
                selectedBid={selectedBid}
                selectedRegion={selectedRegion}
                selectedTemplate={selectedTemplate}
                services={services}
                totalCpu={totalCpu}
                totalGpu={totalGpu}
                totalMemory={`${totalMemory}Gi`}
                totalStorage={`${totalStorage}Gi`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Template Selection Modal */}
      <TemplateModal
        favouriteProviders={favouriteProviders}
        isOpen={isTemplateModalOpen}
        templateFilter={templateFilter}
        templates={templates}
        onFilterChange={setTemplateFilter}
        onOpenChange={setIsTemplateModalOpen}
        onTemplateSelect={handleTemplateSelect}
        onToggleFavourite={toggleFavouriteTemplate}
      />
    </div>
  );
}

export default function DeployPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DeployPageContent />
    </Suspense>
  );
}
